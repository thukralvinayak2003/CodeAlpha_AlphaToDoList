import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

const xprisma = db.$extends({
  model: {
    user: {
      async signUp(name: string, email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        return db.user.create({
          data: {
            name,
            email,
            password: hash,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        });
      },

      async validUser(user: User, password: string) {
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          return match;
        }
      },

      async findManyByDomain(domain: string) {
        return db.user.findMany({
          where: { email: { endsWith: `@${domain}` } },
        });
      },
    },
  },
});

export { db, xprisma };
