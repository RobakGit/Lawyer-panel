import { NextApiRequest, NextApiResponse } from "next";
import NotificationApiController from "@/backend/service/notification/NotificationApiController";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await new NotificationApiController(req, res).process();
};
