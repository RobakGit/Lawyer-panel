import HomeApiController from "@/backend/service/home/HomeApiController";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new HomeApiController(req, res).process();
};
