import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { CaseRepository } from "@/backend/repository/case/CaseRepository";
import { CaseBackendType } from "@/types/case";
import { ActivityRepository } from "@/backend/repository/activity/ActivityRepository";

export default class CaseUidApiController extends BaseApiController {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session) return this.responseUnauthorized();
    const caseRepositry = new CaseRepository();
    const caseData = await caseRepositry.findCaseByUid(
      this.req.query.caseId as string
    );

    if (!caseData) return this.responseNotFound({ message: "Case not found" });

    const response: CaseBackendType = {
      ...caseData,
      users: caseData.users.map((user) => {
        return { ...user.user };
      }),
      client: caseData.client
        ? {
            uid: caseData.client.uid,
            displayName:
              caseData.client.name ??
              `${caseData.client.firstName} ${caseData.client.lastName}`,
          }
        : null,
      opponent: caseData.opponent
        ? {
            uid: caseData.opponent.uid,
            displayName:
              caseData.opponent.name ??
              `${caseData.opponent.firstName} ${caseData.opponent.lastName}`,
          }
        : null,
    };
    this.responseOK(response);
  }
  protected async put() {
    const session = await this.getSession();
    if (!session) return this.responseUnauthorized();
    const {
      title,
      destination,
      client,
      opponent,
      status,
      description,
      cooperator,
    } = this.req.body;
    let data = {};
    const caseRepository = new CaseRepository();
    if (title && typeof title === "string") data = { ...data, title };
    if (destination && typeof destination === "string")
      data = { ...data, destination };
    if (client && typeof client === "string") {
      data = { ...data, client: { connect: { uid: client } } };
    }
    if (opponent && typeof opponent === "string") {
      data = { ...data, opponent: { connect: { uid: opponent } } };
    }
    if (status && typeof status === "string") data = { ...data, status };
    if (description && typeof description === "string")
      data = { ...data, description };
    if (cooperator && typeof cooperator.uid === "string") {
      const users = await caseRepository.findUsersAssignedToCase(
        this.req.query.caseId as string
      );
      let userToRemove: { user: { id: number; uid: string } } | undefined;
      if (users) {
        userToRemove = users.find((user) => user.user.uid === cooperator.uid);
      }
      if (userToRemove) {
        data = {
          ...data,
          users: {
            deleteMany: {
              userId: userToRemove.user.id,
            },
          },
        };
      } else {
        data = {
          ...data,
          users: {
            create: {
              user: {
                connect: { uid: cooperator.uid },
              },
            },
          },
        };
      }
    }

    const caseData = await caseRepository.updateCaseByUid(
      this.req.query.caseId as string,
      data
    );

    if (session.user?.email && cooperator?.uid) {
      const activityRepository = new ActivityRepository();
      await activityRepository.createByUser(
        this.req.query.caseId as string,
        session.user.email,
        cooperator.uid,
        "changeCooperator",
        "Zmiana przypisania sprawy",
        `Zostałeś dodany/odpięty w sprawie ${caseData.title}`
      );
    }

    const response: CaseBackendType = {
      ...caseData,
      users: caseData.users.map((user) => {
        return { ...user.user };
      }),
      client: caseData.client
        ? {
            uid: caseData.client.uid,
            displayName:
              caseData.client.name ??
              `${caseData.client.firstName} ${caseData.client.lastName}`,
          }
        : null,
      opponent: caseData.opponent
        ? {
            uid: caseData.opponent.uid,
            displayName:
              caseData.opponent.name ??
              `${caseData.opponent.firstName} ${caseData.opponent.lastName}`,
          }
        : null,
    };
    this.responseOK(response);
  }
}
