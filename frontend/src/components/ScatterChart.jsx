import { useState } from "react";

const COLORS = ["#e5484d", "#00d084", "#f5a524"];

function ScatterChart({ items, scoresList, width = 480, height = 260 }) {
  const [hovered, setHovered] = useState(null);
  const maxPrice = Math.max(...items.map((i) => i.price));
  const padding = 40;

  return (
    <div className="scatter-chart-wrapper">
      <svg width={width} height={height}>
        <line x1={padding} y1={height - padding} x2={width - 10} y2={height - padding} stroke="var(--border)" />
        <line x1={padding} y1={10} x2={padding} y2={height - padding} stroke="var(--border)" />
        <text x={width / 2} y={height - 8} fontSize="10" fill="var(--text-muted)" textAnchor="middle">Price →</text>
        <text x={12} y={height / 2} fontSize="10" fill="var(--text-muted)" transform={`rotate(-90 12 ${height / 2})`} textAnchor="middle">Performance →</text>

        {items.map((item, i) => {
          const x = padding + (item.price / maxPrice) * (width - padding - 30);
          const perf = scoresList[i].value;
          const y = height - padding - (perf / 100) * (height - padding - 20);
          return (
            <g key={item.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy={y} r={hovered === i ? 9 : 6} fill={COLORS[i]} style={{ transition: "r 0.2s ease" }} />
              {hovered === i && (
                <text x={x} y={y - 14} fontSize="10" fill="var(--text-h)" textAnchor="middle">
                  {item.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default ScatterChart;
