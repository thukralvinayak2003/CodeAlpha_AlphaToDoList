"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { TLogInSchema, loginSchema } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TLogInSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLogInSchema) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        data
      );

      router.push(`/${response.data.data.user.id}`);
    } catch (err: any) {
      setError("password", {
        type: "server",
        message: "Invalid email address or password",
      });
    }
  };

  return (
    <div className={styles.box}>
      <section className={`${styles.wrapper} `}>
        <div className={`${styles.form} ${styles.signup}`}>
          <header>Login</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              required
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              required
            />
            {errors.password && (
              <p className="text-red-300">{`${errors.password.message}`}</p>
            )}

            <input
              type="submit"
              disabled={isSubmitting}
              className="text-yellow-200 bg-blue-800 disabled:bg-slate-800 disabled:text-white"
              value="Login"
            />
          </form>
        </div>
        <div className={`${styles.form} ${styles.login} mb-4`}>
          <header>
            <Link href="/signup">Signup</Link>
          </header>
        </div>
      </section>
    </div>
  );
};

export default Login;
