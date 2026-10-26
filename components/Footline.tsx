import type { ReactNode } from "react";

export function Footline({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="footline">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
