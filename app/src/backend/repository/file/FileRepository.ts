import { FileStatus } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";

export class FileRepository extends BaseRepository {
  async createDirectoryByUser(
    caseUid: string,
    userEmail: string,
    directoryName: string
  ) {
    return this.prisma.file.create({
      data: {
        name: directoryName,
        path: "",
        isDirectory: true,
        case: { connect: { uid: caseUid } },
        user: { connect: { email: userEmail } },
      },
      select: { uid: true, name: true, isDirectory: true },
    });
  }

  async createFileByUser(
    fileName: string,
    filePath: string,
    caseUid: string,
    userEmail: string
  ) {
    return this.prisma.file.create({
      data: {
        name: fileName,
        path: filePath,
        case: { connect: { uid: caseUid } },
        user: { connect: { email: userEmail } },
      },
      select: { uid: true, name: true, isDirectory: true },
    });
  }

  async findByUidAndUserAssignedToCase(fileUid: string, userEmail: string) {
    return this.prisma.file.findUnique({
      where: {
        uid: fileUid,
        case: { users: { some: { user: { email: userEmail } } } },
      },
    });
  }

  async markFileAsDeleted(fileUid: string) {
    return this.prisma.file.update({
      where: { uid: fileUid },
      data: { status: FileStatus.deleted },
      select: { uid: true, status: true },
    });
  }
}
