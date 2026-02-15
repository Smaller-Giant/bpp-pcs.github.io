window.BPP = window.BPP || {};

(function initHome(ns) {
  function getFeaturedProducts() {
    const ids = Array.isArray(ns.featuredProductIds) ? ns.featuredProductIds : [];
    const products = ns.store ? ns.store.getProducts() : [];
    if (ids.length === 0) {
      return products.slice(0, 4);
    }
    return ids.map((id) => ns.store.getProductById(id)).filter(Boolean);
  }

  function renderFeatured() {
    const target = document.querySelector("#featured-products");
    if (!target || !ns.ui || !ns.store) {
      return;
    }

    target.innerHTML = getFeaturedProducts()
      .map((product) => ns.ui.productCard(product, { showViewButton: true }))
      .join("");
  }

  function renderRecentlyViewed() {
    const target = document.querySelector("#recently-viewed");
    if (!target || !ns.ui || !ns.store) {
      return;
    }

    const list = ns.store
      .getRecentlyViewed()
      .map((id) => ns.store.getProductById(id))
      .filter(Boolean)
      .slice(0, 4);

    if (list.length === 0) {
      target.innerHTML = `
        <div class="empty-state">
          <p>Recently viewed products will appear here as you browse.</p>
        </div>
      `;
      return;
    }

    target.innerHTML = `<div class="product-grid">${list
      .map((product) => ns.ui.productCard(product, { showViewButton: true }))
      .join("")}</div>`;
  }

  function renderPerformanceTierSummary() {
    const target = document.querySelector("#performance-tier-summary");
    if (!target || !ns.store) {
      return;
    }

    const groups = ns.store.getProducts().reduce(
      (acc, product) => {
        const key = String(product.tier || "Entry");
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { Entry: 0, Enthusiast: 0, Elite: 0 }
    );

    const total = Math.max(1, groups.Entry + groups.Enthusiast + groups.Elite);

    target.innerHTML = `
      <div class="trust-badge">
        <strong>Entry Tier</strong>
        <span>${Math.round((groups.Entry / total) * 100)}% of catalog</span>
      </div>
      <div class="trust-badge">
        <strong>Enthusiast Tier</strong>
        <span>${Math.round((groups.Enthusiast / total) * 100)}% of catalog</span>
      </div>
      <div class="trust-badge">
        <strong>Elite Tier</strong>
        <span>${Math.round((groups.Elite / total) * 100)}% of catalog</span>
      </div>
      <div class="trust-badge">
        <strong>Tier Guide</strong>
        <span>Entry for value, Enthusiast for balance, Elite for max output.</span>
      </div>
    `;
  }

  function init() {
    renderFeatured();
    renderRecentlyViewed();
    renderPerformanceTierSummary();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("bpp:viewed-changed", renderRecentlyViewed);
  window.addEventListener("bpp:wishlist-changed", renderFeatured);
})(window.BPP);
