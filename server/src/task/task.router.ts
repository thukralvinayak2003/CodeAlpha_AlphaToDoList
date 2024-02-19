import express from "express";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as TaskService from "./task.services";
import * as authController from "../user/auth.services";
import AppError from "../utils/appError";

const taskRouter = express.Router();

// GET: List all the books
taskRouter.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const tasks = await TaskService.listTasks();
      return response.status(200).json(tasks);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

taskRouter.get(
  "/:id",
  authController.isLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const task = await TaskService.getTask(request.params.id);
      return response.status(200).json(task);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

taskRouter.post(
  "/:id",
  authController.isLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const task = await TaskService.createTask(request, response, next);
      return response.status(200).json(task);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

taskRouter.delete(
  "/:id",
  authController.isLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = request.params.id;
      TaskService.deleteTask(id);
      response.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

taskRouter.patch(
  "/:taskid",
  authController.isLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.taskid;
    try {
      const task = request.body;
      const updatedBook = await TaskService.updateTask(task, id);
      return response.status(201).json(updatedBook);
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  }
);

export default taskRouter;
