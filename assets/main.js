const PRODUCTS = [
  {
    id: "aurora-5070-ti",
    name: "BPP Aurora RTX 5070 Ti",
    slug: "aurora-5070-ti",
    price: 1999,
    description: "A high-end 1440p gaming desktop with efficient cooling, low noise tuning, and strong frame consistency for competitive and cinematic titles.",
    specifications: [
      "AMD Ryzen 7 7800X3D",
      "NVIDIA GeForce RTX 5070 Ti 16GB",
      "32GB DDR5 6000MHz",
      "2TB NVMe Gen4 SSD",
      "850W 80 Plus Gold PSU",
      "240mm liquid CPU cooler"
    ],
    image: "assets/images/aurora-5070-ti.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_aurora5070ti"
  },
  {
    id: "eclipse-5080",
    name: "BPP Eclipse RTX 5080",
    slug: "eclipse-5080",
    price: 2699,
    description: "A premium 4K gaming tower built for ultra settings, high refresh displays, and demanding workloads that need fast GPU acceleration.",
    specifications: [
      "Intel Core Ultra 7 265K",
      "NVIDIA GeForce RTX 5080 16GB",
      "32GB DDR5 6400MHz",
      "2TB NVMe Gen4 SSD",
      "1000W 80 Plus Gold PSU",
      "360mm liquid CPU cooler"
    ],
    image: "assets/images/eclipse-5080.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_eclipse5080"
  },
  {
    id: "studio-x-pro",
    name: "BPP Studio X Pro",
    slug: "studio-x-pro",
    price: 2399,
    description: "A creator-first desktop tuned for editing, rendering, and multi-application workflows where stability and memory capacity matter.",
    specifications: [
      "AMD Ryzen 9 7900X",
      "NVIDIA GeForce RTX 4070 Ti Super",
      "64GB DDR5 5600MHz",
      "2TB NVMe Gen4 SSD + 4TB SATA SSD",
      "850W 80 Plus Gold PSU",
      "Quiet airflow tower chassis"
    ],
    image: "assets/images/studio-x-pro.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_studioxpro"
  },
  {
    id: "starter-4060",
    name: "BPP Starter RTX 4060",
    slug: "starter-4060",
    price: 1199,
    description: "An entry gaming and home productivity desktop with efficient components, fast boot times, and room for straightforward upgrades.",
    specifications: [
      "AMD Ryzen 5 7600",
      "NVIDIA GeForce RTX 4060 8GB",
      "16GB DDR5 5200MHz",
      "1TB NVMe Gen4 SSD",
      "650W 80 Plus Bronze PSU",
      "Air-cooled performance chassis"
    ],
    image: "assets/images/starter-4060.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_starter4060"
  },
  {
    id: "pro-office-i7",
    name: "BPP Pro Office i7",
    slug: "pro-office-i7",
    price: 1299,
    description: "A reliable office and multitasking desktop designed for heavy browser usage, spreadsheets, conferencing, and quiet daily operation.",
    specifications: [
      "Intel Core i7-14700",
      "NVIDIA GeForce RTX 4060",
      "32GB DDR5 5600MHz",
      "1TB NVMe Gen4 SSD",
      "650W 80 Plus Bronze PSU",
      "Low-noise tower cooler"
    ],
    image: "assets/images/pro-office-i7.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_proofficei7"
  },
  {
    id: "ml-workstation-4090",
    name: "BPP ML Workstation RTX 4090",
    slug: "ml-workstation-4090",
    price: 3299,
    description: "A heavy-duty workstation for AI experiments, simulation, and render tasks with high VRAM, broad memory headroom, and sustained compute performance.",
    specifications: [
      "AMD Threadripper 7960X",
      "NVIDIA GeForce RTX 4090 24GB",
      "128GB DDR5 ECC",
      "4TB NVMe Gen4 SSD",
      "1200W 80 Plus Platinum PSU",
      "High-airflow workstation chassis"
    ],
    image: "assets/images/ml-workstation-4090.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_mlworkstation4090"
  }
];

const DEFAULT_A11Y_STATE = {
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false
};

const A11Y_CLASS_MAP = {
  highContrast: "a11y-high-contrast",
  reduceMotion: "a11y-reduce-motion",
  dyslexiaFont: "a11y-dyslexia-font"
};

const A11Y_STORAGE_KEY = "pc_site_accessibility";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getCurrentFileName() {
  const path = window.location.pathname || "";
  const fileName = path.split("/").pop() || "index.html";
  return fileName.toLowerCase();
}

function getProductBySlug(slug) {
  return PRODUCTS.find((product) => product.slug === slug) || null;
}

function getProductImage(product) {
  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }

  return "assets/images/aurora-5070-ti.svg";
}

function getProductDescription(product) {
  if (typeof product.longDescription === "string" && product.longDescription.trim()) {
    return product.longDescription.trim();
  }

  return product.description;
}

function getProductArrayField(product, key, fallbackItems) {
  const value = product[key];
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => String(item || "").trim())
      .filter((item) => item.length > 0);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return fallbackItems;
}

function getSlugFromUrl() {
  const fileName = getCurrentFileName();
  const match = fileName.match(/^product-(.+)\.html$/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  const params = new URLSearchParams(window.location.search);
  return String(params.get("slug") || "").toLowerCase();
}

function createProductCard(product) {
  const specificationItems = product.specifications
    .slice(0, 3)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const productImage = getProductImage(product);
  const productUrl = `product-${product.slug}.html`;

  return `
    <article class="product-card" data-product-url="${escapeHtml(productUrl)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(product.name)} details">
      <img class="product-card-image" src="${escapeHtml(productImage)}" alt="${escapeHtml(product.name)} desktop PC">
      <div class="product-card-body">
        <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p>${escapeHtml(getProductDescription(product))}</p>
        <ul class="product-specs">${specificationItems}</ul>
        <div class="card-actions">
          <a class="button button-secondary" href="${escapeHtml(productUrl)}">View details</a>
          <a class="button button-primary" href="${escapeHtml(product.stripeCheckoutLink)}">Buy Now</a>
        </div>
      </div>
    </article>
  `;
}

function initProductCardNavigation() {
  function isInteractiveTarget(target) {
    return Boolean(target.closest("a, button, input, select, textarea, label"));
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card[data-product-url]");
    if (!card || isInteractiveTarget(event.target)) {
      return;
    }

    const productUrl = card.getAttribute("data-product-url");
    if (productUrl) {
      window.location.href = productUrl;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".product-card[data-product-url]");
    if (!card || event.target !== card) {
      return;
    }

    event.preventDefault();
    const productUrl = card.getAttribute("data-product-url");
    if (productUrl) {
      window.location.href = productUrl;
    }
  });
}

function initBackButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-back-button]");
    if (!button) {
      return;
    }

    const fallback = button.getAttribute("data-back-fallback") || "index.html";
    const hasHistory = window.history.length > 1;
    let isSameOriginReferrer = false;

    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer, window.location.href);
        isSameOriginReferrer = referrerUrl.origin === window.location.origin;
      } catch (error) {
        isSameOriginReferrer = false;
      }
    }

    if (hasHistory && isSameOriginReferrer) {
      window.history.back();
      return;
    }

    window.location.href = fallback;
  });
}

function createProductDetail(product) {
  const specificationItems = product.specifications
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const whyBuyItems = getProductArrayField(product, "whyBuy", [
    "Balanced hardware for reliable day-to-day performance.",
    "Built for straightforward setup and immediate use.",
    "Direct Stripe Checkout buying flow with no account required."
  ])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const otherInfoItems = getProductArrayField(product, "otherInfo", [
    "UK delivery only. See the shipping page for delivery timing and rates.",
    "Returns are available under our returns policy and UK consumer law.",
    "Warranty support is available for eligible hardware defects."
  ])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const productImage = getProductImage(product);

  return `
    <figure class="product-image-frame">
      <img src="${escapeHtml(productImage)}" alt="${escapeHtml(product.name)} desktop PC">
    </figure>
    <div class="product-detail-copy">
      <p class="kicker">Prebuilt Desktop PC</p>
      <h1>${escapeHtml(product.name)}</h1>
      <p class="product-price">${formatPrice(product.price)}</p>
      <section class="product-detail-section">
        <h2>Description</h2>
        <p>${escapeHtml(getProductDescription(product))}</p>
      </section>
      <section class="product-detail-section">
        <h2>Why you should buy it</h2>
        <ul class="specification-list">${whyBuyItems}</ul>
      </section>
      <section class="product-detail-section">
        <h2>Specifications</h2>
        <ul class="specification-list">${specificationItems}</ul>
      </section>
      <section class="product-detail-section">
        <h2>Other information</h2>
        <ul class="specification-list">${otherInfoItems}</ul>
      </section>
      <p class="checkout-disclaimer">You will be redirected to Stripe to securely complete your purchase. Stripe is the payment processor, and payment details are handled by Stripe.</p>
      <a class="button button-primary button-large" href="${escapeHtml(product.stripeCheckoutLink)}">Buy Now</a>
    </div>
  `;
}

function setCopyrightYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = year;
  });
}

function setActiveNavigation() {
  const fileName = getCurrentFileName();
  const navKey = fileName.startsWith("product-") ? "products.html" : fileName;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const isActive = link.getAttribute("data-nav") === navKey;
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initMobileNavigation() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("#primary-nav");
  if (!navToggle || !nav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 860) {
      return;
    }

    const clickedInsideNav = event.target.closest("#primary-nav");
    const clickedToggle = event.target.closest("[data-nav-toggle]");
    if (!clickedInsideNav && !clickedToggle) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function loadAccessibilityState() {
  try {
    const saved = JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) || "{}");
    return {
      highContrast: Boolean(saved.highContrast),
      reduceMotion: Boolean(saved.reduceMotion),
      dyslexiaFont: Boolean(saved.dyslexiaFont)
    };
  } catch (error) {
    return { ...DEFAULT_A11Y_STATE };
  }
}

function saveAccessibilityState(state) {
  localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(state));
}

function applyAccessibilityState(state) {
  Object.keys(A11Y_CLASS_MAP).forEach((key) => {
    document.body.classList.toggle(A11Y_CLASS_MAP[key], Boolean(state[key]));
  });
}

function updateAccessibilityButtons(state) {
  document.querySelectorAll("[data-a11y-action]").forEach((button) => {
    const action = button.getAttribute("data-a11y-action");
    if (action === "reset") {
      return;
    }

    const enabled = Boolean(state[action]);
    button.setAttribute("aria-checked", String(enabled));
    button.classList.toggle("is-active", enabled);
  });
}

function initAccessibilityMenu() {
  const root = document.querySelector("[data-a11y-root]");
  const trigger = document.querySelector("[data-a11y-toggle]");
  const menu = document.querySelector("[data-a11y-menu]");
  if (!root || !trigger || !menu) {
    return;
  }

  let accessibilityState = loadAccessibilityState();
  applyAccessibilityState(accessibilityState);
  updateAccessibilityButtons(accessibilityState);
  let closeMenuTimeout = null;

  function finalizeClose() {
    if (closeMenuTimeout) {
      clearTimeout(closeMenuTimeout);
      closeMenuTimeout = null;
    }

    menu.hidden = true;
  }

  function closeMenu() {
    if (closeMenuTimeout) {
      clearTimeout(closeMenuTimeout);
      closeMenuTimeout = null;
    }

    menu.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    closeMenuTimeout = window.setTimeout(finalizeClose, 180);
  }

  function openMenu() {
    if (closeMenuTimeout) {
      clearTimeout(closeMenuTimeout);
      closeMenuTimeout = null;
    }

    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => {
      menu.classList.add("is-open");
    });
  }

  trigger.addEventListener("click", () => {
    if (menu.hidden || !menu.classList.contains("is-open")) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  menu.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-a11y-action]");
    if (!button) {
      return;
    }

    const action = button.getAttribute("data-a11y-action");
    if (action === "reset") {
      accessibilityState = { ...DEFAULT_A11Y_STATE };
    } else if (Object.prototype.hasOwnProperty.call(accessibilityState, action)) {
      accessibilityState[action] = !accessibilityState[action];
    }

    applyAccessibilityState(accessibilityState);
    updateAccessibilityButtons(accessibilityState);
    saveAccessibilityState(accessibilityState);
  });

  document.addEventListener("click", (event) => {
    if (menu.hidden) {
      return;
    }

    if (!event.target.closest("[data-a11y-root]")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function renderFeaturedProducts() {
  const mount = document.querySelector("[data-featured-products]");
  if (!mount) {
    return;
  }

  mount.innerHTML = PRODUCTS.slice(0, 3).map((product) => createProductCard(product)).join("");
}

function renderProductsPage() {
  const mount = document.querySelector("[data-products-grid]");
  if (!mount) {
    return;
  }

  const searchInput = document.querySelector("[data-product-search]");
  const filterSelect = document.querySelector("[data-product-filter]");
  const sortSelect = document.querySelector("[data-product-sort]");
  const searchTerm = String(searchInput?.value || "").trim().toLowerCase();
  const filterValue = String(filterSelect?.value || "all");
  const sortValue = String(sortSelect?.value || "name-asc");

  let visibleProducts = PRODUCTS.filter((product) => {
    if (!searchTerm) {
      return true;
    }

    const searchTarget = [
      product.name,
      product.slug,
      getProductDescription(product),
      ...(Array.isArray(product.specifications) ? product.specifications : [])
    ]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(searchTerm);
  });

  if (filterValue === "under-1500") {
    visibleProducts = visibleProducts.filter((product) => Number(product.price) < 1500);
  } else if (filterValue === "1500-2500") {
    visibleProducts = visibleProducts.filter((product) => Number(product.price) >= 1500 && Number(product.price) <= 2500);
  } else if (filterValue === "over-2500") {
    visibleProducts = visibleProducts.filter((product) => Number(product.price) > 2500);
  }

  if (sortValue === "price-low-high") {
    visibleProducts = visibleProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "price-high-low") {
    visibleProducts = visibleProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortValue === "name-desc") {
    visibleProducts = visibleProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    visibleProducts = visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (visibleProducts.length === 0) {
    mount.innerHTML = `
      <article class="panel products-empty">
        <h2>No products found</h2>
        <p>Try a different search phrase, filter, or sort option.</p>
      </article>
    `;
    return;
  }

  mount.innerHTML = visibleProducts.map((product) => createProductCard(product)).join("");
}

function initProductsControls() {
  const controls = document.querySelector("[data-product-controls]");
  if (!controls) {
    return;
  }

  const rerender = () => {
    renderProductsPage();
  };

  controls.addEventListener("input", rerender);
  controls.addEventListener("change", rerender);

  const resetButton = controls.querySelector("[data-product-reset]");
  if (!resetButton) {
    return;
  }

  resetButton.addEventListener("click", () => {
    controls.reset();
    rerender();
  });
}

function renderProductPage() {
  const mount = document.querySelector("[data-product-detail]");
  if (!mount) {
    return;
  }

  const slug = getSlugFromUrl();
  const product = getProductBySlug(slug);

  if (!product) {
    mount.innerHTML = `
      <div class="not-found">
        <h1>Product not found</h1>
        <p>The requested desktop PC could not be loaded. Please return to the products page.</p>
        <a class="button button-secondary" href="products.html">Back to products</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} | BPP PCs`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${product.name} specifications and direct Stripe Checkout payment link.`);
  }

  mount.innerHTML = createProductDetail(product);
}

document.addEventListener("DOMContentLoaded", () => {
  setCopyrightYear();
  setActiveNavigation();
  initMobileNavigation();
  initAccessibilityMenu();
  initProductCardNavigation();
  initBackButtons();
  initProductsControls();
  renderFeaturedProducts();
  renderProductsPage();
  renderProductPage();
});
