window.BPP = window.BPP || {};

(function initStore(ns) {
  const config = window.BPP_CONFIG || {};
  const keys = config.storageKeys || {};
  const defaultProducts = Array.isArray(window.BPP_DEFAULT_PRODUCTS) ? window.BPP_DEFAULT_PRODUCTS : [];
  const memory = {};

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
      // Quota/private mode fallback in memory.
    }
  }

  function emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function sanitizeProduct(product) {
    const id = String(product.id || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const title = String(product.title || "").trim();
    const price = Number(product.price || 0);
    const description = String(product.description || "").trim();
    const category = String(product.category || "Custom").trim();
    const featured = Boolean(product.featured);
    const stockSeed = Math.max(2, Number.parseInt(product.stockSeed || 8, 10) || 8);
    const stripePriceId = String(product.stripePriceId || "").trim();

    const specs = Array.isArray(product.specs)
      ? product.specs.map((spec) => String(spec || "").trim()).filter(Boolean).slice(0, 4)
      : [];

    const images = Array.isArray(product.images)
      ? product.images.map((img) => String(img || "").trim()).filter(Boolean)
      : [];

    return {
      id,
      title,
      price: Number.isFinite(price) ? price : 0,
      description,
      category,
      featured,
      stockSeed,
      stripePriceId,
      specs: specs.length ? specs : ["Custom tuned build"],
      images: images.length ? images : ["images/products/vanta-s1.svg"]
    };
  }

  function sanitizeProducts(list) {
    if (!Array.isArray(list)) {
      return clone(defaultProducts);
    }

    const seen = new Set();
    const clean = [];

    list.forEach((product) => {
      const item = sanitizeProduct(product);
      if (!item.id || !item.title || seen.has(item.id)) {
        return;
      }
      seen.add(item.id);
      clean.push(item);
    });

    return clean.length ? clean : clone(defaultProducts);
  }

  function getProducts() {
    return sanitizeProducts(readJson(keys.products, defaultProducts));
  }

  function saveProducts(list) {
    const clean = sanitizeProducts(list);
    writeJson(keys.products, clean);
    sanitizeBasket();
    emit("bpp:products-changed", { products: clean });
    return clone(clean);
  }

  function getProductById(id) {
    return getProducts().find((product) => product.id === String(id)) || null;
  }

  function upsertProduct(nextProduct) {
    const item = sanitizeProduct(nextProduct);
    if (!item.id || !item.title) {
      return getProducts();
    }

    const products = getProducts();
    const index = products.findIndex((product) => product.id === item.id);
    if (index >= 0) {
      products[index] = item;
    } else {
      products.push(item);
    }
    return saveProducts(products);
  }

  function deleteProduct(id) {
    const productId = String(id);
    const products = getProducts().filter((product) => product.id !== productId);
    return saveProducts(products);
  }

  function resetProducts() {
    writeJson(keys.products, clone(defaultProducts));
    sanitizeBasket();
    emit("bpp:products-changed", { products: getProducts() });
    return getProducts();
  }

  function getBasket() {
    const raw = readJson(keys.basket, []);
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map((entry) => ({
        id: String(entry.id || ""),
        quantity: Number.parseInt(entry.quantity, 10)
      }))
      .filter((entry) => entry.id && Number.isFinite(entry.quantity) && entry.quantity > 0);
  }

  function saveBasket(nextBasket) {
    const products = getProducts();
    const validIds = new Set(products.map((product) => product.id));

    const clean = (Array.isArray(nextBasket) ? nextBasket : [])
      .map((entry) => ({
        id: String(entry.id || ""),
        quantity: Number.parseInt(entry.quantity, 10)
      }))
      .filter((entry) => validIds.has(entry.id) && Number.isFinite(entry.quantity) && entry.quantity > 0);

    writeJson(keys.basket, clean);
    emit("bpp:basket-changed", { basket: clean });
    return clean;
  }

  function sanitizeBasket() {
    return saveBasket(getBasket());
  }

  function addToBasket(productId, quantity) {
    const id = String(productId);
    const amount = Math.max(1, Number.parseInt(quantity || 1, 10) || 1);
    const product = getProductById(id);
    if (!product) {
      return getBasket();
    }

    const basket = getBasket();
    const index = basket.findIndex((item) => item.id === id);
    if (index >= 0) {
      basket[index].quantity += amount;
    } else {
      basket.push({ id, quantity: amount });
    }
    return saveBasket(basket);
  }

  function setBasketQuantity(productId, quantity) {
    const id = String(productId);
    const qty = Number.parseInt(quantity, 10);
    const basket = getBasket();
    const index = basket.findIndex((item) => item.id === id);
    if (index < 0) {
      return basket;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      basket.splice(index, 1);
    } else {
      basket[index].quantity = qty;
    }

    return saveBasket(basket);
  }

  function removeFromBasket(productId) {
    const id = String(productId);
    return saveBasket(getBasket().filter((item) => item.id !== id));
  }

  function clearBasket() {
    return saveBasket([]);
  }

  function getBasketRows() {
    const products = getProducts();
    const productMap = new Map(products.map((product) => [product.id, product]));

    return getBasket()
      .map((entry) => {
        const product = productMap.get(entry.id);
        if (!product) {
          return null;
        }
        const lineTotal = entry.quantity * Number(product.price || 0);
        return {
          product,
          quantity: entry.quantity,
          lineTotal
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
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount: rows.reduce((sum, row) => sum + row.quantity, 0)
    };
  }

  function getLiveStock(productId) {
    const product = getProductById(productId);
    if (!product) {
      return 0;
    }

    const dayCode = Math.floor(Date.now() / 86400000);
    const hash = String(product.id)
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);
    const variation = (hash + dayCode) % 6;
    return Math.max(2, Number(product.stockSeed || 10) - variation);
  }

  function setAdminSession(isLoggedIn) {
    writeJson(keys.adminSession, Boolean(isLoggedIn));
  }

  function isAdminSession() {
    return Boolean(readJson(keys.adminSession, false));
  }

  function clearAdminSession() {
    setAdminSession(false);
  }

  ns.store = {
    getProducts,
    getProductById,
    saveProducts,
    upsertProduct,
    deleteProduct,
    resetProducts,
    getBasket,
    addToBasket,
    setBasketQuantity,
    removeFromBasket,
    clearBasket,
    getBasketRows,
    getBasketTotals,
    getLiveStock,
    setAdminSession,
    isAdminSession,
    clearAdminSession
  };
})(window.BPP);
