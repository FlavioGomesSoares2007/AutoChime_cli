"use client";
import { LoginFormData, loginSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const refreshToken = localStorage.getItem("@autoChime:RefreshToken");

    if (refreshToken) {
      api
        .post("/auth/refresh", { refreshToken })
        .then((response) => {
          localStorage.setItem(
            "@autoChime:AccessToken",
            response.data.accessToken,
          );
          if (response.data.refreshToken) {
            localStorage.setItem(
              "@autoChime:RefreshToken",
              response.data.refreshToken,
            );
          }
          router.push("/dashboard");
        })
        .catch(() => {
          localStorage.removeItem("@autoChime:AccessToken");
          localStorage.removeItem("@autoChime:RefreshToken");
        });
    }
  }, [router]);

  const onSubimit = async (loginFormData: LoginFormData) => {
    try {
      const response = await api.post("/auth/login", {
        email: loginFormData.email,
        password: loginFormData.password,
      });
      localStorage.setItem(
        "@autoChime:AccessToken",
        response.data.accessToken,
      );
      localStorage.setItem(
        "@autoChime:RefreshToken",
        response.data.refreshToken,
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-black">
      <div className="hidden lg:block relative w-full h-full">
        <Image
          src="/imagemLoginPc.png"
          alt="Banner Login Monitores Grandes"
          fill
          className="hidden lg:block object-cover object-center"
          priority
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubimit)}
        className="flex flex-col items-center justify-center p-6 text-white"
      >
        <h1 className="bg-gradient-to-r from-[#d6d6d6] to-[#D1D5DB] bg-clip-text text-transparent text-5xl font-lalezar mb-4">
          Bem Vindo
        </h1>

        <div className="flex flex-col gap-1 w-full max-w-sm mb-3">
          <label htmlFor="email" className="font-lalezar">
            E-mail
          </label>
          <input
            id="email"
            type="text"
            className={`bg-neutral-900 border rounded px-3 py-2 text-white transition-colors focus:outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-neutral-800 focus:border-white"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm font-sans mt-0.5">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full max-w-sm mb-4">
          <label htmlFor="senha" className="font-lalezar">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            className={`bg-neutral-900 border rounded px-3 py-2 text-white transition-colors focus:outline-none ${
              errors.password
                ? "border-red-500 focus:border-red-500"
                : "border-neutral-800 focus:border-white"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm font-sans mt-0.5">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black py-2 rounded font-lalezar disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Entrando..." : "Login"}
          </button>
        </div>

        <span className="mt-4 text-lg text-neutral-400 font-lalezar">
          Ainda não tem uma conta?
          <Link
            href="/auth/cadastro"
            className="text-white underline font-lalezar ml-1"
          >
            CADASTRE-SE
          </Link>
        </span>
      </form>
    </div>
  );
}