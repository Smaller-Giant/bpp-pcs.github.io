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
      .slice(0, 3);

    mount.innerHTML = featured.map((product) => ns.ui.productCard(product)).join("");
  }

  function init() {
    renderFeatured();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
