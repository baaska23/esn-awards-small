"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomArrow({ side = "left", to = "/" }) {
  const router = useRouter();
  const handleClick = () => router.push(to);
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  // before:* stretches the click area over the whole glass box around the button
  return (
    <button
      onClick={handleClick}
      aria-label={side === "left" ? "Go to previous page" : "Go to next page"}
      className="p-1 rounded-full focus:outline-none flex items-center justify-center cursor-pointer before:absolute before:inset-0 before:content-['']"
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
    </button>
  );
}
