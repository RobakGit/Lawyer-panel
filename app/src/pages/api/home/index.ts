import prisma from "@/services/prisma";
import { CaseBackendPrismaSelect, CaseBackendType } from "@/types/case";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const cases = await prisma.case.findMany({
      where: {
        users: {
          some: { user: { is: { email: session.user?.email ?? "" } } },
        },
      },
      orderBy: { createdAt: "desc" },
      select: CaseBackendPrismaSelect,
    });

    const response: CaseBackendType[] = cases.map((caseItem) => {
      return {
        ...caseItem,
        users: caseItem.users.map((user) => {
          return { ...user.user };
        }),
      };
    });
    res.json(response);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
