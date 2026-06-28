import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/admin.model";
import { z } from "zod";
import { env } from "@/config/env";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        await connectToDatabase();

        const admin = await Admin.findOne({ email });

        if (!admin) {
          // If no admin exists in the system and env vars are set, allow fallback for first login
          // (Or we can run a seed script later. Let's just return null if not found for strict security).
          // However, for development, if the email matches env.ADMIN_EMAIL, we should allow it or create it.
          if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const passwordHash = await bcrypt.hash(password, 12);
            const newAdmin = await Admin.create({ email, passwordHash, role: "superadmin" });
            return { id: newAdmin._id.toString(), email: newAdmin.email, role: newAdmin.role };
          }
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, admin.passwordHash);

        if (passwordsMatch) {
          return { id: admin._id.toString(), email: admin.email, role: admin.role };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: env.AUTH_SECRET,
  trustHost: true,
});
