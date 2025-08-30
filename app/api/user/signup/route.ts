import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/utils/dbConnect';
import { hashOTP } from '@/utils/otp';
import otpModel from '@/models/otpModel';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, dob, otp } = await req.json();

    if (!name || !email || !dob || !otp) {
      return NextResponse.json({ error: 'All fields and OTP are required.' }, { status: 400 });
    }

    // Fetch OTP from database
    const otpData = await otpModel.findOne({ email });
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

    const user = new User({ name, email, dob });
    await user.save();

    // Clean up used OTP
    await otpModel.deleteOne({ email });

    return NextResponse.json({ message: 'Signup successful', user: { name, email, dob } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
