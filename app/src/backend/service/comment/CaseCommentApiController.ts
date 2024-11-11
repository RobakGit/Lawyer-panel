import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { getServerSession } from "next-auth";
import Nextauth from "@/pages/api/auth/[...nextauth]";
import { ServerSessionI } from "@/types/next-auth";
import { CaseRepository } from "@/backend/repository/case/CaseRepository";
import { CaseCommentRepository } from "@/backend/repository/comment/CaseCommentRepository";

export default class CaseCommentApiController extends BaseApiController {
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async post() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }
    const { caseId } = this.req.query;
    const { content } = this.req.body;
    if (typeof content !== "string")
      return this.responseBadRequest("Content must be a string");
    const caseRepository = new CaseRepository();
    const caseData = await caseRepository.findCaseByUid(caseId as string);
    if (!caseData) return this.responseNotFound("Case not found");
    const caseCommentRepository = new CaseCommentRepository();
    const comment = await caseCommentRepository.createByUserEmail(
      content,
      caseId as string,
      session.user.email
    );

    this.responseOK({ comment });
  }
}
