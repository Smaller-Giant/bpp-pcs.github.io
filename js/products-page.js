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

    const categories = [...new Set(ns.store.getProducts().map((product) => String(product.category || "Custom")))];
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.toLowerCase();
      option.textContent = category;
      select.append(option);
    });
  }

  function filterProduct(product) {
    const query = state.search.trim().toLowerCase();
    const inCategory = state.category === "all" || String(product.category || "").toLowerCase() === state.category;
    const inSearch =
      !query ||
      String(product.title || "")
        .toLowerCase()
        .includes(query) ||
      String(product.description || "")
        .toLowerCase()
        .includes(query) ||
      String(product.specs || "")
        .toLowerCase()
        .includes(query);
    return inCategory && inSearch;
  }

  function renderProducts() {
    const mount = document.querySelector("#products-grid");
    const count = document.querySelector("#products-count");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const list = ns.store.getProducts().filter(filterProduct);
    if (count) {
      count.textContent = `${list.length} build${list.length === 1 ? "" : "s"} available`;
    }

    if (!list.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <h3>No builds found</h3>
          <p>Try another search or remove filters.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = list.map((product) => ns.ui.productCard(product, { showSpecs: true })).join("");
  }

  function bindFilters() {
    const search = document.querySelector("#product-search");
    const category = document.querySelector("#category-filter");

    if (search) {
      search.addEventListener("input", () => {
        state.search = search.value;
        renderProducts();
      });
    }

    if (category) {
      category.addEventListener("change", () => {
        state.category = category.value;
        renderProducts();
      });
    }
  }

  function init() {
    if (!document.querySelector("#products-grid")) {
      return;
    }

    fillCategoryFilter();
    bindFilters();
    renderProducts();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("bpp:products-changed", renderProducts);
})(window.BPP);
