"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-black">
      <div className="relative flex justify-center flex-col pl-7 overflow-hidden w-full lg:pl-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2, ease: "linear" }}
        >
          <Image
            src="/esp32.png"
            alt="ESP32"
            width={800}
            height={800}
            priority
            className="absolute top-2/3 left-[85.71%] opacity-80 -translate-x-1/2 -translate-y-[33.33%] 
            z-0 pointer-events-none object-contain w-[500px] h-[500px] 2xl:w-[800px] 2xl:h-[800px] 2xl:top-1/3 2xl:left-3/4 2xl:-translate-y-[30.57%]"
          />
        </motion.div>

        <div className="relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.8, duration: 2, ease: "linear" }}
            className="font-lalezar whitespace-nowrap overflow-hidden pl-1"
          >
            <p className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] bg-clip-text text-transparent text-[clamp(1rem,3vw,1.75rem)]">
              SISTEMA DE AUTOMAÇÃO IOT
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ duration: 2, ease: "linear" }}
            className="font-lalezar whitespace-nowrap overflow-hidden leading-none -mb-5 -mt-2 lg:-mb-11 lg:-mt-5"
          >
            <h1 className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] to-70% bg-clip-text text-transparent text-[clamp(3.5rem,15vw,10rem)]">
              SIRENE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.4, duration: 2, ease: "linear" }}
            className="font-lalezar whitespace-nowrap overflow-hidden leading-none"
          >
            <h1 className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] to-110% bg-clip-text text-transparent text-[clamp(3.5rem,15vw,10rem)]">
              INTELIGENTE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.8, duration: 1.5, ease: "linear" }}
            className="font-lalezar whitespace-nowrap overflow-hidden -mt-3 pl-1 lg:-mt-10"
          >
            <p className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] to-130% bg-clip-text text-transparent text-[clamp(0.75rem,2.3vw,1.35rem)]">
              AUTOMAÇÃO TOTAL E DISPAROS DE PRECISÃO: CONECTE SEU HARDWARE
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.8, duration: 2, ease: "linear" }}
            className="font-lalezar whitespace-nowrap overflow-hidden pl-1 lg:-mb-6"
          >
            <p className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] bg-clip-text text-transparent text-[clamp(0.75rem,2.3vw,1.35rem)]">
              DIRETO À GESTÃO WEB COM 100% DE EFICIÊNCIA.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 2, ease: "linear" }}
            className="mt-2 md:mt-8 pl-1"
          >
            <button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-[#5A5A5A] to-[#D1D5DB] to-140% text-black w-32 h-10 font-lalezar"
            >
              ACESSAR CONTA
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}