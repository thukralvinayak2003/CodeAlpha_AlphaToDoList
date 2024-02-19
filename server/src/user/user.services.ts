import { db, xprisma } from "../utils/db.server";
import * as jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import { Prisma } from "@prisma/client";

export type UserRead = {
  id: string;
  name: string;
  email: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const listUsers = async (): Promise<UserRead[] | null> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const getUser = async (id: string): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { name, email, password } = user;
  return await xprisma.user.signUp(name, email, password);
};

export const deleteUser = async (id: string): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};

export const userTasks = async (id: string): Promise<UserRead | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    include: {
      tasks: true,
    },
  });
};
