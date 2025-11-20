"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomStreamer from "../components/CustomStreamerCard";

export default function Talent() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedTalentId, setSelectedTalentId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/esport/api/talents')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
  }, [])

  const talents = (data ?? []) as {
    talent_id: number,
    username: string,
    player_image_url: string,
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("talent_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedTalentId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(talent_id: number) {
    setSelectedTalentId(talent_id);
    sessionStorage.setItem("talent_id", JSON.stringify(talent_id));
    setTimeout(() => {
      router.push("/streamer");
    }, 200);
  }

  return (
    <div
      className="
        min-h-screen grid items-center justify-items-center p-6 sm:p-12 gap-2
        bg-[url('/esport/BG_MOBILE_2.jpg')] md:bg-[url('/esport/BG_DESKTOP_2.jpg')]
        bg-no-repeat bg-cover bg-center bg-fixed
      "
    >
      <CustomTitle />
      <CustomHeader header1="TALENT" header2="OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 grid-rows-2 gap-4 sm:gap-6 justify-items-center items-stretch lg:grid-cols-6 lg:grid-rows-1 pt-8">
        {talents.map((player, index) => (
          <CustomStreamer
            key={player.talent_id}
            img={`/${player.player_image_url}`}
            username={player.username}
            index={index}
            isSelected={selectedTalentId === player.talent_id}
            onClick={() => handleSelect(player.talent_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/igl" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/streamer" />
        </div>
      </div>
    </div>
  );
}
