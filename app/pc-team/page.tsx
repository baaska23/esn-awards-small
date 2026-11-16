"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import NomineeGrid from "../components/NomineeGrid";
import { InlineNotice } from "../components/Notifier";
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
    fetch('/mea/api/pc-teams')
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
      "
    >
      <CustomTitle />
      <CustomHeader header1="PC ESPORTS" header2="TEAM OF THE YEAR" />
    
      
      {error && (
        <InlineNotice type="error" className="glass w-full max-w-md">
          Мэдээлэл ачаалж чадсангүй. Дахин оролдоно уу.
        </InlineNotice>
      )}
      
      <NomineeGrid count={teams.length}>
          {teams.length > 0 ? (
            teams.map((team, index) => {
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
              <div className="w-full text-center text-sm text-white/70">
                Нэр дэвшигч олдсонгүй
              </div>
            )
          )}
      </NomineeGrid>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 glow glass rounded-2xl px-3 py-1 md:px-6 md:py-2">
          <CustomArrow side="left" to="/" />
        </div>
        <div className="m-1 md:m-2 glow glass rounded-2xl px-3 py-1 md:px-6 md:py-2">
          <CustomArrow side="right" to="/mobile-team" />
        </div>
      </div>
    </div>
  );
}