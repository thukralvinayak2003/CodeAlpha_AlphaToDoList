import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./user/user.router";
import taskRouter from "./task/task.router";

import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
