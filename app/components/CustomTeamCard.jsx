import Image from "next/image";
import {motion} from "framer-motion"

export default function CustomTeamCard({ sportImg, img, name, isSelected, onClick, index }) {
    console.log("sportImg:", sportImg, "img:", img);
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            exit={{ opacity: 0, y: 30 }}
            className={`flex flex-col items-center bg-white/30 rounded-xl shadow-xl p-0 relative transition-all duration-300
                w-[110px] h-[150px] pt-2 pb-0
                sm:w-[120px] sm:h-[180px] sm:pt-3
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
            {/* Top bar */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 rounded-xl shadow flex items-center justify-center border border-gray-200 sm:w-24 sm:h-7 lg:w-32 lg:h-8">
                <Image src={sportImg} alt="sportsImg" width={64} height={18} className="object-contain sm:w-[80px] sm:h-[20px] lg:w-[110px] lg:h-[24px]" priority />
            </div>
            {/* Logo */}
            <div className="relative flex items-center justify-center rounded-2xl mt-4 mb-2 w-24 h-24 lg:w-32 lg:h-32">
                <Image src={img} alt="img" fill className="object-contain p-1 sm:p-2" priority />
            </div>
            {/* Team name */}
            <div className="w-full h-7 bg-white/30 rounded-xl flex items-center justify-center font-bold text-gray-800 tracking-wide border border-gray-200 text-[10px] sm:text-sm lg:text-[16px] lg:h-10">
                {name}
            </div>
        </motion.div>
    );
}