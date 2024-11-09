import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { ActivityRepository } from "@/backend/repository/activity/ActivityRepository";

export default class NotificationApiController extends BaseApiController {
  private activityRepository = new ActivityRepository();
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }

    const notifications = await this.activityRepository.findActivitiesForUser(
      session.user.email
    );

    return this.responseOK(notifications);
  }
}
