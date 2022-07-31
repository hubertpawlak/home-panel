import { PrismaClient } from "@prisma/client";

declare global {
  var sharedPrismaClient: PrismaClient;
}

if (!global.sharedPrismaClient) {
  global.sharedPrismaClient = new PrismaClient();
}

export const prisma = global.sharedPrismaClient;
