import express from "express";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as userController from "./user.services";
import { db, xprisma } from "../utils/db.server";
import { createSendToken } from "./auth.services";
import * as authController from "./auth.services";
import AppError from "../utils/appError";

const userRouter = express.Router();

userRouter.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authors = await userController.listUsers();
      return response.status(200).json(authors);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

userRouter.get(
  "/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    const id: string = request.params.id;
    try {
      const user = await userController.getUser(id);
      if (user) {
        return response.status(200).json(user);
      }
    } catch (error: any) {
      response.status(404).json(error);
    }
  }
);

userRouter.post(
  "/signup",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, email, password } = request.body;
      if (!name || !email || !password) {
        next(new AppError("all required fields", 400));
      }

      const newUser = await xprisma.user.signUp(name, email, password);

      createSendToken(newUser, 201, response);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

userRouter.post(
  "/login",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        next(new AppError("all required fields", 400));
      }
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        const check = await xprisma.user.validUser(user, password);

        if (check) {
          createSendToken(user, 201, response);
        }
        if (!check) {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (error: any) {
      return response.status(400).send({
        message: "Correct your email or password",
      });
    }
  }
);

userRouter.delete(
  "/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = request.params.id;
      userController.deleteUser(id);
      response.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

userRouter.get(
  "/mytasks/:id",
  authController.isLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = request.params.id;
      const userTasks = await userController.userTasks(id);
      if (userTasks) {
        return response.status(200).json(userTasks);
      }
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

userRouter.get("/auth/logout", (request: Request, response: Response) => {
  //->#2.Express.js Documentation way - clearing the cookie value via built-in express function
  response.clearCookie("JWT");
  response.status(200).json({ status: "success" });
});

export default userRouter;
