import { CaseStatus, FileStatus } from "@prisma/client";

export type UserType = {
  uid: string;
  firstName: string;
  lastName: string;
};

export type Comment = {
  uid: string;
  content: string;
  createdAt: Date;
  user: UserType;
};

export type File = {
  uid: string;
  name: string;
};

export type CaseBackendType = {
  uid: string;
  title: string;
  destination: string | null;
  description: string | null;
  status: CaseStatus;
  createdAt: Date;
  users: UserType[];
  comments: Comment[];
  files: File[];
};

export const CaseBackendPrismaSelect = {
  uid: true,
  title: true,
  destination: true,
  description: true,
  status: true,
  createdAt: true,
  users: {
    select: {
      user: {
        select: {
          uid: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  comments: {
    select: {
      uid: true,
      content: true,
      createdAt: true,
      user: { select: { uid: true, firstName: true, lastName: true } },
    },
  },
  files: {
    where: { status: FileStatus.active },
    select: {
      uid: true,
      name: true,
    },
  },
};

export type CaseDetailsType = CaseBackendType & {};
