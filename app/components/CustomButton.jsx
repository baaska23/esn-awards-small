"use client";
import { useRouter } from "next/navigation";

export default function CustomButton({ children, to = "/" }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(to)}
      className="flex items-center justify-center w-24 h-12 md:w-24 md:h-12 lg:w-32 lg:h-16 bg-gray-700 rounded-full text-white font-bold"
    >
      {children}
    </button>
  );
}