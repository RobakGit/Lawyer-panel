import { NextApiRequest, NextApiResponse } from "next";
import CaseCommentApiController from "@/backend/service/comment/CaseCommentApiController";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new CaseCommentApiController(req, res).process();
};
