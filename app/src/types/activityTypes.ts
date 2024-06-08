import { UserType } from "./case";

export interface Activity {
  uid: string;
  type: string;
  content: string;
  createdAt: Date;
  user: UserType;
}
