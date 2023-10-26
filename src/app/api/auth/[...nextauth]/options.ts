import prismadb from "@/lib/prismadb";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages :{
    signIn : "/sign_in"
  },
  session:{
    strategy: "jwt"
  },
  // adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "Ingrese su nombre de usuario",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const dbUserFound = await prismadb.user.findFirst({
          where: {
            username: credentials.username,
          },
        });

        if (dbUserFound && dbUserFound.password === credentials.password) {
          const { password, ...storeWithoutPassword } = dbUserFound;
          return storeWithoutPassword;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
      if(user){
        return {
          ...token,
          username: user.username
        }
      }
      return token
    },
    async session({session, user, token}){
      return {
        ...session,
        user : {
          ...session.user,
          username: token.username
        }
      }
    }
  }
};
