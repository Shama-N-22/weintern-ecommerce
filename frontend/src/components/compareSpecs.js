// Illustrative spec generator — no real benchmark data exists for these
// placeholder products, so specs are derived deterministically from each
// product's price/category (same product always gets the same numbers,
// they just aren't lab-measured). Clearly a demo, not real hardware data.

function seeded(id, salt) {
  const x = Math.sin(id * 999 + salt * 37) * 10000;
  return x - Math.floor(x);
}

function tier(price) {
  if (price > 100000) return 3;
  if (price > 50000) return 2;
  if (price > 15000) return 1;
  return 0;
}

export function generateSpecs(item) {
  const t = tier(item.price);
  const s = (salt, min, max) => Math.round(min + seeded(item.id, salt) * (max - min) + t * (max - min) * 0.15);

  return {
    processor: { icon: "🧠", label: "Processor", value: ["Core i5 / Ryzen 5", "Core i7 / Ryzen 7", "Core i9 / Ryzen 9", "Elite Custom Silicon"][t], score: 40 + t * 18 },
    gpu: { icon: "🎮", label: "GPU", value: ["Integrated Graphics", "Mid-range dGPU", "RTX-class GPU", "Flagship GPU"][t], score: 35 + t * 20 },
    ram: { icon: "💾", label: "RAM", value: `${8 + t * 8}GB`, score: 30 + t * 22 },
    storage: { icon: "💿", label: "Storage", value: `${128 * Math.pow(2, t)}GB SSD`, score: 30 + t * 22 },
    display: { icon: "🖥️", label: "Display", value: ["HD 720p", "FHD 1080p", "QHD 1440p", "4K UHD"][t], score: 35 + t * 20 },
    refresh: { icon: "🔄", label: "Refresh Rate", value: `${60 + t * 45}Hz`, score: 30 + t * 22 },
    brightness: { icon: "☀️", label: "Brightness", value: `${250 + t * 100} nits`, score: 30 + t * 20 },
    weight: { icon: "⚖️", label: "Weight", value: `${(2.2 - t * 0.3).toFixed(1)} kg`, score: 40 + (3 - t) * 15 },
    battery: { icon: "🔋", label: "Battery Life", value: `${s(1, 6, 9) + t}h`, score: s(1, 40, 70) + t * 8 },
    charging: { icon: "⚡", label: "Charging Speed", value: `${20 + t * 25}W`, score: 30 + t * 22 },
    webcam: { icon: "📷", label: "Webcam Quality", value: ["720p", "1080p", "1080p FHD", "4K"][t], score: 35 + t * 20 },
    speaker: { icon: "🔊", label: "Speaker Rating", value: `${3 + t}/5`, score: 30 + t * 20 },
    keyboard: { icon: "⌨️", label: "Keyboard Type", value: ["Membrane", "Chiclet Backlit", "Mechanical-feel", "Custom Mechanical"][t], score: 30 + t * 22 },
    ports: { icon: "🔌", label: "Ports", value: `${2 + t} ports`, score: 25 + t * 22 },
    build: { icon: "🏗️", label: "Build Material", value: ["Plastic", "Aluminum-blend", "Aluminum Unibody", "Premium Alloy"][t], score: 30 + t * 22 },
    wifi: { icon: "📶", label: "Wi-Fi Version", value: t > 1 ? "Wi-Fi 6E" : "Wi-Fi 6", score: 40 + t * 15 },
    bluetooth: { icon: "🔗", label: "Bluetooth", value: t > 1 ? "5.3" : "5.1", score: 40 + t * 15 },
    os: { icon: "💻", label: "Operating System", value: "Latest OS, pre-installed", score: 60 },
    warranty: { icon: "🛡️", label: "Warranty", value: `${1 + (t > 1 ? 1 : 0)} year`, score: 45 + t * 15 },
    ai: { icon: "🤖", label: "AI Features", value: t > 1 ? "On-device AI acceleration" : "Cloud-assisted only", score: 25 + t * 25 },
    cooling: { icon: "❄️", label: "Cooling System", value: ["Passive", "Single fan", "Dual fan", "Vapor chamber"][t], score: 30 + t * 22 },
    sustainability: { icon: "♻️", label: "Sustainability", value: `${3 + t}/5 rating`, score: 40 + t * 15 },
  };
}

export function overallScores(item) {
  const specs = generateSpecs(item);
  const avg = (keys) => Math.round(keys.reduce((s, k) => s + specs[k].score, 0) / keys.length);
  return {
    cpu: avg(["processor"]),
    gpu: avg(["gpu"]),
    battery: avg(["battery", "charging"]),
    display: avg(["display", "refresh", "brightness"]),
    build: avg(["build", "cooling"]),
    value: Math.max(20, 100 - Math.round(item.price / 2000)),
  };
}

export function tagsFor(item) {
  const t = tier(item.price);
  const tags = [];
  if (item.category === "PCs" || (item.category === "Laptops" && item.name.includes("Titan"))) tags.push("Gaming");
  if (t === 0) tags.push("Budget", "Student");
  if (t === 3) tags.push("Premium", "Performance Beast");
  if (item.category === "Laptops" && !item.name.includes("Titan")) tags.push("Creator");
  if (t >= 1) tags.push("Battery King");
  return [...new Set(tags)].slice(0, 3);
}

export function benchmarksFor(item) {
  const t = tier(item.price);
  const s = (salt, min, max) => Math.round(min + seeded(item.id, salt) * (max - min) + t * (max - min) * 0.15);
  return {
    cinebench: s(2, 400, 2200),
    geekbench: s(3, 600, 3200),
    fps: s(4, 40, 160),
    blenderMinutes: Math.max(2, 30 - t * 7 - Math.round(seeded(item.id, 5) * 5)),
    photoshop: s(6, 50, 98),
    aiScore: s(7, 30, 95),
  };
}
