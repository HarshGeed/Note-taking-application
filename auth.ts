import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyOTP } from "./utils/otp";
import User from "./models/userModel";
import bcrypt from "bcryptjs";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        // OTP flow
        if (credentials?.otp) {
          // Validate OTP (should fetch hashed OTP from DB or cache)
          // For demo, always accept '123456' as valid
          if (credentials.otp !== '123456') {
            throw new Error('Invalid OTP');
          }
          // Find or create user
          let user = await User.findOne({ email: credentials.email });
          if (!user) {
            user = await User.create({
              name: credentials.name || 'User',
              email: credentials.email,
              password: '', // No password for OTP users
            });
          }
          return { id: user._id, name: user.name, email: user.email };
        }
        // Password flow
        if (credentials?.email && credentials?.password) {
          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error('Invalid credentials');
          }
          return { id: user._id, name: user.name, email: user.email };
        }
        throw new Error('Missing credentials');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
});