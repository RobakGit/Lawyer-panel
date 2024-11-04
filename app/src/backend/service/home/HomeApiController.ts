import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { CaseBackendType } from "@/types/case";
import { CaseRepository } from "@/backend/repository/case/CaseRepository";

export default class HomeApiController extends BaseApiController {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session || !session.user?.email) return this.responseUnauthorized();
    const { client, opponent } = this.req.query;
    const caseRepository = new CaseRepository();
    const cases =
      await caseRepository.findAllUserCasesOptionallyFilteredByClientOrOpponent(
        session.user.email,
        client as string,
        opponent as string
      );

    const response: CaseBackendType[] = cases.map((caseItem) => {
      return {
        ...caseItem,
        users: caseItem.users.map((user) => {
          return { ...user.user };
        }),
        client: caseItem.client
          ? {
              uid: caseItem.client.uid,
              displayName:
                caseItem.client.name ??
                `${caseItem.client.firstName} ${caseItem.client.lastName}`,
            }
          : null,
        opponent: caseItem.opponent
          ? {
              uid: caseItem.opponent.uid,
              displayName:
                caseItem.opponent.name ??
                `${caseItem.opponent.firstName} ${caseItem.opponent.lastName}`,
            }
          : null,
      };
    });
    return this.responseOK(response);
  }
}
