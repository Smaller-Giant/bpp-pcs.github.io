window.BPP = window.BPP || {};

(function initApp(ns) {
  const config = window.BPP_CONFIG || {};
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(config.currency || "usd").toUpperCase(),
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

  function formatCurrency(value) {
    return formatter.format(Number(value || 0));
  }

  function productCard(product) {
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
          <div class="card-actions">
            <button class="button primary" type="button" data-add-to-basket="${escapeHtml(product.id)}">Add to Basket</button>
          </div>
        </div>
      </article>
    `;
  }

  function showToast(message) {
    let wrap = document.querySelector(".toast-stack");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-stack";
      document.body.append(wrap);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    wrap.append(toast);
    window.setTimeout(() => toast.remove(), 2300);
  }

  function updateBasketBadge() {
    const count = ns.store ? ns.store.getBasketTotals().itemCount : 0;
    document.querySelectorAll("[data-basket-count]").forEach((el) => {
      el.textContent = String(count);
    });
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

  function bindAddToBasket() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-basket]");
      if (!button || !ns.store) {
        return;
      }

      const id = button.getAttribute("data-add-to-basket");
      const product = ns.store.getProductById(id);
      if (!product) {
        return;
      }

      ns.store.addToBasket(id, 1);
      updateBasketBadge();
      showToast(`${product.name} added to basket`);
    });
  }

  function init() {
    setYear();
    setActiveNav();
    updateBasketBadge();
    initMobileNav();
    bindAddToBasket();
  }

  window.addEventListener("bpp:basket-changed", updateBasketBadge);
  document.addEventListener("DOMContentLoaded", init);

  ns.ui = {
    escapeHtml,
    formatCurrency,
    productCard,
    showToast,
    updateBasketBadge
  };
})(window.BPP);
