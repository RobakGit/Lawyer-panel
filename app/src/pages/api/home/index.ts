import prisma from "@/services/prisma";
import { CaseBackendPrismaSelect, CaseBackendType } from "@/types/case";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const { client, opponent } = req.query;
    const cases = await prisma.case.findMany({
      where: {
        users: {
          some: { user: { is: { email: session.user?.email ?? "" } } },
        },
        client: client ? { uid: client as string } : undefined,
        opponent: opponent ? { uid: opponent as string } : undefined,
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
        client: caseItem.client
          ? {
              uid: caseItem.client.uid,
              displayName:
                caseItem.client.name ??
                `${caseItem.client.firstName} ${caseItem.client.lastName}`,
            }
          : null,
        opponent: caseItem.opponent
          ? {
              uid: caseItem.opponent.uid,
              displayName:
                caseItem.opponent.name ??
                `${caseItem.opponent.firstName} ${caseItem.opponent.lastName}`,
            }
          : null,
      };
    });
    res.json(response);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
