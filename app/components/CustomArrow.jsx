"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomArrow({ side = "left", to = "/" }) {
  const router = useRouter();
  const handleClick = () => router.push(to);

  return (
    <button
      onClick={handleClick}
      aria-label={side === "left" ? "Go to previous page" : "Go to next page"}
      className="p-1 rounded-full focus:outline-none"
    >
      {side === "left" ? (
        <div className="relative w-8 h-6 md:w-10 md:h-7 lg:w-12 lg:h-8">
          <Image src="/arrowL.png" alt="Left arrow" fill className="object-contain" priority />
        </div>
      ) : (
        <div className="relative w-8 h-6 md:w-10 md:h-7 lg:w-12 lg:h-8">
          <Image src="/arrowR.png" alt="Right arrow" fill className="object-contain" priority />
        </div>
      )}
    </button>
  );
}