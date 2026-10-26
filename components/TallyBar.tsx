import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  matchId: string;
  fixture: string;
  meta: string;
  active: "desk" | "record" | "recap";
  clockText?: string;
  period?: string;
  live?: boolean;
  status?: string;
  showClock?: boolean;
};

export function TallyBar({ matchId, fixture, meta, active, clockText, period, live = true, status, showClock = true }: Props) {
  return (
    <div className="tally">
      <div className="wordmark">
        <Link href={`/match/${matchId}`}>
          Press <i>Trigger</i>
        </Link>
      </div>
      <div className="tabs">
        <Link className={`tab${active === "desk" ? " active" : ""}`} href={`/match/${matchId}`}>
          Live desk
        </Link>
        <Link className={`tab${active === "record" ? " active" : ""}`} href="/ledger">
          The record
        </Link>
        <Link className={`tab${active === "recap" ? " active" : ""}`} href={`/recap/${matchId}`}>
          Recap
        </Link>
      </div>
      <div className="spacer" />
      <div className="fixture">
        <div className="teams">{fixture}</div>
        <div className="meta">{meta}</div>
      </div>
      {showClock ? (
        <div className="clockbox">
          <div className="clock">{clockText}</div>
          <div className="period">{period}</div>
          <div className={`live${live ? "" : " paused"}`}>
            <i />
            {status ?? (live ? "Live" : "Paused")}
          </div>
        </div>
      ) : null}
      <ThemeToggle />
    </div>
  );
}
