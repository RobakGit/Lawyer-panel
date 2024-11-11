import { userStatus } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";

export class UserRepository extends BaseRepository {
  async getAllActiveUsers() {
    return this.prisma.user.findMany({
      where: { status: userStatus.active },
      select: { uid: true, firstName: true, lastName: true },
    });
  }
}
