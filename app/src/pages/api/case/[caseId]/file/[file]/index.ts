import { NextApiRequest, NextApiResponse } from "next";
import FileUidApiController from "@/backend/service/case/file/FileUidApiController";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new FileUidApiController(req, res).process();
};
