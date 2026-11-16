import Image from "next/image"
import { imageSrc } from "@/lib/image";
import {motion} from "framer-motion"
import { Medal } from "lucide-react"

export default function CustomPlayer({sportImg, img, teamImg, username, name, onClick, isSelected, index, onAchievementsClick}) {
    return(
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            exit={{ opacity: 0, y: 30 }}
            className={`glass flex flex-col items-center rounded-xl p-0 transition-all duration-300
                w-[110px] h-[150px] pt-2 pb-0
                sm:w-[120px] sm:h-[180px] sm:pt-3
                lg:w-[160px] lg:h-[210px] lg:pt-4
                ${isSelected 
                    ? 'glass-selected scale-105' 
                    : 'hover:scale-102'
                }`
            }
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 glass rounded-xl flex items-center justify-center sm:w-24 sm:h-7 lg:w-32 lg:h-8">
                <Image src={imageSrc(sportImg)} alt="sportsImg" width={64} height={18} className="object-contain sm:w-[80px] sm:h-[20px] lg:w-[110px] lg:h-[24px]" priority />
            </div>
            <div className="relative flex items-center justify-center rounded-2xl mt-4 mb-2 w-24 h-24 lg:w-32 lg:h-32">
                <Image src={imageSrc(img)} alt="img" fill className="object-contain p-1 sm:p-2" priority />
            </div>
            <div className="w-full h-7 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white tracking-wide border border-white/15 text-base sm:text-lg lg:text-[16px] lg:h-10">
                {/* Same size as the medal button on the right */}
                <div className="relative ml-1 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                    <Image src={imageSrc(teamImg)} alt="teamImg" fill className="object-contain rounded-full" priority />
                </div>

                <div className="flex flex-col items-start min-h-[2rem] md:min-h-[3rem] lg:min-h-[2.5rem] flex-1 min-w-0 ml-2">
                    <div className="text-white text-sm md:text-md lg:text-lg truncate w-full text-left font-bold">
                        {username}
                    </div>
                    <div className="text-white/70 text-[4px] md:text-xs lg:text-[7px] w-full text-left">
                        {name}
                    </div>
                </div>

                {/* Achievements button — opens the achievements pop-up (not implemented yet).
                    stopPropagation keeps it from selecting/voting for the player. */}
                <button
                    type="button"
                    aria-label="Амжилтууд харах"
                    title="Амжилтууд"
                    onClick={e => {
                        e.stopPropagation();
                        onAchievementsClick?.();
                    }}
                    onKeyDown={e => e.stopPropagation()}
                    className="shrink-0 ml-1 mr-1 flex items-center justify-center rounded-full cursor-pointer
                        w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
                        bg-white/10 border border-white/20
                        text-amber-300 hover:text-amber-200 hover:scale-110 transition-transform
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                    <Medal className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" aria-hidden="true" />
                </button>
            </div>
        </motion.div>
    )
}
