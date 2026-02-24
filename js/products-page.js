// Static product data for the products page.
// Each product has a direct Stripe Checkout link for instant purchase.
const PRODUCTS = [
  {
    id: "aurora-5070-ti",
    name: "BPP Aurora RTX 5070 Ti",
    price: 1999,
    image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80",
    specs: ["Ryzen 7 7800X3D", "RTX 5070 Ti 16GB", "32GB DDR5", "2TB NVMe Gen4"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "eclipse-5080",
    name: "BPP Eclipse RTX 5080",
    price: 2699,
    image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1200&q=80",
    specs: ["Intel Core Ultra 7", "RTX 5080 16GB", "32GB DDR5", "2TB NVMe Gen4"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "studio-x-pro",
    name: "BPP Studio X Pro",
    price: 2399,
    image: "https://images.unsplash.com/photo-1587202372599-814eb66b3b5d?auto=format&fit=crop&w=1200&q=80",
    specs: ["Ryzen 9 7900X", "RTX 4070 Ti Super", "64GB DDR5", "2TB NVMe + 4TB SSD"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "starter-4060",
    name: "BPP Starter RTX 4060",
    price: 1199,
    image: "https://images.unsplash.com/photo-1587202372708-31f6f5e86c44?auto=format&fit=crop&w=1200&q=80",
    specs: ["Ryzen 5 7600", "RTX 4060 8GB", "16GB DDR5", "1TB NVMe"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "pro-office-i7",
    name: "BPP Pro Office i7",
    price: 1299,
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1200&q=80",
    specs: ["Intel Core i7", "RTX 4060", "32GB DDR5", "1TB NVMe"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "ml-workstation-4090",
    name: "BPP ML Workstation RTX 4090",
    price: 3299,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
    specs: ["Threadripper 7960X", "RTX 4090 24GB", "128GB DDR5 ECC", "4TB NVMe Gen4"],
    stripeCheckoutLink: "https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00"
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function productCard(product) {
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const specsHtml = specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");

  return `
    <article class="product-card">
      <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)} desktop PC">
      <div class="product-content">
        <div class="product-top">
          <span class="product-category">Prebuilt PC</span>
          <strong class="product-price">${formatCurrency(product.price)}</strong>
        </div>
        <h3>${escapeHtml(product.name)}</h3>
        <ul class="product-specs">${specsHtml}</ul>
        <div class="card-actions">
          <button class="button primary" type="button" data-buy-now="${escapeHtml(product.id)}">Buy Now</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const mount = document.querySelector("#products-grid");
  if (!mount) {
    return;
  }

  mount.innerHTML = PRODUCTS.map((product) => productCard(product)).join("");
}

function bindBuyNow() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy-now]");
    if (!button) {
      return;
    }

    const id = button.getAttribute("data-buy-now");
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product || !product.stripeCheckoutLink) {
      return;
    }

    window.location.href = product.stripeCheckoutLink;
  });
}

function bindMobileNav() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-mobile-toggle]")) {
      document.querySelector(".nav")?.classList.toggle("open");
    }
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  bindMobileNav();
  bindBuyNow();
  renderProducts();
});
