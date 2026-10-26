import { buildMatch } from "./generate.ts";
import { getScript, MATCH_SCRIPTS } from "./matches.ts";
import { generateCalls } from "./pundits.ts";
import { gradeCalls } from "./resolver.ts";
import type { GradedCall, Match, MatchState, PunditId, PunditRecord } from "./types.ts";

export const DEFAULT_AS_OF = 63;
export const FULL_TIME = 90;

const matchCache = new Map<string, Match>();

export function loadMatch(id: string): Match | null {
  const cached = matchCache.get(id);
  if (cached) return cached;
  const script = getScript(id);
  if (!script) return null;
  const match = buildMatch(script);
  matchCache.set(id, match);
  return match;
}

export function listMatches(): Array<{ id: string; home: string; away: string; date: string }> {
  return MATCH_SCRIPTS.map((script) => ({
    id: script.id,
    home: script.home,
    away: script.away,
    date: script.date
  }));
}

function recordsFor(calls: GradedCall[]): PunditRecord[] {
  const pundits: PunditId[] = ["front-foot", "control-block"];
  return pundits.map((pundit) => {
    const mine = calls.filter((call) => call.pundit === pundit);
    const hit = mine.filter((call) => call.state === "hit").length;
    const miss = mine.filter((call) => call.state === "miss").length;
    const open = mine.filter((call) => call.state === "open").length;
    const decided = hit + miss;
    return {
      pundit,
      called: mine.length,
      hit,
      miss,
      open,
      rate: decided === 0 ? 0 : Math.round((hit / decided) * 100)
    };
  });
}

export function getMatchState(id: string, asOf: number): MatchState | null {
  const match = loadMatch(id);
  if (!match) return null;

  const minute = Math.max(0, Math.min(FULL_TIME, asOf));
  const visible = match.events.filter((event) => event.minute + event.second / 60 <= minute);
  // A desk cannot have made a call in the future. Only calls already on air count.
  const calls = gradeCalls(generateCalls(match), match, minute).filter(
    (call) => call.minute + call.second / 60 <= minute
  );
  const open = calls.filter((call) => call.state === "open");
  const bucket = Math.min(29, Math.floor(minute / 3));

  return {
    match,
    minute,
    visible,
    calls,
    openCall: open.length > 0 ? open[open.length - 1] : null,
    onAir: visible.length > 0 ? visible[visible.length - 1] : null,
    next: match.events.find((event) => event.minute + event.second / 60 > minute) ?? null,
    records: recordsFor(calls),
    pressureNow: match.pressure[bucket]
  };
}

export function getAllCallCounts(): number {
  return MATCH_SCRIPTS.reduce((total, script) => {
    const match = loadMatch(script.id);
    if (!match) return total;
    return total + generateCalls(match).length;
  }, 0);
}
