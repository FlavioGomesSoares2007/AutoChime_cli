"use client";
import { RegisterFormData, registerSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (registerFormData: RegisterFormData) => {
    try {
      const response = await api.post("/users", {
        name: registerFormData.name,
        email: registerFormData.email,
        password: registerFormData.password,
      });
      router.push("/auth/verificar-codigo");
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert("Erro em algo. Veja o console para detalhes.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-black">
      <div className="hidden lg:block relative w-full h-full">
        <Image
          src="/imagemLoginPc.png"
          alt="Banner Cadastro"
          fill
          className="hidden lg:block object-cover object-center"
          priority
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center p-6 text-white"
      >
        <h1 className="bg-gradient-to-r from-[#d6d6d6] to-[#D1D5DB] bg-clip-text text-transparent text-5xl font-lalezar mb-4">
          Crie sua conta
        </h1>

        <div className="flex flex-col gap-1 w-full max-w-sm mb-3">
          <label htmlFor="name" className="font-lalezar">
            Nome
          </label>
          <input
            id="name"
            type="text"
            className={`bg-neutral-900 border rounded px-3 py-2 text-white transition-colors focus:outline-none ${
              errors.name
                ? "border-red-500 focus:border-red-500"
                : "border-neutral-800 focus:border-white"
            }`}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm font-sans mt-0.5">
              {errors.name.message}
            </span>
          )}
        </div>

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

        <div className="flex flex-col gap-1 w-full max-w-sm mb-3">
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

        <div className="flex flex-col gap-1 w-full max-w-sm mb-4">
          <label htmlFor="confirmPassword" className="font-lalezar">
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`bg-neutral-900 border rounded px-3 py-2 text-white transition-colors focus:outline-none ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-500"
                : "border-neutral-800 focus:border-white"
            }`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm font-sans mt-0.5">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black py-2 rounded font-lalezar disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

        <span className="mt-4 text-lg text-neutral-400 font-lalezar">
          Já tem uma conta?
          <Link
            href="/auth/login"
            className="text-white underline font-lalezar ml-1"
          >
            FAÇA LOGIN
          </Link>
        </span>
      </form>
    </div>
  );
}
