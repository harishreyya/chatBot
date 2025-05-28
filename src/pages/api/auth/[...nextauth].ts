import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail, emailConfig } from "@/lib/email";
import { html, text } from "@/lib/emailTemplate";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: emailConfig,
      maxAge: 3 * 60,
      async generateVerificationToken() {
        return randomInt(100000, 999999).toString();
      },
      async sendVerificationRequest({ identifier: email, token, url }) {
        const { host } = new URL(url);
        await sendMail({
          to: email,
          subject: `Sign in to ${host}`,
          html: html({ email, token, host }),
          text: text({ email, token, host }),
        });
        console.log(`✅ OTP sent to ${email} → ${token}`);
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },

  callbacks: {
    async session({ session, token }:any) {
      if (token) {
        session.user = {
          ...(session.user || {}),
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions as any);
