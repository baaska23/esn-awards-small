"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

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

export default function CustomFavPlayerCard({
  teamImg,
  teamName,
  players,
  onClick,
  selectedPlayerId,
  index
}: CustomFavPlayerCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      exit={{ opacity: 0, y: 30 }}
      className="flex flex-col backdrop-blur-sm border rounded-2xl 
      px-3 py-3 lg:px-4 lg:py-4 gap-3 shadow-md
      bg-white/20 border-white/20 hover:bg-white/30 transition-all duration-300"
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "auto",
      }}
    >

      {/* =============== DESKTOP =============== */}
      <div 
        className="hidden md:flex justify-center items-center h-28"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Image view (default) */}
        {!hover && (
          <div className="relative w-24 h-24 lg:w-28 lg:h-28">
            <Image
              src={`/esport/${teamImg}`}
              alt={teamName}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* Hover view → Show player names */}
        {hover && (
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="text-sm font-bold mb-1">{teamName}</div>

            {players.slice(0, 5).map((player) => (
              <div
                key={player.fav_player_id}
                onClick={() => onClick(player.fav_player_id)}
                className={`text-sm cursor-pointer hover:underline ${
                  selectedPlayerId === player.fav_player_id
                    ? "text-yellow-400 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {player.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =============== MOBILE =============== */}
      <div className="flex md:hidden gap-3 cursor-pointer">
        <div className="relative w-30 h-30 shrink-0">
          <Image
            src={`/esport/${teamImg}`}
            alt={teamName}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="font-bold text-gray-900 text-sm mb-1">
            {teamName}
          </div>

          {players.slice(0, 5).map((player) => (
            <div
              key={player.fav_player_id}
              onClick={() => onClick(player.fav_player_id)}
              className={`text-xs cursor-pointer hover:underline ${
                selectedPlayerId === player.fav_player_id
                  ? "text-yellow-500 font-bold"
                  : "text-gray-800"
              }`}
            >
              {player.username}
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
