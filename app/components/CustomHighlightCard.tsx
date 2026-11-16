"use client";
import Image from "next/image";
import { imageSrc } from "@/lib/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface CustomHighlightCardProps {
  playerImg: string;
  username: string;
  posterImg: any;
  playButton: any;
  to?: string;
  onClick: () => void;
  onPlayClick: () => void;
  isSelected: boolean;
  index: number;
}

export default function CustomHighlightCard({
  playerImg,
  username,
  posterImg,
  playButton,
  to,
  onClick,
  onPlayClick,
  isSelected,
  index
}: CustomHighlightCardProps) {
  const router = useRouter();
  const handleClick = () => to && router.push(to);
  
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.35 }}
      exit={{ opacity: 0, y: 30 }}
      className={`nominee-card glass !flex-row md:!flex-col p-2.5 md:p-3 items-center gap-3 ${
        isSelected ? "glass-selected" : ""
      }`}
      style={{
        width: "100%",
        maxWidth: "300px",
        height: "auto",
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="relative w-24 h-32 md:w-28 md:h-36 lg:w-40 lg:h-40">
          <Image 
            src={imageSrc(playerImg)} 
            alt="playerImg" 
            fill 
            className="object-contain rounded-xl" 
            priority 
          />
          <div className="absolute inset-x-0 bottom-0 rounded-xl bg-black/45 px-2 py-1.5 text-center backdrop-blur-sm">
            <span className="block truncate text-sm font-semibold uppercase tracking-wide text-white md:text-[15px]">
              {username}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center flex-1 w-full gap-1">
        <div className="relative flex-1 aspect-video rounded-xl overflow-hidden min-w-0">
          <Image 
            src={imageSrc(posterImg)} 
            alt={`${username} highlight`} 
            fill 
            className="object-cover" 
            priority
          />
        </div>
        <button
          type="button"
          onClick={handlePlayButtonClick}
          onKeyDown={(e) => e.stopPropagation()}
          className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#cfaa17] text-[#1c1b3a] shadow-lg transition hover:scale-110 hover:bg-[#e0bb2a] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label="Бичлэг үзэх"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}