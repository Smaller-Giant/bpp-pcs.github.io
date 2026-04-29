const PRODUCTS = Array.isArray(window.PC_PRODUCTS) ? [...window.PC_PRODUCTS] : [];

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
const PRODUCT_DETAIL_PAGE = "product.html";
const CART_STORAGE_KEY = "bpppcs_cart";
const CHECKOUT_ENDPOINT = "https://stripe-backend-pi-ten.vercel.app/api/create-checkout-session";
const CHECKOUT_SUCCESS_FLAG = "success";
const CHECKOUT_CANCEL_FLAG = "cancel";
const UPSELL_SESSION_KEY = "bpppcs_pc_upsell_seen";
const BUNDLE_PRODUCT_ID = "bpp-starter-gaming-combo";
const PRODUCT_MEASUREMENT_FIELDS = [
  { key: "length", label: "Length" },
  { key: "width", label: "Width" },
  { key: "height", label: "Height" },
  { key: "weight", label: "Weight" }
];

let toastHideTimeoutId = 0;
let isCheckoutInProgress = false;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  const numericValue = Number(value || 0);
  const hasPence = Math.abs(numericValue % 1) > 0.000001;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: hasPence ? 2 : 0,
    maximumFractionDigits: 2
  }).format(numericValue);
}

function getCurrentFileName() {
  const path = window.location.pathname || "";
  const fileName = path.split("/").pop() || "index.html";
  return fileName.toLowerCase();
}

function normalizeProductKey(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeProductId(value) {
  return String(value || "").trim();
}

function getProductId(product) {
  return normalizeProductId(product?.id);
}

function getProductKey(product) {
  const candidates = [product?.slug, product?.id, product?.name];
  for (const candidate of candidates) {
    const normalized = normalizeProductKey(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function getProductByKey(key) {
  const target = normalizeProductKey(key);
  if (!target) {
    return null;
  }

  return PRODUCTS.find((product) => {
    const productCandidates = [product.slug, product.id, product.name];
    return productCandidates.some((candidate) => normalizeProductKey(candidate) === target);
  }) || null;
}

function getProductById(id) {
  const target = normalizeProductId(id);
  if (!target) {
    return null;
  }

  return PRODUCTS.find((product) => getProductId(product) === target) || null;
}

function getProductBySlug(slug) {
  return getProductByKey(slug);
}

function getProductUrl(key) {
  const normalizedKey = normalizeProductKey(key);
  if (!normalizedKey) {
    return "";
  }

  return `${PRODUCT_DETAIL_PAGE}?slug=${encodeURIComponent(normalizedKey)}`;
}

function isWorkReadyProduct(product) {
  const key = getProductKey(product);
  const id = normalizeProductKey(product?.id);
  return key === "work-ready-pc" || id === "office-ready-pc";
}

function isProductPopular(product) {
  const value = String(product?.popular ?? "").trim().toLowerCase();
  if (!value) {
    return false;
  }

  return value === "yes" || value === "true" || value === "1";
}

function getProductCategory(product) {
  return String(product?.category || "").trim();
}

function isPcProduct(product) {
  return getProductCategory(product).toUpperCase() === "PC";
}

function isBundleProduct(product) {
  return getProductId(product) === BUNDLE_PRODUCT_ID || getProductCategory(product).toUpperCase() === "BUNDLE";
}

function triggersBundleUpsell(product) {
  return isPcProduct(product) && Boolean(product?.triggersBundleUpsell);
}

function shouldShowInCatalog(product) {
  if (!product || typeof product !== "object") {
    return false;
  }

  if (product.visibleInCatalog === false) {
    return false;
  }

  return !isBundleProduct(product);
}

function getProductTypeLabel(product) {
  if (isPcProduct(product)) {
    return "Prebuilt Desktop PC";
  }

  if (isBundleProduct(product)) {
    return "Keyboard + Mouse Bundle";
  }

  if (getProductCategory(product).toUpperCase() === "ACCESSORY") {
    return "Gaming Accessory";
  }

  return "BPP PCs Product";
}

function getBundleProduct() {
  return getProductById(BUNDLE_PRODUCT_ID);
}

function getBundleItems(product) {
  if (!Array.isArray(product?.bundleItems)) {
    return [];
  }

  return product.bundleItems
    .map((itemId) => getProductById(itemId))
    .filter(Boolean);
}

function getProductImage(product) {
  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }

  if (Array.isArray(product.images)) {
    const firstGalleryImage = product.images.find((item) => typeof item === "string" && item.trim());
    if (typeof firstGalleryImage === "string") {
      return firstGalleryImage.trim();
    }
  }

  return "assets/images/work-ready-main.svg";
}

function getProductImages(product) {
  const galleryImages = Array.isArray(product.images)
    ? product.images
      .map((item) => String(item || "").trim())
      .filter((item) => item.length > 0)
    : [];

  if (galleryImages.length > 0) {
    return galleryImages;
  }

  return [getProductImage(product)];
}

function getProductGallerySlides(product) {
  const providedSlides = Array.isArray(product.gallerySlides)
    ? product.gallerySlides
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const image = String(item.image || "").trim();
        if (!image) {
          return null;
        }

        return {
          image,
          title: String(item.title || "").trim(),
          description: String(item.description || "").trim()
        };
      })
      .filter(Boolean)
    : [];

  if (providedSlides.length > 0) {
    return providedSlides;
  }

  return getProductImages(product).map((image, index) => ({
    image,
    title: `${product.name} photo ${index + 1}`,
    description: ""
  }));
}

function getProductSummary(product) {
  if (typeof product?.description === "string" && product.description.trim()) {
    return product.description.trim();
  }

  if (typeof product?.longDescription === "string" && product.longDescription.trim()) {
    return product.longDescription.trim();
  }

  return "";
}

function getProductDescription(product) {
  if (typeof product.longDescription === "string" && product.longDescription.trim()) {
    return product.longDescription.trim();
  }

  return getProductSummary(product);
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

function getProductKeyFeatures(product) {
  return getProductArrayField(product, "keyFeatures", getProductArrayField(product, "whyBuy", []));
}

function getProductWhatItCanRun(product) {
  return getProductArrayField(product, "whatItCanRun", []);
}

function getProductMeasurements(product) {
  const rawMeasurements = product && typeof product.measurements === "object" && product.measurements
    ? product.measurements
    : {};

  return PRODUCT_MEASUREMENT_FIELDS.reduce((result, field) => {
    result[field.key] = String(rawMeasurements[field.key] || "").trim();
    return result;
  }, {});
}

function formatMeasurementValue(value) {
  return String(value || "").trim() || "To be confirmed";
}

function getBundleSavings(product) {
  const bundleItems = getBundleItems(product);
  if (bundleItems.length === 0) {
    return 0;
  }

  const separateTotal = bundleItems.reduce((total, item) => total + Number(item.price || 0), 0);
  const bundlePrice = Number(product?.price || 0);
  const savings = separateTotal - bundlePrice;
  return savings > 0 ? savings : 0;
}

function cartContainsProduct(cart, productLike) {
  return findCartItemIndex(Array.isArray(cart) ? cart : [], productLike) >= 0;
}

function cartContainsPc(cart = loadCart()) {
  return cart.some((item) => {
    const product = getCartProduct(item);
    return isPcProduct(product);
  });
}

function hasSeenUpsellThisSession() {
  try {
    return sessionStorage.getItem(UPSELL_SESSION_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function markUpsellSeenThisSession() {
  try {
    sessionStorage.setItem(UPSELL_SESSION_KEY, "true");
  } catch (error) {
    // Ignore storage availability issues and avoid blocking add-to-cart.
  }
}

function normalizeCartItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawName = String(item.name || "").trim();
  const rawPrice = Number(item.price);
  const quantity = Number(item.quantity);
  const id = normalizeProductId(item.id);
  const key = normalizeProductKey(item.key || item.slug);
  const image = typeof item.image === "string" ? item.image.trim() : "";
  const matchedProduct = id
    ? getProductById(id)
    : getProductByKey(key) || PRODUCTS.find((product) => String(product?.name || "").trim().toLowerCase() === rawName.toLowerCase());

  if (!matchedProduct) {
    return null;
  }

  const name = String(matchedProduct.name || rawName).trim();
  const price = Number.isFinite(Number(matchedProduct.price)) ? Number(matchedProduct.price) : rawPrice;
  const resolvedId = id || getProductId(matchedProduct);
  const resolvedKey = key || (matchedProduct ? getProductKey(matchedProduct) : "");
  const resolvedImage = image || (matchedProduct ? getProductImage(matchedProduct) : "");

  if (!resolvedId || !name || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return {
    id: resolvedId,
    name,
    price,
    quantity: Math.max(1, Math.floor(quantity)),
    key: resolvedKey,
    image: resolvedImage
  };
}

function getCartIdentity(item) {
  const id = normalizeProductId(item?.id);
  if (id) {
    return `id:${id}`;
  }

  const key = normalizeProductKey(item?.key);
  if (key) {
    return `key:${key}`;
  }

  return `name:${String(item?.name || "").trim().toLowerCase()}|price:${Number(item?.price)}`;
}

function matchesCartItem(item, itemLike) {
  const itemId = normalizeProductId(item?.id);
  const targetId = normalizeProductId(itemLike?.id);

  if (itemId && targetId) {
    return itemId === targetId;
  }

  const itemKey = normalizeProductKey(item?.key);
  const targetKey = normalizeProductKey(itemLike?.key);

  if (itemKey && targetKey) {
    return itemKey === targetKey;
  }

  const itemName = String(item?.name || "").trim();
  const targetName = String(itemLike?.name || "").trim();
  const itemPrice = Number(item?.price);
  const targetPrice = Number(itemLike?.price);

  return itemName === targetName && itemPrice === targetPrice;
}

function findCartItemIndex(cart, itemLike) {
  return cart.findIndex((item) => matchesCartItem(item, itemLike));
}

function buildCheckoutItems(cart = loadCart()) {
  const mergedItems = new Map();

  cart.map(normalizeCartItem).filter(Boolean).forEach((item) => {
    const product = getProductById(item.id);
    if (!product) {
      return;
    }

    const identity = getCartIdentity(item);
    const existing = mergedItems.get(identity);

    if (existing) {
      existing.quantity += item.quantity;
      return;
    }

    mergedItems.set(identity, {
      id: getProductId(product),
      quantity: Math.max(1, Math.floor(item.quantity))
    });
  });

  return Array.from(mergedItems.values()).filter((item) => {
    return normalizeProductId(item.id) && Number.isFinite(item.quantity) && item.quantity > 0;
  });
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(normalizeCartItem).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  const cleaned = Array.isArray(cart) ? cart.map(normalizeCartItem).filter(Boolean) : [];
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleaned));
  updateBasketIndicators(cleaned);
  refreshUpsellButtons();
  return cleaned;
}

function syncCartWithCatalog() {
  return saveCart(loadCart());
}

function getBasketItemCount(cart = loadCart()) {
  return cart.reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
}

function updateBasketIndicators(cart = loadCart()) {
  const itemCount = getBasketItemCount(cart);
  const itemLabel = itemCount === 1 ? "1 item" : `${itemCount} items`;

  document.querySelectorAll(".basket-link").forEach((link) => {
    let badge = link.querySelector(".basket-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "basket-count";
      badge.setAttribute("aria-hidden", "true");
      link.appendChild(badge);
    }

    badge.textContent = String(itemCount);
    link.setAttribute("aria-label", `Basket, ${itemLabel}`);
    link.setAttribute("title", `Basket, ${itemLabel}`);
  });
}

function getToastRoot() {
  let toastRoot = document.querySelector("[data-toast-root]");
  if (toastRoot) {
    return toastRoot;
  }

  toastRoot = document.createElement("div");
  toastRoot.className = "toast-root";
  toastRoot.setAttribute("data-toast-root", "");
  toastRoot.setAttribute("aria-live", "polite");
  toastRoot.setAttribute("aria-atomic", "true");

  const toast = document.createElement("div");
  toast.className = "site-toast";
  toast.setAttribute("data-site-toast", "");
  toast.hidden = true;
  toastRoot.appendChild(toast);

  document.body.appendChild(toastRoot);
  return toastRoot;
}

function showToast(message) {
  const toastRoot = getToastRoot();
  const toast = toastRoot.querySelector("[data-site-toast]");
  if (!toast) {
    return;
  }

  window.clearTimeout(toastHideTimeoutId);
  toast.textContent = message;
  toast.hidden = false;

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  toastHideTimeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.hidden = true;
    }, 220);
  }, 2600);
}

function isTrustedCheckoutUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    const trustedHosts = new Set(["checkout.stripe.com", "pay.stripe.com"]);
    return url.protocol === "https:" && trustedHosts.has(url.hostname);
  } catch (error) {
    return false;
  }
}

function setCheckoutButtonsBusy(isBusy) {
  document.querySelectorAll("[data-checkout-button]").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    if (!button.dataset.defaultText) {
      button.dataset.defaultText = button.textContent || "Checkout";
    }

    button.disabled = isBusy;
    button.textContent = isBusy ? "Redirecting..." : button.dataset.defaultText;
  });
}

function createAddToBasketButtonHtml(product, options = {}) {
  const productKey = getProductKey(product);
  const cart = Array.isArray(options.cart) ? options.cart : loadCart();
  const shouldDisableIfInCart = Boolean(options.disableIfInCart);
  const alreadyInCart = shouldDisableIfInCart && cartContainsProduct(cart, product);
  const buttonClasses = options.className || "button button-primary";
  const buttonLabel = alreadyInCart
    ? (options.disabledLabel || "Added to Basket")
    : (options.label || "Add to Basket");
  const trackingAttributes = options.trackUpsellButton
    ? ` data-upsell-bundle-button data-add-label="${escapeHtml(options.label || "Add to Basket")}" data-added-label="${escapeHtml(options.disabledLabel || "Added to Basket")}"`
    : "";
  const extraAttributes = options.extraAttributes ? ` ${options.extraAttributes}` : "";
  const disabledAttributes = alreadyInCart ? ' disabled aria-disabled="true"' : "";

  return `<button class="${escapeHtml(buttonClasses)}" type="button" data-add-to-basket data-product-key="${escapeHtml(productKey)}"${trackingAttributes}${extraAttributes}${disabledAttributes}>${escapeHtml(buttonLabel)}</button>`;
}

function createTrustIndicatorsMarkup() {
  const trustPoints = [
    "Secure Checkout",
    "UK Support",
    "Tested Before Delivery"
  ];

  return `
    <div class="trust-strip" aria-label="BPP PCs trust indicators">
      ${trustPoints.map((item) => `<span class="trust-pill">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function createMeasurementsMarkup(product) {
  const measurements = getProductMeasurements(product);
  const measurementCards = PRODUCT_MEASUREMENT_FIELDS
    .map((field) => {
      const value = formatMeasurementValue(measurements[field.key]);
      return `
        <div class="measurement-card">
          <span class="measurement-label">${escapeHtml(field.label)}</span>
          <strong class="measurement-value">${escapeHtml(value)}</strong>
        </div>
      `;
    })
    .join("");

  return `
    <section class="product-detail-section">
      <h2>Measurements</h2>
      <div class="measurement-grid">
        ${measurementCards}
      </div>
    </section>
  `;
}

function createWhatItCanRunMarkup(product) {
  if (!isPcProduct(product)) {
    return "";
  }

  const items = getProductWhatItCanRun(product);
  if (items.length === 0) {
    return "";
  }

  return `
    <section class="product-detail-section">
      <h2>What it can run</h2>
      <div class="run-list">
        ${items.map((item) => `<span class="run-chip">${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
  `;
}

function createBundleVisualMarkup(product) {
  const bundleItems = getBundleItems(product).slice(0, 2);
  if (bundleItems.length === 0) {
    return `
      <div class="upsell-bundle-visual upsell-bundle-visual--single">
        <div class="upsell-bundle-tile">
          <img src="${escapeHtml(getProductImage(product))}" alt="${escapeHtml(product.name)}">
        </div>
      </div>
    `;
  }

  return `
    <div class="upsell-bundle-visual${bundleItems.length === 1 ? " upsell-bundle-visual--single" : ""}">
      ${bundleItems.map((item) => `
        <div class="upsell-bundle-tile">
          <img src="${escapeHtml(getProductImage(item))}" alt="${escapeHtml(item.name)}">
        </div>
      `).join("")}
    </div>
  `;
}

function createBundleOfferMarkup(product, options = {}) {
  const detailUrl = getProductUrl(getProductKey(product));
  const isMinimal = Boolean(options.minimal);
  const bundlePoints = getProductKeyFeatures(product)
    .slice(0, 4)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const savings = getBundleSavings(product);
  const savingsHtml = !isMinimal && savings > 0
    ? `<p class="bundle-value-note">Better value bundle. Save ${formatPrice(savings)} versus buying separately.</p>`
    : "";
  const messageHtml = !isMinimal && options.message
    ? `<p class="upsell-copy">${escapeHtml(options.message)}</p>`
    : "";
  const pointsHtml = !isMinimal && bundlePoints
    ? `<ul class="product-specs upsell-points">${bundlePoints}</ul>`
    : "";
  const addButtonHtml = createAddToBasketButtonHtml(product, {
    cart: options.cart,
    className: options.buttonClassName || "button button-primary",
    label: options.buttonLabel || "Add to Basket",
    disabledLabel: options.disabledLabel || "Added to Basket",
    disableIfInCart: options.disableIfInCart,
    trackUpsellButton: options.trackUpsellButton,
    extraAttributes: options.extraButtonAttributes || ""
  });
  const viewDetailsHtml = options.showViewDetails === false || !detailUrl
    ? ""
    : `<a class="button button-secondary" href="${escapeHtml(detailUrl)}">View details</a>`;
  const actionsHtml = viewDetailsHtml
    ? `${viewDetailsHtml}${addButtonHtml}`
    : addButtonHtml;

  return `
    <article class="upsell-offer${options.compact ? " upsell-offer--compact" : ""}${isMinimal ? " upsell-offer--minimal" : ""}">
      <div class="upsell-offer-visual">
        ${createBundleVisualMarkup(product)}
      </div>
      <div class="upsell-offer-copy-wrap">
        <p class="kicker">BPP PCs Bundle</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        ${savingsHtml}
        ${messageHtml}
        ${pointsHtml}
        <div class="upsell-offer-actions">
          ${actionsHtml}
        </div>
      </div>
    </article>
  `;
}

function createBundleIncludesMarkup(product) {
  const bundleItems = getBundleItems(product);
  if (bundleItems.length === 0) {
    return "";
  }

  const bundleLinks = bundleItems
    .map((item) => {
      const url = getProductUrl(getProductKey(item));
      return `<li><a class="bundle-item-link" href="${escapeHtml(url)}">${escapeHtml(item.name)}</a></li>`;
    })
    .join("");

  return `
    <section class="product-detail-section">
      <h2>Included in this bundle</h2>
      <ul class="specification-list">${bundleLinks}</ul>
    </section>
  `;
}

function createFrequentlyBoughtTogetherMarkup(product) {
  if (!isPcProduct(product)) {
    return "";
  }

  const bundleProduct = getBundleProduct();
  if (!bundleProduct) {
    return "";
  }

  return `
    <section class="product-detail-section upsell-section">
      <h2>Frequently Bought Together</h2>
      ${createBundleOfferMarkup(bundleProduct, {
        cart: loadCart(),
        buttonClassName: "button button-primary",
        buttonLabel: "Add to Basket",
        disabledLabel: "Added to Basket",
        disableIfInCart: true,
        trackUpsellButton: true,
        showViewDetails: true,
        compact: true,
        minimal: true
      })}
    </section>
  `;
}

function getUpsellModalRoot() {
  let root = document.querySelector("[data-upsell-modal-root]");
  if (root) {
    return root;
  }

  root = document.createElement("div");
  root.className = "upsell-modal-root";
  root.setAttribute("data-upsell-modal-root", "");
  root.hidden = true;
  root.innerHTML = `
    <div class="upsell-modal-backdrop" data-upsell-close></div>
    <div class="upsell-modal panel" role="dialog" aria-modal="true" aria-labelledby="upsell-modal-title">
      <button class="button button-secondary upsell-modal-close" type="button" data-upsell-close aria-label="Close popup">Close</button>
      <div class="upsell-modal-content" data-upsell-modal-content></div>
    </div>
  `;

  document.body.appendChild(root);
  return root;
}

function closeUpsellModal() {
  const root = document.querySelector("[data-upsell-modal-root]");
  if (!root) {
    return;
  }

  root.hidden = true;
  document.body.classList.remove("has-upsell-modal-open");
}

function openUpsellModal() {
  const bundleProduct = getBundleProduct();
  if (!bundleProduct) {
    return;
  }

  const root = getUpsellModalRoot();
  const content = root.querySelector("[data-upsell-modal-content]");
  if (!content) {
    return;
  }

  content.innerHTML = `
    <p class="kicker">Complete your setup</p>
    <h2 id="upsell-modal-title">Add a keyboard & mouse for ${formatPrice(bundleProduct.price)}</h2>
    <p>One click adds the BPP Starter Gaming Combo to your basket.</p>
    ${createBundleOfferMarkup(bundleProduct, {
      cart: loadCart(),
      buttonClassName: "button button-primary button-large",
      buttonLabel: "Add to Basket",
      disabledLabel: "Added to Basket",
      disableIfInCart: true,
      trackUpsellButton: true,
      extraButtonAttributes: 'data-upsell-add="true"',
      showViewDetails: false,
      compact: true,
      minimal: true
    })}
    <button class="button button-secondary upsell-modal-dismiss" type="button" data-upsell-close>Close</button>
  `;

  root.hidden = false;
  document.body.classList.add("has-upsell-modal-open");
  root.querySelector("[data-upsell-add]")?.focus();
}

function maybeOpenPcUpsell(product) {
  if (!triggersBundleUpsell(product) || hasSeenUpsellThisSession()) {
    return;
  }

  markUpsellSeenThisSession();

  const bundleProduct = getBundleProduct();
  if (!bundleProduct) {
    return;
  }

  if (cartContainsProduct(loadCart(), bundleProduct)) {
    return;
  }

  openUpsellModal();
}

function refreshUpsellButtons() {
  const bundleProduct = getBundleProduct();
  if (!bundleProduct) {
    return;
  }

  const isInCart = cartContainsProduct(loadCart(), bundleProduct);
  document.querySelectorAll("[data-upsell-bundle-button]").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const addLabel = button.dataset.addLabel || "Add to Basket";
    const addedLabel = button.dataset.addedLabel || "Added to Basket";
    button.disabled = isInCart;
    button.setAttribute("aria-disabled", String(isInCart));
    button.textContent = isInCart ? addedLabel : addLabel;
  });
}

function initUpsellActions() {
  getUpsellModalRoot();

  document.addEventListener("click", (event) => {
    const closeTrigger = event.target.closest("[data-upsell-close]");
    if (!closeTrigger) {
      return;
    }

    event.preventDefault();
    closeUpsellModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeUpsellModal();
    }
  });
}

function addToCart(product, quantity = 1) {
  const id = getProductId(product);
  const name = String(product?.name || "").trim();
  const price = Number(product?.price);
  const qty = Number(quantity);
  const key = getProductKey(product);
  const image = getProductImage(product);

  if (!id || !name || !Number.isFinite(price) || !Number.isFinite(qty) || qty <= 0) {
    return;
  }

  const cart = loadCart();
  const existingIndex = findCartItemIndex(cart, { id, key, name, price });
  const existing = existingIndex >= 0 ? cart[existingIndex] : null;

  if (existing) {
    existing.quantity = Math.max(1, Math.floor(existing.quantity + qty));
    existing.id = existing.id || id;
    existing.key = existing.key || key;
    existing.image = existing.image || image;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: Math.max(1, Math.floor(qty)),
      key,
      image
    });
  }

  saveCart(cart);
}

function getCartProduct(item) {
  const cartId = normalizeProductId(item?.id);
  if (cartId) {
    const idProduct = getProductById(cartId);
    if (idProduct) {
      return idProduct;
    }
  }

  const cartKey = normalizeProductKey(item?.key);
  if (cartKey) {
    const keyedProduct = getProductByKey(cartKey);
    if (keyedProduct) {
      return keyedProduct;
    }
  }

  const cartName = String(item?.name || "").trim().toLowerCase();
  if (!cartName) {
    return null;
  }

  return PRODUCTS.find((product) => String(product?.name || "").trim().toLowerCase() === cartName) || null;
}

function updateCartItemQuantity(name, price, quantity, key = "", id = "") {
  const cart = loadCart();
  const targetName = String(name || "").trim();
  const targetPrice = Number(price);
  const targetKey = normalizeProductKey(key);
  const explicitTargetId = normalizeProductId(id);
  const targetProduct = getProductById(explicitTargetId) || getProductByKey(targetKey) || PRODUCTS.find((product) => String(product?.name || "").trim() === targetName);
  const resolvedTargetId = explicitTargetId || getProductId(targetProduct);
  if ((!targetName || !Number.isFinite(targetPrice)) && !targetKey && !resolvedTargetId) {
    return cart;
  }

  const itemIndex = findCartItemIndex(cart, { id: resolvedTargetId, key: targetKey, name: targetName, price: targetPrice });
  if (itemIndex === -1) {
    return cart;
  }

  if (!Number.isFinite(quantity)) {
    return cart;
  }

  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  cart[itemIndex].quantity = normalizedQuantity;

  return saveCart(cart);
}

function removeCartItem(name, price, key = "", id = "") {
  const cart = loadCart();
  const targetName = String(name || "").trim();
  const targetPrice = Number(price);
  const targetKey = normalizeProductKey(key);
  const explicitTargetId = normalizeProductId(id);
  const targetProduct = getProductById(explicitTargetId) || getProductByKey(targetKey) || PRODUCTS.find((product) => String(product?.name || "").trim() === targetName);
  const resolvedTargetId = explicitTargetId || getProductId(targetProduct);
  if ((!targetName || !Number.isFinite(targetPrice)) && !targetKey && !resolvedTargetId) {
    return cart;
  }

  const filtered = cart.filter((item) => !matchesCartItem(item, { id: resolvedTargetId, key: targetKey, name: targetName, price: targetPrice }));
  return saveCart(filtered);
}

function handleAddToCart(event) {
  const button = event.target.closest("[data-add-to-basket]");
  if (!button) {
    return;
  }

  event.preventDefault();
  const key = button.getAttribute("data-product-key");
  const product = getProductByKey(key);
  if (!product) {
    return;
  }

  const quantityInput = button
    .closest("[data-product-purchase]")
    ?.querySelector("[data-add-quantity]");
  const quantity = Number(quantityInput?.value || 1);
  const isUpsellAddButton = button.hasAttribute("data-upsell-add");

  addToCart(product, quantity);
  maybeOpenPcUpsell(product);

  if (isUpsellAddButton) {
    closeUpsellModal();
  }

  if (document.querySelector("[data-basket-content]")) {
    renderBasket();
  }

  if (quantity > 1) {
    showToast(`${Math.max(1, Math.floor(quantity))} x ${product.name} have been added to your basket`);
    return;
  }

  showToast(`${product.name} has been added to your basket`);
}

function handleBasketQuantityChange(event) {
  const input = event.target.closest("[data-basket-quantity]");
  if (!input) {
    return;
  }

  const name = input.getAttribute("data-item-name");
  const price = Number(input.getAttribute("data-item-price"));
  const key = input.getAttribute("data-item-key") || "";
  const id = input.getAttribute("data-item-id") || "";
  const quantity = Number(input.value);
  if (!Number.isFinite(quantity)) {
    return;
  }

  updateCartItemQuantity(name, price, Math.floor(quantity), key, id);
  renderBasket();
}

function handleBasketRemove(event) {
  const button = event.target.closest("[data-basket-remove]");
  if (!button) {
    return;
  }

  event.preventDefault();
  const name = button.getAttribute("data-item-name");
  const price = Number(button.getAttribute("data-item-price"));
  const key = button.getAttribute("data-item-key") || "";
  const id = button.getAttribute("data-item-id") || "";
  removeCartItem(name, price, key, id);
  renderBasket();
}

async function handleCheckout(event) {
  const trigger = event.target.closest("[data-checkout-button]");
  if (!trigger) {
    return;
  }

  event.preventDefault();
  if (isCheckoutInProgress) {
    return;
  }

  const checkoutItems = buildCheckoutItems();
  if (checkoutItems.length === 0) {
    alert("Your basket is empty");
    return;
  }

  try {
    isCheckoutInProgress = true;
    setCheckoutButtonsBusy(true);

    const successUrl = new URL(`success.html?checkout=${CHECKOUT_SUCCESS_FLAG}`, window.location.href).toString();
    const cancelUrl = new URL(`cancel.html?checkout=${CHECKOUT_CANCEL_FLAG}`, window.location.href).toString();
    const response = await fetch(CHECKOUT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: checkoutItems,
        successUrl,
        cancelUrl
      })
    });

    if (!response.ok) {
      throw new Error(`Checkout failed (${response.status})`);
    }

    const data = await response.json();
    if (!data || !data.url) {
      throw new Error("Checkout response missing URL.");
    }

    if (!isTrustedCheckoutUrl(data.url)) {
      throw new Error("Checkout response returned an unexpected redirect URL.");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout error:", error);
    alert("We couldn't start checkout right now. Please try again.");
    isCheckoutInProgress = false;
    setCheckoutButtonsBusy(false);
  }
}

function initCartActions() {
  document.addEventListener("click", handleAddToCart);
  document.addEventListener("click", handleCheckout);
}

function initBasketActions() {
  document.addEventListener("change", handleBasketQuantityChange);
  document.addEventListener("click", handleBasketRemove);
}

function setupAmbientVideo(video) {
  if (!(video instanceof HTMLVideoElement) || video.dataset.ambientReady === "true") {
    return;
  }

  const hero = video.closest(".hero");
  let retryTimeoutId = 0;

  function clearRetry() {
    if (retryTimeoutId) {
      window.clearTimeout(retryTimeoutId);
      retryTimeoutId = 0;
    }
  }

  function markReady() {
    if (hero) {
      hero.classList.add("has-video-ready");
    }
  }

  function markFallback() {
    if (hero) {
      hero.classList.remove("has-video-ready");
    }
  }

  function requestPlayback(forceReload = false) {
    const shouldReduceMotion = document.body.classList.contains(A11Y_CLASS_MAP.reduceMotion);
    if (shouldReduceMotion) {
      clearRetry();
      markFallback();
      video.pause();
      return;
    }

    if (forceReload) {
      try {
        video.load();
      } catch (error) {
        console.error("Ambient video reload failed:", error);
      }
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function queueRetry() {
    const shouldReduceMotion = document.body.classList.contains(A11Y_CLASS_MAP.reduceMotion);
    if (shouldReduceMotion) {
      return;
    }

    clearRetry();
    retryTimeoutId = window.setTimeout(() => {
      requestPlayback(true);
    }, 900);
  }

  video.addEventListener("loadeddata", markReady);
  video.addEventListener("canplay", markReady);
  video.addEventListener("playing", () => {
    clearRetry();
    markReady();
  });
  video.addEventListener("stalled", queueRetry);
  video.addEventListener("error", () => {
    markFallback();
    queueRetry();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      requestPlayback(false);
    }
  });

  if (video.readyState >= 2) {
    markReady();
  }

  video.dataset.ambientReady = "true";
}

function syncAmbientVideos() {
  const shouldReduceMotion = document.body.classList.contains(A11Y_CLASS_MAP.reduceMotion);
  document.querySelectorAll("[data-ambient-video]").forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    setupAmbientVideo(video);

    if (shouldReduceMotion) {
      const hero = video.closest(".hero");
      if (hero) {
        hero.classList.remove("has-video-ready");
      }
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });
}

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const paramSlug = normalizeProductKey(params.get("slug"));
  if (paramSlug) {
    return paramSlug;
  }

  const fileName = getCurrentFileName();
  const match = fileName.match(/^product-(.+)\.html$/);
  if (match) {
    return normalizeProductKey(decodeURIComponent(match[1]));
  }

  return "";
}

function createProductCard(product) {
  const featureItems = getProductKeyFeatures(product)
    .slice(0, 3)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const productImage = getProductImage(product);
  const productKey = getProductKey(product);
  const productUrl = `${PRODUCT_DETAIL_PAGE}?slug=${encodeURIComponent(productKey)}`;
  const addAction = `<button class="button button-primary" type="button" data-add-to-basket data-product-key="${escapeHtml(productKey)}">Add to Basket</button>`;

  const safeKey = productKey ? productKey.replace(/[^a-z0-9]+/gi, "-") : "";
  const cardClass = `product-card${safeKey ? ` product-card--${safeKey}` : ""}`;

  return `
    <article class="${cardClass}" data-product-url="${escapeHtml(productUrl)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(product.name)} details">
      <img class="product-card-image" src="${escapeHtml(productImage)}" alt="${escapeHtml(product.name)}">
      <div class="product-card-body">
        <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-card-description">${escapeHtml(getProductSummary(product))}</p>
        <ul class="product-specs product-card-specs">${featureItems}</ul>
        <div class="card-actions">
          <a class="button button-secondary" href="${escapeHtml(productUrl)}">View details</a>
          ${addAction}
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
  const productKey = getProductKey(product);
  const productTypeLabel = getProductTypeLabel(product);
  const productSummary = getProductSummary(product);
  const productDescription = getProductDescription(product);
  const keyFeatureItems = getProductKeyFeatures(product)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const otherInfoItems = getProductArrayField(product, "otherInfo", [
    "UK delivery only. See the shipping page for delivery timing and rates.",
    "Returns are available under our returns policy and UK consumer law.",
    "Warranty support is available for eligible hardware defects."
  ])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const keyFeaturesSection = keyFeatureItems
    ? `
      <section class="product-detail-section">
        <h2>Key Features</h2>
        <ul class="specification-list feature-list">${keyFeatureItems}</ul>
      </section>
    `
    : "";
  const measurementsSection = createMeasurementsMarkup(product);
  const whatItCanRunSection = createWhatItCanRunMarkup(product);
  const bundleIncludesSection = isBundleProduct(product)
    ? createBundleIncludesMarkup(product)
    : "";
  const bundleSavings = isBundleProduct(product) ? getBundleSavings(product) : 0;
  const bundleValueNote = bundleSavings > 0
    ? `<p class="bundle-value-note">Better value bundle. Save ${formatPrice(bundleSavings)} versus buying separately.</p>`
    : "";
  const frequentlyBoughtTogetherSection = createFrequentlyBoughtTogetherMarkup(product);
  const trustIndicators = createTrustIndicatorsMarkup();
  const gallerySlideData = getProductGallerySlides(product);
  const gallerySlides = gallerySlideData
    .map((slide, index) => {
      const title = slide.title || `${product.name} photo ${index + 1}`;
      const descriptionHtml = slide.description
        ? `<p>${escapeHtml(slide.description)}</p>`
        : "";

      return `
      <figure class="product-image-frame product-gallery-slide" data-gallery-slide-index="${index}">
        <img src="${escapeHtml(slide.image)}" alt="${escapeHtml(title)}"${index > 0 ? ' loading="lazy"' : ""}>
        <figcaption class="product-gallery-caption">
          <h3>${escapeHtml(title)}</h3>
          ${descriptionHtml}
        </figcaption>
      </figure>
    `;
    })
    .join("");
  const galleryControls = gallerySlideData.length > 1
    ? `
      <div class="product-gallery-controls">
        <button class="button button-secondary" type="button" data-gallery-action="prev" aria-label="Show previous product photo">Previous photo</button>
        <button class="button button-secondary" type="button" data-gallery-action="next" aria-label="Show next product photo">Next photo</button>
      </div>
    `
    : "";
  const addToBasketAction = `<button class="button button-primary button-large" type="button" data-add-to-basket data-product-key="${escapeHtml(productKey)}">Add to Basket</button>`;
  return `
    <section class="product-gallery" data-product-gallery>
      <div class="product-gallery-track" data-product-gallery-track aria-label="${escapeHtml(product.name)} photo gallery">
        ${gallerySlides}
      </div>
      ${galleryControls}
    </section>
    <div class="product-detail-copy">
      <p class="kicker">${escapeHtml(productTypeLabel)}</p>
      <h1>${escapeHtml(product.name)}</h1>
      <p class="product-price">${formatPrice(product.price)}</p>
      <p class="product-summary">${escapeHtml(productSummary)}</p>
      ${bundleValueNote}
      ${trustIndicators}
      <section class="product-detail-section">
        <h2>Description</h2>
        <p>${escapeHtml(productDescription)}</p>
      </section>
      ${keyFeaturesSection}
      ${whatItCanRunSection}
      ${measurementsSection}
      <section class="product-detail-section">
        <h2>Specifications</h2>
        <ul class="specification-list">${specificationItems}</ul>
      </section>
      ${bundleIncludesSection}
      <section class="product-detail-section">
        <h2>Other information</h2>
        <ul class="specification-list">${otherInfoItems}</ul>
      </section>
      ${frequentlyBoughtTogetherSection}
      <div class="product-purchase" data-product-purchase>
        <label class="product-quantity-label" for="product-quantity">Quantity</label>
        <input class="product-quantity-input" id="product-quantity" type="number" min="1" step="1" value="1" data-add-quantity inputmode="numeric">
      </div>
      <p class="checkout-disclaimer">Add items to your basket, then checkout securely with Stripe.</p>
      ${addToBasketAction}
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
  const navKey = fileName.startsWith("product-") || fileName === "product.html" ? "products.html" : fileName;

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

  syncAmbientVideos();
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

  const popularProducts = PRODUCTS
    .filter((product) => shouldShowInCatalog(product) && isProductPopular(product))
    .slice(0, 3);

  mount.innerHTML = popularProducts.map((product) => createProductCard(product)).join("");
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
    if (!shouldShowInCatalog(product)) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const searchTarget = [
      product.name,
      product.slug,
      getProductSummary(product),
      getProductDescription(product),
      ...getProductKeyFeatures(product),
      ...getProductWhatItCanRun(product),
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

function initProductGalleries() {
  document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
    const track = gallery.querySelector("[data-product-gallery-track]");
    const prevButton = gallery.querySelector('[data-gallery-action="prev"]');
    const nextButton = gallery.querySelector('[data-gallery-action="next"]');
    const slides = Array.from(track?.querySelectorAll("[data-gallery-slide-index]") || []);
    if (!track || slides.length === 0) {
      return;
    }

    const shouldReduceMotion = () => document.body.classList.contains("a11y-reduce-motion");
    const maxIndex = slides.length - 1;

    function getActiveIndex() {
      const trackRect = track.getBoundingClientRect();
      let activeIndex = 0;
      let closestOffset = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideRect = slide.getBoundingClientRect();
        const offset = Math.abs(slideRect.left - trackRect.left);
        if (offset < closestOffset) {
          closestOffset = offset;
          activeIndex = index;
        }
      });

      return activeIndex;
    }

    function goToIndex(index) {
      const clampedIndex = Math.max(0, Math.min(maxIndex, index));
      const targetSlide = slides[clampedIndex];
      if (!targetSlide) {
        return;
      }

      targetSlide.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "nearest",
        inline: "start"
      });
    }

    function updateButtons() {
      const activeIndex = getActiveIndex();
      if (prevButton) {
        prevButton.disabled = activeIndex <= 0;
      }
      if (nextButton) {
        nextButton.disabled = activeIndex >= maxIndex;
      }
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        const activeIndex = getActiveIndex();
        goToIndex(activeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const activeIndex = getActiveIndex();
        goToIndex(activeIndex + 1);
      });
    }

    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
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
    document.body.classList.remove("is-work-ready-product");
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
    metaDescription.setAttribute("content", `${product.name}. ${getProductSummary(product)} Secure checkout from BPP PCs.`);
  }

  document.body.classList.toggle("is-work-ready-product", isWorkReadyProduct(product));
  mount.innerHTML = createProductDetail(product);
  initProductGalleries();
}

function createBasketUpsellMarkup(cart) {
  return "";
}

function renderBasket() {
  const mount = document.querySelector("[data-basket-content]");
  if (!mount) {
    return;
  }

  const cart = loadCart();
  if (cart.length === 0) {
    mount.innerHTML = `
      <div class="basket-empty">
        <h2>Your basket is empty</h2>
        <p>Browse the product range to add a custom PC to your basket.</p>
        <a class="button button-secondary" href="products.html">Browse products</a>
      </div>
    `;
    return;
  }

  const itemsHtml = cart
    .map((item, index) => {
      const inputId = `basket-qty-${index + 1}`;
      const subtotal = Number(item.price) * Number(item.quantity);
      const product = getCartProduct(item);
      const productId = item.id || getProductId(product);
      const productKey = product ? getProductKey(product) : item.key;
      const productUrl = getProductUrl(productKey);
      const productImage = item.image || (product ? getProductImage(product) : "assets/images/work-ready-main.svg");
      const titleHtml = productUrl
        ? `<a class="basket-item-title" href="${escapeHtml(productUrl)}">${escapeHtml(item.name)}</a>`
        : `<span class="basket-item-title">${escapeHtml(item.name)}</span>`;
      const imageHtml = productUrl
        ? `<a class="basket-item-image-link" href="${escapeHtml(productUrl)}"><img class="basket-item-image" src="${escapeHtml(productImage)}" alt="${escapeHtml(item.name)}"></a>`
        : `<div class="basket-item-image-link"><img class="basket-item-image" src="${escapeHtml(productImage)}" alt="${escapeHtml(item.name)}"></div>`;
      return `
        <article class="basket-item">
          <div class="basket-item-main">
            ${imageHtml}
            <div class="basket-item-copy">
              <h2>${titleHtml}</h2>
              <p class="basket-item-price">${formatPrice(item.price)}</p>
            </div>
          </div>
          <div class="basket-quantity">
            <label for="${escapeHtml(inputId)}">Quantity</label>
            <input id="${escapeHtml(inputId)}" type="number" min="1" step="1" value="${escapeHtml(item.quantity)}" data-basket-quantity data-item-id="${escapeHtml(productId || "")}" data-item-key="${escapeHtml(productKey || "")}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}">
          </div>
          <div class="basket-item-subtotal">${formatPrice(subtotal)}</div>
          <button class="button button-secondary" type="button" data-basket-remove data-item-id="${escapeHtml(productId || "")}" data-item-key="${escapeHtml(productKey || "")}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}">Remove</button>
        </article>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const basketUpsell = createBasketUpsellMarkup(cart);

  mount.innerHTML = `
    <div class="basket-list">${itemsHtml}</div>
    <div class="basket-summary">
      <div class="basket-total">
        <span>Total</span>
        <strong>${formatPrice(total)}</strong>
      </div>
      <div class="basket-actions">
        <a class="button button-secondary" href="products.html">Continue shopping</a>
        <button class="button button-primary" type="button" data-checkout-button>Checkout</button>
      </div>
    </div>
    ${basketUpsell}
  `;
}

function initCheckoutOutcomePages() {
  const fileName = getCurrentFileName();
  const params = new URLSearchParams(window.location.search);
  const checkoutStatus = params.get("checkout");
  const hasSessionId = params.has("session_id");

  if (fileName === "success.html" && (checkoutStatus === CHECKOUT_SUCCESS_FLAG || hasSessionId)) {
    saveCart([]);
  }

  if (fileName === "thank-you.html") {
    saveCart([]);
  }
}

function initBasketIndicatorSync() {
  updateBasketIndicators();
  refreshUpsellButtons();

  window.addEventListener("storage", (event) => {
    if (event.key === CART_STORAGE_KEY) {
      updateBasketIndicators();
      renderBasket();
      refreshUpsellButtons();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  syncCartWithCatalog();
  setCopyrightYear();
  setActiveNavigation();
  initMobileNavigation();
  initAccessibilityMenu();
  initUpsellActions();
  initCartActions();
  initBasketActions();
  initProductCardNavigation();
  initBackButtons();
  initProductsControls();
  renderFeaturedProducts();
  renderProductsPage();
  renderProductPage();
  renderBasket();
  initCheckoutOutcomePages();
  initBasketIndicatorSync();
  syncAmbientVideos();
  refreshUpsellButtons();
});
