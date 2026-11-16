"use client";
import { motion } from "framer-motion";
import { Medal, Star, Trophy } from "lucide-react";

// One row from /api/achievements
export interface Achievement {
    id: number | string;
    achievement_type: "tournament_place" | "mvp";
    placement: number | null;
    tournament: string;
    month: string; // "YYYY.MM"
}

// Gold / silver / bronze for podium places, muted for the rest.
function placeColor(placement: number | null) {
    if (placement === 1) return "text-[#cfaa17]";
    if (placement === 2) return "text-slate-200";
    if (placement === 3) return "text-amber-600";
    return "text-white/60";
}

// All achievements of one player: summary + list (newest first, as the API returns them).
export default function CustomAchievementCard({ achievements }: { achievements: Achievement[] }) {
    if (achievements.length === 0) {
        return (
            <div className="py-8 flex flex-col items-center gap-2 text-white/60">
                <Medal className="w-8 h-8" aria-hidden="true" />
                <p className="text-sm">Бүртгэгдсэн амжилт байхгүй байна.</p>
            </div>
        );
    }

    const wins = achievements.filter(a => a.achievement_type === "tournament_place" && a.placement === 1).length;
    const mvps = achievements.filter(a => a.achievement_type === "mvp").length;

    return (
        <div className="space-y-3">
            {/* Summary */}
            <div className="flex gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Trophy className="w-3.5 h-3.5 text-[#cfaa17]" aria-hidden="true" />
                    {wins} аварга
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Star className="w-3.5 h-3.5 text-[#cfaa17]" aria-hidden="true" />
                    {mvps} MVP
                </span>
            </div>

            {/* List */}
            <ul className="space-y-2">
                {achievements.map((a, i) => {
                    const isMvp = a.achievement_type === "mvp";
                    const color = isMvp ? "text-[#cfaa17]" : placeColor(a.placement);
                    const Icon = isMvp ? Star : Medal;
                    return (
                        <motion.li
                            key={a.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Math.min(i, 10) * 0.03 }}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                                isMvp ? "bg-[#cfaa17]/15 border-[#cfaa17]/40" : "bg-white/5 border-white/10"
                            }`}
                        >
                            <div className={`w-10 shrink-0 flex flex-col items-center ${color}`}>
                                <Icon className={`w-5 h-5 ${isMvp ? "fill-current" : ""}`} aria-hidden="true" />
                                <span className="text-[11px] font-bold">{isMvp ? "MVP" : `${a.placement}-р`}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-snug text-white">{a.tournament}</p>
                                <p className="text-xs text-white/50">
                                    {a.month} · {isMvp ? "Тэмцээний MVP" : `${a.placement}-р байр`}
                                </p>
                            </div>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}
