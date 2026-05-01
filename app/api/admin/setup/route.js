import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await dbConnect();
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check for secret key in request
    const { secret } = await request.json();
    if (secret !== 'ADMIN_INIT_SECRET') {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { role: 'admin' },
      { new: true }
    );

    return NextResponse.json({ success: true, user: { email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
