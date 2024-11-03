import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { getServerSession } from "next-auth";
import { ServerSessionI } from "@/types/next-auth";
import Nextauth from "@/pages/api/auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = process.env.FILE_UPLOAD_PATH;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      if (!session || !session.user?.email) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      let filesData = [];
      if (fields.directory) {
        const newDirectory = await prisma.file.create({
          data: {
            name: fields.directory[0],
            path: "",
            isDirectory: true,
            case: { connect: { uid: req.query.caseId as string } },
            user: { connect: { email: session.user.email } },
          },
          select: { uid: true, name: true, isDirectory: true },
        });
        filesData.push(newDirectory);
      } else {
        const filesArr = files.files as formidable.File[];
        for await (const file of filesArr) {
          const newFile = await prisma.file.create({
            data: {
              name: file.originalFilename as string,
              path: `${uploadDir}/${file.newFilename}`,
              case: { connect: { uid: req.query.caseId as string } },
              user: { connect: { email: session.user.email } },
            },
            select: { uid: true, name: true, isDirectory: true },
          });
          filesData.push(newFile);
        }
      }

      res.json({ filesData });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
