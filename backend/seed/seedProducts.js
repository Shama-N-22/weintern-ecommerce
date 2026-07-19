// Run with: node seed/seedProducts.js
// Populates the Product collection with the full NextGear catalog.
// Safe to re-run — it clears existing products first, then re-inserts.

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

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
  { name: "AeroBook Pro 14", price: 84999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { name: "AeroBook Air 13", price: 64999, category: "Laptops", image: laptopImg2, colors: NEUTRAL },
  { name: "TitanForce 16 Gaming Laptop", price: 134999, category: "Laptops", image: laptopImg3, colors: ["Black", "Gunmetal"] },
  { name: "SlimEdge Ultrabook", price: 71999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { name: "WorkStation X1 Laptop", price: 99999, category: "Laptops", image: laptopImg2, colors: NEUTRAL },
  { name: "AeroBook Studio 15", price: 109999, category: "Laptops", image: laptopImg3, colors: NEUTRAL },
  { name: "SlimEdge Go 12", price: 54999, category: "Laptops", image: laptopImg1, colors: NEUTRAL },
  { name: "TitanForce 18 Extreme", price: 179999, category: "Laptops", image: laptopImg2, colors: ["Black", "Gunmetal"] },

  { name: "Pulse X Smartphone", price: 42999, category: "Phones", image: phoneImg1, colors: BRIGHT },
  { name: "Pulse X Pro Max", price: 59999, category: "Phones", image: phoneImg2, colors: BRIGHT },
  { name: "Nova Lite 5G", price: 21999, category: "Phones", image: phoneImg3, colors: BRIGHT },
  { name: "Nova Fold", price: 89999, category: "Phones", image: phoneImg1, colors: ["Black", "Cream"] },
  { name: "Pulse Mini", price: 27999, category: "Phones", image: phoneImg2, colors: BRIGHT },
  { name: "Nova Edge 5G", price: 33999, category: "Phones", image: phoneImg3, colors: BRIGHT },
  { name: "Pulse X Ultra", price: 74999, category: "Phones", image: phoneImg1, colors: BRIGHT },
  { name: "Nova SE", price: 17999, category: "Phones", image: phoneImg2, colors: BRIGHT },

  { name: "NovaCore Gaming PC", price: 129999, category: "PCs", image: pcImg1, colors: ["Black", "White"] },
  { name: "NovaCore Mini ITX", price: 89999, category: "PCs", image: pcImg2, colors: ["Black", "White"] },
  { name: "CreatorStation Pro Tower", price: 154999, category: "PCs", image: pcImg1, colors: ["Black"] },
  { name: "BudgetBuild Starter PC", price: 54999, category: "PCs", image: pcImg2, colors: ["Black"] },
  { name: "NovaCore RGB Edition", price: 144999, category: "PCs", image: pcImg1, colors: ["Black", "White"] },
  { name: "CreatorStation Mini", price: 99999, category: "PCs", image: pcImg2, colors: ["Black"] },

  { name: "OrbitBuds Wireless Earbuds", price: 3999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { name: "OrbitBuds Pro ANC", price: 6999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { name: "SonicWave Over-Ear Headphones", price: 8999, category: "Audio", image: audioImg2, colors: AUDIO_COLORS },
  { name: "SonicWave Studio Pro", price: 14999, category: "Audio", image: audioImg3, colors: AUDIO_COLORS },
  { name: "BassPod Portable Speaker", price: 4499, category: "Audio", image: audioImg2, colors: AUDIO_COLORS },
  { name: "OrbitBuds Sport", price: 4999, category: "Audio", image: audioImg1, colors: AUDIO_COLORS },
  { name: "SonicWave Kids Headphones", price: 2999, category: "Audio", image: audioImg3, colors: ["Blue", "Pink"] },

  { name: "HaloView 27\" Monitor", price: 18999, category: "Displays", image: displayImg1, colors: ["Black"] },
  { name: "HaloView 32\" Curved Monitor", price: 27999, category: "Displays", image: displayImg2, colors: ["Black"] },
  { name: "HaloView 24\" Office Monitor", price: 12999, category: "Displays", image: displayImg1, colors: ["Black", "White"] },
  { name: "HaloView 27\" 165Hz Gaming Monitor", price: 24999, category: "Displays", image: displayImg2, colors: ["Black"] },
  { name: "HaloView 34\" Ultrawide", price: 39999, category: "Displays", image: displayImg1, colors: ["Black"] },
  { name: "HaloView 22\" Budget Monitor", price: 8999, category: "Displays", image: displayImg2, colors: ["Black", "White"] },

  { name: "Vortex Mechanical Keyboard", price: 5499, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { name: "Vortex Wireless Mouse", price: 2299, category: "Accessories", image: accessoryImg2, colors: ["Black", "White"] },
  { name: "Vortex Keyboard + Mouse Combo", price: 6999, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { name: "PowerHub USB-C Docking Station", price: 3499, category: "Accessories", image: accessoryImg2, colors: ["Black", "Silver"] },
  { name: "Vortex Compact 60% Keyboard", price: 4499, category: "Accessories", image: accessoryImg1, colors: ["Black", "White"] },
  { name: "PowerHub Wireless Charger", price: 1999, category: "Accessories", image: accessoryImg2, colors: ["Black", "White"] },
  { name: "Vortex Gaming Mousepad XL", price: 999, category: "Accessories", image: accessoryImg1, colors: ["Black"] },

  { name: "PulseFit Smartwatch", price: 14999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver", "Rose Gold"] },
  { name: "VisionMax VR Headset", price: 39999, category: "Wearables", image: wearableImg2, colors: ["Black", "White"] },
  { name: "PulseFit Smartwatch Lite", price: 8999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver"] },
  { name: "PulseFit Pro GPS", price: 21999, category: "Wearables", image: wearableImg1, colors: ["Black", "Silver", "Rose Gold"] },
  { name: "VisionMax VR Headset Lite", price: 24999, category: "Wearables", image: wearableImg2, colors: ["Black", "White"] },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
