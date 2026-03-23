import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { toAdminPath } from "@/lib/admin-path";
import {
  clearLoginGuard,
  getLoginGuardStatus,
  recordLoginFailure,
} from "@/lib/admin-security";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请输入邮箱和密码");
        }

        const email = credentials.email.trim().toLowerCase();
        const guardStatus = await getLoginGuardStatus(email);
        if (guardStatus.locked) {
          const minutes = Math.max(1, Math.ceil(guardStatus.remainingSeconds / 60));
          throw new Error(`登录失败次数过多，请 ${minutes} 分钟后再试`);
        }

        const supabaseAdmin = getSupabaseAdmin();

        const { data: admins, error } = await supabaseAdmin
          .from("admins")
          .select("*")
          .eq("email", email)
          .limit(1);

        if (error || !admins || admins.length === 0) {
          const result = await recordLoginFailure(email);
          if (result.locked) {
            throw new Error(`登录失败次数过多，请 ${result.lockMinutes} 分钟后再试`);
          }
          throw new Error(`邮箱或密码错误，还可尝试 ${Math.max(0, result.maxAttempts - result.attempts)} 次`);
        }

        const admin = admins[0];
        const isValid = await bcrypt.compare(credentials.password, admin.password_hash);

        if (!isValid) {
          const result = await recordLoginFailure(email);
          if (result.locked) {
            throw new Error(`登录失败次数过多，请 ${result.lockMinutes} 分钟后再试`);
          }
          throw new Error(`邮箱或密码错误，还可尝试 ${Math.max(0, result.maxAttempts - result.attempts)} 次`);
        }

        await clearLoginGuard(email);

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: toAdminPath("/login"),
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
