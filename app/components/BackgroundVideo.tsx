"use client";
import { useEffect, useState } from "react";

const SOURCES = {
  mobile: {
    video: "/mea/new-bg/MEA26_BG_LOOP_1_1170x2532.webm",
    photo: "/mea/new-bg/bg-photo-mobile.webp",
  },
  desktop: {
    video: "/mea/new-bg/MEA26_BG_LOOP_1_1920x1080.webm",
    photo: "/mea/new-bg/bg-photo-desktop.webp",
  },
};

export default function BackgroundVideo() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Pick one variant on the client so the browser downloads only that video
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const variant = isDesktop ? SOURCES.desktop : SOURCES.mobile;

  return (
    <>
      {/* Fetch the matching photo early so it is on screen before the video */}
      <link rel="preload" as="image" href={SOURCES.mobile.photo} media="(max-width: 767px)" />
      <link rel="preload" as="image" href={SOURCES.desktop.photo} media="(min-width: 768px)" />

      {/* The photo shows until the video plays, and stays if the video fails */}
      <div
        aria-hidden
        className="
          fixed inset-0 -z-10
          bg-[url('/mea/new-bg/bg-photo-mobile.webp')] md:bg-[url('/mea/new-bg/bg-photo-desktop.webp')]
          bg-no-repeat bg-cover bg-center
        "
      >
        {isDesktop !== null && !videoFailed && (
          <video
            key={variant.video}
            className="h-full w-full object-cover"
            poster={variant.photo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          >
            <source
              src={variant.video}
              type="video/webm"
              onError={() => setVideoFailed(true)}
            />
          </video>
        )}
      </div>
    </>
  );
}
