import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.status !== 'unverified') {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

    let user;
    if (existingUser && existingUser.status === 'unverified') {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.registrationOtp = otp;
      existingUser.registrationOtpExpiry = otpExpiry;
      user = await existingUser.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        status: 'unverified',
        registrationOtp: otp,
        registrationOtpExpiry: otpExpiry
      });
    }

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this if using another provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Task Mind" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Task Mind Account',
      html: `
        <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020204; padding: 40px; border-radius: 16px; border: 1px solid #2a2a35; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="cid:taskmindlogo" alt="Task Mind Logo" style="width: 80px; height: auto; margin-bottom: 15px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);" />
            <h1 style="font-size: 28px; font-weight: 900; font-style: normal; letter-spacing: -1px; margin: 0; color: #ffffff;">Task Mind</h1>
            <p style="color: #a5b4fc; margin-top: 5px; font-size: 14px;">Premium Productivity</p>
          </div>
          
          <div style="background-color: #1c1c24; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <h2 style="margin-top: 0; font-size: 20px; color: #ffffff;">Verify Your Account</h2>
            <p style="color: #94a3b8; line-height: 1.6;">Thank you for registering. To complete your setup, please use the following One-Time Password (OTP):</p>
            
            <div style="background: #2a2a35; border: 1px solid rgba(79,70,229,0.3); border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
              <h1 style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #818cf8; margin: 0; padding-left: 12px;">${otp}</h1>
            </div>
            
            <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0;">
              This code will expire in 60 seconds.<br/>
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #475569; font-size: 12px;">&copy; ${new Date().getFullYear()} Task Board. All rights reserved.</p>
          </div>
        </div>
      `,
      attachments: [{
        filename: 'taskmind-logo.png',
        path: process.cwd() + '/public/taskmind-logo.png',
        cid: 'taskmindlogo'
      }]
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Nodemailer error:", emailError);
      return NextResponse.json({ error: `Email Error: Make sure EMAIL_USER and EMAIL_PASS are set correctly in .env.local` }, { status: 500 });
    }

    return NextResponse.json({
      message: 'OTP sent! Please check your email.',
      email: user.email
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

