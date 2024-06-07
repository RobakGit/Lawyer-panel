import { DefaultSession } from "next-auth";

export interface ServerSessionI {
  callbacks?: {};
  user: {
    email: string;
  };
  expires: string;
}

export declare module "next-auth" {
  export interface Session extends DefaultSession {
    firstName: string | null;
    lastName: string | null;
    userRoles: Array<string>;
  }
}
