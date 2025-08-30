import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, hashOTP } from '@/utils/otp';
import { sendOTPEmail } from '@/utils/sendEmail';
import otpModel from '@/models/otpModel';
import dbConnect from '@/utils/dbConnect';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  try {
    await dbConnect();

    const otp = generateOTP();
    const hashed = hashOTP(otp);
    const expires = Date.now() + 5 * 60 * 1000;

    await otpModel.findOneAndUpdate(
      { email },
      { email, hashed, expires },
      { upsert: true }
    );

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send OTP email.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
