import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session || !session.user?.email)
      return res.status(401).json({ message: "Unauthorized" });
    const caseData = await prisma.case.create({
      data: {
        title: "Nowa sprawa",
        users: { create: { user: { connect: { email: session.user.email } } } },
      },
      select: {
        uid: true,
      },
    });

    res.json(caseData);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
