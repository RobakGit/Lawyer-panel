import { NextApiRequest, NextApiResponse } from "next";
import BaseApiController from "../../BaseApiController";
import { ClientRepository } from "@/backend/repository/client/ClientRepository";

export default class ClientApiController extends BaseApiController {
  private clientRepository = new ClientRepository();
  constructor(req: NextApiRequest, res: NextApiResponse) {
    super(req, res);
  }

  protected async get() {
    const session = await this.getSession();
    if (!session || !session.user?.email) {
      return this.responseUnauthorized();
    }
    const clients = await this.clientRepository.getAllClients();

    const response = clients.map((client) => ({
      uid: client.uid,
      displayName: client.name
        ? client.name
        : `${client.firstName} ${client.lastName}`,
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
    const newClient = await this.clientRepository.createClient(
      firstName,
      lastName,
      name,
      email,
      phone,
      address,
      other
    );
    const response = {
      uid: newClient.uid,
      displayName: newClient.name
        ? newClient.name
        : `${newClient.firstName} ${newClient.lastName}`,
    };

    return this.responseOK(response);
  }
}
