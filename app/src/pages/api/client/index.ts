import { NextApiRequest, NextApiResponse } from "next";
import ClientApiController from "@/backend/service/client/ClientApiController";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new ClientApiController(req, res).process();
};
