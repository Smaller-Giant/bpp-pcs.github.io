window.BPP = window.BPP || {};

(function initStore(ns) {
  const config = window.BPP_CONFIG || {};
  const basketKey = config.storageKeys?.basket || "bpp_basket_v4";
  const memory = {};

  // Product catalog is static on frontend and can later be replaced by Stripe-backed data.
  const PRODUCTS = [
    {
      id: "aurora-5070-ti",
      name: "Aurora RTX 5070 Ti",
      category: "Gaming",
      price: 1999,
      featured: true,
      description: "High refresh 1440p build with premium airflow and clean thermals.",
      image:
        "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "eclipse-5080",
      name: "Eclipse RTX 5080",
      category: "Gaming",
      price: 2699,
      featured: true,
      description: "4K-focused performance tower designed for max visual settings.",
      image:
        "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "studio-x-pro",
      name: "Studio X Pro",
      category: "Creator",
      price: 2399,
      featured: true,
      description: "Creator workstation for editing, rendering, and 3D production.",
      image:
        "https://images.unsplash.com/photo-1587202372599-814eb66b3b5d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "starter-4060",
      name: "Starter RTX 4060",
      category: "Entry",
      price: 1199,
      featured: false,
      description: "Balanced entry-level gaming and productivity desktop.",
      image:
        "https://images.unsplash.com/photo-1587202372708-31f6f5e86c44?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "pro-office-i7",
      name: "Pro Office i7",
      category: "Work",
      price: 1299,
      featured: false,
      description: "Quiet productivity desktop for multitasking and office workloads.",
      image:
        "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "ml-workstation-4090",
      name: "ML Workstation RTX 4090",
      category: "Workstation",
      price: 3299,
      featured: false,
      description: "Compute-heavy build for local AI and accelerated rendering workflows.",
      image:
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      return key in memory ? clone(memory[key]) : clone(fallback);
    }
  }

  function writeJson(key, value) {
    memory[key] = clone(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore private mode/quota failures; memory fallback is used.
    }
  }

  function emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function getProducts() {
    return clone(PRODUCTS);
  }

  function getProductById(id) {
    return PRODUCTS.find((product) => product.id === String(id)) || null;
  }

  function sanitizeBasket(basket) {
    if (!Array.isArray(basket)) {
      return [];
    }

    return basket
      .map((entry) => ({
        id: String(entry?.id || ""),
        quantity: Number.parseInt(entry?.quantity, 10)
      }))
      .filter((entry) => getProductById(entry.id) && Number.isFinite(entry.quantity) && entry.quantity > 0);
  }

  function getBasket() {
    return sanitizeBasket(readJson(basketKey, []));
  }

  function saveBasket(nextBasket) {
    const clean = sanitizeBasket(nextBasket);
    writeJson(basketKey, clean);
    emit("bpp:basket-changed", { basket: clean });
    return clean;
  }

  function addToBasket(productId, quantity) {
    const product = getProductById(productId);
    if (!product) {
      return getBasket();
    }

    const amount = Math.max(1, Number.parseInt(quantity || 1, 10) || 1);
    const basket = getBasket();
    const index = basket.findIndex((entry) => entry.id === product.id);

    if (index >= 0) {
      basket[index].quantity += amount;
    } else {
      basket.push({ id: product.id, quantity: amount });
    }

    return saveBasket(basket);
  }

  function setBasketQuantity(productId, quantity) {
    const id = String(productId);
    const nextQuantity = Number.parseInt(quantity, 10);
    const basket = getBasket();
    const index = basket.findIndex((entry) => entry.id === id);
    if (index < 0) {
      return basket;
    }

    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      basket.splice(index, 1);
    } else {
      basket[index].quantity = nextQuantity;
    }

    return saveBasket(basket);
  }

  function removeFromBasket(productId) {
    return saveBasket(getBasket().filter((entry) => entry.id !== String(productId)));
  }

  function clearBasket() {
    return saveBasket([]);
  }

  function getBasketRows() {
    return getBasket()
      .map((entry) => {
        const product = getProductById(entry.id);
        if (!product) {
          return null;
        }
        return {
          product,
          quantity: entry.quantity,
          lineTotal: entry.quantity * Number(product.price || 0)
        };
      })
      .filter(Boolean);
  }

  function getBasketTotals() {
    const rows = getBasketRows();
    const subtotal = rows.reduce((sum, row) => sum + row.lineTotal, 0);
    const shipping =
      subtotal === 0
        ? 0
        : subtotal >= Number(config.freeShippingThreshold || 0)
          ? 0
          : Number(config.shippingFlatRate || 0);

    return {
      itemCount: rows.reduce((sum, row) => sum + row.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  }

  ns.store = {
    getProducts,
    getProductById,
    getBasket,
    addToBasket,
    setBasketQuantity,
    removeFromBasket,
    clearBasket,
    getBasketRows,
    getBasketTotals
  };
})(window.BPP);
