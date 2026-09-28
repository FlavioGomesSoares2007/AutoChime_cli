"use client";

import DashboardHeader from "@/app/components/Header";
import { api } from "@/app/services/api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Schedule {
  id: string;
  schoolId: string;
  dayOfWeek: number;
  time: string;
  isActive: boolean;
}

const days = [
  { value: 1, label: "Segunda-feira", short: "SEG" },
  { value: 2, label: "Terça-feira", short: "TER" },
  { value: 3, label: "Quarta-feira", short: "QUA" },
  { value: 4, label: "Quinta-feira", short: "QUI" },
  { value: 5, label: "Sexta-feira", short: "SEX" },
  { value: 6, label: "Sábado", short: "SÁB" },
  { value: 0, label: "Domingo", short: "DOM" },
];

export default function HorariosPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newTime, setNewTime] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const response = await api.get<Schedule[]>("/schedules");

      setSchedules(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const getSchedulesByDay = (day: number) => {
    return schedules
      .filter((schedule) => schedule.dayOfWeek === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleAddSchedule = async () => {
    if (selectedDay === null || !newTime || adding) return;

    try {
      setAdding(true);

      const response = await api.post<Schedule>("/schedules", {
        dayOfWeek: selectedDay,
        time: newTime,
        isActive: true,
      });

      setSchedules((current) => [...current, response.data]);
      setNewTime("");
      setSelectedDay(null);
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleSchedule = async (schedule: Schedule) => {
    if (updating === schedule.id) return;

    try {
      setUpdating(schedule.id);

      const response = await api.patch<Schedule>(`/schedules/${schedule.id}`, {
        isActive: !schedule.isActive,
      });

      setSchedules((current) =>
        current.map((item) => (item.id === schedule.id ? response.data : item)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (deleting === id) return;

    try {
      setDeleting(id);

      await api.delete(`/schedules/${id}`);

      setSchedules((current) =>
        current.filter((schedule) => schedule.id !== id),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm font-medium text-blue-500">AUTOMAÇÃO</p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Horários
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
            Configure os horários em que a sirene será acionada automaticamente
            durante a semana.
          </p>
        </motion.section>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => (
              <div
                key={day.value}
                className="h-64 animate-pulse rounded-2xl border border-white/[0.07] bg-[#0b0b0b]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day, index) => {
              const daySchedules = getSchedulesByDay(day.value);

              return (
                <motion.section
                  key={day.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  className="flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                    <div>
                      <span className="text-xs font-medium tracking-widest text-blue-500">
                        {day.short}
                      </span>

                      <h2 className="mt-1 text-base font-semibold">
                        {day.label}
                      </h2>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs font-semibold text-neutral-400">
                      {daySchedules.length}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-4">
                    {daySchedules.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center py-8">
                        <p className="text-center text-sm text-neutral-600">
                          Nenhum horário configurado
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {daySchedules.map((schedule) => (
                            <motion.div
                              key={schedule.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition ${
                                schedule.isActive
                                  ? "border-white/[0.07] bg-white/[0.03]"
                                  : "border-white/[0.04] bg-white/[0.01] opacity-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    schedule.isActive
                                      ? "bg-blue-500"
                                      : "bg-neutral-700"
                                  }`}
                                />

                                <span className="font-mono text-sm font-medium">
                                  {schedule.time.slice(0, 5)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleSchedule(schedule)}
                                  disabled={updating === schedule.id}
                                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                                    schedule.isActive
                                      ? "text-blue-400 hover:bg-blue-500/10"
                                      : "text-neutral-500 hover:bg-white/[0.05]"
                                  }`}
                                >
                                  {updating === schedule.id
                                    ? "..."
                                    : schedule.isActive
                                      ? "Ativo"
                                      : "Inativo"}
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteSchedule(schedule.id)
                                  }
                                  disabled={deleting === schedule.id}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                  aria-label="Excluir horário"
                                >
                                  {deleting === schedule.id ? (
                                    <span className="text-xs">...</span>
                                  ) : (
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M8 6V4h8v2" />
                                      <path d="M19 6l-1 14H6L5 6" />
                                      <path d="M10 11v5M14 11v5" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedDay(day.value);
                        setNewTime("");
                      }}
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] text-sm font-medium text-neutral-400 transition hover:border-blue-500/40 hover:bg-blue-500/[0.04] hover:text-blue-400"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Adicionar horário
                    </button>
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedDay(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6 shadow-2xl"
            >
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-blue-500">
                  Novo horário
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {days.find((day) => day.value === selectedDay)?.label}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Escolha o horário em que a sirene deverá tocar.
                </p>
              </div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                Horário
              </label>

              <input
                type="time"
                value={newTime}
                onChange={(event) => setNewTime(event.target.value)}
                className="h-14 w-full rounded-xl border border-white/[0.08] bg-black px-4 text-center font-mono text-2xl text-white outline-none transition focus:border-blue-500"
              />

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="h-11 rounded-xl px-5 text-sm font-medium text-neutral-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleAddSchedule}
                  disabled={!newTime || adding}
                  className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding ? "Adicionando..." : "Adicionar horário"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
