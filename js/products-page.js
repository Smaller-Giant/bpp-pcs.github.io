window.BPP = window.BPP || {};

(function initProductsPage(ns) {
  const state = {
    search: "",
    category: "all"
  };

  function fillCategoryFilter() {
    const select = document.querySelector("#category-filter");
    if (!select || !ns.store) {
      return;
    }

    const categories = [...new Set(ns.store.getProducts().map((product) => product.category))];
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.toLowerCase();
      option.textContent = category;
      select.append(option);
    });
  }

  function matches(product) {
    const query = state.search.trim().toLowerCase();
    const categoryMatch = state.category === "all" || product.category.toLowerCase() === state.category;
    const queryMatch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  }

  function renderProducts() {
    const mount = document.querySelector("#products-grid");
    const count = document.querySelector("#products-count");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const products = ns.store.getProducts().filter(matches);
    if (count) {
      count.textContent = `${products.length} product${products.length === 1 ? "" : "s"} available`;
    }

    mount.innerHTML = products.map((product) => ns.ui.productCard(product)).join("");
  }

  function bindControls() {
    const searchInput = document.querySelector("#product-search");
    const categorySelect = document.querySelector("#category-filter");

    searchInput?.addEventListener("input", () => {
      state.search = searchInput.value;
      renderProducts();
    });

    categorySelect?.addEventListener("change", () => {
      state.category = categorySelect.value;
      renderProducts();
    });
  }

  function init() {
    if (!document.querySelector("#products-grid")) {
      return;
    }
    fillCategoryFilter();
    bindControls();
    renderProducts();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
