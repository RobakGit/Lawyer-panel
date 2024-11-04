import { BaseRepository } from "../BaseRepository";

export class ActivityRepository extends BaseRepository {
  async createByUser(
    targetCaseUid: string,
    initiatorUserEmail: string,
    affectedUserUid: string,
    type: string,
    title: string,
    message: string
  ) {
    return this.prisma.activity.create({
      data: {
        targetCase: {
          connect: { uid: targetCaseUid },
        },
        initiatorUser: {
          connect: { email: initiatorUserEmail },
        },
        type: type,
        affectedUser: {
          connect: { uid: affectedUserUid },
        },
        title: title,
        message: message,
      },
    });
  }

  async findActivitiesForUser(userEmail: string) {
    return this.prisma.activity.findMany({
      where: { affectedUser: { email: userEmail } },
      orderBy: { createdAt: "desc" },
    });
  }
}
