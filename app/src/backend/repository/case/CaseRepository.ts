import {
  CaseBackendPrismaResult,
  CaseBackendPrismaSelect,
  CaseBackendPrismaSelectWithFilesOrderBy,
} from "@/types/case";
import { BaseRepository } from "../BaseRepository";
import { Prisma } from "@prisma/client";

export class CaseRepository extends BaseRepository {
  async createCaseByUserEmail(userEmail: string) {
    return this.prisma.case.create({
      data: {
        title: "Nowa sprawa",
        users: { create: { user: { connect: { email: userEmail } } } },
      },
      select: {
        uid: true,
      },
    });
  }

  async findCaseByUid(uid: string): Promise<CaseBackendPrismaResult> {
    return this.prisma.case.findUnique({
      where: { uid },
      select: CaseBackendPrismaSelectWithFilesOrderBy,
    }) as unknown as Promise<CaseBackendPrismaResult>;
  }

  async findUsersAssignedToCase(uid: string) {
    return this.prisma.case
      .findUnique({ where: { uid } })
      .users({ select: { user: { select: { uid: true, id: true } } } });
  }

  async updateCaseByUid(uid: string, data: Prisma.CaseUpdateInput) {
    return this.prisma.case.update({
      where: { uid },
      data,
      select: CaseBackendPrismaSelect,
    });
  }

  async findAllUserCasesOptionallyFilteredByClientOrOpponent(
    userEmail: string,
    client?: string,
    opponent?: string
  ) {
    return this.prisma.case.findMany({
      where: {
        users: {
          some: { user: { is: { email: userEmail } } },
        },
        client: client ? { uid: client } : undefined,
        opponent: opponent ? { uid: opponent } : undefined,
      },
      orderBy: { createdAt: "desc" },
      select: CaseBackendPrismaSelect,
    });
  }
}
