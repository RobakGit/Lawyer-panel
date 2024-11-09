import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { OpponentRepository } from "@/backend/repository/opponent/OpponentRepository";

export default class OpponentApiController extends BaseApiController {
  private opponentRepository = new OpponentRepository();
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }
    const opponents = await this.opponentRepository.getAllOpponents();

    const response = opponents.map((opponent) => ({
      uid: opponent.uid,
      displayName: opponent.name
        ? opponent.name
        : `${opponent.firstName} ${opponent.lastName}`,
    }));
    return this.responseOK(response);
  }

  protected async post() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }
    const { firstName, lastName, name, email, phone, address, other } =
      this.req.body;
    const newOpponent = await this.opponentRepository.createOpponent(
      firstName,
      lastName,
      name,
      email,
      phone,
      address,
      other
    );
    const response = {
      uid: newOpponent.uid,
      displayName: newOpponent.name
        ? newOpponent.name
        : `${newOpponent.firstName} ${newOpponent.lastName}`,
    };

    return this.responseOK(response);
  }
}
