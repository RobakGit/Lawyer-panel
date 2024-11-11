import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { CaseRepository } from "@/backend/repository/case/CaseRepository";

export default class CaseApiController extends BaseApiController {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async post() {
    const session = await this.getSession();
    if (!session || !session.user?.email) return this.responseUnauthorized();
    const caseRepository = new CaseRepository();
    const caseData = await caseRepository.createCaseByUserEmail(
      session.user.email
    );

    return this.responseOK(caseData);
  }
}
