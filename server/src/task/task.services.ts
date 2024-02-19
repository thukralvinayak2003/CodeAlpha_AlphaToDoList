import { GetUserAuthInfoRequest } from "../user/auth.services";
import { User, UserRead } from "../user/user.services";
import AppError from "../utils/appError";
import { db } from "../utils/db.server";
import { NextFunction, Request, Response } from "express";

export type TaskRead = {
  taskid: string;
  task_description: string;
  due_date: Date;
  complete: boolean;
  user: UserRead;
};

export type TaskWrite = {
  taskid: string;
  task_description: string;
  due_date: Date;
  complete: boolean;
  userId: string;
};

export const deleteTask = async (taskid: string): Promise<void> => {
  await db.task.delete({
    where: {
      taskid,
    },
  });
};

export const getTask = async (taskid: string) => {
  return db.task.findUnique({
    where: {
      taskid,
    },
    select: {
      taskid: true,
      task_description: true,
      due_date: true,
      complete: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const listTasks = async (): Promise<TaskRead[]> => {
  return db.task.findMany({
    select: {
      taskid: true,
      task_description: true,
      due_date: true,
      complete: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateTask = async (
  task: TaskWrite,
  taskid: string
): Promise<TaskRead> => {
  const { task_description, due_date, complete } = task;
  return db.task.update({
    where: {
      taskid,
    },
    data: {
      task_description,
      due_date,
      complete,
    },
    select: {
      taskid: true,
      task_description: true,
      due_date: true,
      complete: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const createTask = async (
  request: GetUserAuthInfoRequest,
  response: Response,
  next: NextFunction
): Promise<TaskRead | undefined> => {
  const { task_description, due_date } = request.body;
  if (!task_description || !due_date)
    response.status(404).send("Fill the fields");
  const date: Date = new Date(due_date);
  if (request.params.id) {
    const userId = request.params.id;

    return db.task.create({
      data: {
        task_description,
        due_date: date,
        userId,
      },
      select: {
        taskid: true,
        task_description: true,
        due_date: true,
        complete: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
};
