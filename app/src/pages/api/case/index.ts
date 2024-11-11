import CaseApiController from "@/backend/service/case/CaseApiController";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new CaseApiController(req, res).process();
};
