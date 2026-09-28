
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Horários",
    href: "/dashboard/horarios",
  },
  {
    name: "Configurações",
    href: "/dashboard/configuracoes",
  },
];

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white"
            >
              N
            </motion.div>

            <span className="text-lg font-bold tracking-[0.15em] text-white">
              NEXUS
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="relative rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  {active && (
                    <motion.div
                      layoutId="active-navigation"
                      className="absolute inset-0 rounded-lg bg-white/[0.07]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center md:flex">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-neutral-900 text-sm font-semibold text-white"
            >
              U
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-neutral-900 md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
            </div>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 35,
              }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[85%] max-w-sm flex-col border-l border-white/[0.06] bg-[#080808] md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
                    N
                  </div>

                  <span className="font-bold tracking-[0.15em]">
                    NEXUS
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-neutral-900"
                >
                  <span className="text-xl leading-none text-neutral-400">
                    ×
                  </span>
                </motion.button>
              </div>

              <nav className="flex flex-1 flex-col gap-2 p-4">
                {navigation.map((item, index) => {
                  const active = pathname === item.href;

                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.25,
                      }}
                      onClick={() => navigate(item.href)}
                      className={`relative flex items-center rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${
                        active
                          ? "bg-blue-600/10 text-blue-400"
                          : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="mobile-active-navigation"
                          className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-500"
                        />
                      )}

                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
              </nav>

              <div className="border-t border-white/[0.06] p-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold">
                    U
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Minha conta
                    </p>

                    <p className="text-xs text-neutral-500">
                      Conta NEXUS
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
