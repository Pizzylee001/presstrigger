import type { MatchScript } from "./types.ts";

// Three synthetic matches. No Premier League data, no real players.
// Key moments carry the narrative. The rest of the feed is generated around them.

export const MATCH_SCRIPTS: MatchScript[] = [
  {
    id: "m14",
    home: "Ashford",
    away: "Kingsport",
    date: "2026-10-24",
    seed: 1407,
    phases: [0.12, 0.18, 0.14, 0.22, 0.38, 0.58, 0.44, 0.32, 0.48, 0.62, 0.34, 0.26, 0.22, 0.31, 0.52, 0.68, 0.47, 0.36, 0.58, 0.72, 0.52, 0.86, 0.74, 0.91, 0.62, 0.46, 0.57, 0.41, 0.53, 0.67],
    issues: [],
    key: [
      { minute: 12, second: 5, kind: "turnover", team: "home", zone: "final", text: "Kingsport lose it on their own left. Ashford recover inside two seconds." },
      { minute: 18, second: 40, kind: "turnover", team: "home", zone: "final", text: "Second ball won on the left touchline." },
      { minute: 21, second: 50, kind: "turnover", team: "home", zone: "final", text: "Kingsport receive with their back to the pitch. Ashford win it again." },
      { minute: 24, second: 18, kind: "turnover", team: "home", zone: "final", text: "Third turnover in six minutes on the same side." },
      { minute: 31, second: 40, kind: "shot", team: "home", zone: "final", text: "Low drive from the edge of the box, deflected wide.", xg: 0.18 },
      { minute: 32, second: 10, kind: "goal", team: "home", zone: "final", text: "Finn Ashby finishes from six yards after the second ball." },
      { minute: 37, second: 20, kind: "turnover", team: "home", zone: "final", text: "Ashford press the goal kick and win it high." },
      { minute: 40, second: 50, kind: "turnover", team: "home", zone: "final", text: "Third turnover in six minutes on the same flank." },
      { minute: 44, second: 38, kind: "chance", team: "home", zone: "final", text: "Header from six yards, saved low at the near post.", xg: 0.34 },
      { minute: 45, second: 2, kind: "shot", team: "away", zone: "middle", text: "Kingsport's first shot of the half, from distance.", xg: 0.05 },
      { minute: 52, second: 30, kind: "turnover", team: "home", zone: "final", text: "Ashford win it back on the halfway line and drive." },
      { minute: 58, second: 8, kind: "shot", team: "home", zone: "final", text: "Shot from the angle, blocked at the near post.", xg: 0.14 },
      { minute: 58, second: 30, kind: "turnover", team: "home", zone: "final", text: "Kingsport's left back is caught again." },
      { minute: 61, second: 50, kind: "turnover", team: "home", zone: "final", text: "Fourth turnover on the same side in six minutes." },
      { minute: 63, second: 2, kind: "turnover", team: "home", zone: "final", text: "Second ball won on the left touchline for the third time in six minutes." },
      { minute: 68, second: 15, kind: "chance", team: "home", zone: "final", text: "Header from the penalty spot, saved at full stretch.", xg: 0.3 },
      { minute: 74, second: 30, kind: "shot", team: "home", zone: "final", text: "Header from the penalty spot, wide.", xg: 0.09 },
      { minute: 81, second: 5, kind: "turnover", team: "away", zone: "final", text: "Kingsport finally keep the ball on the left." },
      { minute: 88, second: 20, kind: "shot", team: "away", zone: "final", text: "Kingsport's late effort, straight at the keeper.", xg: 0.06 }
    ]
  },
  {
    id: "m13",
    home: "Welby Rovers",
    away: "Danforth",
    date: "2026-10-17",
    seed: 1311,
    phases: [0.2, 0.3, 0.45, 0.6, 0.4, 0.3, 0.5, 0.7, 0.55, 0.4, 0.35, 0.5, 0.65, 0.8, 0.6, 0.45, 0.55, 0.7, 0.5, 0.4, 0.6, 0.75, 0.9, 0.7, 0.55, 0.65, 0.8, 0.6, 0.5, 0.6],
    issues: [{ minute: 9.2, note: "The same goal arrived twice with different timestamps." }],
    key: [
      { minute: 5, second: 10, kind: "shot", team: "home", zone: "final", text: "Welby's first shot from the edge of the box.", xg: 0.16 },
      { minute: 9, second: 12, kind: "goal", team: "home", zone: "final", text: "Welby lead from a corner. The goal arrived twice on the feed." },
      { minute: 22, second: 10, kind: "chance", team: "away", zone: "final", text: "Danforth's first clear chance, saved at the near post.", xg: 0.3 },
      { minute: 30, second: 10, kind: "turnover", team: "home", zone: "final", text: "Welby win it high on the right." },
      { minute: 33, second: 20, kind: "turnover", team: "home", zone: "final", text: "Second turnover in three minutes on the same side." },
      { minute: 38, second: 10, kind: "goal", team: "away", zone: "middle", text: "Danforth equalise from distance." },
      { minute: 42, second: 30, kind: "chance", team: "home", zone: "final", text: "Welby's clearest chance, curled just wide.", xg: 0.29 },
      { minute: 44, second: 0, kind: "shot", team: "away", zone: "final", text: "Danforth shot from the angle, held by the keeper.", xg: 0.13 },
      { minute: 49, second: 5, kind: "turnover", team: "home", zone: "final", text: "Welby press the short goal kick." },
      { minute: 52, second: 40, kind: "turnover", team: "home", zone: "final", text: "Third turnover on the right in eight minutes." },
      { minute: 56, second: 40, kind: "shot", team: "away", zone: "final", text: "Danforth shot from the edge of the box, on target.", xg: 0.2 },
      { minute: 58, second: 11, kind: "goal", team: "away", zone: "final", text: "Danforth lead from the second ball." },
      { minute: 63, second: 15, kind: "turnover", team: "away", zone: "final", text: "Danforth win it back on the left." },
      { minute: 66, second: 40, kind: "turnover", team: "away", zone: "final", text: "Welby are caught on the ball again." },
      { minute: 70, second: 5, kind: "turnover", team: "home", zone: "final", text: "Welby force the turnover on the right." },
      { minute: 72, second: 30, kind: "turnover", team: "home", zone: "final", text: "Second turnover in three minutes on the right." },
      { minute: 84, second: 2, kind: "goal", team: "home", zone: "final", text: "Welby equalise late from a corner." },
      { minute: 86, second: 30, kind: "shot", team: "home", zone: "final", text: "Welby shot from distance, over the bar.", xg: 0.11 },
      { minute: 88, second: 30, kind: "chance", team: "home", zone: "final", text: "Welby chance in stoppage time, blocked on the line.", xg: 0.33 }
    ]
  },
  {
    id: "m12",
    home: "Carrow Heath",
    away: "Ashford",
    date: "2026-10-10",
    seed: 1204,
    phases: [0.3, 0.4, 0.35, 0.5, 0.7, 0.6, 0.45, 0.35, 0.5, 0.65, 0.8, 0.6, 0.4, 0.5, 0.7, 0.85, 0.6, 0.5, 0.65, 0.8, 0.9, 0.7, 0.55, 0.4, 0.5, 0.65, 0.75, 0.6, 0.45, 0.55],
    issues: [],
    key: [
      { minute: 8, second: 30, kind: "turnover", team: "away", zone: "final", text: "Ashford win it back on the left." },
      { minute: 11, second: 10, kind: "turnover", team: "away", zone: "final", text: "Second turnover in three minutes on the left." },
      { minute: 12, second: 50, kind: "goal", team: "away", zone: "final", text: "Ashford score first from the second ball." },
      { minute: 21, second: 40, kind: "turnover", team: "away", zone: "final", text: "Ashford press the goal kick and win it high." },
      { minute: 24, second: 50, kind: "turnover", team: "away", zone: "final", text: "Third turnover on the left in six minutes." },
      { minute: 27, second: 14, kind: "goal", team: "away", zone: "final", text: "Ashford double the lead from the same side." },
      { minute: 33, second: 5, kind: "shot", team: "home", zone: "final", text: "Carrow Heath's best effort, deflected wide.", xg: 0.14 },
      { minute: 37, second: 20, kind: "goal", team: "home", zone: "final", text: "Carrow Heath pull one back from a corner." },
      { minute: 40, second: 22, kind: "shot", team: "home", zone: "final", text: "Shot from the edge of the box, straight at the keeper.", xg: 0.09 },
      { minute: 52, second: 10, kind: "turnover", team: "home", zone: "final", text: "Carrow Heath win it high for the first time." },
      { minute: 55, second: 30, kind: "turnover", team: "home", zone: "final", text: "Second turnover in three minutes on the right." },
      { minute: 68, second: 40, kind: "chance", team: "away", zone: "final", text: "Clear chance for Ashford, saved low.", xg: 0.31 },
      { minute: 72, second: 30, kind: "chance", team: "home", zone: "final", text: "Carrow Heath's best chance of the half, headed over.", xg: 0.28 },
      { minute: 77, second: 5, kind: "shot", team: "away", zone: "final", text: "Ashford shot from the angle, blocked.", xg: 0.17 },
      { minute: 83, second: 15, kind: "turnover", team: "home", zone: "middle", text: "Carrow Heath keep the ball but go nowhere." }
    ]
  }
];

export function getScript(id: string): MatchScript | undefined {
  return MATCH_SCRIPTS.find((m) => m.id === id);
}

export const DEFAULT_MATCH_ID = "m14";
