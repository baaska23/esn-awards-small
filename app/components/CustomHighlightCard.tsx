"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      transition={{ delay: index * 0.1 }}
      exit={{ opacity: 0, y: 30 }}
      className={`flex flex-row sm:flex-row md:flex-col backdrop-blur-sm border rounded-2xl 
      px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-4 items-center gap-2 shadow-md cursor-pointer 
      transition-all duration-300 ${
        isSelected
          ? "bg-yellow-300 shadow-xl scale-105"
          : "bg-white/20 border-white/20 hover:bg-white/30 hover:scale-102"
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
            src={`/mongolian-esports-awards${playerImg}`} 
            alt="playerImg" 
            fill 
            className="object-contain rounded-lg" 
            priority 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white/30 backdrop-blur-sm py-2 px-3 rounded-2xl flex items-center justify-center font-bold text-gray-800 text-lg tracking-wide border border-gray-200">
            <span className="font-bold text-gray-900 text-base md:text-lg lg:text-xl tracking-wide uppercase">
              {username}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center flex-1 w-full gap-1">
        <div className="relative flex-1 aspect-video rounded-lg overflow-hidden min-w-0">
          <Image 
            src={`/mongolian-esports-awards${posterImg}`} 
            alt={`${username} highlight`} 
            fill 
            className="object-cover" 
            priority
          />
        </div>
        <button
          onClick={handlePlayButtonClick}
          className="relative w-12 h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 shrink-0 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Play video"
        >
          <div className="relative w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8">
            <Image 
              src={`/mongolian-esports-awards/${playButton}`} 
              alt="play" 
              fill
              className="object-contain" 
            />
          </div>
        </button>
      </div>
    </motion.div>
  );
}