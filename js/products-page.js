window.BPP = window.BPP || {};

(function initProductsPage(ns) {
  const state = {
    search: "",
    category: "all",
    tier: "all",
    sort: "popularity"
  };

  // Restore tier filtering with backward-compatible fallback for older product records.
  function getTier(product) {
    const rawTier = String(product?.tier || "")
      .trim()
      .toLowerCase();

    if (rawTier === "entry" || rawTier === "performance" || rawTier === "elite") {
      return rawTier;
    }

    const price = Number(product?.price || 0);
    if (price >= 2300) {
      return "elite";
    }
    if (price >= 1500) {
      return "performance";
    }
    return "entry";
  }

  // Restore popularity sorting; products without explicit popularity get a deterministic score.
  function getPopularity(product) {
    const explicit = Number.parseInt(product?.popularity, 10);
    if (Number.isFinite(explicit)) {
      return explicit;
    }

    const price = Number(product?.price || 0);
    const featuredBoost = product?.featured ? 22 : 0;
    return Math.max(10, 100 - Math.round(price / 42) + featuredBoost);
  }

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
    const inTier = state.tier === "all" || getTier(product) === state.tier;
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
    return inCategory && inTier && inSearch;
  }

  function sortProducts(products) {
    const sorted = products.slice();

    sorted.sort((left, right) => {
      if (state.sort === "name-asc") {
        return String(left.title || "").localeCompare(String(right.title || ""));
      }
      if (state.sort === "name-desc") {
        return String(right.title || "").localeCompare(String(left.title || ""));
      }
      if (state.sort === "price-asc") {
        return Number(left.price || 0) - Number(right.price || 0);
      }
      if (state.sort === "price-desc") {
        return Number(right.price || 0) - Number(left.price || 0);
      }

      // Default sort: popularity (high to low), then name for stable ordering.
      const popularityDelta = getPopularity(right) - getPopularity(left);
      if (popularityDelta !== 0) {
        return popularityDelta;
      }
      return String(left.title || "").localeCompare(String(right.title || ""));
    });

    return sorted;
  }

  function renderProducts() {
    const mount = document.querySelector("#products-grid");
    const count = document.querySelector("#products-count");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const list = sortProducts(ns.store.getProducts().filter(filterProduct));
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
    const tier = document.querySelector("#tier-filter");
    const sort = document.querySelector("#sort-filter");

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

    if (tier) {
      tier.addEventListener("change", () => {
        state.tier = tier.value;
        renderProducts();
      });
    }

    if (sort) {
      sort.addEventListener("change", () => {
        state.sort = sort.value;
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
