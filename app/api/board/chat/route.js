import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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

    const { boardId, text } = await request.json();
    if (!boardId || !text) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    // Verify board access before posting chat
    const board = await Board.findOne({
      _id: boardId,
      $or: [{ userId: user.id }, { "members.email": user.email }]
    });

    if (!board) return NextResponse.json({ error: 'No access to this board' }, { status: 403 });

    const message = {
      id: Date.now().toString(),
      sender: user.email,
      text: text,
      timestamp: new Date()
    };

    await Board.findByIdAndUpdate(
      boardId,
      { $push: { chat: message } },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
