"use client";
import CustomTitle from "../components/CustomTitle";
import CustomHeader from "../components/CustomHeader";
import CustomArrow from "../components/CustomArrow";
import CustomHighlightCard from "../components/CustomHighlightCard";
import playButton from "../../public/playB.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Highlight() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedHighlightId, setSelectedhighlightId] = useState<number | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  useEffect(() => {
    fetch('/api/highlights')
    .then((res) => res.json())
    .then((data) => {
      setData(data)
    });
  }, []);

  const highlights = (data ?? []) as {
    sport_id: number;
    player_id: number;
    highlight_id: number;
    username: string;
    player_image_url: string;
    highlight_url: string;
    highlight_image_url: string;
  }[];

  useEffect(() => {
    const raw = sessionStorage.getItem("highlight_id");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedhighlightId(parsed);
      } catch {}
    }
  }, []);

  function handleSelect(
    highlight_sport_id: number,
    highlight_player_id: number,
    highlight_id: number
  ) {
    setSelectedhighlightId(highlight_id);
    sessionStorage.setItem("highlight_sport_id", JSON.stringify(highlight_sport_id));
    sessionStorage.setItem("highlight_player_id", JSON.stringify(highlight_player_id));
    sessionStorage.setItem("highlight_id", JSON.stringify(highlight_id));
    setTimeout(() => {
      router.push("/submit");
    }, 200);
  }

  function handlePlayVideo(highlightUrl: string) {
    const srcMatch = highlightUrl.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      setCurrentVideoUrl(srcMatch[1]);
      setVideoModalOpen(true);
    }
  }

  function closeVideoModal() {
    setVideoModalOpen(false);
    setCurrentVideoUrl("");
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
      <CustomHeader header1="HIGHLIGHT" header2="OF THE YEAR" />
      <div className="
        w-full max-w-6xl mx-auto 
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6 sm:gap-8 lg:gap-12 
        justify-items-center items-stretch pt-8
      ">
        {highlights.map((highlight, index) => {
          return (
            <CustomHighlightCard
              key={highlight.player_id}
              username={highlight.username}
              posterImg={`/${highlight.highlight_image_url}`}
              index={index}
              playButton={playButton}
              playerImg={`/${highlight.player_image_url}`}
              onPlayClick={() => handlePlayVideo(highlight.highlight_url)}
              onClick={() =>
                handleSelect(
                  highlight.sport_id,
                  highlight.player_id,
                  highlight.highlight_id
                )
              }
              isSelected={selectedHighlightId === highlight.highlight_id}
            />
          );
        })}
      </div>

      <div className="w-full max-w-6xl flex justify-center md:justify-between items-center mt-4 px-4 gap-4">
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="left" to="/streamer" />
        </div>
        <div className="m-1 md:m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-3 py-1 md:px-6 md:py-2 shadow-md">
          <CustomArrow side="right" to="/submit" />
        </div>
      </div>

      {videoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full h-full md:w-full md:max-w-4xl md:h-auto md:aspect-video bg-black md:rounded-lg overflow-hidden shadow-2xl rotate-90 md:rotate-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors text-xl font-bold -rotate-90 md:rotate-0"
              aria-label="Close video"
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="100%"
              src={currentVideoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
