const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function pad(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

export function mmss(minute: number, second = 0): string {
  return `${pad(minute)}:${pad(second)}`;
}

// Turns a float minute into a match clock. 63.25 becomes 63:15.
export function clock(minuteFloat: number): string {
  const safe = Math.max(0, Math.min(90.999, minuteFloat));
  const minute = Math.floor(safe);
  const second = Math.floor((safe - minute) * 60);
  return mmss(minute, second);
}

export function dateLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

export function resultLabel(state: string): string {
  if (state === "hit") return "Hit";
  if (state === "miss") return "Miss";
  if (state === "void") return "Void";
  return "Open";
}
