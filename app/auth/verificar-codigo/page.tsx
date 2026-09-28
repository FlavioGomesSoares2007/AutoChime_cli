"use client";
import { OtpFormData, otpSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function VerifyCode() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    const fullCode = newOtp.join("");
    
    // Passa 'shouldValidate: true' para que o zod reavalie a validação imediatamente
    setValue("code", fullCode, { shouldValidate: true });

    if (fullCode.length === 6) {
      clearErrors("code");
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setValue("code", pastedData, { shouldValidate: true });
      clearErrors("code");
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    const signupToken = localStorage.getItem("@autoChime:signupToken");

    if (!signupToken) {
      alert("Sessão de cadastro expirada. Faça o cadastro novamente.");
      router.push("/auth/cadastro");
      return;
    }

    try {
      const response = await api.post("/users/confirm", {
        code: data.code,
        signupToken: signupToken,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("@autoChime:AccessToken", response.data.accessToken);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem("@autoChime:RefreshToken", response.data.refreshToken);
      }

      localStorage.removeItem("@autoChime:signupToken");

      router.push("/auth/login");
    } catch (error: any) {
      console.error("Erro na verificação do código:", error);

      const message =
        error.response?.data?.message ||
        "Código inválido ou expirado. Tente novamente.";

      alert(Array.isArray(message) ? message.join("\n") : message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center text-white w-full max-w-sm"
      >
        <h1 className="bg-gradient-to-r from-[#d6d6d6] to-[#D1D5DB] bg-clip-text text-transparent text-5xl font-lalezar mb-4 text-center">
          Verificar Código
        </h1>

        <div className="flex flex-col gap-1 w-full mb-4">
          <div className="flex justify-between gap-2 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-2xl font-bold bg-neutral-900 border rounded text-white transition-colors focus:outline-none ${
                  errors.code
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-800 focus:border-white"
                }`}
              />
            ))}
          </div>

          {errors.code && (
            <span className="text-red-500 text-sm font-sans mt-0.5 text-center">
              {errors.code.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black py-2 rounded font-lalezar disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Verificando..." : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
}