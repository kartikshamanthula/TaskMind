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

export async function POST(request) {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data.boardId) return NextResponse.json({ error: 'boardId is required' }, { status: 400 });

    // Verify board access
    const Board = (await import('@/models/Board')).default;
    const board = await Board.findOne({
      _id: data.boardId,
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });

    if (!board) return NextResponse.json({ error: 'No access to this board' }, { status: 403 });

    // Sanitize task data to prevent mass-assignment
    const safeData = {
      boardId: data.boardId,
      userId: user.id,
      id: `task-${Date.now()}`,
      title: data.title || "New Task",
      column: data.column || board.columns[0],
      priority: data.priority || "medium",
      labels: data.labels || [],
      checklists: data.checklists || [],
      history: [{ action: 'created', timestamp: new Date(), userId: user.id }]
    };

    const task = await Task.create(safeData);
    const { _id, __v, ...cleanTask } = task.toObject();
    return NextResponse.json({ task: cleanTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
