import prisma from "@/services/prisma";
import { CaseBackendPrismaSelect, CaseBackendType } from "@/types/case";
import { ServerSessionI } from "@/types/next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import Nextauth from "../../auth/[...nextauth]";

const isLoggedIn = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  if (!session) return false;
  return true;
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const caseId = req.query.caseId as string;
  if (req.method === "GET") {
    if (!isLoggedIn) return res.status(401).json({ message: "Unauthorized" });
    const caseData = await prisma.case.findUnique({
      where: { uid: caseId },
      select: CaseBackendPrismaSelect,
    });

    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const response: CaseBackendType = {
      ...caseData,
      users: caseData.users.map((user) => {
        return { ...user.user };
      }),
      client: caseData.client
        ? {
            uid: caseData.client.uid,
            displayName:
              caseData.client.name ??
              `${caseData.client.firstName} ${caseData.client.lastName}`,
          }
        : null,
      opponent: caseData.opponent
        ? {
            uid: caseData.opponent.uid,
            displayName:
              caseData.opponent.name ??
              `${caseData.opponent.firstName} ${caseData.opponent.lastName}`,
          }
        : null,
    };
    res.json(response);
  } else if (req.method === "PUT") {
    const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const {
      title,
      destination,
      client,
      opponent,
      status,
      description,
      cooperator,
    } = req.body;
    let data = {};
    if (title && typeof title === "string") data = { ...data, title };
    if (destination && typeof destination === "string")
      data = { ...data, destination };
    if (client && typeof client === "string") {
      data = { ...data, client: { connect: { uid: client } } };
    }
    if (opponent && typeof opponent === "string") {
      data = { ...data, opponent: { connect: { uid: opponent } } };
    }
    if (status && typeof status === "string") data = { ...data, status };
    if (description && typeof description === "string")
      data = { ...data, description };
    if (cooperator && typeof cooperator.uid === "string") {
      const users = await prisma.case
        .findUnique({ where: { uid: caseId as string } })
        .users({ select: { user: { select: { uid: true, id: true } } } });
      let userToRemove: { user: { id: number; uid: string } } | undefined;
      if (users) {
        userToRemove = users.find((user) => user.user.uid === cooperator.uid);
      }
      if (userToRemove) {
        data = {
          ...data,
          users: {
            deleteMany: {
              userId: userToRemove.user.id,
            },
          },
        };
      } else {
        data = {
          ...data,
          users: {
            create: {
              user: {
                connect: { uid: cooperator.uid },
              },
            },
          },
        };
      }
    }
    const caseData = await prisma.case.update({
      where: { uid: caseId as string },
      data,
      select: CaseBackendPrismaSelect,
    });

    if (session.user?.email && cooperator?.uid) {
      await prisma.activity.create({
        data: {
          targetCase: {
            connect: { uid: caseId as string },
          },
          initiatorUser: {
            connect: { email: session.user.email },
          },
          type: "changeCooperator",
          affectedUser: {
            connect: { uid: cooperator.uid },
          },
          title: "Zmiana przypisania sprawy",
          message: `Zostałeś dodany/odpięty w sprawie ${caseData.title}`,
        },
      });
    }

    const response: CaseBackendType = {
      ...caseData,
      users: caseData.users.map((user) => {
        return { ...user.user };
      }),
      client: caseData.client
        ? {
            uid: caseData.client.uid,
            displayName:
              caseData.client.name ??
              `${caseData.client.firstName} ${caseData.client.lastName}`,
          }
        : null,
      opponent: caseData.opponent
        ? {
            uid: caseData.opponent.uid,
            displayName:
              caseData.opponent.name ??
              `${caseData.opponent.firstName} ${caseData.opponent.lastName}`,
          }
        : null,
    };
    res.json(response);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
