import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegularTask from '@/models/RegularTask';
import Task from '@/models/Task';
import Board from '@/models/Board';
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

export async function POST(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    // 1. Get regular task
    const regTask = await RegularTask.findOne({ _id: id, userId: user.id });
    if (!regTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // 2. Get user's board (prefer first board where they are owner or member)
    const board = await Board.findOne({
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });

    if (!board) return NextResponse.json({ error: 'No workspace found to promote to' }, { status: 400 });

    // 3. Create Kanban task
    const kanbanTaskData = {
      id: `task-${Date.now()}`,
      title: regTask.title,
      description: regTask.note || "",
      column: board.columns[0] || "To Do",
      userId: user.id,
      boardId: board._id.toString(),
      priority: regTask.priority || "medium",
      history: [{ action: 'Promoted from Regular Tasks', timestamp: new Date().toLocaleString(), detail: 'Task was moved from personal list' }]
    };

    const newTask = await Task.create(kanbanTaskData);

    // 4. Delete regular task
    await RegularTask.deleteOne({ _id: id });

    return NextResponse.json({ 
      success: true, 
      task: newTask,
      message: `Promoted to "${board.title}"`
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
