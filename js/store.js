window.BPP = window.BPP || {};

(function initStore(ns) {
  // Static product catalog for GitHub Pages deployment.
  // Each product includes a direct Stripe Checkout Payment Link.
  const PRODUCTS = [
    {
      id: "aurora-5070-ti",
      name: "BPP Aurora RTX 5070 Ti",
      category: "Gaming",
      price: 1999,
      featured: true,
      specs: ["Ryzen 7 7800X3D", "RTX 5070 Ti 16GB", "32GB DDR5", "2TB NVMe Gen4"],
      description: "High-refresh 1440p performance with balanced thermals and low acoustic profile.",
      image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_28EaEW6lR98AgqZ88P6kg01"
    },
    {
      id: "eclipse-5080",
      name: "BPP Eclipse RTX 5080",
      category: "Gaming",
      price: 2699,
      featured: true,
      specs: ["Intel Core Ultra 7", "RTX 5080 16GB", "32GB DDR5", "2TB NVMe Gen4"],
      description: "4K-first gaming desktop tuned for frame stability and premium visual output.",
      image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
    },
    {
      id: "studio-x-pro",
      name: "BPP Studio X Pro",
      category: "Creator",
      price: 2399,
      featured: true,
      specs: ["Ryzen 9 7900X", "RTX 4070 Ti Super", "64GB DDR5", "2TB NVMe + 4TB SSD"],
      description: "Creator system optimized for editing, rendering, and demanding 3D workflows.",
      image: "https://images.unsplash.com/photo-1587202372599-814eb66b3b5d?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
    },
    {
      id: "starter-4060",
      name: "BPP Starter RTX 4060",
      category: "Entry",
      price: 1199,
      featured: false,
      specs: ["Ryzen 5 7600", "RTX 4060 8GB", "16GB DDR5", "1TB NVMe"],
      description: "Entry-level gaming and productivity platform with efficient performance.",
      image: "https://images.unsplash.com/photo-1587202372708-31f6f5e86c44?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
    },
    {
      id: "pro-office-i7",
      name: "BPP Pro Office i7",
      category: "Work",
      price: 1299,
      featured: false,
      specs: ["Intel Core i7", "RTX 4060", "32GB DDR5", "1TB NVMe"],
      description: "Quiet and reliable workstation for multitasking and office-heavy workflows.",
      image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
    },
    {
      id: "ml-workstation-4090",
      name: "BPP ML Workstation RTX 4090",
      category: "Workstation",
      price: 3299,
      featured: false,
      specs: ["Threadripper 7960X", "RTX 4090 24GB", "128GB DDR5 ECC", "4TB NVMe Gen4"],
      description: "High-compute workstation for AI prototyping, rendering, and simulation workloads.",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
      stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getProducts() {
    return clone(PRODUCTS);
  }

  function getProductById(id) {
    return PRODUCTS.find((product) => product.id === String(id)) || null;
  }

  ns.store = {
    getProducts,
    getProductById
  };
})(window.BPP);
