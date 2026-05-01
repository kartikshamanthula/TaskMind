import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Board from '@/models/Board';
import Task from '@/models/Task';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const verifyAdmin = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      console.log('--- ADMIN SECURITY LOG ---');
      console.log('User Email:', user?.email);
      console.log('User Role:', user?.role);
      console.log('--- END LOG ---');
      return null;
    }
    return user;
  } catch (e) {
    console.error('JWT/DB Error in Admin Check:', e.message);
    return null;
  }
};

export async function GET() {
  await dbConnect();
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const totalUsers = await User.countDocuments();
    const totalBoards = await Board.countDocuments();
    const totalTasks = await Task.countDocuments();

    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');
    const recentBoards = await Board.find().sort({ createdAt: -1 }).limit(5).select('title userId createdAt');

    return NextResponse.json({
      stats: { totalUsers, totalBoards, totalTasks },
      recentUsers,
      recentBoards
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
