import { NextApiRequest, NextApiResponse } from "next";
import FileApiController from "@/backend/service/case/file/FileApiController";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new FileApiController(req, res).process();
};
