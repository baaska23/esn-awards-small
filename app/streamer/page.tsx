"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomStreamer from "../components/CustomStreamerCard";

export default function Streamer() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedStreamerId, setSelectedStreamerId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/esport/api/streamers')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
  }, [])

  const streamers = (data ?? []) as {
    streamer_id: number,
    username: string,
    player_image_url: string,
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("streamer_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedStreamerId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(streamer_id: number) {
    setSelectedStreamerId(streamer_id);
    sessionStorage.setItem("streamer_id", JSON.stringify(streamer_id));
    setTimeout(() => {
      router.push("/fan-favorite");
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
      <CustomHeader header1="STREAMER" header2="OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 grid-rows-2 gap-4 sm:gap-6 justify-items-center items-stretch lg:grid-cols-6 lg:grid-rows-1 pt-8">
        {streamers.map((player, index) => (
          <CustomStreamer
            key={player.streamer_id}
            img={`/${player.player_image_url}`}
            username={player.username}
            index={index}
            isSelected={selectedStreamerId === player.streamer_id}
            onClick={() => handleSelect(player.streamer_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/talent" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/fan-favorite" />
        </div>
      </div>
    </div>
  );
}
