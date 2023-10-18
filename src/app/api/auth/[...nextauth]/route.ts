import NextAuth from "next-auth";
import { options as AuthConfig } from "./options";

const handler = NextAuth(AuthConfig);

export { handler as GET, handler as POST };
