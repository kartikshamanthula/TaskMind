import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await dbConnect();
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Task Board <onboarding@resend.dev>',
      to: user.email,
      subject: 'Reset Your Password – Task Board',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f17; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: white; letter-spacing: -1px;">Task Board</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="color: white; font-size: 20px; margin-bottom: 12px;">Reset Your Password</h2>
            <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 32px;">
              Hi ${user.name},<br/>We received a request to reset your password. Click the button below. This link expires in <strong style="color: #818cf8;">1 hour</strong>.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; font-weight: 800; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-size: 15px;">
              Reset Password →
            </a>
            <p style="color: #475569; font-size: 12px; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: `Resend Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
