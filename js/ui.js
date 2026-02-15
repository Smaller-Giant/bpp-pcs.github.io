window.BPP = window.BPP || {};

(function initUi(ns) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(ns.config?.currency || "usd").toUpperCase(),
    maximumFractionDigits: 0
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatCurrency(amount) {
    return formatter.format(Number(amount || 0));
  }

  function tierClass(tier) {
    const cleaned = String(tier || "")
      .trim()
      .toLowerCase();
    if (cleaned === "elite") {
      return "tier-elite";
    }
    if (cleaned === "enthusiast") {
      return "tier-enthusiast";
    }
    return "tier-entry";
  }

  function getStockLabel(quantity) {
    if (quantity <= 3) {
      return `Only ${quantity} left`;
    }
    if (quantity <= 8) {
      return `${quantity} in stock`;
    }
    return "Ready to ship";
  }

  function productCard(product, options = {}) {
    const store = ns.store;
    const stock = store ? store.getSimulatedStock(product.id) : Number(product.stockSeed || 8);
    const wishlist = store ? store.getWishlist() : [];
    const isWishlisted = wishlist.includes(product.id);
    const showViewButton = options.showViewButton !== false;

    return `
      <article class="product-card" data-product-id="${escapeHtml(product.id)}">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)} desktop PC">
        <div class="product-body">
          <div class="product-meta-row">
            <span class="tier-chip ${tierClass(product.tier)}">${escapeHtml(product.tier)}</span>
            <strong class="product-price">${formatCurrency(product.price)}</strong>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.shortDescription)}</p>
          <span class="stock-chip" data-stock-for="${escapeHtml(product.id)}"><span class="stock-dot"></span>${escapeHtml(
      getStockLabel(stock)
    )}</span>
          <div class="card-actions">
            <button class="btn btn-primary" type="button" data-add-to-basket="${escapeHtml(product.id)}">Add to Basket</button>
            <button class="btn btn-soft wishlist-btn ${isWishlisted ? "active" : ""}" type="button" data-toggle-wishlist="${escapeHtml(product.id)}">Wishlist</button>
            ${
              showViewButton
                ? `<button class="btn btn-secondary" type="button" data-view-product="${escapeHtml(product.id)}">View Details</button>`
                : ""
            }
          </div>
        </div>
      </article>
    `;
  }

  function updateBasketBadge() {
    const count = ns.store ? ns.store.getBasketTotals().itemCount : 0;
    document.querySelectorAll(".basket-count").forEach((el) => {
      el.textContent = String(count);
    });
  }

  function setActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const target = el.getAttribute("data-nav");
      el.classList.toggle("active", target === page);
    });
  }

  function ensureToastContainer() {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.append(wrap);
    }
    return wrap;
  }

  function toast(message) {
    const wrap = ensureToastContainer();
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    wrap.append(item);

    window.setTimeout(() => {
      item.remove();
    }, 2400);
  }

  ns.ui = {
    escapeHtml,
    formatCurrency,
    tierClass,
    getStockLabel,
    productCard,
    updateBasketBadge,
    setActiveNav,
    toast
  };
})(window.BPP);
