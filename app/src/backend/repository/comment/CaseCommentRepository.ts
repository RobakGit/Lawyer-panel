import { BaseRepository } from "../BaseRepository";

export class CaseCommentRepository extends BaseRepository {
  async createByUserEmail(content: string, caseId: string, userEmail: string) {
    return this.prisma.comment.create({
      data: {
        content,
        case: { connect: { uid: caseId as string } },
        user: { connect: { email: userEmail } },
      },
    });
  }
}
