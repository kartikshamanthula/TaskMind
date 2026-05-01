import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Board from '@/models/Board';
import Task from '@/models/Task';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const getUser = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, email }
  } catch (e) {
    return null;
  }
};

// GET /api/board — returns all boards + tasks for the active board
export async function GET(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;
    const userEmail = user.email;

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId'); // optional: fetch a specific board

    // Fetch all boards for this user (owner OR member)
    // Fetch all boards for this user (owner OR member)
    // We use a raw query to bypass Mongoose casting which crashes on old string-based members
    let boards = await Board.collection.find({
      $or: [
        { userId },
        { "members.email": userEmail },
        { members: userEmail }
      ]
    }).toArray();
    console.log(`Found ${boards.length} boards for user ${userEmail}`);

    // --- MIGRATION: Convert string-based members to object-based members ---
    for (const board of boards) {
      try {
        let needsUpdate = false;
        const updatedMembers = (board.members || []).map(m => {
          if (typeof m === 'string') {
            needsUpdate = true;
            return { email: m, role: 'member', lastActive: new Date() };
          }
          if (m && typeof m === 'object' && !m.email) {
              needsUpdate = true;
              return null; 
          }
          return m;
        }).filter(Boolean);

        if (needsUpdate) {
          console.log(`Migrating members for board: ${board._id}`);
          await Board.findByIdAndUpdate(board._id, { $set: { members: updatedMembers } });
          board.members = updatedMembers;
        }
        
        // Update own presence
        const myMemberIndex = (board.members || []).findIndex(m => {
          const email = typeof m === 'string' ? m : m?.email;
          return email === userEmail;
        });
        
        if (myMemberIndex > -1) {
          await Board.updateOne(
            { _id: board._id, "members.email": userEmail },
            { $set: { "members.$.lastActive": new Date() } }
          );
          if (board.members[myMemberIndex] && typeof board.members[myMemberIndex] === 'object') {
            board.members[myMemberIndex].lastActive = new Date();
          }
        }
      } catch (err) {
        console.error(`Migration failed for board ${board._id}:`, err);
        // Continue to next board instead of crashing the whole request
      }
    }

    // If no boards exist yet, create the default workspace
    if (boards.length === 0) {
      const defaultBoard = await Board.create({
        userId,
        title: 'Default Workspace',
        columns: ["To Do", "In Progress", "Done"],
        labels: []
      });
      boards = [defaultBoard.toObject()];
    }

    // --- BACKFILL: Give titles to old boards that were created before the title field was added ---
    for (const board of boards) {
      if (board.title === undefined || board.title === null) {
        await Board.findByIdAndUpdate(board._id, { $set: { title: 'Default Workspace' } });
        board.title = 'Default Workspace';
      }
    }

    // Determine which board is "active"
    const activeBoard = boardId
      ? boards.find(b => b._id.toString() === boardId) || boards[0]
      : boards[0];

    const activeBoardId = activeBoard._id.toString();

    // --- DATA MIGRATION ---
    // Any tasks without a boardId are assigned to the first/default board
    if (activeBoard.userId === userId) {
      await Task.updateMany(
        { userId, boardId: null },
        { $set: { boardId: activeBoardId } }
      );
    }

    // Fetch tasks belonging to the active board
    let tasks = await Task.find({ userId, boardId: activeBoardId }).lean();
    tasks = tasks.map(t => {
      const { _id, __v, ...rest } = t;
      return rest;
    });

    // Clean board objects — convert _id to string, strip __v
    const cleanBoards = boards.filter(Boolean).map(b => ({ ...b, _id: b._id?.toString() }));
    const cleanActiveBoard = { ...activeBoard, _id: activeBoardId };
    delete cleanActiveBoard.__v;

    console.log(`GET /api/board success for user ${userEmail}`);
    return NextResponse.json({ boards: cleanBoards, activeBoard: cleanActiveBoard, tasks });
  } catch (error) {
    console.error("GET /api/board CRASH:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

// POST /api/board — create a new workspace
export async function POST(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = user.id;

    const { title } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const board = await Board.create({
      userId,
      title: title.trim(),
      columns: ["To Do", "In Progress", "Done"],
      labels: []
    });

    return NextResponse.json({ board: { ...board.toObject(), _id: board._id.toString() } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/board — update a board's columns/labels
export async function PUT(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { boardId, ...data } = await request.json();

    // Check if user has permission to update (owner or member)
    const board = await Board.findOne({
      _id: boardId,
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });

    if (!board) return NextResponse.json({ error: 'Board not found or access denied' }, { status: 404 });

    // Sanitize data to prevent mass-assignment
    const safeData = {};
    const allowedFields = ['title', 'columns', 'labels', 'members', 'background'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        if (field === 'members') {
          const uniqueEmails = new Set();
          safeData.members = data.members
            .filter(m => {
              const email = typeof m === 'string' ? m : m.email;
              if (!email || uniqueEmails.has(email)) return false;
              uniqueEmails.add(email);
              return true;
            })
            .map(m => typeof m === 'string' ? { email: m, role: 'member', lastActive: new Date() } : m);
        } else {
          safeData[field] = data[field];
        }
      }
    });

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { $set: safeData },
      { returnDocument: 'after' }
    ).lean();
    
    // Auto-create snapshot for Visual Time-Travel on major updates (column/label changes)
    if (data.columns || data.labels) {
      const tasks = await Task.find({ boardId }).lean();
      await Board.findByIdAndUpdate(boardId, {
        $push: { 
          snapshots: { 
            timestamp: new Date(), 
            state: { columns: data.columns || board.columns, tasks } 
          } 
        }
      });
    }

    return NextResponse.json({ board: { ...updatedBoard, _id: updatedBoard._id.toString() } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/board — delete a workspace and all its tasks
export async function DELETE(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { boardId } = await request.json();
    if (!boardId) return NextResponse.json({ error: 'boardId required' }, { status: 400 });

    // Only owner can delete a workspace
    const board = await Board.findOne({ _id: boardId, userId: user.id });
    if (!board) return NextResponse.json({ error: 'Only the owner can delete this workspace' }, { status: 403 });

    // Prevent deleting the last workspace
    const count = await Board.countDocuments({ userId: user.id });
    if (count <= 1) return NextResponse.json({ error: 'Cannot delete the last workspace' }, { status: 400 });

    await Board.findOneAndDelete({ _id: boardId, userId: user.id });
    await Task.deleteMany({ boardId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
