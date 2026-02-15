(function () {
  const products = window.PRODUCTS || [];
  const storageKey = "bpp-basket";
  const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

  const elements = {
    list: document.getElementById("basketItems"),
    items: document.getElementById("summaryItems"),
    subtotal: document.getElementById("summarySubtotal"),
    total: document.getElementById("summaryTotal"),
    basketCount: document.getElementById("basketCount"),
    checkout: document.getElementById("checkoutButton"),
    consent: document.getElementById("legalConsent")
  };

  if (!elements.list || !elements.items || !elements.subtotal || !elements.total || !elements.checkout) {
    return;
  }

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

  function basketLines() {
    return readBasket()
      .map((line) => ({
        ...line,
        product: products.find((product) => product.id === line.id)
      }))
      .filter((line) => line.product);
  }

  function changeQuantity(productId, delta) {
    const basket = readBasket();
    const line = basket.find((item) => item.id === productId);
    if (!line) return;
    line.quantity += delta;
    writeBasket(basket.filter((item) => item.quantity > 0));
    render();
  }

  function updateSummary(lines) {
    const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0);

    elements.items.textContent = String(totalItems);
    elements.subtotal.textContent = money.format(subtotal);
    elements.total.textContent = money.format(subtotal);
    if (elements.basketCount) elements.basketCount.textContent = String(totalItems);

    const hasConsent = elements.consent ? elements.consent.checked : true;
    elements.checkout.disabled = totalItems === 0 || !hasConsent;
  }

  function render() {
    const lines = basketLines();

    if (!lines.length) {
      elements.list.innerHTML = '<p class="panel">Your basket is empty. Add a system from the products page.</p>';
      updateSummary(lines);
      return;
    }

    elements.list.innerHTML = lines.map((line) => `
      <article class="basket-card">
        <img src="${line.product.image}" alt="${line.product.name}" />
        <div>
          <h3>${line.product.name}</h3>
          <p class="muted">${money.format(line.product.price)} each</p>
        </div>
        <div>
          <div class="qty-controls">
            <button type="button" aria-label="Decrease quantity for ${line.product.name}" data-id="${line.product.id}" data-delta="-1">-</button>
            <strong>${line.quantity}</strong>
            <button type="button" aria-label="Increase quantity for ${line.product.name}" data-id="${line.product.id}" data-delta="1">+</button>
          </div>
          <p class="price">${money.format(line.quantity * line.product.price)}</p>
        </div>
      </article>
    `).join("");

    elements.list.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        changeQuantity(button.dataset.id, Number(button.dataset.delta));
      });
    });

    updateSummary(lines);
  }

  if (elements.consent) {
    elements.consent.addEventListener("change", render);
  }

  elements.checkout.addEventListener("click", () => {
    alert("Checkout is ready to integrate with your payment provider.");
  });

  render();
})();
