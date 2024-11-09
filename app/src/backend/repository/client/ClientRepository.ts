import { FileStatus } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";

export class ClientRepository extends BaseRepository {
  async getAllClients() {
    return this.prisma.client.findMany({
      select: { uid: true, firstName: true, lastName: true, name: true },
    });
  }

  async createClient(
    firstName: string,
    lastName: string,
    displayName: string,
    email: string,
    phone: string,
    address: string,
    other: string
  ) {
    return this.prisma.client.create({
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
