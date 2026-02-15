window.BPP = window.BPP || {};

window.BPP.config = {
  stripePublishableKey: "pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY",
  currency: "usd",
  stripeMode: "payment",
  shippingFlatRate: 49,
  freeShippingThreshold: 2600,
  storageKeys: {
    basket: "bpp_basket_v1",
    wishlist: "bpp_wishlist_v1",
    recentlyViewed: "bpp_recently_viewed_v1"
  }
};
