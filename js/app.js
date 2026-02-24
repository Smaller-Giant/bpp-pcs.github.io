window.BPP = window.BPP || {};

(function initApp(ns) {
  const config = window.BPP_CONFIG || {};
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: String(config.currency || "GBP").toUpperCase(),
    maximumFractionDigits: 0
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatCurrency(value) {
    return formatter.format(Number(value || 0));
  }

  function productCard(product) {
    const specs = Array.isArray(product.specs) ? product.specs.filter(Boolean) : [];
    const specsHtml = specs.length
      ? `
        <ul class="product-specs">
          ${specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("")}
        </ul>
      `
      : "";

    return `
      <article class="product-card">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)} desktop PC">
        <div class="product-content">
          <div class="product-top">
            <span class="product-category">${escapeHtml(product.category)}</span>
            <strong class="product-price">${formatCurrency(product.price)}</strong>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="product-description">${escapeHtml(product.description)}</p>
          ${specsHtml}
          <div class="card-actions">
            <button class="button primary" type="button" data-buy-now="${escapeHtml(product.id)}">Buy Now</button>
          </div>
        </div>
      </article>
    `;
  }

  function setYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function setActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-nav") === page);
    });
  }

  function initMobileNav() {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-mobile-toggle]")) {
        document.querySelector(".nav")?.classList.toggle("open");
      }
    });
  }

  function bindBuyNow() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-buy-now]");
      if (!button || !ns.store) {
        return;
      }

      const id = button.getAttribute("data-buy-now");
      const product = ns.store.getProductById(id);
      const fallbackLink = config.stripeFallbackCheckoutLink;
      const checkoutLink = product?.stripeCheckoutLink || fallbackLink;

      if (!checkoutLink) {
        return;
      }

      window.location.href = checkoutLink;
    });
  }

  function init() {
    setYear();
    setActiveNav();
    initMobileNav();
    bindBuyNow();
  }

  document.addEventListener("DOMContentLoaded", init);

  ns.ui = {
    escapeHtml,
    formatCurrency,
    productCard
  };
})(window.BPP);
