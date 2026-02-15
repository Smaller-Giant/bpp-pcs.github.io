window.BPP = window.BPP || {};

// Edit products here: name, price, image, description, stock, and Stripe priceId.
window.BPP.products = [
  {
    id: "vanta-s1",
    name: "Vanta S1",
    category: "Gaming",
    tier: "Entry",
    price: 1299,
    shortDescription: "Solid 1080p/1440p performance with whisper-quiet airflow.",
    description:
      "Built for smooth high-refresh gaming and everyday creative work. Tuned airflow, clean cable routing, and quiet fan curves.",
    image: "assets/images/vanta-s1.svg",
    priceId: "price_1BPPvantaS1Replace",
    stockSeed: 17
  },
  {
    id: "helios-r2",
    name: "Helios R2",
    category: "Gaming",
    tier: "Enthusiast",
    price: 1799,
    shortDescription: "Balanced RTX-class power for competitive play and streaming.",
    description:
      "A balanced gaming build with performance headroom for modern titles, creator apps, and multi-display setups.",
    image: "assets/images/helios-r2.svg",
    priceId: "price_1BPPheliosR2Replace",
    stockSeed: 12
  },
  {
    id: "aurora-x9",
    name: "Aurora X9",
    category: "Gaming",
    tier: "Elite",
    price: 2499,
    shortDescription: "Flagship 4K-ready system with premium thermals.",
    description:
      "Designed for elite frame rates and ultra settings. Premium cooling and tuned acoustics keep it stable under sustained load.",
    image: "assets/images/aurora-x9.svg",
    priceId: "price_1BPPauroraX9Replace",
    stockSeed: 7
  },
  {
    id: "forge-c6",
    name: "Forge C6",
    category: "Creator",
    tier: "Enthusiast",
    price: 2199,
    shortDescription: "Rendering and editing focused workstation with fast scratch storage.",
    description:
      "Optimized for 3D, editing, and motion workflows with sustained multicore performance and fast NVMe throughput.",
    image: "assets/images/forge-c6.svg",
    priceId: "price_1BPPforgeC6Replace",
    stockSeed: 11
  },
  {
    id: "studio-n5",
    name: "Studio N5",
    category: "Creator",
    tier: "Entry",
    price: 1499,
    shortDescription: "Creator-first build for clean timelines and reliable exports.",
    description:
      "A quiet creator setup for photo, design, and 1080p/1440p editing with excellent upgrade potential.",
    image: "assets/images/studio-n5.svg",
    priceId: "price_1BPPstudioN5Replace",
    stockSeed: 16
  },
  {
    id: "atlas-p4",
    name: "Atlas P4",
    category: "Work",
    tier: "Entry",
    price: 1099,
    shortDescription: "Fast office and productivity tower with low maintenance design.",
    description:
      "Quiet productivity machine built for teams, office stacks, and long daily sessions with minimal noise.",
    image: "assets/images/atlas-p4.svg",
    priceId: "price_1BPPatlasP4Replace",
    stockSeed: 23
  },
  {
    id: "titan-z8",
    name: "Titan Z8",
    category: "Work",
    tier: "Elite",
    price: 2899,
    shortDescription: "Heavy compute workstation for AI-assisted workflows.",
    description:
      "High-core compute platform with premium power delivery and cooling for demanding simulation and AI tasks.",
    image: "assets/images/titan-z8.svg",
    priceId: "price_1BPPtitanZ8Replace",
    stockSeed: 8
  },
  {
    id: "drift-mini",
    name: "Drift Mini",
    category: "Compact",
    tier: "Enthusiast",
    price: 1699,
    shortDescription: "Small-form-factor performance build with premium materials.",
    description:
      "Compact chassis without compromise. Great for limited desk space while still handling modern workloads.",
    image: "assets/images/drift-mini.svg",
    priceId: "price_1BPPdriftMiniReplace",
    stockSeed: 10
  }
];

window.BPP.featuredProductIds = ["aurora-x9", "helios-r2", "forge-c6", "drift-mini"];
