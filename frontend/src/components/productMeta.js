// Deterministic per-product "marketplace" metadata (ratings, stock, badges,
// delivery estimate, EMI). No real review/inventory system exists yet, so
// these are generated consistently from each product's id/price — same
// product always shows the same numbers, but they aren't live data.

function seeded(id, salt) {
  const x = Math.sin(id * 999 + salt * 37) * 10000;
  return x - Math.floor(x);
}

const BRAND_MAP = {
  AeroBook: "AeroBook", SlimEdge: "AeroBook", TitanForce: "TitanForce",
  Pulse: "Pulse", Nova: "Nova", NovaCore: "NovaCore", CreatorStation: "NovaCore",
  BudgetBuild: "NovaCore", OrbitBuds: "Orbit", SonicWave: "Orbit", BassPod: "Orbit",
  HaloView: "HaloView", Vortex: "Vortex", PowerHub: "Vortex",
  PulseFit: "PulseFit", VisionMax: "VisionMax",
};

export function brandFor(item) {
  const match = Object.keys(BRAND_MAP).find((prefix) => item.name.startsWith(prefix));
  return match ? BRAND_MAP[match] : "NextGear";
}

export function metaFor(item) {
  const rating = Math.round((3.8 + seeded(item.id, 1) * 1.2) * 10) / 10;
  const reviewCount = Math.round(20 + seeded(item.id, 2) * 480);
  const discountPercent = Math.round(seeded(item.id, 3) * 25);
  const stockRoll = seeded(item.id, 4);
  const stock = stockRoll > 0.85 ? "Limited Stock" : stockRoll > 0.1 ? "In Stock" : "Out of Stock";
  const deliveryDays = 2 + Math.round(seeded(item.id, 5) * 3);
  const emiMonthly = Math.round(item.price / 12);

  const badges = [];
  if (seeded(item.id, 6) > 0.7) badges.push("Trending");
  if (discountPercent > 15) badges.push("Hot Deal");
  if (stock === "Limited Stock") badges.push("Limited Stock");
  if (seeded(item.id, 7) > 0.75) badges.push("New Arrival");
  if (item.price < 20000) badges.push("Best Value");

  const quickTags = [];
  if (seeded(item.id, 8) > 0.6) quickTags.push("Best Seller");
  if (seeded(item.id, 7) > 0.75) quickTags.push("New Launch");
  if (item.category === "PCs" || item.name.includes("Titan")) quickTags.push("Gaming");
  if (item.price < 25000) quickTags.push("Student Pick", "Budget");
  if (item.price > 90000) quickTags.push("Premium");
  if (seeded(item.id, 9) > 0.85) quickTags.push("Editor's Choice");

  return {
    rating, reviewCount, discountPercent, stock, deliveryDays, emiMonthly,
    badges: [...new Set(badges)], quickTags: [...new Set(quickTags)],
    brand: brandFor(item),
  };
}
