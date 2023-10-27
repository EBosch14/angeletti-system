import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: $Enums.UserRole;
    image: string;
    store_id: string;
  }

  // interface Session {
  //   user: User;
  // }
}
