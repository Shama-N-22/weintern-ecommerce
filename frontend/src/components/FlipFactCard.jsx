import { useState } from "react";
import techFacts from "../data/techFacts";

const CATEGORIES = ["All", "Computing", "Gaming", "AI", "Smartphones", "Internet History"];

function FlipFactCard() {
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const pool = category === "All" ? techFacts : techFacts.filter((f) => f.tag === category);
  const current = pool[index % pool.length];

  const nextFact = () => {
    setFlipped((prev) => !prev);
    setTimeout(() => setIndex((i) => (i + 1) % pool.length), 250);
  };

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: "center" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${category === cat ? "active" : ""}`}
            onClick={() => { setCategory(cat); setIndex(0); setFlipped(false); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flip-card-scene" onClick={nextFact}>
        <div className={`flip-card-inner ${flipped ? "flip-card-flipped" : ""}`}>
          <div className="flip-card-face flip-card-front">
            <span className="fun-label">{current.tag}</span>
            <p>{current.fact}</p>
            <span className="fun-hint">Tap to flip →</span>
          </div>
          <div className="flip-card-face flip-card-back">
            <span className="fun-label">Fun Fact</span>
            <p>Come back and tap again for another one.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipFactCard;
