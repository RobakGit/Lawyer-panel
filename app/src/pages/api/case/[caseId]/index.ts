import { NextApiRequest, NextApiResponse } from "next";
import CaseUidApiController from "@/backend/service/case/CaseUidApiController";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new CaseUidApiController(req, res).process();
};
