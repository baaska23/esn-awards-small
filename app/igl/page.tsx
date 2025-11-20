"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import CustomPlayerCard from "../components/CustomPlayerCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Igl() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedIglId, setSelectedIglId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/esport/api/igls')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
  }, [])

  const igls = (data ?? []) as {
    sport_id: number,
    team_id: number,
    igl_id: number,
    username: string,
    fullname: string,
    player_image_url: string,
    team_image_url: string,
    sport_image_url: string
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("igl_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedIglId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(igl_id: number) {
    setSelectedIglId(igl_id);
    sessionStorage.setItem("igl_id", JSON.stringify(igl_id));
    setTimeout(() => {
      router.push("/talent");
    }, 200);
  }

  return (
    <div
      className="
        min-h-screen grid items-center justify-items-center p-6 sm:p-12 gap-2
        bg-[url('/BG_MOBILE_2.jpg')] md:bg-[url('/BG_DESKTOP_2.jpg')]
        bg-no-repeat bg-cover bg-center bg-fixed
      "
    >
      <CustomTitle />
      <CustomHeader header1="IGL" header2="OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 grid-rows-2 gap-4 gap-y-12 sm:gap-6 justify-items-center items-stretch  lg:grid-cols-5 lg:grid-rows-1 pt-8">
        {igls.map((player, index) => (
          <CustomPlayerCard
            key={player.igl_id}
            sportImg={`/${player.sport_image_url}`}
            img={`/${player.player_image_url}`}
            teamImg={`/${player.team_image_url}`}
            username={player.username}
            name={player.fullname}
            index={index}
            isSelected={selectedIglId === player.igl_id}
            onClick={() => handleSelect(player.igl_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/coach" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/talent" />
        </div>
      </div>
    </div>
  );
}
