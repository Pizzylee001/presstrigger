import type { CallState, GradedCall } from "../lib/types.ts";

type Props = {
  pressure: number[];
  owner: Array<0 | 1>;
  calls: GradedCall[];
  home: string;
  away: string;
};

const BAR_W = 28;
const GAP = 15;
const START_X = 22;
const BASE_Y = 114;
const MAX_H = 64;
const EXTRUSION = 9;
const STEM = 18;

function xFor(bucket: number): number {
  return START_X + bucket * (BAR_W + GAP);
}

function heightFor(value: number): number {
  return Math.max(4, Math.round(value * MAX_H));
}

const PIN_COLOR: Record<CallState, string> = {
  hit: "var(--pin-hit)",
  miss: "var(--pin-miss)",
  open: "var(--pin-open)",
  void: "var(--pin-void)"
};

export function RhythmRibbon({ pressure, owner, calls, home, away }: Props) {
  const buckets = pressure.map((value, index) => {
    const x = xFor(index);
    const h = heightFor(value);
    const top = BASE_Y - h;
    return {
      index,
      x,
      h,
      top,
      isHome: owner[index] === 1,
      side: `${x + BAR_W},${top} ${x + BAR_W + EXTRUSION},${top - EXTRUSION} ${x + BAR_W + EXTRUSION},${BASE_Y - EXTRUSION} ${x + BAR_W},${BASE_Y}`,
      face: `${x},${top} ${x + EXTRUSION},${top - EXTRUSION} ${x + BAR_W + EXTRUSION},${top - EXTRUSION} ${x + BAR_W},${top}`
    };
  });

  const grouped = new Map<number, GradedCall[]>();
  for (const call of calls) {
    const bucket = Math.max(0, Math.min(29, Math.floor((call.minute + call.second / 60) / 3)));
    const list = grouped.get(bucket) ?? [];
    list.push(call);
    grouped.set(bucket, list);
  }

  const pins = Array.from(grouped.entries()).flatMap(([bucket, list]) =>
    list.map((call, index) => {
      const spread = (index - (list.length - 1) / 2) * 10;
      const cx = xFor(bucket) + BAR_W / 2 + EXTRUSION / 2 + spread;
      const top = BASE_Y - heightFor(pressure[bucket]) - EXTRUSION;
      return { call, cx, top };
    })
  );

  const marks = [15, 30, 45, 60, 75, 90];

  return (
    <svg
      className="ribbonsvg"
      viewBox="0 0 1360 142"
      role="img"
      aria-label={`Pressure across ninety minutes. Blue is ${home} on top, grey is ${away}. ${calls.length} calls marked, with pins for each one.`}
    >
      <line x1="8" y1={BASE_Y} x2="1338" y2={BASE_Y} stroke="var(--rib-axis)" strokeWidth="1" />

      {buckets.map((bar) => (
        <g key={bar.index}>
          <polygon
            points={bar.side}
            fill={bar.isHome ? "var(--rib-home-side)" : "var(--rib-away-side)"}
          />
          <polygon
            points={bar.face}
            fill={bar.isHome ? "var(--rib-home-top)" : "var(--rib-away-top)"}
          />
          <rect
            x={bar.x}
            y={bar.top}
            width={BAR_W}
            height={bar.h}
            fill={bar.isHome ? "var(--rib-home-front)" : "var(--rib-away-front)"}
          />
        </g>
      ))}

      {marks.map((minute) => {
        const bucket = Math.min(29, Math.floor(minute / 3) - 1);
        const x = xFor(bucket) + BAR_W;
        return (
          <text
            key={minute}
            x={x}
            y={BASE_Y + 20}
            textAnchor="middle"
            fill="var(--rib-label)"
            fontSize="9"
            fontWeight="600"
            letterSpacing=".08em"
            fontFamily="Public Sans, system-ui, sans-serif"
          >
            {minute}
          </text>
        );
      })}

      {pins.map(({ call, cx, top }) => {
        const color = PIN_COLOR[call.state];
        return (
          <g key={call.id}>
            <line x1={cx} y1={top} x2={cx} y2={top - STEM} stroke={color} strokeWidth="1.5" />
            <circle cx={cx} cy={top - STEM - 4} r="4" fill={color} stroke="var(--paper)" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
}
