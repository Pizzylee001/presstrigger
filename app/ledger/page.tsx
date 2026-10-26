import type { Metadata } from "next";
import { Footline } from "../../components/Footline";
import { LedgerClient, type LedgerRow } from "../../components/LedgerClient";
import { TallyBar } from "../../components/TallyBar";
import { DEFAULT_AS_OF, getMatchState } from "../../lib/engine.ts";
import { clock } from "../../lib/format.ts";
import { PUNDITS } from "../../lib/pundits.ts";
import type { MatchState } from "../../lib/types.ts";

export const metadata: Metadata = {
  title: "The Record · Press Trigger",
  description: "Every call the desk has made, with the evidence it was graded on. Nothing is removed afterwards."
};

function punditName(id: string): string {
  return PUNDITS.find((pundit) => pundit.id === id)?.name ?? id;
}

function scoreAt(state: MatchState): { home: number; away: number } {
  return state.visible.reduce(
    (total, event) => {
      if (event.kind === "goal") total[event.team] += 1;
      return total;
    },
    { home: 0, away: 0 }
  );
}

export default function LedgerPage() {
  const live = getMatchState("m14", DEFAULT_AS_OF);
  const finished = ["m13", "m12"].map((id) => getMatchState(id, 90)).filter((state): state is MatchState => state !== null);
  const states: MatchState[] = live ? [live, ...finished] : finished;

  const rows: LedgerRow[] = states.flatMap((state) => {
    const number = state.match.id.replace(/^m/, "").padStart(3, "0");
    const score = scoreAt(state);
    const stage = state.match.id === "m14" ? `live at ${clock(DEFAULT_AS_OF)}` : "full time";
    const groupTitle = `${state.match.home} ${score.home} ${state.match.away} ${score.away} · ${stage}`;
    return [...state.calls].reverse().map((call) => ({
      id: call.id,
      matchId: state.match.id,
      matchNumber: number,
      groupTitle,
      minute: call.minute,
      second: call.second,
      pundit: call.pundit,
      punditName: punditName(call.pundit),
      claim: call.claim,
      read: call.read,
      horizon: call.horizon,
      state: call.state,
      evidence: call.evidence,
      note: call.note
    }));
  });

  const hit = rows.filter((row) => row.state === "hit").length;
  const miss = rows.filter((row) => row.state === "miss").length;
  const open = rows.filter((row) => row.state === "open").length;
  const voided = rows.filter((row) => row.state === "void").length;
  const decided = hit + miss;
  const rate = decided === 0 ? 0 : Math.round((hit / decided) * 100);

  return (
    <div className="app">
      <TallyBar
        matchId="m14"
        fixture={`${rows.length} calls on record`}
        meta="Three synthetic matches · resolver v1"
        active="record"
        showClock={false}
      />

      <main className="page">
        <div className="page-head">
          <h1 className="page-title">The Record</h1>
          <p className="page-sub">
            Every call this desk has made, with the evidence it was graded on. Nothing is removed afterwards,
            including the calls that were wrong.
          </p>
          <div className="page-meta">
            <span>Synthetic data</span>
            <span>No real match feed</span>
            <span>Graded in public</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="k">Calls made</div>
            <div className="v">{rows.length}</div>
            <div className="note">Across three matches</div>
          </div>
          <div className="stat">
            <div className="k">Right</div>
            <div className="v">
              {hit}
              <small>{rate}%</small>
            </div>
            <div className="note">Settled by the resolver</div>
          </div>
          <div className="stat">
            <div className="k">Wrong</div>
            <div className="v">{miss}</div>
            <div className="note">Kept, not hidden</div>
          </div>
          <div className="stat">
            <div className="k">Open now</div>
            <div className="v">{open}</div>
            <div className="note">
              {open > 0
                ? `Clears at ${Array.from(new Set(rows.filter((row) => row.state === "open").map((row) => row.horizon))).sort((a, b) => a - b).map((horizon) => `${horizon}:00`).join(" and ")}`
                : voided > 0
                  ? `${voided} voided by a feed conflict`
                  : "Nothing open"}
            </div>
          </div>
        </div>

        <LedgerClient rows={rows} />
      </main>

      <Footline
        left={
          <>
            <b>Three synthetic matches</b> · generated locally · no Premier League data
          </>
        }
        right="Every call kept, including the misses"
      />
    </div>
  );
}
