// Single source of truth lives in assets/products.js.
const PRODUCTS = Array.isArray(window.PC_PRODUCTS) ? window.PC_PRODUCTS : [];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function productCard(product) {
  const specs = Array.isArray(product.specifications) ? product.specifications : [];
  const specsHtml = specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const image = product.image || "";
  const productKey = String(product.slug || product.id || product.name || "").trim().toLowerCase();
  const productUrl = `product.html?slug=${encodeURIComponent(productKey)}`;

  return `
    <article class="product-card">
      <img class="product-image" src="${escapeHtml(image)}" alt="${escapeHtml(product.name)} desktop PC">
      <div class="product-content">
        <div class="product-top">
          <span class="product-category">Prebuilt PC</span>
          <strong class="product-price">${formatCurrency(product.price)}</strong>
        </div>
        <h3>${escapeHtml(product.name)}</h3>
        <ul class="product-specs">${specsHtml}</ul>
        <div class="card-actions">
          <a class="button secondary" href="${escapeHtml(productUrl)}">View Details</a>
          <a class="button primary" href="${escapeHtml(product.stripeCheckoutLink)}">Buy Now</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const mount = document.querySelector("#products-grid");
  if (!mount) {
    return;
  }

  mount.innerHTML = PRODUCTS.map((product) => productCard(product)).join("");
}

function bindMobileNav() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-mobile-toggle]")) {
      document.querySelector(".nav")?.classList.toggle("open");
    }
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  bindMobileNav();
  renderProducts();
});
