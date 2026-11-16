import Image from "next/image";
import { imageSrc } from "@/lib/image";
import NomineeCardShell from "./NomineeCardShell";

export default function CustomTeamCard({ sportImg, img, name, isSelected, onClick, index }) {
    return (
        <NomineeCardShell index={index} isSelected={isSelected} onClick={onClick}>
            {/* Game logo */}
            {/* A light label (not glass) so dark logos like PUBG stay readable */}
            <div className="mx-auto mt-3 rounded-md bg-white/85 px-2 py-[3px]">
                <div className="relative h-3.5 w-14 sm:h-4 sm:w-16">
                    <Image src={imageSrc(sportImg)} alt="" fill sizes="64px" className="object-contain" priority />
                </div>
            </div>

            {/* Team logo */}
            {/* Padding lives on the wrapper: Safari mis-sizes a square flex item that has side margins */}
            <div className="w-full px-5 pt-3">
                <div className="relative aspect-square w-full">
                    <Image src={imageSrc(img)} alt={name ?? ""} fill sizes="176px" className="object-contain" priority />
                </div>
            </div>

            {/* Team name: up to two lines, height reserved so cards stay level */}
            <div className="mt-3 flex min-h-[3.25rem] items-center justify-center border-t border-white/10 px-2.5 py-2">
                <p className="line-clamp-2 text-center text-[13px] font-semibold leading-tight tracking-wide text-white sm:text-sm">
                    {name}
                </p>
            </div>
        </NomineeCardShell>
    );
}
