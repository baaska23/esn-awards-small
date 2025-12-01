"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import CustomTeamCard from "../components/CustomTeamCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Team() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/mongolian-esports-awards/api/mobile-teams')
    .then((res) => res.json())
    .then((data) => {
      console.log("Data in teams: ", data)
      setData(data)
    });
  }, [])

  const teams = (data ?? []) as {
    sport_id: number,
    mobile_team_id: number,
    team_name: string,
    team_image_url: string,
    sport_image_url: string
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("mobile_team_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedTeamId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(mobile_team_id: number) {
    setSelectedTeamId(mobile_team_id);
    sessionStorage.setItem("mobile_team_id", JSON.stringify(mobile_team_id));
    setTimeout(() => {
      router.push("/pc-player");
    }, 200);
  }

  return (
    <div
      className="
        min-h-screen grid items-center justify-items-center p-6 sm:p-12 gap-2
        bg-[url('/mongolian-esports-awards/BG_MOBILE_2.jpg')] md:bg-[url('/mongolian-esports-awards/BG_DESKTOP_2.jpg')]
        bg-no-repeat bg-cover bg-center bg-fixed
      "
    >
      <CustomTitle />
      <CustomHeader header1="MOBILE ESPORTS" header2="TEAM OF THE YEAR" />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-4 gap-y-12 sm:gap-6 justify-items-center items-stretch lg:grid-cols-6 pt-8">
        {teams.map((team, index) => (
          <CustomTeamCard
            key={team.mobile_team_id}
            sportImg={`/${team.sport_image_url}`}
            index={index}
            img={`/${team.team_image_url}`}
            name={team.team_name}
            isSelected={selectedTeamId === team.mobile_team_id}
            onClick={() => handleSelect(team.mobile_team_id)}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/pc-team" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/pc-player" />
        </div>
      </div>
    </div>
  );
}
