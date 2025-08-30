import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/utils/dbConnect';
import { hashOTP } from '@/utils/otp';
import OTPModel from '@/models/otpModel';

export async function POST(req: NextRequest) {
  try {
    console.log('POST request received');

    await dbConnect();
    const { name, email, dob, otp } = await req.json();

    if (!name || !email || !dob || !otp) {
      console.error('Missing fields:', { name, email, dob, otp });
      return NextResponse.json({ error: 'All fields and OTP are required.' }, { status: 400 });
    }

    // Debugging logs
    console.log('Received email:', email);
    console.log('Received OTP:', otp);

    // Fetch OTP from database
    const otpData = await OTPModel.findOne({ email });
    if (!otpData) {
      console.error('OTP not found for email:', email);
      return NextResponse.json({ error: 'OTP not found. Please request a new OTP.' }, { status: 400 });
    }
    if (Date.now() > otpData.expires) {
      console.error('OTP expired for email:', email);
      return NextResponse.json({ error: 'OTP expired. Please request a new OTP.' }, { status: 400 });
    }
    if (hashOTP(otp) !== otpData.hashed) {
      console.error('Invalid OTP for email:', email);
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists with email:', email);
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    const user = new User({ name, email, dob });
    await user.save();

    console.log('User created successfully:', { name, email, dob });
    return NextResponse.json({ message: 'Signup successful', user: { name, email, dob } });
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
