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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/mongolian-esports-awards/api/pc-teams')
    .then((res) => res.json())
    .then((data) => {
      console.log("Data in teams: ", data);
    
      if (data.error) {
        setError(data.error);
        setData([]);
      } else if (Array.isArray(data)) {
        setData(data);
      } else {
        setData([]);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError(err.message);
      setData([]);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const teams = Array.isArray(data) ? data : [];

  useEffect(() => {
    const raw = sessionStorage.getItem("pc_team_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedTeamId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(pc_team_id: number) {
    setSelectedTeamId(pc_team_id);
    sessionStorage.setItem("pc_team_id", JSON.stringify(pc_team_id));
    setTimeout(() => {
      router.push("/mobile-team");
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
      <CustomHeader header1="PC ESPORTS" header2="TEAM OF THE YEAR" />
    
      
      {error && (
        <div className="text-red-500 text-xl bg-white/20 p-4 rounded-lg">
          Error: {error} 2swAZq
        </div>
      )}
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-12 sm:gap-6 justify-items-center items-stretch pt-8">
          {teams.length > 0 ? (
            teams.map((team, index) => {
              console.log("sport_image_url", `/${team.sport_image_url}`)
              return(
              <CustomTeamCard
                  key={team.pc_team_id}
                  sportImg={`/${team.sport_image_url}`}
                  index={index}
                  img={`/${team.team_image_url}`}
                  name={team.team_name}
                  isSelected={selectedTeamId === team.pc_team_id}
                  onClick={() => handleSelect(team.pc_team_id)}
              />)}
            )
          ) : (
            !loading && !error && (
              <div className="col-span-full text-white text-xl">
                No teams found
              </div>
            )
          )}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/mobile-team" />
        </div>
      </div>
    </div>
  );
}