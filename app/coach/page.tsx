"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import CustomPlayerCard from "../components/CustomPlayerCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Coach() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/coaches')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
  }, [])

  const coaches = (data ?? []) as {
    sport_id: number,
    coach_id: number,
    username: string,
    fullname: string,
    player_image_url: string,
    sport_image_url: string,
    team_image_url: string
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("coach_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedCoachId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(coach_id: number) {
    setSelectedCoachId(coach_id);
    sessionStorage.setItem("coach_id", JSON.stringify(coach_id));
    setTimeout(() => {
      router.push("/igl");
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
      <CustomHeader header1="COACH" header2="OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-12 sm:gap-6 justify-items-center items-stretch pt-8">
        {coaches.map((coach, index) => (
          <CustomPlayerCard
            key={coach.coach_id}
            sportImg={`/${coach.sport_image_url}`}
            img={`/${coach.player_image_url}`}
            teamImg={`/${coach.team_image_url}`}
            username={coach.username}
            name={coach.fullname}
            index={index}
            isSelected={selectedCoachId === coach.coach_id}
            onClick={() => handleSelect(coach.coach_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/mobile-player" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/igl" />
        </div>
      </div>
    </div>
  );
}
