import type { Call, Match, MatchEvent, PunditId, Team } from "./types.ts";

// Two desks, two priors. Both read the same feed and commit in public.
// Front foot reads pressure as a trigger. Control block refuses to call until
// pressure produces a real shot. Neither one is allowed to hedge.

export const PUNDITS: Array<{ id: PunditId; name: string; bias: string }> = [
  {
    id: "front-foot",
    name: "Front foot",
    bias: "Every turnover is a trigger until the opposition completes three passes."
  },
  {
    id: "control-block",
    name: "Control block",
    bias: "Pressure is noise until it produces a shot on target."
  }
];

const FRONT_FOOT_HORIZON = 12;
const CONTROL_BLOCK_HORIZON = 6;
const FRONT_FOOT_COOLDOWN = 12;
const CONTROL_BLOCK_COOLDOWN = 10;
const FINAL_THIRD_WINDOW = 10;
const FRONT_FOOT_EARLIEST = 20;
const CONTROL_SHOT_XG = 0.12;
const CONTROL_MIN_PRESSURE = 0.3;

function minutesOf(event: MatchEvent): number {
  return event.minute + event.second / 60;
}

function teamName(match: Match, team: Team): string {
  return team === "home" ? match.home : match.away;
}

export function generateCalls(match: Match): Call[] {
  const calls: Call[] = [];
  let lastFrontFoot = -100;
  let lastControlBlock = -100;

  for (const event of match.events) {
    const t = minutesOf(event);

    if (event.kind === "turnover" && event.zone === "final" && event.minute >= FRONT_FOOT_EARLIEST) {
      const recent = match.events.filter((candidate) => {
        if (candidate.kind !== "turnover" || candidate.zone !== "final") return false;
        const candidateTime = minutesOf(candidate);
        return candidateTime >= t - FINAL_THIRD_WINDOW && candidateTime <= t + 0.001;
      });
      if (recent.length >= 2 && t - lastFrontFoot >= FRONT_FOOT_COOLDOWN) {
        const homeCount = recent.filter((candidate) => candidate.team === "home").length;
        const team: Team = homeCount * 2 >= recent.length ? "home" : "away";
        const horizon = Math.min(90, Math.ceil(t + FRONT_FOOT_HORIZON));
        calls.push({
          id: "",
          matchId: match.id,
          pundit: "front-foot",
          minute: event.minute,
          second: event.second,
          kind: "chance-or-goal",
          team,
          claim: `Goal or a clear chance for ${teamName(match, team)} before ${horizon}:00`,
          horizon,
          evidence: recent.slice(-3).map((candidate) => candidate.id),
          read: `${recent.length} turnovers in the final third in ten minutes. ${teamName(match, team)} have a pattern on that side.`
        });
        lastFrontFoot = t;
      }
    }

    if (event.kind === "shot" && (event.xg ?? 0) >= CONTROL_SHOT_XG) {
      const bucket = Math.min(29, Math.floor(event.minute / 3));
      const pressure = match.pressure[bucket];
      if (pressure >= CONTROL_MIN_PRESSURE && t - lastControlBlock >= CONTROL_BLOCK_COOLDOWN) {
        const horizon = Math.min(90, Math.ceil(t + CONTROL_BLOCK_HORIZON));
        calls.push({
          id: "",
          matchId: match.id,
          pundit: "control-block",
          minute: event.minute,
          second: event.second,
          kind: "goal",
          team: event.team,
          claim: `Goal from open play for ${teamName(match, event.team)} before ${horizon}:00`,
          horizon,
          evidence: [event.id],
          read: `A shot worth ${(event.xg ?? 0).toFixed(2)} expected goals with pressure at ${pressure.toFixed(2)}. That is the moment to commit.`
        });
        lastControlBlock = t;
      }
    }
  }

  return calls
    .sort((a, b) => minutesOfCall(a) - minutesOfCall(b))
    .map((call, index) => ({ ...call, id: `c-${String(index + 1).padStart(3, "0")}` }));
}

function minutesOfCall(call: Call): number {
  return call.minute + call.second / 60;
}
