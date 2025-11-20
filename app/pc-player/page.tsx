"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import CustomPlayerCard from "../components/CustomPlayerCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Player() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/esport/api/pc-players')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
  }, [])

  const players = (data ?? []) as {
    sport_id: number,
    team_id: number,
    pc_player_id: number,
    username: string,
    fullname: string,
    player_image_url: string,
    team_image_url: string,
    sport_image_url: string
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("pc_player_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedPlayerId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(pc_player_id: number) {
    setSelectedPlayerId(pc_player_id);
    sessionStorage.setItem("pc_player_id", JSON.stringify(pc_player_id));
    setTimeout(() => {
      router.push("/mobile-player");
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
      <CustomHeader header1="PC PLAYER" header2="OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 grid-rows-2 gap-4 gap-y-12 sm:gap-6 justify-items-center items-stretch lg:grid-cols-6 lg:grid-rows-1 pt-8">
        {players.map((player, index) => (
          <CustomPlayerCard
            key={player.pc_player_id}
            sportImg={`/${player.sport_image_url}`}
            img={`/${player.player_image_url}`}
            teamImg={`/${player.team_image_url}`}
            username={player.username}
            name={player.fullname}
            index={index}
            isSelected={selectedPlayerId === player.pc_player_id}
            onClick={() => handleSelect(player.pc_player_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/mobile-team" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/mobile-player" />
        </div>
      </div>
    </div>
  );
}
