import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashed: { type: String, required: true },
  expires: { type: Number, required: true },
});

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);
