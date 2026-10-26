export type Team = "home" | "away";
export type Zone = "own" | "middle" | "final";
export type EventKind = "pass" | "carry" | "turnover" | "shot" | "chance" | "goal";

export type FeedIssue = {
  minute: number;
  note: string;
};

export type MatchEvent = {
  id: string;
  minute: number;
  second: number;
  kind: EventKind;
  team: Team;
  zone: Zone;
  text: string;
  xg?: number;
};

export type KeyMoment = Omit<MatchEvent, "id">;

export type MatchScript = {
  id: string;
  home: string;
  away: string;
  date: string;
  seed: number;
  phases: number[];
  key: KeyMoment[];
  issues: FeedIssue[];
};

export type Match = {
  id: string;
  home: string;
  away: string;
  date: string;
  events: MatchEvent[];
  pressure: number[];
  owner: Array<0 | 1>;
  score: { home: number; away: number };
  issues: FeedIssue[];
};

export type PunditId = "front-foot" | "control-block";
export type CallKind = "chance-or-goal" | "goal";

export type Call = {
  id: string;
  matchId: string;
  pundit: PunditId;
  minute: number;
  second: number;
  kind: CallKind;
  team: Team;
  claim: string;
  horizon: number;
  evidence: string[];
  read: string;
};

export type CallState = "hit" | "miss" | "void" | "open";

export type GradedCall = Call & {
  state: CallState;
  resolvedAt?: number;
  resolvedEvidence?: string[];
  note?: string;
};

export type PunditRecord = {
  pundit: PunditId;
  called: number;
  hit: number;
  miss: number;
  open: number;
  rate: number;
};

export type MatchState = {
  match: Match;
  minute: number;
  visible: MatchEvent[];
  calls: GradedCall[];
  openCall: GradedCall | null;
  onAir: MatchEvent | null;
  next: MatchEvent | null;
  records: PunditRecord[];
  pressureNow: number;
};
