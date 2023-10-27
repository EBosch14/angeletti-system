import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: $Enums.UserRole;
    image: string;
    store_id: string;
  }

  interface Session {
    user: JWT;
  }
}
