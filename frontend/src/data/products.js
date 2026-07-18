// Placeholder catalog until Muskan's Product module (API-backed) is merged.
// Swap `products` below for a fetch to /api/products once that's ready —
// the shape (id, name, price, image, category, colors) already matches the
// API contract, with `colors` as an extra field for the color-picker UI.

const laptopImg1 = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80&auto=format&fit=crop";
const laptopImg2 = "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=700&q=80&auto=format&fit=crop";
const laptopImg3 = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&q=80&auto=format&fit=crop";

const phoneImg1 = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80&auto=format&fit=crop";
const phoneImg2 = "https://images.unsplash.com/photo-1592286927505-1def25115558?w=700&q=80&auto=format&fit=crop";
const phoneImg3 = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80&auto=format&fit=crop";

const pcImg1 = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=700&q=80&auto=format&fit=crop";
const pcImg2 = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=700&q=80&auto=format&fit=crop";

const audioImg1 = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80&auto=format&fit=crop";
const audioImg2 = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=80&auto=format&fit=crop";
const audioImg3 = "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&q=80&auto=format&fit=crop";

const displayImg1 = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&q=80&auto=format&fit=crop";
const displayImg2 = "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&q=80&auto=format&fit=crop";

const accessoryImg1 = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&q=80&auto=format&fit=crop";
const accessoryImg2 = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&q=80&auto=format&fit=crop";

const wearableImg1 = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&auto=format&fit=crop";
const wearableImg2 = "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=700&q=80&auto=format&fit=crop";

const NEUTRAL = ["Midnight Black", "Silver", "Space Gray"];
const BRIGHT = ["Black", "Blue", "Red"];
const AUDIO_COLORS = ["Black", "White", "Navy"];

const products = [
  // Laptops
  { id: 301, name: "AeroBook Pro 14", price: 84999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { id: 302, name: "AeroBook Air 13", price: 64999, category: "Laptops", image: laptopImg2, colors: NEUTRAL },
  { id: 303, name: "TitanForce 16 Gaming Laptop", price: 134999, category: "Laptops", image: laptopImg3, colors: ["Black", "Gunmetal"] },
  { id: 304, name: "SlimEdge Ultrabook", price: 71999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { id: 305, name: "WorkStation X1 Laptop", price: 99999, category: "Laptops", image: laptopImg2, colors: NEUTRAL },
  { id: 331, name: "AeroBook Studio 15", price: 109999, category: "Laptops", image: laptopImg3, colors: NEUTRAL },
  { id: 332, name: "SlimEdge Go 12", price: 54999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { id: 333, name: "TitanForce 18 Extreme", price: 179999, category: "Laptops", image: laptopImg2, colors: ["Black", "Gunmetal"] },

  // Phones
  { id: 306, name: "Pulse X Smartphone", price: 42999, category: "Phones", image: phoneImg1, colors: BRIGHT },
  { id: 307, name: "Pulse X Pro Max", price: 59999, category: "Phones", image: phoneImg2, colors: BRIGHT },
  { id: 308, name: "Nova Lite 5G", price: 21999, category: "Phones", image: phoneImg3, colors: BRIGHT },
  { id: 309, name: "Nova Fold", price: 89999, category: "Phones", image: phoneImg1, colors: ["Black", "Cream"] },
  { id: 310, name: "Pulse Mini", price: 27999, category: "Phones", image: phoneImg2, colors: BRIGHT },
  { id: 334, name: "Nova Edge 5G", price: 33999, category: "Phones", image: phoneImg3, colors: BRIGHT },
  { id: 335, name: "Pulse X Ultra", price: 74999, category: "Phones", image: phoneImg1, colors: BRIGHT },
  { id: 336, name: "Nova SE", price: 17999, category: "Phones", image: phoneImg2, colors: BRIGHT },

  // PCs
  { id: 311, name: "NovaCore Gaming PC", price: 129999, category: "PCs", image: pcImg1, colors: ["Black", "White"] },
  { id: 312, name: "NovaCore Mini ITX", price: 89999, category: "PCs", image: pcImg2, colors: ["Black", "White"] },
  { id: 313, name: "CreatorStation Pro Tower", price: 154999, category: "PCs", image: pcImg1, colors: ["Black"] },
  { id: 314, name: "BudgetBuild Starter PC", price: 54999, category: "PCs", image: pcImg2, colors: ["Black"] },
  { id: 337, name: "NovaCore RGB Edition", price: 144999, category: "PCs", image: pcImg1, colors: ["Black", "White"] },
  { id: 338, name: "CreatorStation Mini", price: 99999, category: "PCs", image: pcImg2, colors: ["Black"] },

  // Audio
  { id: 315, name: "OrbitBuds Wireless Earbuds", price: 3999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { id: 316, name: "OrbitBuds Pro ANC", price: 6999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { id: 317, name: "SonicWave Over-Ear Headphones", price: 8999, category: "Audio", image: audioImg2, colors: AUDIO_COLORS },
  { id: 318, name: "SonicWave Studio Pro", price: 14999, category: "Audio", image: audioImg3, colors: AUDIO_COLORS },
  { id: 319, name: "BassPod Portable Speaker", price: 4499, category: "Audio", image: audioImg2, colors: AUDIO_COLORS },
  { id: 339, name: "OrbitBuds Sport", price: 4999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { id: 340, name: "SonicWave Kids Headphones", price: 2999, category: "Audio", image: audioImg3, colors: ["Blue", "Pink"] },

  // Displays
  { id: 320, name: "HaloView 27\" Monitor", price: 18999, category: "Displays", image: displayImg1, colors: ["Black"] },
  { id: 321, name: "HaloView 32\" Curved Monitor", price: 27999, category: "Displays", image: displayImg2, colors: ["Black"] },
  { id: 322, name: "HaloView 24\" Office Monitor", price: 12999, category: "Displays", image: displayImg1, colors: ["Black", "White"] },
  { id: 323, name: "HaloView 27\" 165Hz Gaming Monitor", price: 24999, category: "Displays", image: displayImg2, colors: ["Black"] },
  { id: 341, name: "HaloView 34\" Ultrawide", price: 39999, category: "Displays", image: displayImg1, colors: ["Black"] },
  { id: 342, name: "HaloView 22\" Budget Monitor", price: 8999, category: "Displays", image: displayImg2, colors: ["Black", "White"] },

  // Accessories
  { id: 324, name: "Vortex Mechanical Keyboard", price: 5499, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { id: 325, name: "Vortex Wireless Mouse", price: 2299, category: "Accessories", image: accessoryImg2, colors: ["Black", "White"] },
  { id: 326, name: "Vortex Keyboard + Mouse Combo", price: 6999, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { id: 327, name: "PowerHub USB-C Docking Station", price: 3499, category: "Accessories", image: accessoryImg2, colors: ["Black", "Silver"] },
  { id: 343, name: "Vortex Compact 60% Keyboard", price: 4499, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { id: 344, name: "PowerHub Wireless Charger", price: 1999, category: "Accessories", image: accessoryImg2, colors: ["Black", "White"] },
  { id: 345, name: "Vortex Gaming Mousepad XL", price: 999, category: "Accessories", image: accessoryImg1, colors: ["Black"] },

  // Wearables
  { id: 328, name: "PulseFit Smartwatch", price: 14999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver", "Rose Gold"] },
  { id: 329, name: "VisionMax VR Headset", price: 39999, category: "Wearables", image: wearableImg2, colors: ["Black", "White"] },
  { id: 330, name: "PulseFit Smartwatch Lite", price: 8999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver"] },
  { id: 346, name: "PulseFit Pro GPS", price: 21999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver", "Rose Gold"] },
  { id: 347, name: "VisionMax VR Headset Lite", price: 24999, category: "Wearables", image: wearableImg2, colors: ["Black", "White"] },
];

export default products;
