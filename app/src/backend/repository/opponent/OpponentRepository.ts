import { BaseRepository } from "../BaseRepository";

export class OpponentRepository extends BaseRepository {
  async getAllOpponents() {
    return this.prisma.opponent.findMany({
      select: { uid: true, firstName: true, lastName: true, name: true },
    });
  }

  async createOpponent(
    firstName: string,
    lastName: string,
    displayName: string,
    email: string,
    phone: string,
    address: string,
    other: string
  ) {
    return this.prisma.opponent.create({
      data: {
        firstName,
        lastName,
        name: displayName,
        email,
        phone,
        address,
        other,
      },
      select: { uid: true, firstName: true, lastName: true, name: true },
    });
  }
}
