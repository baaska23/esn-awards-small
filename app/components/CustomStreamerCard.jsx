import Image from "next/image"
import { imageSrc } from "@/lib/image";
import NomineeCardShell from "./NomineeCardShell";

export default function CustomStreamer({img, username, onClick, isSelected, index}) {
    return(
        <NomineeCardShell index={index} isSelected={isSelected} onClick={onClick}>
            {/* Photo */}
            {/* Padding lives on the wrapper: Safari mis-sizes a square flex item that has side margins */}
            <div className="w-full px-3 pt-3">
                <div className="relative aspect-square w-full">
                    <Image src={imageSrc(img)} alt={username ?? ""} fill sizes="176px" className="rounded-xl object-contain object-bottom" priority />
                </div>
            </div>

            {/* Name: up to two lines, height reserved so cards stay level */}
            <div className="mt-2.5 flex min-h-[3.25rem] items-center justify-center border-t border-white/10 px-2.5 py-2">
                <p className="line-clamp-2 text-center text-[13px] font-semibold leading-tight tracking-wide text-white sm:text-sm">
                    {username}
                </p>
            </div>
        </NomineeCardShell>
    )
}
