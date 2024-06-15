import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, userStatus } from "@prisma/client";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        port: process.env.SMTP_PORT,
        host: process.env.SMTP_HOST,
        secure: true,
        auth: {
          user: process.env.SMTP_AUTH_USERNAME,
          pass: process.env.SMTP_AUTH_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    session: async (data) => {
      if (data.session.user?.email) {
        const user = await prisma.user.findFirst({
          where: {
            email: data.session.user.email,
            status: userStatus.active,
          },
          include: { roles: { include: { role: true } } },
        });

        if (user) {
          data.session.firstName = user.firstName;
          data.session.lastName = user.lastName;
          data.session.userRoles = user.roles.map((role) => role.role.name);
        }
      }
      return data.session;
    },
    signIn: async (data) => {
      const email = data.user.email;
      if (!email) return false;
      const userCount = await prisma.user.count({
        where: {
          email: email,
          status: userStatus.active,
        },
      });
      if (userCount === 1) {
        return true;
      } else return false;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
});
