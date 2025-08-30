import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';
import otpModel from '@/models/otpModel';
import { hashOTP } from '@/utils/otp';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    // Verify OTP
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Clean up used OTP
    await otpModel.deleteOne({ email });

    return NextResponse.json({ 
      message: 'Login successful', 
      token, 
      user: { name: user.name, email: user.email } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
