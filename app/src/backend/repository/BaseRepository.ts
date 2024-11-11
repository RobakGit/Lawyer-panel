import prisma from "@/services/prisma";
import { PrismaClient } from "@prisma/client";
export abstract class BaseRepository {
  protected prisma: PrismaClient = prisma;
}
