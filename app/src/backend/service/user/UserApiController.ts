import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { UserRepository } from "@/backend/repository/user/UserRepository";

export default class UserApiController extends BaseApiController {
  private userRepository = new UserRepository();
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session) return this.responseUnauthorized();
    const users = await this.userRepository.getAllActiveUsers();
    this.responseOK(users);
  }
}
