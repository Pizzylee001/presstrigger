import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footline } from "../../../components/Footline";
import { RhythmRibbon } from "../../../components/RhythmRibbon";
import { TallyBar } from "../../../components/TallyBar";
import { FULL_TIME, getMatchState, listMatches } from "../../../lib/engine.ts";
import { dateLabel, mmss, resultLabel } from "../../../lib/format.ts";
import { PUNDITS } from "../../../lib/pundits.ts";
import type { MatchState, PunditRecord } from "../../../lib/types.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMatches().map((match) => ({ id: match.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const state = getMatchState(id, FULL_TIME);
  if (!state) return { title: "Press Trigger" };
  return { title: `${state.match.home} ${state.match.score.home}-${state.match.score.away} ${state.match.away} · Press Trigger recap` };
}

function punditName(id: string): string {
  return PUNDITS.find((pundit) => pundit.id === id)?.name ?? id;
}

function verdict(state: MatchState): string {
  const hit = state.calls.filter((call) => call.state === "hit").length;
  const miss = state.calls.filter((call) => call.state === "miss").length;
  const voided = state.calls.filter((call) => call.state === "void").length;
  const frontFoot = state.records.find((record) => record.pundit === "front-foot");
  const controlBlock = state.records.find((record) => record.pundit === "control-block");

  const line = (record: PunditRecord | undefined) => {
    if (!record || record.called === 0) return "did not commit";
    return `landed ${record.hit} of ${record.hit + record.miss}`;
  };

  const first = `${state.calls.length} calls. ${hit} right, ${miss} wrong${
    voided > 0 ? `, ${voided} voided when the feed delivered the same goal twice` : ""
  }.`;
  return `${first} Front foot ${line(frontFoot)}, control block ${line(controlBlock)}. Nothing was taken down afterwards.`;
}

function summary(record: PunditRecord): string {
  const decided = record.hit + record.miss;
  if (record.called === 0) return "Never committed. That is a choice, not a result.";
  if (decided === 0) return "Nothing has cleared yet.";
  if (record.hit === 0) return `Called ${record.called} times and did not land one. The bias is in the record now.`;
  if (record.hit === decided) return `Landed all ${decided}. The trigger held up every time it fired.`;
  if (record.hit > record.miss) return `Landed ${record.hit} of ${decided}. The trigger is doing more good than harm.`;
  if (record.hit === record.miss) return `${record.hit} of ${decided}. Right as often as wrong, which is not an edge.`;
  return `${record.hit} of ${decided}. More wrong than right on the night.`;
}

export default async function RecapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = getMatchState(id, FULL_TIME);
  if (!state) notFound();

  const { match } = state;
  const number = match.id.replace(/^m/, "").padStart(3, "0");
  const hit = state.calls.filter((call) => call.state === "hit").length;
  const miss = state.calls.filter((call) => call.state === "miss").length;

  const keyEvents = match.events.filter((event) => event.kind === "goal" || event.kind === "chance");
  const goals = keyEvents.filter((event) => event.kind === "goal").slice(0, 2);
  const moments = [...goals, ...keyEvents.filter((event) => event.kind !== "goal")]
    .sort((a, b) => a.minute * 60 + a.second - (b.minute * 60 + b.second))
    .slice(0, 3);

  return (
    <div className="app">
      <TallyBar
        matchId={match.id}
        fixture={`${match.home} ${match.score.home} ${match.away} ${match.score.away}`}
        meta={`Synthetic match ${number} · full time`}
        active="recap"
        showClock={false}
      />

      <main className="page">
        <div className="score">
          <div>
            <div className="label" style={{ marginBottom: 10 }}>
              Full time · synthetic match {number} · matchday 07
            </div>
            <div className="teams">
              {match.home}
              <br />
              {match.away}
            </div>
            <div className="ft">{dateLabel(match.date)}</div>
          </div>
          <div className="scoreline">
            {match.score.home}-{match.score.away}
          </div>
        </div>

        <div className="bandhead" style={{ marginTop: 22 }}>
          <div className="label">Game rhythm · the whole match</div>
          <div className="hint">
            {state.calls.length} calls marked · {hit} hit, {miss} missed
          </div>
        </div>
        <RhythmRibbon
          pressure={match.pressure}
          owner={match.owner}
          calls={state.calls}
          home={match.home}
          away={match.away}
        />

        <div className="verdict">
          <div className="k">The desk&rsquo;s verdict</div>
          <p>{verdict(state)}</p>
          <div className="by">
            Graded by resolver v1 · {state.calls.length} calls · {hit} right · {miss} wrong
          </div>
        </div>

        <div className="moments">
          {moments.map((event) => (
            <div className="moment" key={event.id}>
              <div className="m">
                <span className="t">{mmss(event.minute, event.second)}</span>
                <span
                  className="r"
                  style={{ color: event.kind === "goal" ? "var(--green)" : "var(--ink-3)" }}
                >
                  {event.kind === "goal" ? "Goal" : "Chance"}
                </span>
              </div>
              <p>{event.text}</p>
            </div>
          ))}
        </div>

        <div className="recapgrid">
          <div>
            <div className="colhead">
              <div className="label">Every call in this match</div>
              <div className="label">{state.calls.length} calls</div>
            </div>
            <table className="record">
              <thead>
                <tr>
                  <th>Minute</th>
                  <th>Desk</th>
                  <th>Call</th>
                  <th>Result</th>
                  <th className="evcol">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {state.calls.map((call) => (
                  <tr key={call.id}>
                    <td className="num">{mmss(call.minute, call.second)}</td>
                    <td>{punditName(call.pundit)}</td>
                    <td className="what">
                      {call.claim}
                      <span>{call.read}</span>
                      {call.note ? <span>{call.note}</span> : null}
                    </td>
                    <td>
                      <span className={`res ${call.state}`}>{resultLabel(call.state)}</span>
                    </td>
                    <td className="num evcol">{(call.resolvedEvidence && call.resolvedEvidence.length > 0 ? call.resolvedEvidence : call.evidence).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="colhead">
              <div className="label">The two desks</div>
              <div className="label">
                {match.home} v {match.away}
              </div>
            </div>
            {state.records.map((record) => {
              const pundit = PUNDITS.find((entry) => entry.id === record.pundit);
              const decided = record.hit + record.miss;
              return (
                <div className="scorecard" key={record.pundit}>
                  <div className="name">{pundit?.name}</div>
                  <div className="nums">
                    <span>
                      <b>{record.called}</b> called
                    </span>
                    <span>
                      <b>{record.hit}</b> right
                    </span>
                    <span>{decided > 0 ? <b>{record.rate}%</b> : "no grade"}</span>
                  </div>
                  <p>{summary(record)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footline
        left={
          <>
            <b>Synthetic match {number}</b> · generated locally · no Premier League data
          </>
        }
        right="Recap written from the ledger, not from memory"
      />
    </div>
  );
}
