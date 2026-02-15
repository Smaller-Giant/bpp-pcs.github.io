window.BPP = window.BPP || {};

(function initSuccessPage(ns) {
  function init() {
    const marker = document.querySelector("[data-success-page]");
    if (!marker || !ns.store) {
      return;
    }

    ns.store.clearBasket();
    ns.ui?.updateBasketBadge();

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    const sessionTarget = document.querySelector("#session-id");
    if (sessionTarget && sessionId) {
      sessionTarget.textContent = sessionId;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
