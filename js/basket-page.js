window.BPP = window.BPP || {};

(function initBasketPage(ns) {
  let checkoutBusy = false;

  function basketRow(row) {
    const product = row.product;
    const firstImage =
      Array.isArray(product.images) && product.images.length ? product.images[0] : "images/products/vanta-s1.svg";

    return `
      <article class="basket-row" data-row="${ns.ui.escapeHtml(product.id)}">
        <img class="basket-image" src="${ns.ui.escapeHtml(firstImage)}" alt="${ns.ui.escapeHtml(product.title)}">
        <div class="basket-info">
          <div class="basket-head">
            <div>
              <h3>${ns.ui.escapeHtml(product.title)}</h3>
              <p>${ns.ui.escapeHtml(product.description)}</p>
            </div>
            <strong>${ns.ui.formatCurrency(row.lineTotal)}</strong>
          </div>
          <div class="basket-controls">
            <div class="qty-control" aria-label="Quantity controls for ${ns.ui.escapeHtml(product.title)}">
              <button type="button" data-qty="${ns.ui.escapeHtml(product.id)}" data-step="-1">-</button>
              <span>${row.quantity}</span>
              <button type="button" data-qty="${ns.ui.escapeHtml(product.id)}" data-step="1">+</button>
            </div>
            <button class="button ghost" type="button" data-remove="${ns.ui.escapeHtml(product.id)}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderSummary() {
    const mount = document.querySelector("#basket-summary");
    const checkoutBtn = document.querySelector("#checkout-button");
    if (!mount || !ns.store || !ns.ui) {
      return;
    }

    const totals = ns.store.getBasketTotals();
    mount.innerHTML = `
      <h3>Order Summary</h3>
      <dl class="summary-grid">
        <div><dt>Items (${totals.itemCount})</dt><dd>${ns.ui.formatCurrency(totals.subtotal)}</dd></div>
        <div><dt>Shipping</dt><dd>${totals.shipping ? ns.ui.formatCurrency(totals.shipping) : "Free"}</dd></div>
        <div><dt>Total</dt><dd>${ns.ui.formatCurrency(totals.total)}</dd></div>
      </dl>
      <p class="meta-note">Shipping becomes free over ${ns.ui.formatCurrency(window.BPP_CONFIG.freeShippingThreshold)}.</p>
    `;

    if (checkoutBtn) {
      checkoutBtn.disabled = totals.itemCount === 0 || checkoutBusy;
      checkoutBtn.textContent = checkoutBusy ? "Redirecting..." : "Checkout with Stripe";
    }
  }

  function renderRows() {
    const mount = document.querySelector("#basket-rows");
    if (!mount || !ns.store) {
      return;
    }

    const rows = ns.store.getBasketRows();
    if (!rows.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <h3>Your basket is empty</h3>
          <p>Select a build to continue.</p>
          <a class="button primary" href="products.html">Browse Products</a>
        </div>
      `;
      renderSummary();
      return;
    }

    mount.innerHTML = rows.map((row) => basketRow(row)).join("");
    renderSummary();
  }

  function buildCheckoutUrls() {
    const current = new URL(window.location.href);
    const basePath = current.pathname.slice(0, current.pathname.lastIndexOf("/") + 1);
    const base = `${current.origin}${basePath}`;
    return {
      successUrl: `${base}success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}cancel.html`
    };
  }

  async function startCheckout() {
    if (!ns.store || !ns.ui || checkoutBusy) {
      return;
    }

    const rows = ns.store.getBasketRows();
    if (!rows.length) {
      ns.ui.showToast("Basket is empty");
      return;
    }

    const key = String(window.BPP_CONFIG.stripePublishableKey || "");
    if (!key.startsWith("pk_") || key.includes("REPLACE_WITH")) {
      ns.ui.showToast("Set Stripe key in js/config.js");
      return;
    }

    const missingPrice = rows.find((row) => !String(row.product.stripePriceId || "").startsWith("price_"));
    if (missingPrice) {
      ns.ui.showToast(`Missing Stripe price ID: ${missingPrice.product.title}`);
      return;
    }

    if (typeof window.Stripe !== "function") {
      ns.ui.showToast("Stripe library did not load");
      return;
    }

    checkoutBusy = true;
    renderSummary();

    try {
      const stripe = window.Stripe(key);
      const urls = buildCheckoutUrls();
      const response = await stripe.redirectToCheckout({
        mode: window.BPP_CONFIG.stripeMode || "payment",
        lineItems: rows.map((row) => ({
          price: row.product.stripePriceId,
          quantity: row.quantity
        })),
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl
      });

      if (response && response.error) {
        ns.ui.showToast(response.error.message || "Checkout failed");
      }
    } catch (error) {
      ns.ui.showToast("Checkout failed");
    } finally {
      checkoutBusy = false;
      renderSummary();
    }
  }

  function handleClicks(event) {
    const qtyButton = event.target.closest("[data-qty]");
    if (qtyButton && ns.store) {
      const id = qtyButton.getAttribute("data-qty");
      const step = Number.parseInt(qtyButton.getAttribute("data-step"), 10) || 0;
      const row = ns.store.getBasket().find((entry) => entry.id === id);
      const nextQuantity = (row?.quantity || 0) + step;
      ns.store.setBasketQuantity(id, nextQuantity);
      renderRows();
      return;
    }

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton && ns.store) {
      const id = removeButton.getAttribute("data-remove");
      ns.store.removeFromBasket(id);
      ns.ui.showToast("Item removed");
      renderRows();
      return;
    }

    if (event.target.closest("#clear-basket") && ns.store) {
      ns.store.clearBasket();
      renderRows();
    }
  }

  function init() {
    if (!document.querySelector("#basket-rows")) {
      return;
    }

    document.addEventListener("click", handleClicks);
    document.querySelector("#checkout-button")?.addEventListener("click", startCheckout);
    renderRows();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("bpp:basket-changed", renderRows);
})(window.BPP);
