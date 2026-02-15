(function () {
  const basketKey = "bpp-basket";
  const cookieKey = "bpp-cookie-consent";

  function readBasket() {
    try {
      return JSON.parse(localStorage.getItem(basketKey) || "[]");
    } catch (_err) {
      return [];
    }
  }

  function updateBasketBadge() {
    const count = readBasket().reduce((sum, item) => sum + (item.quantity || 0), 0);
    const countEl = document.getElementById("basketCount");
    if (countEl) countEl.textContent = String(count);
  }

  function updateYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("#year").forEach((el) => {
      el.textContent = year;
    });
  }

  function attachCookieBanner() {
    if (localStorage.getItem(cookieKey)) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <p class="muted">We use functional cookies for basket storage. Optional analytics cookies can be accepted or declined.</p>
      <div class="cookie-actions">
        <button type="button" data-choice="decline">Decline</button>
        <button type="button" class="accept" data-choice="accept">Accept</button>
      </div>
    `;

    document.body.appendChild(banner);
    banner.querySelectorAll("button[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem(cookieKey, button.dataset.choice);
        banner.remove();
      });
    });
  }

  updateBasketBadge();
  updateYear();
  attachCookieBanner();
})();
