import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyOTP } from "./utils/otp";
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
        // OTP flow (Edge Runtime compatible: only demo logic, no DB)
        if (credentials?.otp) {
          if (credentials.otp !== '123456') {
            throw new Error('Invalid OTP');
          }
          // Return a demo user object
          return { id: 'demo-id', name: String(credentials.name || 'User'), email: String(credentials.email) };
        }
        // Password flow (Edge Runtime compatible: always fail)
        if (credentials?.email && credentials?.password) {
          throw new Error('Password login not supported in Edge Runtime.');
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