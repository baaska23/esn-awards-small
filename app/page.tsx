"use client";
import Image from "next/image";
import CustomButton from "./components/CustomButton";
import CustomTitle from "./components/CustomTitle";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      className="
        font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20
        bg-[url('/esport/BG_MOBILE_1.jpg')] md:bg-[url('/esport/BG_DESKTOP_1.jpg')]
        bg-no-repeat bg-cover bg-center bg-fixed
      "
    >
      <Image
        src={`/esport/esn_logo.png`}
        alt="Next.js logo"
        width={140}
        height={35}
        priority
      />
      <CustomTitle />
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-2 text-gray-700 text-xl font-bold"
      >
        Санал хураалт 2025.12.15 18:00 цагт хаагдана
      </motion.div>
      <CustomButton to="/pc-team">ЭХЛЭХ</CustomButton>
    </div>
  );
}
