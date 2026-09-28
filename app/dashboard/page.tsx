"use client";

import { useEffect, useState } from "react";
import { getUserIdFromToken } from "@/utils/decodeToken";
import { api } from "../services/api";
import DashboardHeader from "../components/Header";

interface User {
  name: string;
}

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("...");
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("@autoChime:AccessToken");

      if (!token) return;

      const id = getUserIdFromToken(token);

      if (!id) return;

      setUserId(id);

      try {
        const response = await api.get<User>(`/users/${id}`);
        setUserName(response.data.name);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  const turnOnSiren = async () => {
    if (!userId || activating) return;

    try {
      setActivating(true);

      await api.post("/bell-control/trigger", {
        schoolId: userId,
        payload: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Olá, {userName}
          </h1>

          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            Gerencie e controle sua sirene de forma rápida e simples.
          </p>
        </section>

        <section className="max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold">Controle manual</h2>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Acione a sirene manualmente sempre que precisar.
            </p>

            <button
              onClick={turnOnSiren}
              disabled={!userId || activating}
              className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activating ? "Ativando..." : "Ativar sirene"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
