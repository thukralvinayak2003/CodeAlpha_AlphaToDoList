"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "../lib/types";
import axios, { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: TSignUpSchema) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/signup",
        data
      );
      router.push(`/${response.data.data.user.id}`);
    } catch (err: any) {
      setError("email", {
        type: "server",
        message: "Use another email address",
      });
    }
  };

  return (
    <div className={styles.box}>
      <section className={styles.wrapper}>
        <div className={styles.form}>
          <header>SignUp</header>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} type="text" placeholder="Name" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              required
            />
            {errors.email && (
              <p className="text-red-300">{`${errors.email.message}`}</p>
            )}
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              minLength={3}
              required
            />

            <input
              type="submit"
              disabled={isSubmitting}
              className="text-yellow-200 bg-blue-400 disabled:bg-slate-800"
              value="SignUp"
            />
          </form>
        </div>
        <div className={`${styles.form} ${styles.login}`}>
          <header>
            <Link href="/login">Login</Link>
          </header>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
