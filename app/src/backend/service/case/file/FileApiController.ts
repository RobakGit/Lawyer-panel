import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../../BaseApiController";
import * as formidable from "formidable";
import { FileRepository } from "@/backend/repository/file/FileRepository";

export default class FileApiController extends BaseApiController {
  private uploadDir = process.env.FILE_UPLOAD_PATH;
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async post() {
    const session = await this.getSession();
    const form = new formidable.IncomingForm({
      uploadDir: this.uploadDir,
      keepExtensions: true,
    });
    form.parse(this.req, async (err, fields, files) => {
      if (err) {
        return this.responseInternalServerError();
      }
      if (!session || !session.user?.email) {
        return this.responseUnauthorized();
      }
      let filesData = [];
      const fileRepository = new FileRepository();
      if (fields.directory) {
        const newDirectory = await fileRepository.createDirectoryByUser(
          this.req.query.caseId as string,
          session.user.email,
          fields.directory[0]
        );
        filesData.push(newDirectory);
      } else {
        const filesArr = files.files as formidable.File[];
        for await (const file of filesArr) {
          const newFile = await fileRepository.createFileByUser(
            file.originalFilename as string,
            `${this.uploadDir}/${file.newFilename}`,
            this.req.query.caseId as string,
            session.user.email
          );
          filesData.push(newFile);
        }
      }

      this.responseOK({ filesData });
    });
  }
}
