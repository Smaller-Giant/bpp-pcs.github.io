window.BPP_CONFIG = {
  // Stripe Payment Link used for all client-side checkout redirects (test mode).
  stripePaymentLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00",
  stripePublishableKey: "",
  stripeMode: "payment",
  currency: "usd",
  shippingFlatRate: 45,
  freeShippingThreshold: 2500,
  adminCode: "901",
  storageKeys: {
    basket: "bpp_basket_v3",
    products: "bpp_products_v3",
    checkoutPayload: "bpp_checkout_payload_v1",
    cookieConsent: "bpp_cookie_consent_v1",
    adminSession: "bpp_admin_session_v1"
  }
};
