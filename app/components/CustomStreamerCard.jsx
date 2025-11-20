import Image from "next/image"
import {motion} from "framer-motion"

export default function CustomStreamer({img, username, onClick, isSelected, index}) {
    return(
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            exit={{ opacity: 0, y: 30 }}
            className={`flex flex-col items-center bg-white/30 rounded-xl shadow-xl p-0 relative transition-all duration-300
                w-[110px] h-[150px] pt-2 pb-0
                sm:w-[30px] sm:h-[180px] sm:pt-3
                lg:w-[160px] lg:h-[210px] lg:pt-4
                ${isSelected 
                    ? 'bg-yellow-300 shadow-xl scale-105' 
                    : 'bg-white/20 border-white/20 hover:bg-white/30 hover:scale-102'
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
            <div className="relative flex items-center justify-center rounded-2xl mt-4 mb-2 w-24 h-24 lg:w-32 lg:h-32">
                <Image src={`/esport${img}`} alt="img" fill className="object-contain p-1 sm:p-2" priority />
            </div>
            <div className="w-full h-7 bg-white/30 rounded-xl flex items-center justify-center font-bold text-gray-800 tracking-wide border border-gray-200 text-[10px] sm:text-sm lg:text-[16px] lg:h-10">
                {username}
            </div>
        </motion.div>
    )
}
