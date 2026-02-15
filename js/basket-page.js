window.BPP = window.BPP || {};

(function initBasketPage(ns) {
  let isCheckingOut = false;

  function basketRow(item) {
    const { product, quantity, lineTotal } = item;
    return `
      <article class="basket-row" data-row-id="${ns.ui.escapeHtml(product.id)}">
        <img src="${ns.ui.escapeHtml(product.image)}" alt="${ns.ui.escapeHtml(product.name)} desktop PC">
        <div class="basket-row-main">
          <div class="basket-row-top">
            <div>
              <h3>${ns.ui.escapeHtml(product.name)}</h3>
              <p style="margin-top:0.35rem;">${ns.ui.escapeHtml(product.shortDescription)}</p>
            </div>
            <strong>${ns.ui.formatCurrency(lineTotal)}</strong>
          </div>
          <div class="basket-actions">
            <div class="qty-control" aria-label="Quantity controls for ${ns.ui.escapeHtml(product.name)}">
              <button type="button" data-qty-change="${ns.ui.escapeHtml(product.id)}" data-delta="-1">-</button>
              <span>${quantity}</span>
              <button type="button" data-qty-change="${ns.ui.escapeHtml(product.id)}" data-delta="1">+</button>
            </div>
            <button class="btn btn-soft" type="button" data-remove-item="${ns.ui.escapeHtml(product.id)}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderBasket() {
    const listTarget = document.querySelector("#basket-list");
    const summaryTarget = document.querySelector("#basket-summary");
    const checkoutButton = document.querySelector("#checkout-button");
    if (!listTarget || !summaryTarget || !ns.store || !ns.ui) {
      return;
    }

    const items = ns.store.getBasketDetailed();
    const totals = ns.store.getBasketTotals();

    if (items.length === 0) {
      listTarget.innerHTML = `
        <div class="empty-state">
          <h3>Your basket is empty</h3>
          <p>Choose a build to continue to secure checkout.</p>
          <a class="btn btn-primary" href="products.html">Browse PCs</a>
        </div>
      `;
    } else {
      listTarget.innerHTML = items.map(basketRow).join("");
    }

    summaryTarget.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-list">
        <div><span>Items (${totals.itemCount})</span><strong>${ns.ui.formatCurrency(totals.subtotal)}</strong></div>
        <div><span>Shipping</span><strong>${totals.shipping === 0 ? "Free" : ns.ui.formatCurrency(totals.shipping)}</strong></div>
        <div><span>Total</span><strong>${ns.ui.formatCurrency(totals.total)}</strong></div>
      </div>
      <p class="summary-note">
        Free shipping for orders over ${ns.ui.formatCurrency(ns.config.freeShippingThreshold || 0)}.
      </p>
    `;

    if (checkoutButton) {
      checkoutButton.disabled = items.length === 0 || isCheckingOut;
      checkoutButton.textContent = isCheckingOut ? "Redirecting..." : "Proceed to Checkout";
    }
  }

  function resolveCheckoutUrls() {
    const currentUrl = new URL(window.location.href);
    const basePath = currentUrl.pathname.slice(0, currentUrl.pathname.lastIndexOf("/") + 1);
    const base = `${currentUrl.origin}${basePath}`;
    return {
      successUrl: `${base}success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}cancel.html`
    };
  }

  async function startCheckout() {
    if (!ns.store || !ns.config || !ns.ui || isCheckingOut) {
      return;
    }

    const items = ns.store.getBasketDetailed();
    if (items.length === 0) {
      ns.ui.toast("Your basket is empty");
      return;
    }

    const key = String(ns.config.stripePublishableKey || "");
    if (!key.startsWith("pk_") || key.includes("REPLACE_WITH")) {
      ns.ui.toast("Set your Stripe publishable key in js/config.js");
      return;
    }

    const missingPrice = items.find((item) => !String(item.product.priceId || "").startsWith("price_"));
    if (missingPrice) {
      ns.ui.toast(`Add Stripe priceId for ${missingPrice.product.name}`);
      return;
    }

    if (typeof window.Stripe !== "function") {
      ns.ui.toast("Stripe.js failed to load");
      return;
    }

    isCheckingOut = true;
    renderBasket();

    const stripe = window.Stripe(key);
    const urls = resolveCheckoutUrls();

    try {
      const result = await stripe.redirectToCheckout({
        mode: ns.config.stripeMode || "payment",
        lineItems: items.map((item) => ({
          price: item.product.priceId,
          quantity: item.quantity
        })),
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl
      });

      if (result?.error) {
        ns.ui.toast(result.error.message || "Unable to launch Stripe Checkout");
      }
    } catch (error) {
      ns.ui.toast("Checkout request failed");
    } finally {
      isCheckingOut = false;
      renderBasket();
    }
  }

  function handleBasketClicks(event) {
    const qtyButton = event.target.closest("[data-qty-change]");
    if (qtyButton && ns.store) {
      const id = qtyButton.getAttribute("data-qty-change");
      const delta = Number.parseInt(qtyButton.getAttribute("data-delta"), 10) || 0;
      const row = ns.store.getBasket().find((item) => item.id === id);
      const nextQty = (row?.quantity || 0) + delta;
      ns.store.updateBasketQuantity(id, nextQty);
      renderBasket();
      return;
    }

    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton && ns.store) {
      const id = removeButton.getAttribute("data-remove-item");
      ns.store.removeFromBasket(id);
      ns.ui?.toast("Item removed");
      renderBasket();
      return;
    }

    const clearButton = event.target.closest("#clear-basket");
    if (clearButton && ns.store) {
      ns.store.clearBasket();
      renderBasket();
    }
  }

  function init() {
    if (!document.querySelector("#basket-list")) {
      return;
    }

    document.addEventListener("click", handleBasketClicks);
    document.querySelector("#checkout-button")?.addEventListener("click", startCheckout);
    renderBasket();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
