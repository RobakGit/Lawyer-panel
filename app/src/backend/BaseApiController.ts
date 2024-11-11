import Nextauth from "@/pages/api/auth/[...nextauth]";
import { ServerSessionI } from "@/types/next-auth";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";

export default abstract class BaseApiController {
  protected req: NextApiRequest;
  protected res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
  }

  protected async getSession() {
    return getServerSession<ServerSessionI>(this.req, this.res, Nextauth);
  }

  async process() {
    switch (this.req.method) {
      case "POST":
        await this.post();
        break;
      case "GET":
        await this.get();
        break;
      case "PUT":
        await this.put();
        break;
      case "DELETE":
        await this.delete();
        break;
      default:
        this.responseMethodNotAllowed();
        break;
    }
  }

  protected async post(): Promise<void> {
    this.responseMethodNotAllowed({ message: "Method not allowed" });
  }

  protected async get(): Promise<void> {
    this.responseMethodNotAllowed({ message: "Method not allowed" });
  }

  protected async put(): Promise<void> {
    this.responseMethodNotAllowed({ message: "Method not allowed" });
  }

  protected async delete(): Promise<void> {
    this.responseMethodNotAllowed({ message: "Method not allowed" });
  }

  protected responseOK(data: {}) {
    this.res.status(StatusCodes.OK).json(data);
  }

  protected responseUnauthorized(data?: {}) {
    this.res
      .status(StatusCodes.UNAUTHORIZED)
      .json(data ?? { message: "Unauthorized" });
  }

  protected responseBadRequest(data: {}) {
    this.res.status(StatusCodes.BAD_REQUEST).json(data);
  }

  protected responseNotFound(data: {}) {
    this.res.status(StatusCodes.NOT_FOUND).json(data);
  }

  protected responseMethodNotAllowed(data = {}) {
    this.res.status(StatusCodes.METHOD_NOT_ALLOWED).json(data);
  }

  protected responseInternalServerError(data = {}) {
    this.res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(data);
  }
}
