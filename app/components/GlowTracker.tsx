"use client";
import { useEffect, useRef } from "react";

// Feeds the cursor position into every .glow element as --x/--y,
// and moves a page-wide spotlight that follows the cursor
export default function GlowTracker() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    let frame = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const el = (e.target as Element | null)?.closest?.(".glow") as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }

      cx = e.clientX;
      cy = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!spot) return;
          spot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
          spot.style.opacity = "1";
        });
      }
    };

    const onLeave = () => {
      if (spot) spot.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={spotRef} aria-hidden className="cursor-spotlight" />;
}
