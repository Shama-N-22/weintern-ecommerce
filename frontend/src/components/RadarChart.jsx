const AXES = [
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "battery", label: "Battery" },
  { key: "display", label: "Display" },
  { key: "build", label: "Build" },
  { key: "value", label: "Value" },
];

const COLORS = ["#e5484d", "#00d084", "#f5a524"];

function pointOnAxis(index, total, value, size) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / 100) * (size / 2 - 20);
  return {
    x: size / 2 + radius * Math.cos(angle),
    y: size / 2 + radius * Math.sin(angle),
  };
}

function RadarChart({ items, scoresList, size = 280 }) {
  const rings = [25, 50, 75, 100];

  return (
    <div className="radar-chart-wrapper">
      <svg width={size} height={size}>
        {rings.map((r) => (
          <polygon
            key={r}
            points={AXES.map((_, i) => {
              const p = pointOnAxis(i, AXES.length, r, size);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        {AXES.map((axis, i) => {
          const p = pointOnAxis(i, AXES.length, 100, size);
          return (
            <line
              key={axis.key}
              x1={size / 2} y1={size / 2} x2={p.x} y2={p.y}
              stroke="var(--border)" strokeWidth="1"
            />
          );
        })}

        {scoresList.map((scores, si) => (
          <polygon
            key={si}
            points={AXES.map((axis, i) => {
              const p = pointOnAxis(i, AXES.length, scores[axis.key], size);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill={COLORS[si]}
            fillOpacity="0.15"
            stroke={COLORS[si]}
            strokeWidth="2"
            style={{ transition: "all 0.6s ease" }}
          />
        ))}

        {AXES.map((axis, i) => {
          const p = pointOnAxis(i, AXES.length, 112, size);
          return (
            <text
              key={axis.key}
              x={p.x} y={p.y}
              textAnchor="middle"
              fontSize="11"
              fill="var(--text-muted)"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>

      <div className="radar-legend">
        {items.map((item, i) => (
          <span key={item.id} className="radar-legend-item">
            <span className="radar-legend-dot" style={{ background: COLORS[i] }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RadarChart;
