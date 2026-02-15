window.BPP = window.BPP || {};

(function initSuccessPage(ns) {
  function init() {
    if (!document.querySelector("[data-success-page]") || !ns.store) {
      return;
    }

    ns.store.clearBasket();
    ns.ui?.updateBasketCounter();

    // Clear checkout payload after successful return from Stripe.
    const payloadKey = window.BPP_CONFIG.storageKeys?.checkoutPayload;
    if (payloadKey) {
      try {
        window.localStorage.removeItem(payloadKey);
      } catch (error) {
        // Ignore storage failures.
      }
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    const target = document.querySelector("#stripe-session-id");
    if (sessionId && target) {
      target.textContent = `Stripe session: ${sessionId}`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
