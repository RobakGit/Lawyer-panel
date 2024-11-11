import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../../BaseApiController";
import * as fsPromises from "node:fs/promises";
import { FileRepository } from "@/backend/repository/file/FileRepository";

export default class FileUidApiController extends BaseApiController {
  private fileRepository = new FileRepository();
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }
    const fileUid = this.req.query.file as string;
    const file = await this.fileRepository.findByUidAndUserAssignedToCase(
      fileUid,
      session.user.email
    );
    if (!file) return this.responseNotFound({ message: "File not found" });
    if (file.isDirectory) {
      const files = await this.fileRepository.findFilesByParent(file.uid);
      return this.responseOK({ parent: file, files });
    }
    const fileData = await fsPromises.readFile(file.path);
    this.res.setHeader("Content-Type", "application/octet-stream");
    this.res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.name}`
    );
    this.res.end(fileData);
  }

  protected async delete(): Promise<void> {
    const fileUid = this.req.query.file as string;
    const file = await this.fileRepository.markFileAsDeleted(fileUid);
    return this.responseOK({ file });
  }

  protected async put(): Promise<void> {
    const fileUid = this.req.query.file as string;
    const { parentUid, filename } = this.req.body;
    let file;
    if (filename) {
      file = await this.fileRepository.changeName(fileUid, filename);
    }
    if (parentUid === null) {
      file = await this.fileRepository.unlinkParentDirectory(fileUid);
    }
    if (parentUid && typeof parentUid === "string") {
      file = await this.fileRepository.changeParent(fileUid, parentUid);
    }
    return this.responseOK({ file });
  }
}
