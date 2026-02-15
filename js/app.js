window.BPP = window.BPP || {};

(function initApp(ns) {
  const config = window.BPP_CONFIG || {};
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(config.currency || "usd").toUpperCase(),
    maximumFractionDigits: 0
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatCurrency(amount) {
    return formatter.format(Number(amount || 0));
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getStockLabel(stock) {
    if (stock <= 3) {
      return `Only ${stock} left`;
    }
    if (stock <= 8) {
      return `${stock} in stock`;
    }
    return "Ready to ship";
  }

  function productCarousel(product) {
    const images = Array.isArray(product.images) && product.images.length ? product.images : ["images/products/vanta-s1.svg"];
    const imageNodes = images
      .map(
        (src, index) => `
          <img
            class="carousel-image ${index === 0 ? "is-active" : ""}"
            src="${escapeHtml(src)}"
            alt="${escapeHtml(product.title)} image ${index + 1}"
            data-carousel-image
          >
        `
      )
      .join("");

    const dotNodes = images
      .map(
        (_, index) => `
          <button
            class="carousel-dot ${index === 0 ? "is-active" : ""}"
            type="button"
            data-carousel-dot="${index}"
            aria-label="View image ${index + 1}"
          ></button>
        `
      )
      .join("");

    return `
      <div class="product-carousel" data-carousel data-index="0" data-count="${images.length}">
        <div class="carousel-track">
          ${imageNodes}
        </div>
        ${
          images.length > 1
            ? `
              <button class="carousel-nav prev" type="button" data-carousel-prev aria-label="Previous image">Prev</button>
              <button class="carousel-nav next" type="button" data-carousel-next aria-label="Next image">Next</button>
            `
            : ""
        }
        ${images.length > 1 ? `<div class="carousel-dots">${dotNodes}</div>` : ""}
      </div>
    `;
  }

  function productCard(product, options) {
    const settings = options || {};
    const showSpecs = settings.showSpecs !== false;
    const stock = ns.store ? ns.store.getLiveStock(product.id) : Number(product.stockSeed || 10);
    const specs = Array.isArray(product.specs) ? product.specs.slice(0, 3) : [];

    return `
      <article class="product-card" data-product-id="${escapeHtml(product.id)}">
        ${productCarousel(product)}
        <div class="product-content">
          <div class="product-top">
            <p class="product-category">${escapeHtml(product.category || "Custom")}</p>
            <p class="product-price">${formatCurrency(product.price)}</p>
          </div>
          <h3>${escapeHtml(product.title)}</h3>
          <p class="product-description">${escapeHtml(product.description)}</p>
          ${
            showSpecs && specs.length
              ? `<ul class="spec-list">${specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("")}</ul>`
              : ""
          }
          <div class="product-bottom">
            <span class="stock-tag">${escapeHtml(getStockLabel(stock))}</span>
            <button class="button primary" type="button" data-add-basket="${escapeHtml(product.id)}">Add to Basket</button>
          </div>
        </div>
      </article>
    `;
  }

  function showToast(message) {
    let wrap = document.querySelector(".toast-stack");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-stack";
      document.body.append(wrap);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    wrap.append(toast);

    window.setTimeout(() => toast.remove(), 2500);
  }

  function updateBasketCounter() {
    const count = ns.store ? ns.store.getBasketTotals().itemCount : 0;
    document.querySelectorAll("[data-basket-count]").forEach((el) => {
      el.textContent = String(count);
    });
  }

  function setActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === page);
    });
  }

  function updateCarousel(carousel, nextIndex) {
    const count = Number.parseInt(carousel.getAttribute("data-count"), 10) || 1;
    const index = ((nextIndex % count) + count) % count;
    carousel.setAttribute("data-index", String(index));

    carousel.querySelectorAll("[data-carousel-image]").forEach((img, imgIndex) => {
      img.classList.toggle("is-active", imgIndex === index);
    });

    carousel.querySelectorAll("[data-carousel-dot]").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function initSmoothScroll() {
    if (document.documentElement) {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }

  function initParallax() {
    const nodes = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!nodes.length) {
      return;
    }

    function onScroll() {
      const y = window.scrollY || 0;
      nodes.forEach((node) => {
        const speed = Number(node.getAttribute("data-parallax")) || 0.18;
        node.style.transform = `translateY(${Math.round(y * speed)}px)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initCookieBanner() {
    const key = config.storageKeys?.cookieConsent;
    if (!key) {
      return;
    }

    let accepted = false;
    try {
      accepted = window.localStorage.getItem(key) === "accepted";
    } catch (error) {
      accepted = false;
    }

    if (accepted || document.querySelector(".cookie-banner")) {
      return;
    }

    const banner = document.createElement("aside");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <p>We use cookies for basket persistence and analytics-ready events. Continue to accept.</p>
      <div class="cookie-actions">
        <button class="button secondary" type="button" data-cookie-dismiss>Dismiss</button>
        <button class="button primary" type="button" data-cookie-accept>Accept</button>
      </div>
    `;
    document.body.append(banner);
  }

  function setYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function handleGlobalClick(event) {
    const addButton = event.target.closest("[data-add-basket]");
    if (addButton && ns.store) {
      const productId = addButton.getAttribute("data-add-basket");
      const product = ns.store.getProductById(productId);
      if (product) {
        ns.store.addToBasket(productId, 1);
        updateBasketCounter();
        showToast(`${product.title} added to basket`);
      }
      return;
    }

    const carousel = event.target.closest("[data-carousel]");
    if (carousel) {
      if (event.target.closest("[data-carousel-prev]")) {
        const current = Number.parseInt(carousel.getAttribute("data-index"), 10) || 0;
        updateCarousel(carousel, current - 1);
        return;
      }
      if (event.target.closest("[data-carousel-next]")) {
        const current = Number.parseInt(carousel.getAttribute("data-index"), 10) || 0;
        updateCarousel(carousel, current + 1);
        return;
      }
      const dot = event.target.closest("[data-carousel-dot]");
      if (dot) {
        const index = Number.parseInt(dot.getAttribute("data-carousel-dot"), 10) || 0;
        updateCarousel(carousel, index);
        return;
      }
    }

    if (event.target.closest("[data-cookie-accept]")) {
      const key = config.storageKeys?.cookieConsent;
      if (key) {
        try {
          window.localStorage.setItem(key, "accepted");
        } catch (error) {
          // Ignore storage errors.
        }
      }
      event.target.closest(".cookie-banner")?.remove();
      return;
    }

    if (event.target.closest("[data-cookie-dismiss]")) {
      event.target.closest(".cookie-banner")?.remove();
      return;
    }

    if (event.target.closest("[data-mobile-toggle]")) {
      const nav = document.querySelector("[data-nav-menu]");
      nav?.classList.toggle("open");
    }
  }

  function initNewsletterForms() {
    document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("input[type='email']");
        const email = String(input?.value || "").trim();
        if (!email) {
          showToast("Enter an email address");
          return;
        }
        if (input) {
          input.value = "";
        }
        showToast("Newsletter signup received");
      });
    });
  }

  function init() {
    setYear();
    setActiveNav();
    initSmoothScroll();
    initParallax();
    initCookieBanner();
    initNewsletterForms();
    updateBasketCounter();
  }

  document.addEventListener("click", handleGlobalClick);
  window.addEventListener("bpp:basket-changed", updateBasketCounter);
  window.addEventListener("bpp:products-changed", updateBasketCounter);
  document.addEventListener("DOMContentLoaded", init);

  ns.ui = {
    escapeHtml,
    formatCurrency,
    slugify,
    getStockLabel,
    productCard,
    showToast,
    updateBasketCounter,
    updateCarousel
  };
})(window.BPP);
