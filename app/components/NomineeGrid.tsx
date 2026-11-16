import type { CSSProperties, ReactNode } from "react";

// Centred, wrapping grid for nominee cards (see .nominee-grid in globals.css).
// On desktop the rows are balanced: up to 5 nominees sit in one row,
// more than that split into two even rows (10 -> 5 + 5, 7 -> 4 + 3).
export default function NomineeGrid({ count, children }: { count: number; children: ReactNode }) {
  const cols = Math.min(6, count <= 5 ? Math.max(count, 1) : Math.ceil(count / 2));
  return (
    <div className="nominee-grid" style={{ "--cols": cols } as CSSProperties}>
      {children}
    </div>
  );
}
