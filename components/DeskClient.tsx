"use client";

import { useEffect, useMemo, useState } from "react";
import { parseDeskParams } from "../lib/deeplink.ts";
import { getMatchState } from "../lib/engine.ts";
import { clock, mmss, resultLabel } from "../lib/format.ts";
import { PUNDITS } from "../lib/pundits.ts";
import type { GradedCall, MatchEvent } from "../lib/types.ts";
import { Footline } from "./Footline";
import { RhythmRibbon } from "./RhythmRibbon";
import { TallyBar } from "./TallyBar";

type Props = { matchId: string; initialMinute: number };

const ADVANCE_MS = 440;
const ADVANCE_MIN = 0.2;

function punditName(id: string): string {
  return PUNDITS.find((pundit) => pundit.id === id)?.name ?? id;
}

export function DeskClient({ matchId, initialMinute }: Props) {
  const [minute, setMinute] = useState(initialMinute);
  const [playing, setPlaying] = useState(true);
  const atEnd = minute >= 90;

  useEffect(() => {
    if (!playing || atEnd) return;
    const timer = window.setInterval(() => {
      setMinute((current) => Math.min(90, Math.round((current + ADVANCE_MIN) * 100) / 100));
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [playing, atEnd]);

  // The desk accepts a start point so a demo or a screenshot can land on a
  // known minute: ?at=63.2&paused=1. Without one it keeps the default minute.
  useEffect(() => {
    const params = parseDeskParams(window.location.search, initialMinute);
    setMinute(params.minute);
    if (params.paused) setPlaying(false);
  }, [initialMinute]);

  const state = useMemo(() => getMatchState(matchId, minute), [matchId, minute]);
  if (!state) return null;

  const { match } = state;
  const number = match.id.replace(/^m/, "").padStart(3, "0");
  const score = state.visible.reduce(
    (total, event) => {
      if (event.kind === "goal") total[event.team] += 1;
      return total;
    },
    { home: 0, away: 0 }
  );

  const openCalls = state.calls.filter((call) => call.state === "open");
  const onAir = state.onAir;
  const previous = state.visible.length > 1 ? state.visible[state.visible.length - 2] : null;
  const evidenceCount =
    onAir && previous && onAir.minute * 60 + onAir.second - (previous.minute * 60 + previous.second) <= 60 ? 2 : 1;

  const items: Array<{ key: string; time: number; event?: MatchEvent; call?: GradedCall }> = [
    ...state.visible.slice(-3).map((event) => ({
      key: event.id,
      time: event.minute + event.second / 60,
      event
    })),
    ...state.calls.slice(-2).map((call) => ({
      key: call.id,
      time: call.minute + call.second / 60,
      call
    }))
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  return (
    <div className="app">
      <TallyBar
        matchId={match.id}
        fixture={`${match.home} ${score.home} ${match.away} ${score.away}`}
        meta={`Synthetic match ${number} · matchday 07`}
        active="desk"
        clockText={clock(minute)}
        period={minute >= 45 ? "2H" : "1H"}
        live={playing && !atEnd}
        status={atEnd ? "Full time" : playing ? "Live" : "Paused"}
      />

      <div className="band">
        <div className="bandhead">
          <div className="label">Game rhythm · pressure by three minute bucket</div>
          <div className="hint">
            Blue is {match.home} on top, grey is {match.away} · pins are calls
          </div>
        </div>
        <div className="ribbonwrap">
          <RhythmRibbon
            pressure={match.pressure}
            owner={match.owner}
            calls={state.calls}
            home={match.home}
            away={match.away}
          />
        </div>
      </div>

      <div className="desk">
        <div className="col">
          <div className="colhead">
            <div className="label">Rundown</div>
            <div className="label">{state.visible.length} events</div>
          </div>

          {items.map((item) => {
            const isOnAir = item.event && onAir && item.event.id === onAir.id;
            return (
              <div className={`row${isOnAir ? " sel" : ""}`} key={item.key}>
                <div className="min">
                  {item.call ? mmss(item.call.minute, item.call.second) : mmss(item.event!.minute, item.event!.second)}
                </div>
                <div className="kind">
                  {item.call ? (
                    <span className="callchip">Call</span>
                  ) : isOnAir ? (
                    <span className="chip-onair">On air</span>
                  ) : (
                    "Event"
                  )}
                </div>
                <div className="txt">
                  {item.call ? (
                    <>
                      <strong>{punditName(item.call.pundit)}</strong>: {item.call.claim}.
                    </>
                  ) : (
                    item.event!.text
                  )}
                </div>
                <div className="ev">
                  {item.call
                    ? item.call.evidence.map((id, index) => (
                        <span key={id}>
                          {index > 0 ? <br /> : null}
                          {id}
                        </span>
                      ))
                    : item.event!.id}
                </div>
                <div>
                  {item.call ? <div className={`res ${item.call.state}`}>{resultLabel(item.call.state)}</div> : null}
                </div>
              </div>
            );
          })}

          <div className="rowfoot">
            Rows {items.length} of {state.visible.length + state.calls.length} · newest first
          </div>
        </div>

        <div className="col">
          <div className="colhead">
            <div className="label">Monitor</div>
            <div className="label">Source · match feed</div>
          </div>

          <div className="monitor" style={{ marginTop: 16 }}>
            <div className="mon-head">
              <div>On air · lower third</div>
              <div>Safe area 92%</div>
            </div>
            <div className="screenwrap">
              <div className="screen">
                <div className="guide">
                  <div className="l3bar" />
                  <div className="l3box">
                    <div className="l3name">{openCalls.length > 0 ? `${punditName(openCalls[openCalls.length - 1].pundit)} desk` : "Match feed"}</div>
                    <div className="l3line">{openCalls.length > 0 ? openCalls[openCalls.length - 1].claim : onAir ? onAir.text : "Waiting for the feed"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mon-plain">
              <div className="plain-line">{onAir ? onAir.text : "No events yet."}</div>
              <div className="mon-meta">
                <span className="who">Match feed</span>
                <span>{onAir ? mmss(onAir.minute, onAir.second) : clock(minute)}</span>
                {onAir ? (
                  <span className="verify">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 6.5 4.2 9.7 11 2.5" />
                    </svg>
                    {evidenceCount} {evidenceCount === 1 ? "event" : "events"}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mon-foot">
              <span>Synthetic feed · deterministic</span>
              <span>{state.next ? `Next ${mmss(state.next.minute, state.next.second)}` : "Full time"}</span>
            </div>
          </div>

          <div className="open-calls">
            {openCalls.length === 0 ? (
              <div className="open-empty">
                No open call. The desk is watching, and a desk that always has a call is selling something.
              </div>
            ) : (
              <>
                <div className="block" key={openCalls[openCalls.length - 1].id}>
                  <div className="top">
                    <div className="label">Open call</div>
                    <div className="status">Horizon {openCalls[openCalls.length - 1].horizon}:00</div>
                  </div>
                  <div className="claim">{openCalls[openCalls.length - 1].claim}.</div>
                  <div className="meta-row">
                    <span>{punditName(openCalls[openCalls.length - 1].pundit)}</span>
                    <span>
                      opened {mmss(openCalls[openCalls.length - 1].minute, openCalls[openCalls.length - 1].second)}
                    </span>
                    <span>
                      {Math.max(0, Math.round((openCalls[openCalls.length - 1].horizon - minute) * 10) / 10)} min left
                    </span>
                  </div>
                </div>
                {openCalls.length > 1 ? (
                  <div className="alsoopen">
                    {openCalls.slice(0, -1).map((call) => (
                      <div key={call.id}>
                        Also open · {punditName(call.pundit)} · horizon {call.horizon}:00 ·{" "}
                        {Math.max(0, Math.round((call.horizon - minute) * 10) / 10)} min left
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="col">
          <div className="colhead">
            <div className="label">Desk</div>
            <div className="label">2 agents</div>
          </div>

          {PUNDITS.map((pundit) => {
            const record = state.records.find((entry) => entry.pundit === pundit.id);
            const latest = [...state.calls].reverse().find((call) => call.pundit === pundit.id);
            const open = state.calls.find((call) => call.pundit === pundit.id && call.state === "open");
            const read =
              latest?.read ??
              (pundit.id === "front-foot"
                ? "No trigger yet. It wants the ball won high before it says anything."
                : "No shot on target yet. It will not call pressure alone.");
            return (
              <div className="pundit" key={pundit.id}>
                <div className="name">{pundit.name}</div>
                <div className="bias">{pundit.bias}</div>
                <div className="read">{read}</div>
                <div className="rec">
                  <div>
                    <b>{record?.called ?? 0}</b> called
                  </div>
                  <div>
                    <b>{record?.hit ?? 0}</b> right
                  </div>
                  <div>{record && record.hit + record.miss > 0 ? <b>{record.rate}%</b> : "no grade yet"}</div>
                </div>
                <div className="open">{open ? `Open · clears at ${open.horizon}:00` : "No open call"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Footline
        left={
          <>
            <b>Synthetic match {number}</b> · generated locally · no Premier League data
          </>
        }
        right={
          <div className="replay">
            <span className="state">{atEnd ? "Full time" : playing ? "Replay · 1 min per 2.2s" : "Paused"}</span>
            <button
              type="button"
              onClick={() => {
                if (atEnd) {
                  setMinute(initialMinute);
                  setPlaying(true);
                  return;
                }
                setPlaying((current) => !current);
              }}
            >
              {atEnd ? "Replay" : playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMinute(initialMinute);
                setPlaying(true);
              }}
            >
              Restart
            </button>
          </div>
        }
      />
    </div>
  );
}
