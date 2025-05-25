import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string | null
      image: string | null
    }
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to baseUrl if url is not absolute
      if (!url.startsWith('http')) {
        return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
      }
      // Only allow redirects to our domain
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account, profile, email }) {
      console.log('Sign in callback triggered:', { 
        user: user?.email || 'No user data',
        account: account?.provider || 'No account data',
        profile: profile?.email || 'No profile data',
        email: email || 'No email data'
      });
      return true;
    },
    async jwt({ token, user }) {
      console.log('JWT callback triggered:', { 
        token: token?.sub || 'No token',
        user: user?.email || 'No user data'
      });
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  events: {
    async signIn(message) {
      console.log('Sign in event triggered:', message);
    },
    async signOut(message) {
      console.log('Sign out event triggered:', message);
    },
    async createUser(message) {
      console.log('Create user event triggered:', message);
    },
    async updateUser(message) {
      console.log('Update user event triggered:', message);
    },
    async linkAccount(message) {
      console.log('Link account event triggered:', message);
    },
    async session(message) {
      console.log('Session event triggered:', message);
    }
  },
  debug: process.env.NODE_ENV === 'development',
}
