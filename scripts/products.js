(function () {
  const products = window.PRODUCTS || [];
  const storageKey = "bpp-basket";
  const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

  const elements = {
    grid: document.getElementById("productGrid"),
    search: document.getElementById("searchInput"),
    category: document.getElementById("categoryFilter"),
    price: document.getElementById("priceFilter"),
    sort: document.getElementById("sortBy"),
    results: document.getElementById("resultsCount"),
    basketCount: document.getElementById("basketCount")
  };

  if (!elements.grid || !elements.search || !elements.category || !elements.price || !elements.sort || !elements.results) {
    return;
  }

  const state = {
    search: "",
    category: "all",
    price: "all",
    sort: "featured"
  };

  function readBasket() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (_err) {
      return [];
    }
  }

  function writeBasket(nextBasket) {
    localStorage.setItem(storageKey, JSON.stringify(nextBasket));
  }

  function updateBasketCount() {
    if (!elements.basketCount) return;
    const count = readBasket().reduce((sum, item) => sum + item.quantity, 0);
    elements.basketCount.textContent = String(count);
  }

  function addToBasket(productId) {
    const basket = readBasket();
    const line = basket.find((item) => item.id === productId);
    if (line) line.quantity += 1;
    else basket.push({ id: productId, quantity: 1 });
    writeBasket(basket);
    updateBasketCount();
  }

  function inPriceRange(product, priceRange) {
    if (priceRange === "all") return true;
    const [min, max] = priceRange.split("-").map(Number);
    return product.price >= min && product.price <= max;
  }

  function getVisibleProducts() {
    const searchTerm = state.search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.description} ${product.keywords.join(" ")}`.toLowerCase();
      const searchMatch = !searchTerm || text.includes(searchTerm);
      const categoryMatch = state.category === "all" || product.category === state.category;
      return searchMatch && categoryMatch && inPriceRange(product, state.price);
    });

    if (state.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (state.sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));

    return filtered;
  }

  function renderProducts() {
    const visible = getVisibleProducts();
    elements.results.textContent = `${visible.length} product${visible.length === 1 ? "" : "s"} shown`;

    if (!visible.length) {
      elements.grid.innerHTML = '<p class="panel">No products match your current filters.</p>';
      return;
    }

    elements.grid.innerHTML = visible.map((product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="category-tag">${product.category[0].toUpperCase() + product.category.slice(1)}</p>
        <p class="muted">${product.description}</p>
        <div class="price-row">
          <span class="price">${money.format(product.price)}</span>
          <button class="button primary" data-product-id="${product.id}">Add to basket</button>
        </div>
      </article>
    `).join("");

    elements.grid.querySelectorAll("button[data-product-id]").forEach((button) => {
      button.addEventListener("click", () => addToBasket(button.dataset.productId));
    });
  }

  elements.search.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  elements.category.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderProducts();
  });

  elements.price.addEventListener("change", (event) => {
    state.price = event.target.value;
    renderProducts();
  });

  elements.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  updateBasketCount();
  renderProducts();
})();
