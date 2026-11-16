import Image from "next/image"
import { imageSrc } from "@/lib/image";
import { Medal } from "lucide-react"
import NomineeCardShell from "./NomineeCardShell";

/**
 * @param {{ sportImg: string, img: string, teamImg: string, username: string, name?: string,
 *   onClick: () => void, isSelected: boolean, index: number, onAchievementsClick?: () => void }} props
 */
export default function CustomPlayer({sportImg, img, teamImg, username, name, onClick, isSelected, index, onAchievementsClick}) {
    return(
        <NomineeCardShell index={index} isSelected={isSelected} onClick={onClick}>
            {/* Game logo — plain, no extra glass layer */}
            {/* A light label (not glass) so dark logos like PUBG stay readable */}
            <div className="mx-auto mt-3 rounded-md bg-white/85 px-2 py-[3px]">
                <div className="relative h-3.5 w-14 sm:h-4 sm:w-16">
                    <Image src={imageSrc(sportImg)} alt="" fill sizes="64px" className="object-contain" priority />
                </div>
            </div>

            {/* Photo */}
            <div className="relative mx-3 mt-2 aspect-square">
                <Image src={imageSrc(img)} alt={username ?? ""} fill sizes="176px" className="rounded-xl object-contain object-bottom" priority />
            </div>

            {/* Team logo · username · achievements */}
            <div className="mt-2.5 border-t border-white/10 px-2.5 pb-2.5 pt-2">
                <div className="flex items-center gap-1.5">
                    {/* Team logo is decoration, not a control: no frame, no background */}
                    <div className="relative h-6 w-6 shrink-0">
                        <Image src={imageSrc(teamImg)} alt="" fill sizes="24px" className="object-contain" priority />
                    </div>

                    <div
                        title={username}
                        className="min-w-0 flex-1 truncate text-center text-[13px] font-semibold tracking-wide text-white sm:text-sm lg:text-[15px]"
                    >
                        {username}
                    </div>

                    {/* Achievements button — the only control inside the card.
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
                        className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full
                            border border-[#cfaa17]/40 bg-[#cfaa17]/15 text-[#e6c44a]
                            transition hover:scale-110 hover:bg-[#cfaa17]/30
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cfaa17]
                            before:absolute before:-inset-2 before:content-['']"
                    >
                        <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                </div>

                {/* Full name: up to two lines, height reserved so cards stay level */}
                <p className="mt-1 line-clamp-2 min-h-[2.5em] text-center text-[10px] leading-[1.25] text-white/55 sm:text-[11px]">
                    {name}
                </p>
            </div>
        </NomineeCardShell>
    )
}
