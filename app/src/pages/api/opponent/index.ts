import { NextApiRequest, NextApiResponse } from "next";
import OpponentApiController from "@/backend/service/opponent/OpponentApiController";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new OpponentApiController(req, res).process();
};
