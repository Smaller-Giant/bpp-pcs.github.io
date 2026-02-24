window.BPP = window.BPP || {};

(function initStore(ns) {
  // Single source of truth lives in assets/products.js.
  const CATALOG = Array.isArray(window.PC_PRODUCTS) ? window.PC_PRODUCTS : [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toLegacyProduct(product) {
    return {
      id: product.id,
      name: product.name,
      category: product.category || "Desktop",
      price: product.price,
      featured: Boolean(product.featured),
      specs: Array.isArray(product.specifications) ? product.specifications : [],
      description: product.description || "",
      image: product.image || "",
      stripeCheckoutLink: product.stripeCheckoutLink || ""
    };
  }

  function getProducts() {
    return clone(CATALOG.map(toLegacyProduct));
  }

  function getProductById(id) {
    const match = CATALOG.find((product) => String(product.id) === String(id));
    return match ? clone(toLegacyProduct(match)) : null;
  }

  ns.store = {
    getProducts,
    getProductById
  };
})(window.BPP);
