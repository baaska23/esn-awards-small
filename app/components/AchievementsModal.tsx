"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { imageSrc } from "@/lib/image";
import CustomAchievementCard, { type Achievement } from "./CustomAchievementCard";

export type AchievementsPlayer = {
  player_id: number;
  username: string;
  fullname?: string | null;
  player_image_url?: string | null;
  team_image_url?: string | null;
};

type Status = "loading" | "ready" | "error";

export default function AchievementsModal({
  player,
  onClose,
}: {
  player: AchievementsPlayer | null;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Achievement[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Keep the latest onClose without re-running effects when the parent re-renders.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  // Load achievements whenever a different player is opened.
  useEffect(() => {
    if (!player) return;
    const controller = new AbortController();
    setStatus("loading");
    setItems([]);
    fetch(`/mea/api/achievements?player_id=${player.player_id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((rows: Achievement[]) => {
        setItems(rows);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [player]);

  // Esc closes; lock page scroll while open; focus the close button.
  useEffect(() => {
    if (!player) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [player]);

  if (!mounted) return null;


  return createPortal(
    <AnimatePresence>
      {player && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievements-title"
            className="glass rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col text-white overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: photo, name, team logo, close */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <div className="relative w-14 h-14 shrink-0 rounded-xl bg-white/10 border border-white/20 overflow-hidden">
                <Image src={imageSrc(player.player_image_url)} alt="" fill className="object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {player.team_image_url && (
                    <div className="relative w-5 h-5 shrink-0 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                      <Image src={imageSrc(player.team_image_url)} alt="" fill className="object-contain" />
                    </div>
                  )}
                  <h2 id="achievements-title" className="text-lg font-bold truncate">
                    {player.username}
                  </h2>
                </div>
                {player.fullname && <p className="text-xs text-white/60 truncate">{player.fullname}</p>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Хаах"
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cfaa17]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {status === "loading" && (
                <ul className="space-y-2" aria-label="Ачаалж байна">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                  ))}
                </ul>
              )}

              {status === "error" && (
                <p className="py-8 text-center text-sm text-white/70">
                  Амжилтуудыг ачаалж чадсангүй. Дахин оролдоно уу.
                </p>
              )}

              {status === "ready" && <CustomAchievementCard achievements={items} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
