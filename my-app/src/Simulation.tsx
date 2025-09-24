import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Simulation() {
  // timer + pause
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);

  // Seeded random state
  // displaySeed: 8-digit seed string shown in UI
  const [displaySeed, setDisplaySeed] = useState<string>(() => "00000000");
  // randomDigits: the first 4 digits extracted from the 8-digit seed
  const [randomDigits, setRandomDigits] = useState<string>(() => "0000");
  // displayedNumber: mapped to [-1, 1]
  const [displayedNumber, setDisplayedNumber] = useState<number>(() => 0);
  // history of displayed numbers (for plotting). Newest appended to the end.
  const [history, setHistory] = useState<number[]>([]);
  const seedRef = useRef<number>(0);

  // mulberry32 seeded PRNG (fast, deterministic)
  function mulberry32(a: number) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Generate one random number from current seedRef.current, update displaySeed and randomValue,
  // and advance seedRef.current to the next seed (derived from the generated number)
  const generateOnce = useCallback(() => {
    const seed = Math.trunc(seedRef.current) || 0;
    const prng = mulberry32(seed);
    // produce an 8-digit integer deterministically from the seed
    const eight = Math.floor(prng() * 100_000_000); // 0 .. 99_999_999
    const eightStr = String(eight).padStart(8, "0");
    // take the first 4 digits
    const first4 = eightStr.slice(0, 4);
    const first4num = parseInt(first4, 10);
    // map first4num (0..9999) to [-1, 1], round to 2 decimals
    const mapped = Math.round(((first4num / 9999) * 2 - 1) * 100) / 100;

    setDisplaySeed(eightStr);
    setRandomDigits(first4);
    setDisplayedNumber(mapped);
    // append to history, cap at maxPoints
    setHistory((h) => {
      const maxPoints = 120;
      const next = h.concat(mapped);
      if (next.length > maxPoints) return next.slice(next.length - maxPoints);
      return next;
    });

    // next seed becomes the generated 8-digit integer
    seedRef.current = eight;
  }, []);

  // Start generation immediately when running and then every second
  useEffect(() => {
    if (paused) return;
    // ensure seedRef starts at 0 unless already changed
    if (!Number.isFinite(seedRef.current)) seedRef.current = 0;
    generateOnce(); // immediate
    const id = setInterval(generateOnce, 1000);
    return () => clearInterval(id);
  }, [paused, generateOnce]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const styles = {
    timer: { fontVariantNumeric: "tabular-nums" as const, color: "#666" },
    pausedtimer: {
      fontVariantNumeric: "tabular-nums" as const,
      color: "crimson",
    },
  };

  return (
    <div>
      <h2>Simulation</h2>
      <p>Content for Simulation. Replace with your Simulation view.</p>

      <div className="row">
        <span style={paused ? styles.pausedtimer : styles.timer}>
          Elapsed: {mm}:{ss}
        </span>
        <button className="button" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div
        className="row"
        style={{ gap: 24, marginTop: 12, alignItems: "center" }}
      >
        <div>
          <div style={{ color: "#666", fontSize: 12 }}>Seed (8 digits)</div>
          <div
            style={{
              fontVariantNumeric: "tabular-nums" as const,
              fontSize: 16,
            }}
          >
            {displaySeed}
          </div>
        </div>

        <div>
          <div style={{ color: "#666", fontSize: 12 }}>
            Random digits (first 4)
          </div>
          <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 16 }}>
            {randomDigits}
          </div>
        </div>

        <div>
          <div style={{ color: "#666", fontSize: 12 }}>
            Displayed number (−1…1)
          </div>
          <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 20 }}>
            {displayedNumber >= 0
              ? ` ${displayedNumber.toFixed(2)}`
              : displayedNumber.toFixed(2)}
          </div>
        </div>
      </div>

      {/* --- Simple chart box with axes --- */}
      <ChartBox
        width={640}
        height={320}
        margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
        data={history}
      />
    </div>
  );
}

/**
 * ChartBox
 * Renders an SVG chart frame with X/Y axes and ticks.
 * No data plotted yet—just the box & axes.
 */
type Margin = { top: number; right: number; bottom: number; left: number };

function ChartBox({
  width = 640,
  height = 320,
  margin = { top: 16, right: 16, bottom: 32, left: 40 },
  data,
}: {
  width?: number;
  height?: number;
  margin?: Margin;
  data?: number[];
}) {
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  // Simple linear ticks (you can adjust counts later)
  const xTickCount = 10;
  const yTickCount = 5;

  const xTicks = useMemo(
    () => Array.from({ length: xTickCount + 1 }, (_, i) => i / xTickCount),
    [xTickCount]
  );
  const yTicks = useMemo(
    () => Array.from({ length: yTickCount + 1 }, (_, i) => i / yTickCount),
    [yTickCount]
  );

  // Basic scales (0..1 for now — we’ll map real data later)
  const x = (t: number) => t * innerW;
  const y = (t: number) => innerH - t * innerH;

  const axisColor = "#888";
  const gridColor = "#eee";
  const font = {
    fontFamily: "system-ui, sans-serif",
    fontSize: 12 as const,
    fill: "#555",
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Simulation chart frame"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Plot area background (optional subtle) */}
        <rect width={innerW} height={innerH} fill="#fff" stroke="#ddd" />

        {/* Y grid lines + ticks + labels */}
        {yTicks.map((t, i) => {
          const yy = y(t);
          return (
            <g key={`y-${i}`} transform={`translate(0,${yy})`}>
              {/* grid line */}
              <line x1={0} x2={innerW} y1={0} y2={0} stroke={gridColor} />
              {/* tick mark on Y axis */}
              <line x1={0} x2={-6} y1={0} y2={0} stroke={axisColor} />
              {/* label */}
              <text x={-10} y={4} textAnchor="end" {...font}>
                {(t * 100).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* X grid lines + ticks + labels */}
        {xTicks.map((t, i) => {
          const xx = x(t);
          return (
            <g key={`x-${i}`} transform={`translate(${xx},0)`}>
              {/* grid line */}
              <line x1={0} x2={0} y1={0} y2={innerH} stroke={gridColor} />
              {/* tick mark on X axis (bottom) */}
              <line
                x1={0}
                x2={0}
                y1={innerH}
                y2={innerH + 6}
                stroke={axisColor}
              />
              {/* label under the axis */}
              <text x={0} y={innerH + 20} textAnchor="middle" {...font}>
                {(t * 10).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        {/* Y axis */}
        <line x1={0} x2={0} y1={0} y2={innerH} stroke={axisColor} />
        {/* X axis */}
        <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke={axisColor} />

        {/* Axis labels (placeholder) */}
        <text x={-margin.left + 10} y={-6} {...font}>
          Y
        </text>
        <text x={innerW} y={innerH + 28} textAnchor="end" {...font}>
          X
        </text>

        {/* Plot line if data present */}
        {data && data.length > 0 && (
          <g>
            {(() => {
              // map data values (range -1..1) to path coordinates
              const pts = data.map((v, i) => {
                const xPos = (i / Math.max(1, data.length - 1)) * innerW;
                // v in [-1,1] -> t in [0,1] where 1 -> top
                const t = 1 - (v + 1) / 2;
                const yPos = t * innerH;
                return [xPos, yPos];
              });
              const d = pts
                .map(
                  ([px, py], i) =>
                    `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`
                )
                .join(" ");
              return (
                <>
                  <path d={d} fill="none" stroke="#1976d2" strokeWidth={2} />
                </>
              );
            })()}
          </g>
        )}
      </g>
    </svg>
  );
}
