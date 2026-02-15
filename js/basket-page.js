window.BPP = window.BPP || {};

(function initBasketPage(ns) {
  let redirecting = false;

  function basketRow(row) {
    return `
      <article class="basket-row">
        <img class="basket-image" src="${ns.ui.escapeHtml(row.product.image)}" alt="${ns.ui.escapeHtml(row.product.name)} desktop PC">
        <div class="basket-info">
          <div class="basket-head">
            <div>
              <h3>${ns.ui.escapeHtml(row.product.name)}</h3>
              <p>${ns.ui.escapeHtml(row.product.description)}</p>
            </div>
            <strong>${ns.ui.formatCurrency(row.lineTotal)}</strong>
          </div>
          <div class="basket-controls">
            <div class="qty-control" aria-label="Quantity controls for ${ns.ui.escapeHtml(row.product.name)}">
              <button type="button" data-qty="${ns.ui.escapeHtml(row.product.id)}" data-step="-1">-</button>
              <span>${row.quantity}</span>
              <button type="button" data-qty="${ns.ui.escapeHtml(row.product.id)}" data-step="1">+</button>
            </div>
            <button class="button secondary" type="button" data-remove="${ns.ui.escapeHtml(row.product.id)}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderSummary() {
    const mount = document.querySelector("#basket-summary");
    const checkoutButton = document.querySelector("#checkout-button");
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
      <p class="meta-line">Dynamic Stripe sessions can be connected later via a serverless endpoint.</p>
    `;

    if (checkoutButton) {
      checkoutButton.disabled = totals.itemCount === 0 || redirecting;
      checkoutButton.textContent = redirecting ? "Redirecting..." : "Continue to Checkout";
    }
  }

  function renderBasket() {
    const mount = document.querySelector("#basket-rows");
    if (!mount || !ns.store) {
      return;
    }

    const rows = ns.store.getBasketRows();
    if (!rows.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <h3>Your basket is empty</h3>
          <p>Add a system from the products page to continue.</p>
          <a class="button primary" href="products.html">View Products</a>
        </div>
      `;
      renderSummary();
      return;
    }

    mount.innerHTML = rows.map((row) => basketRow(row)).join("");
    renderSummary();
  }

  function startCheckout() {
    if (!ns.store || redirecting) {
      return;
    }

    const totals = ns.store.getBasketTotals();
    if (totals.itemCount <= 0) {
      ns.ui?.showToast("Add items to basket first");
      return;
    }

    const checkoutLink = String(window.BPP_CONFIG.stripeCheckoutLink || "").trim();
    if (!checkoutLink || !checkoutLink.startsWith("https://buy.stripe.com/")) {
      ns.ui?.showToast("Stripe checkout link is not configured");
      return;
    }

    redirecting = true;
    renderSummary();

    // Stripe integration hook:
    // replace this redirect with a server call that creates a Checkout Session dynamically.
    window.location.href = checkoutLink;
  }

  function handleClicks(event) {
    const qtyButton = event.target.closest("[data-qty]");
    if (qtyButton && ns.store) {
      const id = qtyButton.getAttribute("data-qty");
      const step = Number.parseInt(qtyButton.getAttribute("data-step"), 10) || 0;
      const row = ns.store.getBasket().find((entry) => entry.id === id);
      const nextQuantity = (row?.quantity || 0) + step;
      ns.store.setBasketQuantity(id, nextQuantity);
      renderBasket();
      return;
    }

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton && ns.store) {
      ns.store.removeFromBasket(removeButton.getAttribute("data-remove"));
      renderBasket();
      return;
    }

    if (event.target.closest("#clear-basket") && ns.store) {
      ns.store.clearBasket();
      renderBasket();
    }
  }

  function init() {
    if (!document.querySelector("#basket-rows")) {
      return;
    }

    document.addEventListener("click", handleClicks);
    document.querySelector("#checkout-button")?.addEventListener("click", startCheckout);
    renderBasket();
  }

  window.addEventListener("bpp:basket-changed", renderBasket);
  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
