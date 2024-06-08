import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Nextauth from "../auth/[...nextauth]";
import { ServerSessionI } from "@/types/next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
    if (!session || !session.user?.email)
      return res.status(401).json({ message: "Unauthorized" });
    const { caseId } = req.query;
    const { content } = req.body;
    if (typeof content !== "string")
      return res.status(400).json({ message: "Content must be a string" });
    const caseData = await prisma.case.findUnique({
      where: { uid: caseId as string },
    });
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    const comment = await prisma.comment.create({
      data: {
        content,
        case: { connect: { uid: caseId as string } },
        user: { connect: { email: session.user.email } },
      },
    });

    res.json({ comment });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
