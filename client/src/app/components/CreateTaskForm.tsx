"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TCreateTaskSchema, createTaskSchema } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

function CreateTaskForm(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TCreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
  });

  const submit = async (data: TCreateTaskSchema) => {
    const res = await axios.post(
      `http://localhost:8000/api/tasks/${props.id}`,
      {
        ...data,
        due_date: new Date(data.due_date),
      }
    );
    console.log(res);
  };
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <div>
      <form
        onSubmit={handleSubmit(submit, onInvalid)}
        className="max-w-sm mx-auto "
      >
        <label
          htmlFor="task_description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Task Description
        </label>
        <input
          {...register("task_description")}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
          placeholder="Task Description"
          required
        />
        <label
          htmlFor="date"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Due Date
        </label>
        <input
          {...register("due_date")}
          type="date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
          disabled={isSubmitting} // Disable the button during submission
        />
      </form>
    </div>
  );
}

export default CreateTaskForm;
