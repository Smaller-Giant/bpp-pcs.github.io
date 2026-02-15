window.BPP = window.BPP || {};

(function initStore(ns) {
  const config = ns.config || {};
  const products = Array.isArray(ns.products) ? ns.products : [];
  const productMap = new Map(products.map((product) => [product.id, product]));
  const memoryStore = {};

  const keys = {
    basket: config.storageKeys?.basket || "bpp_basket_v1",
    wishlist: config.storageKeys?.wishlist || "bpp_wishlist_v1",
    viewed: config.storageKeys?.recentlyViewed || "bpp_recently_viewed_v1"
  };

  function readStorage(key) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return memoryStore[key] ?? null;
    }
  }

  function writeStorage(key, value) {
    memoryStore[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore quota and private mode failures; memory fallback is used.
    }
  }

  function emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function sanitizeBasket(input) {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .map((row) => ({
        id: String(row?.id || ""),
        quantity: Number.parseInt(row?.quantity, 10)
      }))
      .filter((row) => productMap.has(row.id) && Number.isFinite(row.quantity) && row.quantity > 0);
  }

  function getBasket() {
    return sanitizeBasket(readStorage(keys.basket) || []);
  }

  function saveBasket(nextBasket) {
    const cleanBasket = sanitizeBasket(nextBasket);
    writeStorage(keys.basket, cleanBasket);
    emit("bpp:basket-changed", { basket: cleanBasket });
    return cleanBasket;
  }

  function getWishlist() {
    const raw = readStorage(keys.wishlist);
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map(String).filter((id) => productMap.has(id));
  }

  function saveWishlist(nextList) {
    const unique = [...new Set(nextList.map(String).filter((id) => productMap.has(id)))];
    writeStorage(keys.wishlist, unique);
    emit("bpp:wishlist-changed", { wishlist: unique });
    return unique;
  }

  function getRecentlyViewed() {
    const raw = readStorage(keys.viewed);
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map(String).filter((id) => productMap.has(id));
  }

  function saveRecentlyViewed(list) {
    const trimmed = [...new Set(list.map(String).filter((id) => productMap.has(id)))].slice(0, 8);
    writeStorage(keys.viewed, trimmed);
    emit("bpp:viewed-changed", { viewed: trimmed });
    return trimmed;
  }

  function getProductById(id) {
    return productMap.get(String(id)) || null;
  }

  function addToBasket(id, amount = 1) {
    const product = getProductById(id);
    if (!product) {
      return getBasket();
    }

    const qty = Math.max(1, Number.parseInt(amount, 10) || 1);
    const basket = getBasket();
    const idx = basket.findIndex((item) => item.id === product.id);

    if (idx >= 0) {
      basket[idx].quantity += qty;
    } else {
      basket.push({ id: product.id, quantity: qty });
    }

    trackViewed(product.id);
    return saveBasket(basket);
  }

  function updateBasketQuantity(id, quantity) {
    const qty = Number.parseInt(quantity, 10);
    const basket = getBasket();
    const idx = basket.findIndex((item) => item.id === String(id));
    if (idx < 0) {
      return basket;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      basket.splice(idx, 1);
    } else {
      basket[idx].quantity = qty;
    }

    return saveBasket(basket);
  }

  function removeFromBasket(id) {
    return saveBasket(getBasket().filter((item) => item.id !== String(id)));
  }

  function clearBasket() {
    return saveBasket([]);
  }

  function toggleWishlist(id) {
    const product = getProductById(id);
    if (!product) {
      return false;
    }

    const wishlist = getWishlist();
    const exists = wishlist.includes(product.id);
    const nextList = exists ? wishlist.filter((itemId) => itemId !== product.id) : [...wishlist, product.id];
    saveWishlist(nextList);
    return !exists;
  }

  function trackViewed(id) {
    const product = getProductById(id);
    if (!product) {
      return getRecentlyViewed();
    }

    const viewed = getRecentlyViewed().filter((itemId) => itemId !== product.id);
    viewed.unshift(product.id);
    return saveRecentlyViewed(viewed);
  }

  function getSimulatedStock(id) {
    const product = getProductById(id);
    if (!product) {
      return 0;
    }

    const dayCode = Math.floor(Date.now() / 86400000);
    const hash = product.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const dip = (hash + dayCode) % 6;
    return Math.max(2, Number(product.stockSeed || 10) - dip);
  }

  function getBasketDetailed() {
    return getBasket()
      .map((entry) => {
        const product = getProductById(entry.id);
        if (!product) {
          return null;
        }
        return {
          product,
          quantity: entry.quantity,
          lineTotal: entry.quantity * Number(product.price)
        };
      })
      .filter(Boolean);
  }

  function getBasketTotals() {
    const items = getBasketDetailed();
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shipping =
      subtotal === 0
        ? 0
        : subtotal >= Number(config.freeShippingThreshold || 0)
          ? 0
          : Number(config.shippingFlatRate || 0);

    return {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  }

  ns.store = {
    getProducts: () => products.slice(),
    getProductById,
    getBasket,
    addToBasket,
    updateBasketQuantity,
    removeFromBasket,
    clearBasket,
    getBasketDetailed,
    getBasketTotals,
    getWishlist,
    toggleWishlist,
    getRecentlyViewed,
    trackViewed,
    getSimulatedStock
  };
})(window.BPP);
