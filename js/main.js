window.BPP = window.BPP || {};

(function initMain(ns) {
  function syncWishlistButtons() {
    const list = ns.store ? ns.store.getWishlist() : [];
    document.querySelectorAll("[data-toggle-wishlist]").forEach((button) => {
      const id = button.getAttribute("data-toggle-wishlist");
      button.classList.toggle("active", list.includes(id));
    });
  }

  function handleGlobalClick(event) {
    const addButton = event.target.closest("[data-add-to-basket]");
    if (addButton && ns.store) {
      event.preventDefault();
      const id = addButton.getAttribute("data-add-to-basket");
      const product = ns.store.getProductById(id);
      if (!product) {
        return;
      }
      ns.store.addToBasket(id, 1);
      ns.ui?.updateBasketBadge();
      ns.ui?.toast(`${product.name} added to basket`);
      return;
    }

    const wishlistButton = event.target.closest("[data-toggle-wishlist]");
    if (wishlistButton && ns.store) {
      event.preventDefault();
      const id = wishlistButton.getAttribute("data-toggle-wishlist");
      const active = ns.store.toggleWishlist(id);
      wishlistButton.classList.toggle("active", active);
      ns.ui?.toast(active ? "Saved to wishlist" : "Removed from wishlist");
      return;
    }

    const viewButton = event.target.closest("[data-view-product]");
    if (viewButton && ns.store) {
      event.preventDefault();
      const id = viewButton.getAttribute("data-view-product");
      ns.store.trackViewed(id);
      if (typeof ns.productsPage?.openProductModal === "function") {
        ns.productsPage.openProductModal(id);
      } else {
        window.location.href = `products.html?product=${encodeURIComponent(id)}`;
      }
      return;
    }

    const menuToggle = event.target.closest("[data-menu-toggle]");
    if (menuToggle) {
      const links = document.querySelector(".nav-links");
      if (links) {
        links.classList.toggle("open");
      }
    }
  }

  function initNewsletterForms() {
    document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("input[type='email']");
        const value = input?.value?.trim();
        if (!value) {
          ns.ui?.toast("Enter an email to subscribe");
          return;
        }
        if (input) {
          input.value = "";
        }
        ns.ui?.toast("Subscribed to launch and stock alerts");
      });
    });
  }

  function initRevealAnimations() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initBaseLayout() {
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    ns.ui?.setActiveNav();
    ns.ui?.updateBasketBadge();
    syncWishlistButtons();
    initNewsletterForms();
    initRevealAnimations();
  }

  document.addEventListener("click", handleGlobalClick);

  window.addEventListener("bpp:basket-changed", () => {
    ns.ui?.updateBasketBadge();
  });

  window.addEventListener("bpp:wishlist-changed", () => {
    syncWishlistButtons();
  });

  document.addEventListener("DOMContentLoaded", initBaseLayout);
})(window.BPP);
