import prisma from "@/services/prisma";
import { userStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: "Unauthorized" });
    const users = await prisma.user.findMany({
      where: { status: userStatus.active },
      select: { uid: true, firstName: true, lastName: true },
    });
    res.json(users);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
