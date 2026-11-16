"use client";
import Image from "next/image";
import { imageSrc } from "@/lib/image";
import { motion } from "framer-motion";

interface Player {
  fav_player_id: number;
  username: string;
  player_image_url?: string;
}

interface CustomFavPlayerCardProps {
  teamImg: string;
  teamName: string;
  players: Player[];
  onClick: (playerId: number) => void;
  selectedPlayerId: number | null;
  index: number;
}

// One team with its players as selectable chips. The team logo and name are
// a heading only; the chips are the controls.
export default function CustomFavPlayerCard({
  teamImg,
  teamName,
  players,
  onClick,
  selectedPlayerId,
  index,
}: CustomFavPlayerCardProps) {
  const hasSelected = players.some((p) => p.fav_player_id === selectedPlayerId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.35 }}
      className={`glass flex h-full w-full max-w-sm flex-col gap-3 rounded-[1.25rem] p-4 transition-shadow duration-300 ${
        hasSelected ? "glass-selected" : ""
      }`}
    >
      {/* Team heading */}
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0">
          <Image src={imageSrc(teamImg)} alt="" fill sizes="44px" className="object-contain" priority />
        </div>
        <h3 className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold leading-tight tracking-wide text-[#cfaa17]">
          {teamName}
        </h3>
      </div>

      {/* Players */}
      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
        {players.map((player) => {
          const isSelected = selectedPlayerId === player.fav_player_id;
          return (
            <button
              key={player.fav_player_id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onClick(player.fav_player_id)}
              className={`relative cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-medium transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                  isSelected
                    ? "border-[#cfaa17] bg-[#cfaa17] text-[#1c1b3a]"
                    : "border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/15"
                }`}
            >
              {player.username}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
