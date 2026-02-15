window.BPP = window.BPP || {};

(function initHomePage(ns) {
  function renderFeatured() {
    const mount = document.querySelector("#featured-products");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const featured = ns.store
      .getProducts()
      .filter((product) => product.featured)
      .slice(0, 4);

    mount.innerHTML = featured.map((product) => ns.ui.productCard(product, { showSpecs: true })).join("");
  }

  function renderHighlights() {
    const mount = document.querySelector("#build-highlight-cards");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const products = ns.store.getProducts().slice(0, 3);
    mount.innerHTML = products
      .map((product) => {
        const stock = ns.store.getLiveStock(product.id);
        return `
          <article class="highlight-card">
            <h3>${ns.ui.escapeHtml(product.title)}</h3>
            <p>${ns.ui.escapeHtml(product.specs.join(" | "))}</p>
            <p class="highlight-meta">${ns.ui.escapeHtml(product.category)} | ${ns.ui.escapeHtml(
          ns.ui.getStockLabel(stock)
        )}</p>
          </article>
        `;
      })
      .join("");
  }

  function init() {
    renderFeatured();
    renderHighlights();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("bpp:products-changed", init);
})(window.BPP);
