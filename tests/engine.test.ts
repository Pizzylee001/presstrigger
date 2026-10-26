import assert from "node:assert/strict";
import test from "node:test";

import { FULL_TIME, getMatchState, listMatches, loadMatch } from "../lib/engine.ts";
import { buildMatch } from "../lib/generate.ts";
import { MATCH_SCRIPTS } from "../lib/matches.ts";
import { generateCalls } from "../lib/pundits.ts";

const ids = MATCH_SCRIPTS.map((script) => script.id);

test("the same seed builds the same match every time", () => {
  for (const script of MATCH_SCRIPTS) {
    const a = buildMatch(script);
    const b = buildMatch(script);
    assert.deepEqual(a.events, b.events, `${script.id} is not deterministic`);
    assert.deepEqual(a.pressure, b.pressure);
  }
});

test("events are chronological with unique ids", () => {
  for (const id of ids) {
    const match = loadMatch(id);
    assert.ok(match, `missing match ${id}`);
    const seen = new Set<string>();
    let previous = -1;
    for (const event of match.events) {
      const t = event.minute * 60 + event.second;
      assert.ok(t >= previous, `${id} events out of order at ${event.id}`);
      previous = t;
      assert.ok(!seen.has(event.id), `${id} duplicate id ${event.id}`);
      seen.add(event.id);
    }
  }
});

test("pressure has one value per three minute bucket and stays in range", () => {
  for (const id of ids) {
    const match = loadMatch(id)!;
    assert.equal(match.pressure.length, 30, `${id} pressure length`);
    for (const value of match.pressure) {
      assert.ok(value >= 0 && value <= 1, `${id} pressure out of range: ${value}`);
    }
    assert.equal(match.owner.length, 30);
  }
});

test("the score is the number of goal events", () => {
  for (const id of ids) {
    const match = loadMatch(id)!;
    const home = match.events.filter((e) => e.kind === "goal" && e.team === "home").length;
    const away = match.events.filter((e) => e.kind === "goal" && e.team === "away").length;
    assert.deepEqual(match.score, { home, away }, `${id} score mismatch`);
  }
});

test("both desks commit, and every call cites evidence that exists", () => {
  for (const id of ids) {
    const match = loadMatch(id)!;
    const calls = generateCalls(match);
    assert.ok(calls.length >= 3, `${id} produced only ${calls.length} calls`);
    assert.ok(calls.some((c) => c.pundit === "front-foot"), `${id} front foot never called`);
    assert.ok(calls.some((c) => c.pundit === "control-block"), `${id} control block never called`);
    const eventIds = new Set(match.events.map((e) => e.id));
    for (const call of calls) {
      assert.ok(call.evidence.length > 0, `${call.id} has no evidence`);
      for (const evidence of call.evidence) {
        assert.ok(eventIds.has(evidence), `${call.id} cites missing event ${evidence}`);
      }
      assert.ok(call.horizon > call.minute, `${call.id} horizon is not in the future`);
      assert.ok(call.horizon <= FULL_TIME, `${call.id} horizon past full time`);
    }
  }
});

test("grading is honest: a hit has a qualifying event, a miss has none", () => {
  for (const id of ids) {
    const match = loadMatch(id)!;
    const state = getMatchState(id, FULL_TIME)!;
    for (const call of state.calls) {
      assert.notEqual(call.state, "open", `${id} left ${call.id} open at full time`);
      const start = call.minute + call.second / 60;
      const window = match.events.filter((e) => {
        const t = e.minute + e.second / 60;
        return t > start && t <= call.horizon;
      });
      const qualifying = window.filter((e) =>
        e.team === call.team && (call.kind === "goal" ? e.kind === "goal" : e.kind === "goal" || e.kind === "chance")
      );
      const issue = match.issues.some((entry) => entry.minute > start && entry.minute <= call.horizon);
      if (call.state === "void") {
        assert.ok(issue, `${call.id} was voided without a feed issue`);
      } else if (call.state === "hit") {
        assert.ok(qualifying.length > 0, `${call.id} hit with no qualifying event`);
        assert.ok(!issue, `${call.id} hit inside a corrupted window`);
      } else {
        assert.equal(qualifying.length, 0, `${call.id} missed but an event qualified`);
      }
    }
  }
});

test("every match produces at least one hit and one miss", () => {
  for (const id of ids) {
    const state = getMatchState(id, FULL_TIME)!;
    assert.ok(state.calls.some((call) => call.state === "hit"), `${id} has no hit`);
    assert.ok(state.calls.some((call) => call.state === "miss"), `${id} has no miss`);
  }
});

test("the live desk has an open call at 63 minutes", () => {
  const state = getMatchState("m14", 63)!;
  assert.ok(state.openCall, "no open call at 63 minutes");
  assert.equal(state.openCall?.state, "open");
  assert.ok(state.openCall!.horizon > 63);
});

test("the open call resolves once the clock passes its horizon", () => {
  const at63 = getMatchState("m14", 63)!;
  const horizon = at63.openCall!.horizon;
  const atFullTime = getMatchState("m14", FULL_TIME)!;
  const same = atFullTime.calls.find((call) => call.id === at63.openCall!.id)!;
  assert.notEqual(same.state, "open", "the open call never closed");
  assert.ok(same.resolvedAt !== undefined);
  assert.ok(same.resolvedAt! <= FULL_TIME);
  assert.ok(horizon <= FULL_TIME);
});

test("the feed conflict in match 13 voids the call it touches", () => {
  const state = getMatchState("m13", FULL_TIME)!;
  const voided = state.calls.filter((call) => call.state === "void");
  assert.equal(voided.length, 1, "expected exactly one voided call");
  assert.match(voided[0].note ?? "", /twice/i);
});

test("a hit is settled only by the team the call was about", () => {
  for (const id of ids) {
    const match = loadMatch(id)!;
    const state = getMatchState(id, FULL_TIME)!;
    for (const call of state.calls.filter((c) => c.state === "hit")) {
      const start = call.minute + call.second / 60;
      const settling = match.events.filter((e) => {
        const t = e.minute + e.second / 60;
        const rightKind = e.team === call.team && (call.kind === "goal" ? e.kind === "goal" : e.kind === "goal" || e.kind === "chance");
        return t > start && t <= call.horizon && rightKind && e.team === call.team;
      });
      assert.ok(settling.length > 0, `${call.id} was settled by the wrong team`);
      for (const evidence of call.resolvedEvidence ?? []) {
        const event = match.events.find((e) => e.id === evidence);
        assert.ok(event, `${call.id} cites missing resolved evidence`);
        assert.equal(event!.team, call.team, `${call.id} resolved on the other team`);
      }
    }
  }
});

test("the desk never shows a call it has not made yet", () => {
  const state = getMatchState("m14", 63)!;
  for (const call of state.calls) {
    assert.ok(call.minute + call.second / 60 <= 63, `${call.id} is from the future`);
  }
  const openCalls = state.calls.filter((c) => c.state === "open"); assert.ok(openCalls.length >= 1, "expected at least one open call"); for (const openCall of openCalls) { assert.ok(openCall.horizon > 63, openCall.id + " is open but expired"); }
});

test("records add up to the calls that were graded", () => {
  for (const id of ids) {
    const state = getMatchState(id, FULL_TIME)!;
    for (const record of state.records) {
      const mine = state.calls.filter((call) => call.pundit === record.pundit);
      assert.equal(record.called, mine.length, `${id} ${record.pundit} called count`);
      assert.equal(record.hit, mine.filter((c) => c.state === "hit").length);
      assert.equal(record.miss, mine.filter((c) => c.state === "miss").length);
      assert.equal(record.open, mine.filter((c) => c.state === "open").length);
      if (record.hit + record.miss > 0) {
        assert.equal(record.rate, Math.round((record.hit / (record.hit + record.miss)) * 100));
      }
    }
  }
});

test("asking for the same minute twice gives the same state", () => {
  const a = getMatchState("m14", 58);
  const b = getMatchState("m14", 58);
  assert.deepEqual(a, b);
});

test("the match list covers every script", () => {
  const matches = listMatches();
  assert.equal(matches.length, MATCH_SCRIPTS.length);
  for (const match of matches) {
    assert.ok(match.home.length > 0 && match.away.length > 0);
  }
});
