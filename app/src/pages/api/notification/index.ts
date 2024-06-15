import prisma from "@/services/prisma";
import { ServerSessionI } from "@/types/next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Nextauth from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method === "GET") {
    const notifications = await prisma.activity.findMany({
      where: { affectedUser: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
