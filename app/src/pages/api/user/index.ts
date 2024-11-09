import UserApiController from "@/backend/service/user/UserApiController";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new UserApiController(req, res).process();
};
