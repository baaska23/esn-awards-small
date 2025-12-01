"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomFavPlayerCard from "../components/CustomFavPlayerCard";

interface FavPlayer {
  team_id: number;
  fav_player_id: number;
  username: string;
  team_name?: string;
  team_image_url?: string;
  player_image_url?: string;
}

interface TeamGroup {
  team_id: number;
  team_name: string;
  team_image_url: string;
  players: {
    fav_player_id: number;
    username: string;
    player_image_url?: string;
  }[];
}

export default function FavoritePlayers() {
  const router = useRouter();
  const [data, setData] = useState<FavPlayer[]>([]);
  const [selectedFavId, setSelectedFavId] = useState<number | null>(null);

  // Game type mapping based on team_id
  const GAME_TYPE_MAP: { [key: number]: string } = {
    1: "CS2",
    5: "MLBB",
    9: "PUBG",
    // Add more mappings as needed
  };

  useEffect(() => {
    fetch('/mongolian-esports-awards/api/fan-favorite')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("fav_player_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedFavId(parsed);
      } catch {}
    }
  }, []);

  const teamGroups: TeamGroup[] = [];
  const teamMap = new Map<number, TeamGroup>();

  data.forEach((fav) => {
    if (!teamMap.has(fav.team_id)) {
      // Create display name with game type if applicable
      let displayName = fav.team_name || `Team ${fav.team_id}`;
      const gameType = GAME_TYPE_MAP[fav.team_id];
      
      if (gameType) {
        displayName = `${displayName} / ${gameType} /`;
      }

      teamMap.set(fav.team_id, {
        team_id: fav.team_id,
        team_name: displayName,
        team_image_url: fav.team_image_url || "",
        players: []
      });
    }
    
    teamMap.get(fav.team_id)?.players.push({
      fav_player_id: fav.fav_player_id,
      username: fav.username,
      player_image_url: fav.player_image_url
    });
  });

  teamMap.forEach((value) => teamGroups.push(value));

  function handleSelect(fav_player_id: number) {
    setSelectedFavId(fav_player_id);
    sessionStorage.setItem("fav_player_id", JSON.stringify(fav_player_id));
    setTimeout(() => {
      router.push("/highlight");
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
      <CustomHeader header1="FAN FAVORITE PLAYER" header2="OF THE YEAR" />
      
      <div className="
        w-full max-w-6xl mx-auto
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-6 sm:gap-8
        justify-items-center items-stretch pt-8
      ">
        {teamGroups.map((team, index) => (
          <CustomFavPlayerCard
            key={team.team_id}
            teamImg={team.team_image_url}
            teamName={team.team_name}
            players={team.players}
            onClick={handleSelect}
            selectedPlayerId={selectedFavId}
            index={index}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/streamer" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/highlight" />
        </div>
      </div>
    </div>
  );
}