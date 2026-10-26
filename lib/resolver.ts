import type { Call, GradedCall, Match, MatchEvent } from "./types.ts";

function timeOf(event: MatchEvent): number {
  return event.minute + event.second / 60;
}

function callTime(call: Call): number {
  return call.minute + call.second / 60;
}

function qualifies(call: Call, event: MatchEvent): boolean {
  // A call is about one team. An event by the other team cannot settle it.
  if (event.team !== call.team) return false;
  if (call.kind === "goal") return event.kind === "goal";
  return event.kind === "goal" || event.kind === "chance";
}

// The resolver is the whole product. It is deterministic, it only looks at the
// window between the call and its horizon, and it refuses to grade a call whose
// evidence was corrupted by the feed.
export function gradeCall(call: Call, match: Match, asOf: number): GradedCall {
  const start = callTime(call);

  if (call.horizon > asOf) {
    return { ...call, state: "open" };
  }

  const inWindow = match.events.filter((event) => {
    const t = timeOf(event);
    return t > start && t <= call.horizon;
  });

  const issue = match.issues.find((entry) => entry.minute > start && entry.minute <= call.horizon);
  if (issue) {
    return {
      ...call,
      state: "void",
      resolvedAt: issue.minute,
      note: issue.note
    };
  }

  const hits = inWindow.filter((event) => qualifies(call, event));
  if (hits.length > 0) {
    return {
      ...call,
      state: "hit",
      resolvedAt: timeOf(hits[0]),
      resolvedEvidence: hits.map((event) => event.id)
    };
  }

  return {
    ...call,
    state: "miss",
    resolvedAt: call.horizon,
    resolvedEvidence: []
  };
}

export function gradeCalls(calls: Call[], match: Match, asOf: number): GradedCall[] {
  return calls.map((call) => gradeCall(call, match, asOf));
}
