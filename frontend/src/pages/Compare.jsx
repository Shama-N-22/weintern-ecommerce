import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../services/productService";
import ScoreRing from "../components/ScoreRing";
import AccordionCard from "../components/AccordionCard";
import RadarChart from "../components/RadarChart";
import ScatterChart from "../components/ScatterChart";
import BenchmarkArena from "../components/BenchmarkArena";
import { generateSpecs, overallScores, tagsFor, benchmarksFor } from "../components/compareSpecs";

const USAGE_TYPES = ["Coding", "Gaming", "Video Editing", "Netflix", "Browsing", "AI Training"];
const USAGE_DRAIN = { Coding: 1, Browsing: 0.8, Netflix: 1.1, Gaming: 1.9, "Video Editing": 1.7, "AI Training": 2.2 };

const PERSONAS = [
  { icon: "🎮", label: "Gamer" },
  { icon: "🎓", label: "College Student" },
  { icon: "💻", label: "Software Developer" },
  { icon: "🎨", label: "Content Creator" },
  { icon: "💼", label: "Business User" },
  { icon: "✈️", label: "Traveller" },
];

const PERSONA_WEIGHTS = {
  Gamer: (s) => s.gpu * 1.5 + s.cpu,
  "College Student": (s) => s.value * 1.5 + s.battery,
  "Software Developer": (s) => s.cpu * 1.5 + s.build,
  "Content Creator": (s) => s.cpu + s.gpu + s.display,
  "Business User": (s) => s.build + s.battery + s.value,
  Traveller: (s) => s.battery * 1.8,
};

function Compare() {
  const compareIds = JSON.parse(localStorage.getItem("compareItems")) || [];
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const items = products.filter((p) => compareIds.includes(p.id));

  const [diffOnly, setDiffOnly] = useState(false);
  const [usage, setUsage] = useState("Browsing");
  const [ownYears, setOwnYears] = useState(2);
  const [expandedBenchmarks, setExpandedBenchmarks] = useState(false);

  const specsList = useMemo(() => items.map((i) => generateSpecs(i)), [items]);
  const scoresList = useMemo(() => items.map((i) => overallScores(i)), [items]);
  const benchmarksList = useMemo(() => items.map((i) => benchmarksFor(i)), [items]);

  const clearCompare = () => {
    localStorage.removeItem("compareItems");
    window.location.reload();
  };

  if (loadingProducts) {
    return (
      <div className="page-container">
        <h1>Compare Products</h1>
        <h2 className="empty-state">Loading products…</h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1>Compare Products</h1>
        <h2 className="empty-state">
          No products selected yet — go to the Shop page and check "Compare" on a few items.
        </h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Go to Shop</Link>
      </div>
    );
  }

  const specKeys = Object.keys(specsList[0]);
  const visibleSpecKeys = diffOnly
    ? specKeys.filter((key) => new Set(specsList.map((s) => s[key].value)).size > 1)
    : specKeys;

  const winnerIndex = (key) => {
    let best = 0;
    specsList.forEach((s, i) => { if (s[key].score > specsList[best][key].score) best = i; });
    return best;
  };

  const categoryWinner = (metric) => {
    let best = 0;
    scoresList.forEach((s, i) => { if (s[metric] > scoresList[best][metric]) best = i; });
    return items[best].name;
  };

  const overallWinnerIndex = scoresList
    .map((s, i) => ({ i, total: s.cpu + s.gpu + s.battery + s.display + s.build + s.value }))
    .sort((a, b) => b.total - a.total)[0].i;

  const barMetrics = [
    { label: "Battery Life", key: "battery" },
    { label: "Gaming Performance", key: "gpu" },
    { label: "Productivity Score", key: "cpu" },
    { label: "Video Editing Score", key: "build" },
    { label: "AI Capability", key: "cpu" },
    { label: "Price-to-Performance", key: "value" },
  ];

  const maxBarValue = 100;

  const priceDiff = items.length >= 2 ? Math.abs(items[0].price - items[1].price) : 0;
  const perfDiff = items.length >= 2
    ? Math.round(((scoresList[overallWinnerIndex].cpu - scoresList[overallWinnerIndex === 0 ? 1 : 0].cpu) / (scoresList[overallWinnerIndex === 0 ? 1 : 0].cpu || 1)) * 100)
    : 0;

  const downloadComparison = () => {
    const lines = [
      "NEXTGEAR — Comparison Summary",
      "",
      ...items.map((item, i) => `${item.name} — ₹${item.price.toLocaleString("en-IN")} — Overall Score: ${Math.round(Object.values(scoresList[i]).reduce((a, b) => a + b, 0) / 6)}`),
      "",
      `Overall Winner: ${items[overallWinnerIndex].name}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nextgear-comparison.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <h1>Compare Products</h1>

      {/* Sticky summary ribbon */}
      <div className="compare-ribbon">
        <span>🏆 Overall: <strong>{items[overallWinnerIndex].name}</strong></span>
        <span>⚙️ Performance: <strong>{categoryWinner("cpu")}</strong></span>
        <span>🔋 Battery: <strong>{categoryWinner("battery")}</strong></span>
        <span>🖥️ Display: <strong>{categoryWinner("display")}</strong></span>
        <span>💰 Value: <strong>{categoryWinner("value")}</strong></span>
        <span>🎒 Portability: <strong>{categoryWinner("build")}</strong></span>
      </div>

      {/* Product cards */}
      <div className="compare-cards-grid">
        {items.map((item, i) => (
          <motion.div
            className="compare-product-card"
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {i === overallWinnerIndex && <span className="editors-choice-badge">Editor's Choice</span>}
            <img src={item.image} alt={item.name} className="compare-product-image" />
            <h2>{item.name}</h2>
            <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
            <span className="testimonial-stars" style={{ marginTop: 6 }}>
              {"★".repeat(4)}{"☆"}
            </span>
            <div className="compare-tags">
              {tagsFor(item).map((tag) => <span className="tech-chip" key={tag}>{tag}</span>)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spec table */}
      <div className="compare-table-toolbar">
        <h1 className="rail-title">Full Specification Comparison</h1>
        <label className="compare-check">
          <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
          Show differences only
        </label>
      </div>

      <div className="premium-compare-table-wrapper">
        <table className="premium-compare-table">
          <thead>
            <tr>
              <th>Specification</th>
              {items.map((item) => <th key={item.id}>{item.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {visibleSpecKeys.map((key) => {
              const win = items.length > 1 ? winnerIndex(key) : -1;
              return (
                <tr key={key}>
                  <td className="spec-label-cell">{specsList[0][key].icon} {specsList[0][key].label}</td>
                  {items.map((item, i) => (
                    <td key={item.id} className={win === i ? "spec-winner-cell" : ""}>
                      {specsList[i][key].value}
                      {win === i && items.length > 1 && <span className="winner-badge">Winner</span>}
                      {items.length > 1 && win !== i && <span className="spec-arrow-down">▼</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Radar chart */}
      {items.length > 1 && (
        <>
          <h1 className="rail-title" style={{ marginTop: 50 }}>Performance Radar</h1>
          <RadarChart items={items} scoresList={scoresList} />
        </>
      )}

      {/* Bar graphs */}
      <h1 className="rail-title" style={{ marginTop: 40 }}>Detailed Scores</h1>
      <div className="compare-chart">
        {barMetrics.map((metric) => (
          <div key={metric.label}>
            <span className="compare-bar-label" style={{ display: "block", marginBottom: 6 }}>{metric.label}</span>
            {items.map((item, i) => (
              <div className="compare-bar-row" key={item.id}>
                <span className="compare-bar-label">{item.name}</span>
                <div className="compare-bar-track">
                  <motion.div
                    className="compare-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${scoresList[i][metric.key]}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="compare-bar-value">{scoresList[i][metric.key]}/{maxBarValue}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* AI Verdict */}
      {items.length > 1 && (
        <div className="ai-verdict-card">
          <span className="section-eyebrow">AI Verdict</span>
          <p>
            <strong>{items[overallWinnerIndex].name}</strong> is the stronger overall pick — better{" "}
            {categoryWinner("cpu") === items[overallWinnerIndex].name ? "processing power" : "battery life"} and
            multitasking headroom, while <strong>{items[overallWinnerIndex === 0 ? 1 : 0].name}</strong> is worth
            considering if {categoryWinner("battery") === items[overallWinnerIndex === 0 ? 1 : 0].name ? "longer battery life" : "a lower price"} matters more to you.
          </p>
        </div>
      )}

      {/* Who Should Buy This */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Who Should Buy This?</h1>
      <div className="persona-grid">
        {PERSONAS.map((persona) => {
          const scores = scoresList.map((s) => PERSONA_WEIGHTS[persona.label](s));
          const bestIndex = scores.indexOf(Math.max(...scores));
          return (
            <div className="persona-card" key={persona.label}>
              <span className="why-icon">{persona.icon}</span>
              <h2>{persona.label}</h2>
              <span className="tech-chip">{items[bestIndex].name}</span>
              <span className="persona-badge">{items.length > 1 ? "Recommended" : "Best Choice"}</span>
            </div>
          );
        })}
      </div>

      {/* Scatter chart */}
      {items.length > 1 && (
        <>
          <h1 className="rail-title" style={{ marginTop: 50 }}>Price vs Performance</h1>
          <ScatterChart
            items={items}
            scoresList={scoresList.map((s) => ({ value: Math.round((s.cpu + s.gpu) / 2) }))}
          />
        </>
      )}

      {/* Battery simulator */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Battery Simulator</h1>
      <div className="filter-bar">
        {USAGE_TYPES.map((u) => (
          <button key={u} className={`filter-chip ${usage === u ? "active" : ""}`} onClick={() => setUsage(u)}>{u}</button>
        ))}
      </div>
      <div className="perf-dashboard-grid" style={{ marginTop: 14 }}>
        {items.map((item, i) => (
          <div className="perf-stat" key={item.id}>
            <span>{Math.max(1, Math.round((scoresList[i].battery / 10) / USAGE_DRAIN[usage]))}h</span>
            <label>{item.name} under {usage}</label>
          </div>
        ))}
      </div>

      {/* Temperature & noise */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Temperature & Noise Simulation</h1>
      <div className="thermal-grid">
        {items.map((item, i) => (
          <div className="thermal-card" key={item.id}>
            <h2>{item.name}</h2>
            {["Idle", "Medium Load", "Heavy Load"].map((load, li) => (
              <div className="thermal-row" key={load}>
                <span>{li === 2 ? "🌀" : li === 1 ? "🌬️" : "❄️"} {load}</span>
                <span>{35 + li * 15 + Math.round((100 - scoresList[i].build) / 8)}°C</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Future proof score */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Future Proof Score</h1>
      <div className="score-rings-grid">
        {items.map((item, i) => (
          <ScoreRing
            key={item.id}
            value={Math.round((scoresList[i].cpu + scoresList[i].gpu + scoresList[i].value) / 3)}
            label={item.name}
            size={100}
          />
        ))}
      </div>

      {/* Upgrade recommendation */}
      {items.length > 1 && priceDiff > 0 && priceDiff < 15000 && (
        <div className="upgrade-card" style={{ marginTop: 30 }}>
          <h2>Upgrade Recommendation</h2>
          <p>
            For ₹{priceDiff.toLocaleString("en-IN")} more, you gain roughly {Math.abs(perfDiff)}% higher
            performance with the {items[overallWinnerIndex].name}. Recommended upgrade.
          </p>
        </div>
      )}

      {/* Real size compare */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Compare in Real Size</h1>
      <div className="real-size-grid">
        {items.map((item) => {
          const scale = item.category === "Phones" ? 0.5 : item.category === "Laptops" ? 1 : 0.8;
          return (
            <div className="real-size-item" key={item.id}>
              <div
                className="real-size-box"
                style={{ width: `${140 * scale}px`, height: `${90 * scale + 40}px` }}
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
      <p className="lab-note">Illustrative footprint comparison, not exact manufacturer dimensions.</p>

      {/* Daily cost calculator */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Daily Cost Calculator</h1>
      <div className="lab-row" style={{ maxWidth: 320 }}>
        <label>Years of use: {ownYears}</label>
        <input type="range" min="1" max="6" value={ownYears} onChange={(e) => setOwnYears(Number(e.target.value))} />
      </div>
      <div className="perf-dashboard-grid" style={{ marginTop: 14 }}>
        {items.map((item) => (
          <div className="perf-stat" key={item.id}>
            <span>₹{Math.round(item.price / (ownYears * 365))}</span>
            <label>{item.name} per day</label>
          </div>
        ))}
      </div>

      {/* Benchmarks */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Benchmark Scores</h1>
      <div className="accordion-list">
        <AccordionCard icon="🧮" title="Cinebench Score">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].cinebench} pts`).join(" · ")}
        </AccordionCard>
        <AccordionCard icon="📊" title="Geekbench Score">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].geekbench} pts`).join(" · ")}
        </AccordionCard>
        <AccordionCard icon="🎮" title="Gaming FPS Estimate">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].fps} fps`).join(" · ")}
        </AccordionCard>
        <AccordionCard icon="🎬" title="Blender Render Time">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].blenderMinutes} min`).join(" · ")}
        </AccordionCard>
        <AccordionCard icon="🖌️" title="Photoshop Performance">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].photoshop}/100`).join(" · ")}
        </AccordionCard>
        <AccordionCard icon="🤖" title="AI Benchmark Score">
          {items.map((item, i) => `${item.name}: ${benchmarksList[i].aiScore}/100`).join(" · ")}
        </AccordionCard>
      </div>

      {/* Community choice */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Community Choice</h1>
      <div className="community-grid">
        {items.map((item, i) => (
          <div className="community-card" key={item.id}>
            <h2>{item.name}</h2>
            <p>{85 + (i === overallWinnerIndex ? 10 : 0)}% of buyers recommend this product</p>
            <p style={{ color: "var(--success)" }}>Most loved: {tagsFor(item)[0] || "Build quality"}</p>
            <p style={{ color: "var(--text-muted)" }}>Common complaint: Charger sold separately</p>
          </div>
        ))}
      </div>

      {/* Frequently bought together */}
      <h1 className="rail-title" style={{ marginTop: 50 }}>Frequently Bought Together</h1>
      <div className="product-rail">
        {products.filter((p) => p.category === "Accessories").slice(0, 4).map((item) => (
          <div className="rail-item" key={item.id}>
            <div className="product-card">
              <img src={item.image} alt={item.name} className="product-image" />
              <h2>{item.name}</h2>
              <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Benchmark Arena */}
      {items.length > 1 && (
        <div style={{ marginTop: 50 }}>
          <BenchmarkArena items={items} scoresList={scoresList} benchmarksList={benchmarksList} />
        </div>
      )}

      {/* Export actions */}
      <div className="advisor-actions-bar" style={{ marginTop: 50 }}>
        <button className="btn btn-outline" onClick={downloadComparison}>📄 Download Comparison</button>
        <button
          className="btn btn-outline"
          onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied (page URL — real shareable comparison links need a backend to store the selection)."); }}
        >
          🔗 Copy Link
        </button>
      </div>

      <button className="btn btn-outline" style={{ marginTop: 32 }} onClick={clearCompare}>
        Clear comparison
      </button>
    </div>
  );
}

export default Compare;
