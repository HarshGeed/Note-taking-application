import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/utils/dbConnect';
import bcrypt from 'bcryptjs';
import { hashOTP } from '@/utils/otp';
import { otpStore } from '../send-otp/route';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, otp } = await req.json();

  if (!name || !email || !password || !otp) {
    return NextResponse.json({ error: 'All fields and OTP are required.' }, { status: 400 });
  }
  // OTP validation
  const otpData = otpStore[email];
  if (!otpData) {
    return NextResponse.json({ error: 'OTP not found. Please request a new OTP.' }, { status: 400 });
  }
  if (Date.now() > otpData.expires) {
    return NextResponse.json({ error: 'OTP expired. Please request a new OTP.' }, { status: 400 });
  }
  if (hashOTP(otp) !== otpData.hashed) {
    return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return NextResponse.json({ message: 'Signup successful', user: { name, email } });
}
