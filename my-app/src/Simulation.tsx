import { useEffect, useMemo, useState } from "react";

export default function Simulation() {
  // timer + pause
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);

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

      {/* --- Simple chart box with axes --- */}
      <ChartBox
        width={640}
        height={320}
        margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
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
}: {
  width?: number;
  height?: number;
  margin?: Margin;
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
      </g>
    </svg>
  );
}
