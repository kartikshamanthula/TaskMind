import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const getUser = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
};

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const data = await request.json();

    const task = await Task.findOne({ id });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Verify board access
    const Board = (await import('@/models/Board')).default;
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });
    if (!board) return NextResponse.json({ error: 'No access to this board' }, { status: 403 });

    // Sanitize data to prevent mass-assignment
    const safeData = {};
    const allowedFields = ['title', 'description', 'column', 'priority', 'dueDate', 'members', 'labels', 'checklists', 'comments', 'history'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) safeData[field] = data[field];
    });

    const updatedTask = await Task.findOneAndUpdate({ id }, safeData, { returnDocument: 'after' });
    
    // Auto-create snapshot for Visual Time-Travel history on movement or title changes
    if (data.column || data.title) {
      const allTasks = await Task.find({ boardId: task.boardId }).lean();
      await Board.findByIdAndUpdate(task.boardId, {
        $push: { 
          snapshots: { 
            timestamp: new Date(), 
            state: { columns: board.columns, tasks: allTasks } 
          } 
        }
      });
    }

    const { _id, __v, ...cleanTask } = updatedTask.toObject();
    return NextResponse.json({ task: cleanTask });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const task = await Task.findOne({ id });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Verify board access
    const Board = (await import('@/models/Board')).default;
    const board = await Board.findOne({
      _id: task.boardId,
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });
    if (!board) return NextResponse.json({ error: 'No access to this board' }, { status: 403 });

    await Task.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
