import prismadb from "@/lib/prismadb";
import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

const SESSION_DURATION_SECONDS = 60 * 5;

export const options: NextAuthOptions = {
  // adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      authorize: async (credentials, req) => {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const dbUserFound = await prismadb.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!dbUserFound) return null;

        if (dbUserFound.password !== credentials.password) return null;

        const { password, ...user } = dbUserFound;
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  // secret: process.env.NEXTAUTH_SECRET,
  // jwt: {
  //   async encode({ secret, token }) {
  //     if (!token) throw new Error("Invalid token");
  //     return jwt.sign(token, secret);
  //   },
  //   async decode({ secret, token }) {
  //     if (!token) throw new Error("Invalid token");
  //     const decodedToken = jwt.verify(token, secret);
  //     if (typeof decodedToken === "string") return JSON.parse(decodedToken);
  //     return decodedToken;
  //   },
  // },
  // session: {
  //   strategy: "jwt",
  //   maxAge: SESSION_DURATION_SECONDS,
  // }
};
