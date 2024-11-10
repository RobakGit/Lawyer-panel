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
      select: {
        uid: true,
        name: true,
        path: true,
        isDirectory: true,
        directory: { select: { uid: true } },
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

  async changeParent(fileUid: string, newParentUid: string) {
    return this.prisma.file.update({
      where: { uid: fileUid },
      data: { directory: { connect: { uid: newParentUid } } },
      select: { uid: true, name: true, isDirectory: true },
    });
  }

  async findFilesByParent(parentUid: string) {
    return this.prisma.file.findMany({
      where: { directory: { uid: parentUid }, status: FileStatus.active },
      select: { uid: true, name: true, isDirectory: true },
    });
  }

  async unlinkParentDirectory(fileUid: string) {
    return this.prisma.file.update({
      where: { uid: fileUid },
      data: { directory: { disconnect: true } },
      select: { uid: true, name: true, isDirectory: true },
    });
  }
}
