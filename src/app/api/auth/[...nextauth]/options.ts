import prismadb from "@/lib/prismadb";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
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

        const dbStoreFound = await prismadb.store.findFirst({
          where: {
            username: credentials.username,
          },
        });

        if (dbStoreFound && dbStoreFound.password === credentials.password) {
          const { password, ...storeWithoutPassword } = dbStoreFound;
          return storeWithoutPassword;
        }

        return null;
      },
    }),
  ],
};
