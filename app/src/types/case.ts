import { CaseStatus, FileStatus } from "@prisma/client";

export type UserType = {
  uid: string;
  firstName: string;
  lastName: string;
};

export type ClientOrOpponentType = {
  uid: string;
  displayName: string;
};

export type ClientOrOpponentPayloadType = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  other: string;
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
  isDirectory: boolean;
};

export type CaseBackendType = {
  uid: string;
  title: string;
  destination: string | null;
  description: string | null;
  status: CaseStatus;
  createdAt: Date;
  users: UserType[];
  client: ClientOrOpponentType | null;
  opponent: ClientOrOpponentType | null;
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
  client: {
    select: {
      uid: true,
      name: true,
      firstName: true,
      lastName: true,
    },
  },
  opponent: {
    select: {
      uid: true,
      name: true,
      firstName: true,
      lastName: true,
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
      isDirectory: true,
    },
  },
};

export type CaseDetailsType = CaseBackendType & {};
