"use client";

import { Fragment, useState } from "react";
import { mmss, resultLabel } from "../lib/format.ts";
import type { CallState } from "../lib/types.ts";

export type LedgerRow = {
  id: string;
  matchId: string;
  matchNumber: string;
  groupTitle: string;
  minute: number;
  second: number;
  pundit: "front-foot" | "control-block";
  punditName: string;
  claim: string;
  read: string;
  horizon: number;
  state: CallState;
  evidence: string[];
  note?: string;
};

type Filter = "all" | "hit" | "miss" | "open" | "void" | "front-foot" | "control-block";

export function LedgerClient({ rows }: { rows: LedgerRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(13);

  function choose(next: Filter) {
    setFilter(next);
    setLimit(13);
  }

  const filtered = rows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "front-foot" || filter === "control-block") return row.pundit === filter;
    return row.state === filter;
  });
  const visible = filtered.slice(0, limit);

  const count = (next: Filter) =>
    rows.filter((row) => {
      if (next === "all") return true;
      if (next === "front-foot" || next === "control-block") return row.pundit === next;
      return row.state === next;
    }).length;

  return (
    <>
      <div className="filters">
        <button className="filter" type="button" aria-pressed={filter === "all"} onClick={() => choose("all")}>
          All {count("all")}
        </button>
        <button className="filter" type="button" aria-pressed={filter === "hit"} onClick={() => choose("hit")}>
          Hits {count("hit")}
        </button>
        <button className="filter" type="button" aria-pressed={filter === "miss"} onClick={() => choose("miss")}>
          Misses {count("miss")}
        </button>
        <button className="filter" type="button" aria-pressed={filter === "open"} onClick={() => choose("open")}>
          Open {count("open")}
        </button>
        <button className="filter" type="button" aria-pressed={filter === "void"} onClick={() => choose("void")}>
          Void {count("void")}
        </button>
        <span className="sep" />
        <button
          className="filter"
          type="button"
          aria-pressed={filter === "front-foot"}
          onClick={() => choose("front-foot")}
        >
          Front foot
        </button>
        <button
          className="filter"
          type="button"
          aria-pressed={filter === "control-block"}
          onClick={() => choose("control-block")}
        >
          Control block
        </button>
      </div>

      <div className="marks" aria-hidden="true">
        {[...rows].reverse().map((row) => (
          <div className={`mark ${row.state}`} key={row.id} title={`${row.punditName} ${mmss(row.minute, row.second)}`} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "var(--ink-3)", padding: "6px 0 0", letterSpacing: ".02em" }}>
        One mark per call, oldest first. Green hit, grey miss, blue open, outline void.
      </div>

      <table className="record">
        <thead>
          <tr>
            <th>Minute</th>
            <th>Desk</th>
            <th>Call</th>
            <th>Horizon</th>
            <th>Result</th>
            <th className="evcol">Evidence</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty">
                No calls in this view.
              </td>
            </tr>
          ) : null}
          {visible.map((row, index) => {
            const firstOfGroup = index === 0 || visible[index - 1].matchId !== row.matchId;
            return (
              <Fragment key={row.id}>
                {firstOfGroup ? (
                  <tr className="grouphead">
                    <td colSpan={6}>
                      <b>Match {row.matchNumber}</b> · {row.groupTitle}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td className="num">{mmss(row.minute, row.second)}</td>
                  <td>{row.punditName}</td>
                  <td className="what">
                    {row.claim}
                    <span>{row.read}</span>
                    {row.note ? <span>{row.note}</span> : null}
                  </td>
                  <td className="num">{row.horizon}:00</td>
                  <td>
                    <span className={`res ${row.state}`}>{resultLabel(row.state)}</span>
                  </td>
                  <td className="num evcol">{row.evidence.join(", ")}</td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="tablefoot">
        <span>
          Showing {visible.length} of {filtered.length}
        </span>
        {visible.length < filtered.length ? (
          <button className="loadmore" type="button" onClick={() => setLimit((current) => current + 12)}>
            Load 12 more
          </button>
        ) : (
          <span>End of the record</span>
        )}
      </div>
    </>
  );
}
