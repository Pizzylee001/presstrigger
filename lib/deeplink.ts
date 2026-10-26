export type DeskParams = {
  minute: number;
  paused: boolean;
};

// Reads the desk's deep link. A missing "at" must keep the default start
// minute: Number(null) is 0, which once reset every plain visit to kickoff.
export function parseDeskParams(search: string, fallback: number): DeskParams {
  const params = new URLSearchParams(search);
  const raw = params.get("at");
  let minute = fallback;
  if (raw !== null && raw.trim() !== "") {
    const at = Number(raw);
    if (Number.isFinite(at) && at >= 0 && at <= 90) minute = at;
  }
  return { minute, paused: params.get("paused") === "1" };
}
