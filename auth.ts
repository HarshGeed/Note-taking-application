import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        otp: { label: "OTP", type: "text", required: true },
      },
      async authorize(credentials) {
        // OTP flow - validate via login API
        if (credentials?.email && credentials?.otp) {
          try {
            // Use absolute URL or fallback to localhost
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/api/user/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                otp: credentials.otp,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              return {
                id: data.user.email,
                name: data.user.name,
                email: data.user.email,
              };
            }
          } catch (error) {
            console.error('Auth error:', error);
          }
        }
        return null;
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
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to homepage after successful login
      if (url.startsWith('/') && url !== '/signin' && url !== '/signup') {
        return baseUrl + url;
      }
      return baseUrl + '/';
    },
  },
});