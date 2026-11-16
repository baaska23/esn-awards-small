"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { subscribe, type Notice, type NoticeType } from "@/lib/notify";

const ICONS = { error: CircleAlert, success: CircleCheck, info: Info };
const ICON_COLOR: Record<NoticeType, string> = {
  error: "text-red-300",
  success: "text-emerald-300",
  info: "text-[#cfaa17]",
};

// Message box used inside forms (OTP, submit) — same look as the toasts.
export function InlineNotice({
  type = "error",
  children,
  className = "",
}: {
  type?: NoticeType;
  children: ReactNode;
  className?: string;
}) {
  const Icon = ICONS[type];
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-left text-sm font-medium leading-snug text-white ${className}`}
    >
      <Icon className={`mt-px h-4.5 w-4.5 shrink-0 ${ICON_COLOR[type]}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

// Global toasts. Mounted once in app/layout.tsx; triggered with notify().
export default function Notifier() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(
    () =>
      subscribe((notice) => {
        // Keep at most 3 on screen, newest last; don't stack the same message twice.
        setNotices((current) =>
          current.some((n) => n.message === notice.message) ? current : [...current.slice(-2), notice]
        );
        setTimeout(() => {
          setNotices((current) => current.filter((n) => n.id !== notice.id));
        }, notice.duration);
      }),
    []
  );

  const dismiss = (id: number) => setNotices((current) => current.filter((n) => n.id !== id));

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {notices.map((notice) => {
          const Icon = ICONS[notice.type];
          return (
            <motion.div
              key={notice.id}
              layout
              role={notice.type === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="glass pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_COLOR[notice.type]}`} aria-hidden="true" />
              <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{notice.message}</p>
              <button
                type="button"
                onClick={() => dismiss(notice.id)}
                aria-label="Хаах"
                className="relative -mr-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
