import crypto from 'crypto';

// Generate a 6-digit OTP
export function generateOTP(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

// Hash OTP for secure storage
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Compare hashed OTP
export function verifyOTP(otp: string, hashed: string): boolean {
  return hashOTP(otp) === hashed;
}
