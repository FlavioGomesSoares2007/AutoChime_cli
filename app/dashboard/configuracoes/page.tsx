"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/decodeToken";
import DashboardHeader from "@/app/components/Header";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("@autoChime:AccessToken");

    if (token) {
      const id = getUserIdFromToken(token);
      setUserId(id);
    }
  }, []);

  const handleCopyId = async () => {
    if (!userId) return;

    await navigator.clipboard.writeText(userId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("@autoChime:AccessToken");
    localStorage.removeItem("@autoChime:RefreshToken");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-500">SISTEMA</p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Configurações
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
            Gerencie a integração do seu ESP32 e as configurações da sua conta.
          </p>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Integração com ESP32
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-neutral-400">
                    Utilize o Client ID abaixo para identificar este cliente ao
                    configurar o ESP32.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Client ID
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-h-12 flex-1 items-center overflow-hidden rounded-xl border border-white/[0.08] bg-black px-4">
                    <span className="truncate font-mono text-sm text-blue-400">
                      {userId || "Carregando..."}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyId}
                    disabled={!userId}
                    className="min-h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? "Copiado!" : "Copiar ID"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                <svg
                  className="mt-0.5 shrink-0 text-blue-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>

                <p className="text-xs leading-5 text-neutral-400">
                  Esse identificador deve ser utilizado na configuração do ESP32
                  para que o dispositivo saiba a qual cliente pertence.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-semibold">Sessão</h2>

              <p className="mt-1 text-sm text-neutral-400">
                Gerencie o acesso atual à sua conta.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm font-medium text-white">
                  Encerrar sessão
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Isso removerá os tokens de acesso deste dispositivo.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/15 sm:w-auto"
              >
                Sair da conta
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
