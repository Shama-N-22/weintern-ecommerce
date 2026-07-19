import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function BattleRow({ label, items, values, unit = "%", maxValue = 100 }) {
  return (
    <div className="arena-row">
      <span className="arena-row-label">{label}</span>
      {items.map((item, i) => (
        <div className="arena-bar-line" key={item.id}>
          <span className="arena-bar-name">{item.name}</span>
          <div className="arena-bar-track">
            <motion.div
              className="arena-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(values[i] / maxValue) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
            />
          </div>
          <span className="arena-bar-value">{values[i]}{unit}</span>
        </div>
      ))}
    </div>
  );
}

function BenchmarkArena({ items, scoresList, benchmarksList }) {
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTrophy(true), 1600);
    return () => clearTimeout(timer);
  }, [items]);

  const overallIndex = scoresList
    .map((s, i) => ({ i, total: s.cpu + s.gpu + s.battery + s.display + s.build + s.value }))
    .sort((a, b) => b.total - a.total)[0].i;

  const winner = items[overallIndex];
  const winnerTotal = scoresList[overallIndex].cpu + scoresList[overallIndex].gpu;
  const runnerUpIndex = overallIndex === 0 ? 1 : 0;
  const runnerUpTotal = scoresList[runnerUpIndex] ? scoresList[runnerUpIndex].cpu + scoresList[runnerUpIndex].gpu : winnerTotal;
  const advantage = runnerUpTotal > 0 ? Math.round(((winnerTotal - runnerUpTotal) / runnerUpTotal) * 100) : 0;

  return (
    <div className="benchmark-arena">
      <span className="section-eyebrow">⚡ Benchmark Arena</span>

      <BattleRow label="CPU Battle" items={items} values={scoresList.map((s) => s.cpu)} />
      <BattleRow label="GPU Battle" items={items} values={scoresList.map((s) => s.gpu)} />
      <BattleRow label="Battery" items={items} values={benchmarksList.map((b, i) => scoresList[i].battery)} unit="%" />

      {showTrophy && (
        <motion.div
          className="arena-winner"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="arena-trophy">🏆</span>
          <div>
            <h3>Overall Winner: {winner.name}</h3>
            {advantage > 0 && <p>Performance Advantage: +{advantage}%</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default BenchmarkArena;
