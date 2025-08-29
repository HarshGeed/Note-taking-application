import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, hashOTP } from '../../../../utils/otp';

export const otpStore: Record<string, { hashed: string; expires: number }> = {};

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const otp = generateOTP();
  const hashed = hashOTP(otp);
  const expires = Date.now() + 5 * 60 * 1000;
  otpStore[email] = { hashed, expires };

  // TODO: Send OTP to user's email (use nodemailer or similar)
  console.log(`OTP for ${email}: ${otp}`);

  return NextResponse.json({ message: 'OTP sent.' });
}
