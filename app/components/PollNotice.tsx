import Image from "next/image";
import CustomTitle from "./CustomTitle";
import { imageSrc } from "@/lib/image";

// Full-screen glass message used by /coming-soon and /closed.
export default function PollNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 flex flex-col">
      <div className="pt-2">
        <CustomTitle />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-gray-800 text-xl font-semibold text-center max-w-2xl">
          {children}
        </div>
      </div>
      <div className="pb-2 flex justify-center">
        <Image src={imageSrc("esn_logo.png")} alt="ESN logo" width={140} height={35} priority />
      </div>
    </div>
  );
}
