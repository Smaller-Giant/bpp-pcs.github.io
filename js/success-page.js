window.BPP = window.BPP || {};

(function initSuccessPage(ns) {
  function init() {
    if (!document.querySelector("[data-success-page]") || !ns.store) {
      return;
    }

    ns.store.clearBasket();
    ns.ui?.updateBasketCounter();

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    const target = document.querySelector("#stripe-session-id");
    if (sessionId && target) {
      target.textContent = `Stripe session: ${sessionId}`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
