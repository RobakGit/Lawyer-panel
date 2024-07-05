import prisma from "@/services/prisma";
import { ServerSessionI } from "@/types/next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Nextauth from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession<ServerSessionI>(req, res, Nextauth);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method === "GET") {
    const clients = await prisma.client.findMany({
      select: { uid: true, firstName: true, lastName: true, name: true },
    });

    const response = clients.map((client) => ({
      uid: client.uid,
      displayName: client.name
        ? client.name
        : `${client.firstName} ${client.lastName}`,
    }));
    res.json(response);
  } else if (req.method === "POST") {
    const { firstName, lastName, name, email, phone, address, other } =
      req.body;
    const newClient = await prisma.client.create({
      data: {
        firstName,
        lastName,
        name,
        email,
        phone,
        address,
        other,
      },
      select: { uid: true, firstName: true, lastName: true, name: true },
    });
    const response = {
      uid: newClient.uid,
      displayName: newClient.name
        ? newClient.name
        : `${newClient.firstName} ${newClient.lastName}`,
    };

    res.json(response);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
