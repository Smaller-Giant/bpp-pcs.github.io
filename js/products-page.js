window.BPP = window.BPP || {};

(function initProductsPage(ns) {
  const state = {
    search: "",
    category: "all",
    tier: "all",
    sort: "featured",
    wishlistOnly: false
  };

  let stockInterval = null;

  function featuredIndexMap() {
    const map = new Map();
    (ns.featuredProductIds || []).forEach((id, idx) => map.set(id, idx));
    return map;
  }

  function matchesFilters(product) {
    const searchTerm = state.search.trim().toLowerCase();
    const inSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.shortDescription.toLowerCase().includes(searchTerm) ||
      String(product.category).toLowerCase().includes(searchTerm);

    const inCategory = state.category === "all" || String(product.category).toLowerCase() === state.category;
    const inTier = state.tier === "all" || String(product.tier).toLowerCase() === state.tier;
    const inWishlist = !state.wishlistOnly || ns.store.getWishlist().includes(product.id);

    return inSearch && inCategory && inTier && inWishlist;
  }

  function sortProducts(list) {
    const featuredOrder = featuredIndexMap();

    return list.slice().sort((a, b) => {
      if (state.sort === "price-asc") {
        return a.price - b.price;
      }
      if (state.sort === "price-desc") {
        return b.price - a.price;
      }
      if (state.sort === "stock-desc") {
        return ns.store.getSimulatedStock(b.id) - ns.store.getSimulatedStock(a.id);
      }

      const aIdx = featuredOrder.has(a.id) ? featuredOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bIdx = featuredOrder.has(b.id) ? featuredOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
      if (aIdx !== bIdx) {
        return aIdx - bIdx;
      }
      return a.name.localeCompare(b.name);
    });
  }

  function renderProducts() {
    const target = document.querySelector("#products-grid");
    const resultsMeta = document.querySelector("#results-meta");
    if (!target || !ns.store || !ns.ui) {
      return;
    }

    const filtered = sortProducts(ns.store.getProducts().filter(matchesFilters));

    if (resultsMeta) {
      resultsMeta.textContent = `${filtered.length} build${filtered.length === 1 ? "" : "s"} shown`;
    }

    if (filtered.length === 0) {
      target.innerHTML = `
        <div class="empty-state">
          <h3>No builds found</h3>
          <p>Try a broader search, or clear one of the filters.</p>
        </div>
      `;
      return;
    }

    target.innerHTML = filtered.map((product) => ns.ui.productCard(product, { showViewButton: true })).join("");
  }

  function syncLiveStockLabels() {
    if (!ns.store || !ns.ui) {
      return;
    }

    document.querySelectorAll("[data-stock-for]").forEach((el) => {
      const id = el.getAttribute("data-stock-for");
      const nextStock = ns.store.getSimulatedStock(id);
      el.innerHTML = `<span class="stock-dot"></span>${ns.ui.escapeHtml(ns.ui.getStockLabel(nextStock))}`;
    });
  }

  function fillFilterOptions() {
    const categorySelect = document.querySelector("#category-filter");
    const tierSelect = document.querySelector("#tier-filter");
    if (!categorySelect || !tierSelect || !ns.store) {
      return;
    }

    const products = ns.store.getProducts();
    const categories = [...new Set(products.map((product) => String(product.category)))];
    const tiers = [...new Set(products.map((product) => String(product.tier)))];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.toLowerCase();
      option.textContent = category;
      categorySelect.append(option);
    });

    tiers.forEach((tier) => {
      const option = document.createElement("option");
      option.value = tier.toLowerCase();
      option.textContent = tier;
      tierSelect.append(option);
    });
  }

  function openProductModal(productId) {
    const modal = document.querySelector("#product-modal");
    const body = document.querySelector("#product-modal-body");
    if (!modal || !body || !ns.store || !ns.ui) {
      return;
    }

    const product = ns.store.getProductById(productId);
    if (!product) {
      return;
    }

    ns.store.trackViewed(product.id);

    body.innerHTML = `
      <img class="product-image" src="${ns.ui.escapeHtml(product.image)}" alt="${ns.ui.escapeHtml(product.name)} desktop PC">
      <div>
        <span class="tier-chip ${ns.ui.tierClass(product.tier)}">${ns.ui.escapeHtml(product.tier)}</span>
        <h3 style="margin-top:0.55rem;">${ns.ui.escapeHtml(product.name)}</h3>
        <p style="margin-top:0.6rem;">${ns.ui.escapeHtml(product.description)}</p>
        <p style="margin-top:0.9rem;"><strong>${ns.ui.formatCurrency(product.price)}</strong></p>
        <p style="margin-top:0.4rem;font-size:0.85rem;color:var(--muted);">
          Stock: ${ns.ui.escapeHtml(ns.ui.getStockLabel(ns.store.getSimulatedStock(product.id)))}
        </p>
        <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap;">
          <button class="btn btn-primary" type="button" data-add-to-basket="${ns.ui.escapeHtml(product.id)}">Add to Basket</button>
          <button class="btn btn-soft" type="button" data-toggle-wishlist="${ns.ui.escapeHtml(product.id)}">Toggle Wishlist</button>
          <button class="btn btn-secondary" type="button" data-close-modal>Close</button>
        </div>
      </div>
    `;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    const modal = document.querySelector("#product-modal");
    if (modal) {
      modal.hidden = true;
    }
    document.body.style.overflow = "";
  }

  function bindControls() {
    const searchInput = document.querySelector("#search-input");
    const categorySelect = document.querySelector("#category-filter");
    const tierSelect = document.querySelector("#tier-filter");
    const sortSelect = document.querySelector("#sort-filter");
    const wishlistOnlyButton = document.querySelector("#wishlist-only-btn");
    const modal = document.querySelector("#product-modal");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.search = searchInput.value || "";
        renderProducts();
        syncLiveStockLabels();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", () => {
        state.category = categorySelect.value;
        renderProducts();
        syncLiveStockLabels();
      });
    }

    if (tierSelect) {
      tierSelect.addEventListener("change", () => {
        state.tier = tierSelect.value;
        renderProducts();
        syncLiveStockLabels();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        state.sort = sortSelect.value;
        renderProducts();
        syncLiveStockLabels();
      });
    }

    if (wishlistOnlyButton) {
      wishlistOnlyButton.addEventListener("click", () => {
        state.wishlistOnly = !state.wishlistOnly;
        wishlistOnlyButton.classList.toggle("active", state.wishlistOnly);
        wishlistOnlyButton.textContent = state.wishlistOnly ? "Showing Wishlist" : "Wishlist Only";
        renderProducts();
        syncLiveStockLabels();
      });
    }

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest("[data-close-modal]")) {
          closeProductModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProductModal();
      }
    });
  }

  function openFromQueryString() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    if (productId) {
      openProductModal(productId);
    }
  }

  function init() {
    if (!document.querySelector("#products-grid")) {
      return;
    }

    fillFilterOptions();
    bindControls();
    renderProducts();
    syncLiveStockLabels();
    openFromQueryString();

    if (stockInterval) {
      window.clearInterval(stockInterval);
    }
    stockInterval = window.setInterval(syncLiveStockLabels, 26000);
  }

  ns.productsPage = {
    openProductModal
  };

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("bpp:wishlist-changed", renderProducts);
})(window.BPP);
