import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        xp: user.xp || 0,
        level: user.level || 1,
        permissions: user.permissions || {
          canUseAI: true,
          canAccessBoard: true,
          canAccessRegularTasks: true,
          canAccessFinancialFeature: true
        }
      } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
