import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST() {
  await dbConnect();
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and update heartbeat/usage
    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const now = new Date();
    const lastBeat = user.lastHeartbeat || user.updatedAt;
    const diffMs = now - lastBeat;
    
    // If last beat was within 2 minutes, add to usage
    if (diffMs < 120000) {
       user.totalUsageMinutes += (diffMs / 60000);
    }

    user.isOnline = true;
    user.lastHeartbeat = now;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
