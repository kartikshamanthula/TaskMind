import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status !== 'unverified') {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    if (user.registrationOtp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > new Date(user.registrationOtpExpiry)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    user.status = 'pending';
    user.registrationOtp = null;
    user.registrationOtpExpiry = null;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully! Pending admin approval.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
