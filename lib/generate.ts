import { mulberry32 } from "./rng.ts";
import type { EventKind, Match, MatchEvent, MatchScript, Team, Zone } from "./types.ts";

const KIND_WEIGHTS: Array<{ kind: EventKind; weight: number }> = [
  { kind: "pass", weight: 0.6 },
  { kind: "carry", weight: 0.22 },
  { kind: "turnover", weight: 0.18 }
];

const ZONES: Zone[] = ["own", "middle", "final"];

function pickKind(r: number): EventKind {
  let acc = 0;
  for (const entry of KIND_WEIGHTS) {
    acc += entry.weight;
    if (r <= acc) return entry.kind;
  }
  return "pass";
}

function fillerText(kind: EventKind, zone: Zone, teamName: string): string {
  if (kind === "turnover") {
    if (zone === "final") return `${teamName} win it back inside the final third.`;
    if (zone === "middle") return `${teamName} win the second ball in midfield.`;
    return `${teamName} recover it deep and slow the game down.`;
  }
  if (kind === "carry") {
    if (zone === "final") return `${teamName} carry it into the box and check back.`;
    if (zone === "middle") return `${teamName} drive through the middle.`;
    return `${teamName} carry it out of their own third.`;
  }
  if (zone === "final") return `${teamName} work it into the final third.`;
  if (zone === "middle") return `${teamName} keep the ball in midfield.`;
  return `${teamName} play out from the back.`;
}

const WEIGHTS: Record<EventKind, number> = {
  pass: 0.02,
  carry: 0.03,
  turnover: 0.1,
  shot: 0.22,
  chance: 0.4,
  goal: 0.6
};

export function buildMatch(script: MatchScript): Match {
  const random = mulberry32(script.seed);
  const generated: MatchEvent[] = [];

  for (let bucket = 0; bucket < script.phases.length; bucket++) {
    const intensity = script.phases[bucket];
    const count = 3 + Math.round(intensity * 6);
    for (let i = 0; i < count; i++) {
      const minute = bucket * 3 + Math.floor(random() * 3);
      const second = Math.floor(random() * 60);
      const homeLikelihood = 0.35 + intensity * 0.45;
      const team: Team = random() < homeLikelihood ? "home" : "away";
      const zone = ZONES[Math.floor(random() * ZONES.length)];
      const kind = pickKind(random());
      const teamName = team === "home" ? script.home : script.away;
      generated.push({
        id: "",
        minute,
        second,
        kind,
        team,
        zone,
        text: fillerText(kind, zone, teamName)
      });
    }
  }

  for (const key of script.key) {
    generated.push({ ...key, id: "" });
  }

  generated.sort((a, b) => a.minute * 60 + a.second - (b.minute * 60 + b.second));

  const events = generated.map((event, index) => ({
    ...event,
    id: `e-${String(index + 1).padStart(4, "0")}`
  }));

  const totals = new Array(30).fill(0);
  const homeTotals = new Array(30).fill(0);
  const awayTotals = new Array(30).fill(0);

  for (const event of events) {
    const bucket = Math.min(29, Math.floor(event.minute / 3));
    const weight = WEIGHTS[event.kind];
    totals[bucket] += weight;
    if (event.team === "home") homeTotals[bucket] += weight;
    else awayTotals[bucket] += weight;
  }

  const peak = Math.max(...totals, 0.001);
  const pressure = totals.map((total) => Math.round(Math.min(1, total / peak) * 100) / 100);
  const owner = totals.map((_, bucket) => (homeTotals[bucket] >= awayTotals[bucket] ? 1 : 0)) as Array<0 | 1>;

  const score = { home: 0, away: 0 };
  for (const event of events) {
    if (event.kind !== "goal") continue;
    if (event.team === "home") score.home += 1;
    else score.away += 1;
  }

  return {
    id: script.id,
    home: script.home,
    away: script.away,
    date: script.date,
    events,
    pressure,
    owner,
    score,
    issues: script.issues
  };
}
