import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ServerSessionI } from "@/types/next-auth";
import Nextauth from "@/pages/api/auth/[...nextauth]";
import * as fsPromises from "node:fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
  if (req.method === "GET") {
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const fileUid = req.query.file as string;
    const file = await prisma.file.findUnique({
      where: {
        uid: fileUid,
        case: { users: { some: { user: { email: session.user.email } } } },
      },
    });
    if (!file) return res.status(404).json({ message: "File not found" });
    const fileData = await fsPromises.readFile(file.path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
    res.end(fileData);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
