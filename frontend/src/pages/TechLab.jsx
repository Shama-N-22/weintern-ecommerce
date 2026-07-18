import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import products from "../data/products";
import ScoreRing from "../components/ScoreRing";
import BuildAnimation from "../components/BuildAnimation";
import { playSelectSound, playSuccessSound } from "../components/soundEffects";

const TABS = ["Dream Setup", "FPS Estimator", "Laptop Finder", "Personality Quiz"];

/* ============================================================
   Shared fun facts + community builds (static/illustrative)
   ============================================================ */
const aiFunFacts = [
  "Pairing a lightweight laptop with heavy peripherals can add more travel weight than you'd expect.",
  "SSDs have no moving parts, which is why they survive drops far better than old hard drives.",
  "A 165Hz monitor only helps if your GPU can actually push that many frames — pairing matters.",
  "Mechanical keyboards typically outlast membrane ones by 3-5x in keystroke lifespan.",
  "Battery health degrades faster with heat, not just charge cycles — cooling matters for laptops too.",
];

const communityBuilds = [
  { name: "Aditya's Creator Rig", desc: "AeroBook Studio 15 + HaloView 32\" + SonicWave Studio Pro", likes: 128, tag: "Creator's Choice" },
  { name: "Meera's Campus Setup", desc: "SlimEdge Go 12 + OrbitBuds + Vortex Compact Keyboard", likes: 94, tag: "Best for Students" },
  { name: "Rohan's Battlestation", desc: "TitanForce 16 + HaloView 27\" 165Hz + Vortex Mechanical", likes: 210, tag: "Gaming Beast" },
];

const SETUP_CATEGORIES = ["Laptops", "Phones", "Audio", "Accessories", "Displays", "Wearables"];

const MOODS = [
  { id: "minimal", label: "Minimal Workspace", bg: "linear-gradient(135deg, #111 0%, #1b1b1b 100%)" },
  { id: "gaming", label: "RGB Gaming Room", bg: "linear-gradient(135deg, #1a0a0c 0%, #2a0f13 100%)" },
  { id: "office", label: "Professional Office", bg: "linear-gradient(135deg, #14161a 0%, #1e2126 100%)" },
  { id: "creator", label: "Creator Studio", bg: "linear-gradient(135deg, #16110d 0%, #241a12 100%)" },
  { id: "luxury", label: "Dark Luxury Desk", bg: "linear-gradient(135deg, #0d0505 0%, #22090c 100%)" },
];

const WHY_EXPLANATIONS = {
  Laptops: "Picked based on a balance of performance-per-rupee and battery life for everyday + demanding tasks.",
  Phones: "Chosen for camera quality and battery life relative to price in this range.",
  Audio: "Selected for comfort during long sessions and reliable wireless range.",
  Accessories: "Picked for build quality and compatibility with the rest of your setup.",
  Displays: "Chosen for refresh rate and color accuracy suited to your likely use case.",
  Wearables: "Selected for battery life and accurate sensors at this price point.",
};

/* ============================================================
   Heuristic "AI" scoring — rule-based, not a trained model.
   Transparent about that in the UI copy.
   ============================================================ */
function computeScores(selection) {
  const items = Object.values(selection).filter(Boolean);
  if (items.length === 0) {
    return { Performance: 0, Productivity: 0, Gaming: 0, "AI/ML Dev": 0, "Battery Life": 0, Portability: 0, Upgradeability: 0, "Value for Money": 0, Overall: 0 };
  }
  const avgPrice = items.reduce((s, i) => s + i.price, 0) / items.length;
  const hasLaptop = !!selection.Laptops;
  const hasDisplay = !!selection.Displays;
  const hasAudio = !!selection.Audio;
  const priceScore = Math.min(100, Math.round((avgPrice / 60000) * 60 + 20));

  const scores = {
    Performance: Math.min(100, priceScore + (hasDisplay ? 10 : 0)),
    Productivity: Math.min(100, priceScore + (hasLaptop ? 15 : 0)),
    Gaming: Math.min(100, priceScore + (hasDisplay ? 15 : 0) - (hasLaptop && selection.Laptops.price < 70000 ? 10 : 0)),
    "AI/ML Dev": Math.min(100, hasLaptop ? Math.min(100, priceScore + 5) : 30),
    "Battery Life": hasLaptop ? Math.max(30, 100 - Math.round(selection.Laptops.price / 2000)) : 50,
    Portability: hasLaptop ? Math.max(20, 100 - Math.round(selection.Laptops.price / 1500)) : 50,
    Upgradeability: hasDisplay || hasAudio ? 70 : 55,
    "Value for Money": Math.max(35, 100 - Math.round(avgPrice / 2000)),
  };
  const overall = Math.round(Object.values(scores).reduce((s, v) => s + v, 0) / Object.keys(scores).length);
  return { ...scores, Overall: overall };
}

function estimatePower(selection) {
  const WATTAGE = { Laptops: 65, Phones: 10, Audio: 5, Accessories: 8, Displays: 40, Wearables: 2 };
  let watts = 0;
  Object.keys(selection).forEach((cat) => {
    if (selection[cat]) watts += WATTAGE[cat] || 10;
  });
  const hoursPerDay = 6;
  const kwhPerYear = (watts * hoursPerDay * 365) / 1000;
  const costPerYear = Math.round(kwhPerYear * 8); // approx ₹8/unit
  return { watts, costPerYear };
}

function badgeFor(item) {
  if (!item) return null;
  if (item.price > 100000) return "Editor's Pick";
  if (item.price < 30000) return "Best Value";
  if (item.category === "Laptops" && item.name.includes("Titan")) return "Gaming Beast";
  if (item.category === "Laptops") return "Creator's Choice";
  if (item.category === "Displays") return "AI Optimized";
  return "Best for Students";
}

/* ============================================================
   Custom dropdown with thumbnail + price shown in the menu
   ============================================================ */
function ProductDropdown({ category, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="product-dropdown" ref={ref}>
      <span className="dropdown-label">{category}</span>
      <button type="button" className={`dropdown-trigger ${open ? "dropdown-trigger-open" : ""}`} onClick={() => setOpen((p) => !p)}>
        {selected ? (
          <span className="dropdown-selected-preview">
            <img src={selected.image} alt="" />
            {selected.name} — ₹{selected.price.toLocaleString("en-IN")}
          </span>
        ) : (
          "— choose —"
        )}
        <span className="dropdown-arrow">▾</span>
      </button>
      {open && (
        <div className="dropdown-menu product-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`dropdown-option product-dropdown-option ${selected?.id === opt.id ? "dropdown-option-active" : ""}`}
              onClick={() => { onSelect(opt); setOpen(false); }}
            >
              <img src={opt.image} alt="" />
              <div>
                <div>{opt.name}</div>
                <span className="product-dropdown-price">₹{opt.price.toLocaleString("en-IN")} · ★{(4 + (opt.id % 10) / 10).toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Dream Setup — the full AI Advisor experience
   ============================================================ */
function DreamSetupAdvisor() {
  const [selection, setSelection] = useState({});
  const [budget, setBudget] = useState(150000);
  const [mood, setMood] = useState(MOODS[0]);
  const [soundOn, setSoundOn] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const [popover, setPopover] = useState(null);
  const [whyCategory, setWhyCategory] = useState(null);
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);
  const [setupId, setSetupId] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  const optionsByCategory = useMemo(() => {
    const map = {};
    SETUP_CATEGORIES.forEach((cat) => { map[cat] = products.filter((p) => p.category === cat); });
    return map;
  }, []);

  const total = Object.values(selection).reduce((sum, item) => sum + (item ? item.price : 0), 0);
  const filledCount = Object.values(selection).filter(Boolean).length;
  const confidence = Math.round((filledCount / SETUP_CATEGORIES.length) * 100);
  const scores = computeScores(selection);
  const power = estimatePower(selection);
  const budgetPct = Math.min(100, Math.round((total / budget) * 100));

  let budgetStatus = "Not started";
  if (total > 0) {
    if (budgetPct < 70) budgetStatus = "Excellent Balance";
    else if (budgetPct <= 100) budgetStatus = "Slightly Over Budget".replace("Slightly Over", budgetPct <= 100 ? "On" : "Over") ;
    else budgetStatus = "Premium Configuration";
  }
  if (total > 0 && budgetPct > 100) budgetStatus = "Premium Configuration";
  else if (total > 0 && budgetPct >= 85) budgetStatus = "Slightly Over Budget";
  else if (total > 0) budgetStatus = "Excellent Balance";

  const pick = (category, product) => {
    setSelection((prev) => ({ ...prev, [category]: product }));
    setFactIndex((i) => (i + 1) % aiFunFacts.length);
    if (soundOn) playSelectSound();
  };

  const removeItem = (category) => {
    setSelection((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
    setPopover(null);
  };

  const randomSetup = () => {
    const random = {};
    SETUP_CATEGORIES.forEach((cat) => {
      const opts = optionsByCategory[cat];
      random[cat] = opts[Math.floor(Math.random() * opts.length)];
    });
    setSelection(random);
    if (soundOn) playSelectSound();
  };

  const handleBuild = () => {
    setBuilding(true);
    setBuilt(false);
  };

  const onBuildDone = () => {
    setBuilding(false);
    setBuilt(true);
    setSetupId(`NG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    if (soundOn) playSuccessSound();
  };

  const addAllToCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const additions = Object.values(selection).filter(Boolean).map((item) => ({
      ...item, color: item.colors ? item.colors[0] : undefined, quantity: 1,
    }));
    localStorage.setItem("cartItems", JSON.stringify([...savedCart, ...additions]));
    alert("Entire setup added to cart!");
  };

  const addAllToWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const additions = Object.values(selection).filter(Boolean);
    const merged = [...savedWishlist, ...additions.filter((a) => !savedWishlist.some((w) => w.id === a.id))];
    localStorage.setItem("wishlistItems", JSON.stringify(merged));
    setWishlisted(true);
  };

  const downloadQuotation = () => {
    const lines = [
      "NEXTGEAR — Dream Setup Quotation",
      setupId ? `Setup ID: ${setupId}` : "",
      "",
      ...Object.entries(selection).map(([cat, item]) => item ? `${cat}: ${item.name} — ₹${item.price.toLocaleString("en-IN")}` : ""),
      "",
      `Total: ₹${total.toLocaleString("en-IN")}`,
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nextgear-setup-${setupId || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // AI assistant messages — rule-based, illustrative
  const aiMessages = [];
  if (selection.Laptops && selection.Laptops.price < 75000 && selection.Accessories?.name.includes("Mechanical")) {
    aiMessages.push(`I noticed you picked a lightweight laptop but a full mechanical keyboard. If portability matters, consider a compact 60% board instead — similar feel, less desk space and travel bulk.`);
  }
  if (selection.Laptops && !selection.Displays) {
    aiMessages.push(`Your laptop alone can work, but pairing it with an external display noticeably improves multitasking for under ₹20,000.`);
  }
  if (total > budget) {
    aiMessages.push(`This setup is ₹${(total - budget).toLocaleString("en-IN")} over your budget — consider swapping the Accessories pick for a lower-tier option to rebalance.`);
  }
  if (filledCount >= 4 && total < budget * 0.6) {
    aiMessages.push(`You've got budget headroom — upgrading your Laptops pick would give the biggest overall performance jump.`);
  }
  if (aiMessages.length === 0 && filledCount > 0) {
    aiMessages.push(`This is a solid, balanced setup for the categories you've picked so far — keep going to see your full compatibility score.`);
  }

  // Future upgrade suggestion — pick the cheapest filled category to "upgrade"
  const upgradeSuggestion = useMemo(() => {
    const filled = Object.entries(selection).filter(([, v]) => v);
    if (filled.length === 0) return null;
    const [cat, current] = filled.sort((a, b) => a[1].price - b[1].price)[0];
    const better = optionsByCategory[cat].filter((p) => p.price > current.price).sort((a, b) => a.price - b.price)[0];
    if (!better) return null;
    return { cat, current, better, delta: better.price - current.price };
  }, [selection, optionsByCategory]);

  return (
    <div className="advisor-layout">
      {building && <BuildAnimation onDone={onBuildDone} />}

      <div className="advisor-main">
        {/* Dropdown pickers */}
        <div className="advisor-pickers">
          {SETUP_CATEGORIES.map((cat) => (
            <ProductDropdown
              key={cat}
              category={cat}
              options={optionsByCategory[cat]}
              selected={selection[cat]}
              onSelect={(p) => pick(cat, p)}
            />
          ))}
        </div>

        <div className="advisor-toolbar">
          <button className="btn btn-outline" onClick={randomSetup}>🎲 Random Dream Setup</button>
          <button className="btn btn-primary" onClick={handleBuild} disabled={filledCount === 0}>
            Build Setup
          </button>
          <label className="sound-toggle">
            <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} />
            Sound {soundOn ? "on" : "off"}
          </label>
        </div>

        {/* Desk preview */}
        <div className="desk-scene-wrapper" style={{ background: mood.bg }}>
          <div className="desk-scene">
            <div className="desk-surface">
              {SETUP_CATEGORIES.map((cat, i) => (
                <AnimatePresence key={cat} mode="wait">
                  {selection[cat] ? (
                    <motion.div
                      key={selection[cat].id}
                      className={`desk-item desk-item-${i}`}
                      style={{ backgroundImage: `url(${selection[cat].image})` }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.35 }}
                      onClick={() => setPopover({ cat, item: selection[cat] })}
                      title={selection[cat].name}
                    >
                      {badgeFor(selection[cat]) && (
                        <span className="desk-item-badge">{badgeFor(selection[cat])}</span>
                      )}
                    </motion.div>
                  ) : (
                    <div className={`desk-item desk-item-${i} desk-item-empty`} key={`empty-${cat}`}>
                      {cat}
                    </div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>

          <div className="mood-selector">
            {MOODS.map((m) => (
              <button
                key={m.id}
                className={`filter-chip ${mood.id === m.id ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item popover */}
        {popover && (
          <div className="item-popover">
            <img src={popover.item.image} alt={popover.item.name} />
            <div>
              <h3>{popover.item.name}</h3>
              <span className="price-tag">₹{popover.item.price.toLocaleString("en-IN")}</span>
              <div className="item-popover-actions">
                <button className="btn btn-outline" onClick={() => setWhyCategory(popover.cat)}>Why this?</button>
                <button className="btn btn-danger" onClick={() => removeItem(popover.cat)}>Remove</button>
                <button className="btn btn-outline" onClick={() => setPopover(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant */}
        <div className="ai-assistant-panel">
          <span className="section-eyebrow">NextGear AI</span>
          {aiMessages.map((msg, i) => (
            <p key={i} className="ai-message">"{msg}"</p>
          ))}
        </div>

        {/* AI Fun Fact */}
        <div className="fun-card" style={{ marginTop: 20 }}>
          <span className="fun-label">AI Fun Fact</span>
          <p>{aiFunFacts[factIndex]}</p>
        </div>

        {/* Compatibility scores */}
        <h1 className="rail-title" style={{ marginTop: 40 }}>AI Compatibility Score</h1>
        <div className="score-rings-grid">
          {Object.entries(scores).map(([label, value]) => (
            <ScoreRing key={label} value={value} label={label} />
          ))}
        </div>

        {/* Budget health */}
        <div className="budget-health-card">
          <ScoreRing value={Math.min(100, budgetPct)} size={100} />
          <div>
            <h2>Budget Health</h2>
            <p>{budgetStatus} — ₹{total.toLocaleString("en-IN")} of ₹{budget.toLocaleString("en-IN")}</p>
            <input
              type="range" min="30000" max="300000" step="10000"
              value={budget} onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Performance dashboard */}
        <h1 className="rail-title" style={{ marginTop: 40 }}>Live Performance Dashboard</h1>
        <p className="lab-note">Estimates based on your picks — for fun, not a lab benchmark.</p>
        <div className="perf-dashboard-grid">
          <div className="perf-stat"><span>{Math.round(scores.Gaming * 0.9)}</span><label>Est. FPS (popular titles)</label></div>
          <div className="perf-stat"><span>{scores.Productivity}%</span><label>Coding / multitasking</label></div>
          <div className="perf-stat"><span>{scores["AI/ML Dev"]}%</span><label>AI model training</label></div>
          <div className="perf-stat"><span>{Math.round(scores["Battery Life"] / 10)}h</span><label>Battery estimate</label></div>
        </div>

        {/* Power consumption */}
        <div className="power-card">
          <span>⚡ {power.watts}W estimated draw</span>
          <span>≈ ₹{power.costPerYear.toLocaleString("en-IN")}/year running 6h/day</span>
        </div>

        {/* Upgrade suggestion */}
        {upgradeSuggestion && (
          <div className="upgrade-card">
            <h2>Future Upgrade Suggestion</h2>
            <p>
              Upgrading your <strong>{upgradeSuggestion.cat}</strong> pick from{" "}
              {upgradeSuggestion.current.name} to {upgradeSuggestion.better.name} would give the
              biggest performance jump — for +₹{upgradeSuggestion.delta.toLocaleString("en-IN")}.
            </p>
          </div>
        )}

        {/* Reality check — shown after Build Setup completes */}
        {built && (
          <div className="reality-check-card">
            <h2>🏆 Reality Check</h2>
            <ul>
              <li>💰 Expected lifespan: 5–6 years</li>
              <li>🔋 Battery life: ~{Math.round(scores["Battery Life"] / 10)} hours</li>
              <li>🎮 Runs demanding games: Estimated {Math.round(scores.Gaming * 0.95)} FPS</li>
              <li>🤖 Can train AI models: {scores["AI/ML Dev"] > 60 ? "Yes (Medium-High)" : "Entry level only"}</li>
              <li>🎓 Best for: students, developers, and creators</li>
              <li>🔄 Recommended upgrade after: 2 years</li>
              <li>♻️ Power efficiency: {power.watts < 100 ? "Excellent" : "Good"}</li>
              <li>🏆 Overall AI Confidence: {confidence}%</li>
            </ul>
          </div>
        )}

        {/* Completion celebration */}
        {built && filledCount === SETUP_CATEGORIES.length && (
          <motion.div
            className="completion-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>🎉 Your Dream Setup is Ready</h2>
            <p>AI Rating: {confidence}% · Total Cost: ₹{total.toLocaleString("en-IN")}</p>
            <div className="completion-actions">
              <button className="btn btn-primary" onClick={addAllToCart}>Add Entire Setup to Cart</button>
              <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </motion.div>
        )}

        {/* Save / Share / Wishlist / Export */}
        {filledCount > 0 && (
          <div className="advisor-actions-bar">
            <button className="btn btn-outline" onClick={downloadQuotation}>📄 Download Quotation</button>
            <button className="btn btn-outline" onClick={addAllToWishlist}>
              {wishlisted ? "♥ Saved to Wishlist" : "♡ Save Entire Setup"}
            </button>
            {setupId && <span className="setup-id-tag">Setup ID: {setupId}</span>}
          </div>
        )}

        {/* Community builds */}
        <h1 className="rail-title" style={{ marginTop: 50 }}>Community Builds</h1>
        <p className="lab-note">Illustrative examples for now — real shared builds need user accounts wired in.</p>
        <div className="community-grid">
          {communityBuilds.map((b) => (
            <div className="community-card" key={b.name}>
              <span className="tech-chip" style={{ marginBottom: 10 }}>{b.tag}</span>
              <h2>{b.name}</h2>
              <p>{b.desc}</p>
              <span className="community-likes">♥ {b.likes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating sticky summary panel */}
      <div className="advisor-sticky-summary">
        <h3>Setup Summary</h3>
        <p>Total: ₹{total.toLocaleString("en-IN")}</p>
        <p>AI Score: {scores.Overall}/100</p>
        <p>Selected: {filledCount}/{SETUP_CATEGORIES.length}</p>
        <p>Confidence: {confidence}%</p>
        <p>Budget: {budgetStatus}</p>
        <div className="advisor-sticky-actions">
          <button className="btn btn-outline" onClick={downloadQuotation}>Export</button>
          <button className="btn btn-outline" onClick={addAllToWishlist}>Save</button>
        </div>
      </div>

      {/* Why this recommendation modal */}
      {whyCategory && (
        <div className="modal-backdrop" onClick={() => setWhyCategory(null)}>
          <div className="modal-panel why-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setWhyCategory(null)}>✕</button>
            <div className="modal-body">
              <h2>Why this recommendation?</h2>
              <p className="modal-desc">{WHY_EXPLANATIONS[whyCategory]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FPS Estimator (unchanged logic, lightly polished)
   ============================================================ */
const GPU_SCORE = { Entry: 30, Mid: 60, High: 100, Enthusiast: 150 };
const CPU_SCORE = { Entry: 20, Mid: 40, High: 65 };
const GAME_DIVISOR = { "Esports (1080p)": 1, "AAA (1080p)": 2, "AAA (4K)": 4.2 };

function FpsEstimator() {
  const [gpu, setGpu] = useState("Mid");
  const [cpu, setCpu] = useState("Mid");
  const [game, setGame] = useState("AAA (1080p)");
  const fps = Math.round(((GPU_SCORE[gpu] + CPU_SCORE[cpu]) * 3) / GAME_DIVISOR[game]);

  return (
    <motion.div className="lab-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2>Estimate your gaming FPS</h2>
      <p className="lab-note">A rough, fun estimate based on general tiers — not a real benchmark.</p>
      <div className="lab-row">
        <label>GPU tier</label>
        <select value={gpu} onChange={(e) => setGpu(e.target.value)}>
          {Object.keys(GPU_SCORE).map((tier) => <option key={tier}>{tier}</option>)}
        </select>
      </div>
      <div className="lab-row">
        <label>CPU tier</label>
        <select value={cpu} onChange={(e) => setCpu(e.target.value)}>
          {Object.keys(CPU_SCORE).map((tier) => <option key={tier}>{tier}</option>)}
        </select>
      </div>
      <div className="lab-row">
        <label>Game preset</label>
        <select value={game} onChange={(e) => setGame(e.target.value)}>
          {Object.keys(GAME_DIVISOR).map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="lab-result">
        <span className="lab-result-number">{fps}</span>
        <span className="lab-result-label">estimated FPS</span>
      </div>
    </motion.div>
  );
}

function LaptopFinder() {
  const [budget, setBudget] = useState(80000);
  const laptops = products.filter((p) => p.category === "Laptops");
  const best = laptops.filter((p) => p.price <= budget).sort((a, b) => b.price - a.price)[0];

  return (
    <motion.div className="lab-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2>Find a laptop for your budget</h2>
      <p className="lab-note">We'll recommend the best match from our catalog.</p>
      <div className="lab-row">
        <label>Budget: ₹{budget.toLocaleString("en-IN")}</label>
        <input type="range" min="30000" max="150000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
      </div>
      {best ? (
        <div className="product-card" style={{ maxWidth: 320, marginTop: 20 }}>
          <img src={best.image} alt={best.name} className="product-image" />
          <span className="product-category">{best.category}</span>
          <h2>{best.name}</h2>
          <span className="price-tag">₹{best.price.toLocaleString("en-IN")}</span>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 10 }}>View in Shop</Link>
        </div>
      ) : (
        <p className="lab-note" style={{ marginTop: 16 }}>No laptop fits that budget yet — try increasing it.</p>
      )}
    </motion.div>
  );
}

const QUESTIONS = [
  { q: "What's your budget?", options: [{ label: "I splurge on tech", score: { performance: 2, creator: 1 } }, { label: "I stick to a plan", score: { minimal: 2, traveler: 1 } }] },
  { q: "Gamer or Creator?", options: [{ label: "Gamer, obviously", score: { performance: 2 } }, { label: "Creator, always making something", score: { creator: 2 } }] },
  { q: "Battery or Performance?", options: [{ label: "Performance, no compromise", score: { performance: 2 } }, { label: "Battery life, I'm always moving", score: { traveler: 2 } }] },
  { q: "RGB or Minimal?", options: [{ label: "RGB everything", score: { performance: 1 } }, { label: "Clean and minimal", score: { minimal: 2 } }] },
  { q: "Travel setup or Home setup?", options: [{ label: "Travel — light and portable", score: { traveler: 2 } }, { label: "Home — full battle station", score: { performance: 1, creator: 1 } }] },
];

const RESULTS = {
  performance: { title: "Performance Beast 🩸", desc: "You want raw power and don't apologize for it. Check out our gaming PCs and high-end laptops.", category: "PCs" },
  creator: { title: "The Creator 🎨", desc: "You need reliable, capable gear for making things. Our laptops and displays are built for you.", category: "Displays" },
  minimal: { title: "Minimalist Pro ⚪", desc: "Clean, efficient, no clutter. Our ultrabooks and accessories fit your style.", category: "Accessories" },
  traveler: { title: "The Traveler ✈️", desc: "Light, portable, dependable on the go. Our slim laptops and earbuds are made for you.", category: "Audio" },
};

function PersonalityQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});

  const answer = (optionScore) => {
    const updated = { ...scores };
    Object.entries(optionScore).forEach(([key, val]) => { updated[key] = (updated[key] || 0) + val; });
    setScores(updated);
    setStep((prev) => prev + 1);
  };

  const restart = () => { setStep(0); setScores({}); };

  if (step >= QUESTIONS.length) {
    const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "performance";
    const result = RESULTS[topType];
    return (
      <motion.div className="lab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>{result.title}</h2>
        <p className="lab-note">{result.desc}</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 10 }}>Shop {result.category}</Link>
        <button className="btn btn-outline" style={{ marginTop: 10, marginLeft: 8 }} onClick={restart}>Retake Quiz</button>
      </motion.div>
    );
  }

  const current = QUESTIONS[step];
  return (
    <motion.div className="lab-panel" key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <h2>{current.q}</h2>
      <p className="lab-note">Question {step + 1} of {QUESTIONS.length}</p>
      <div className="quiz-options">
        {current.options.map((opt) => (
          <button key={opt.label} className="btn btn-outline quiz-option" onClick={() => answer(opt.score)}>{opt.label}</button>
        ))}
      </div>
    </motion.div>
  );
}

/* ============================================================
   Main TechLab page
   ============================================================ */
function TechLab() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="page-container">
      <h1>AI Advisor</h1>
      <p className="lab-note" style={{ marginBottom: 20, maxWidth: 640 }}>
        These tools use rule-based logic built from our own product data — a
        genuinely useful configurator, not a trained AI model. Framed as "AI"
        for the experience, built honestly underneath.
      </p>
      <div className="filter-bar">
        {TABS.map((t) => (
          <button key={t} className={`filter-chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "Dream Setup" && <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DreamSetupAdvisor /></motion.div>}
        {tab === "FPS Estimator" && <motion.div key="fps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FpsEstimator /></motion.div>}
        {tab === "Laptop Finder" && <motion.div key="finder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LaptopFinder /></motion.div>}
        {tab === "Personality Quiz" && <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PersonalityQuiz /></motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default TechLab;
