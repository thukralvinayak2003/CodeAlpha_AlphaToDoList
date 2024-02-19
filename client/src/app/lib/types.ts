import { number, z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(3, "Password should be at least 3 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createTaskSchema = z.object({
  task_description: z.string(),
  due_date: z.string(),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export type TLogInSchema = z.infer<typeof loginSchema>;

export type TCreateTaskSchema = z.infer<typeof createTaskSchema>;

export type Task = {
  taskid: string;
  task_description: string;
  due_date: Date;
  complete: boolean;
};
