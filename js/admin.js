window.BPP = window.BPP || {};

(function initAdminPage(ns) {
  const state = {
    editingId: null
  };

  function getElements() {
    return {
      page: document.querySelector("[data-admin-page]"),
      loginPanel: document.querySelector("#admin-login-panel"),
      dashboardPanel: document.querySelector("#admin-dashboard"),
      loginForm: document.querySelector("#admin-login-form"),
      loginInput: document.querySelector("#admin-code"),
      loginError: document.querySelector("#admin-login-error"),
      tableBody: document.querySelector("#admin-product-body"),
      form: document.querySelector("#admin-product-form"),
      formTitle: document.querySelector("#admin-form-title"),
      idInput: document.querySelector("#product-id"),
      titleInput: document.querySelector("#product-title"),
      categoryInput: document.querySelector("#product-category"),
      priceInput: document.querySelector("#product-price"),
      stockInput: document.querySelector("#product-stock"),
      stripeInput: document.querySelector("#product-stripe"),
      featuredInput: document.querySelector("#product-featured"),
      descriptionInput: document.querySelector("#product-description"),
      specsInput: document.querySelector("#product-specs"),
      imagesInput: document.querySelector("#product-images"),
      saveButton: document.querySelector("#admin-save-button"),
      cancelButton: document.querySelector("#admin-cancel-edit"),
      newButton: document.querySelector("#admin-new-product"),
      logoutButton: document.querySelector("#admin-logout"),
      resetButton: document.querySelector("#admin-reset-default"),
      exportButton: document.querySelector("#admin-export-products")
    };
  }

  function uniqueIdFromTitle(title, existingProducts) {
    const base = ns.ui.slugify(title) || `build-${Date.now()}`;
    const taken = new Set(existingProducts.map((product) => product.id));
    if (!taken.has(base)) {
      return base;
    }

    let index = 2;
    while (taken.has(`${base}-${index}`)) {
      index += 1;
    }
    return `${base}-${index}`;
  }

  function parseList(text, fallback) {
    const list = String(text || "")
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .filter(Boolean);
    return list.length ? list : fallback;
  }

  function renderTable(elements) {
    if (!elements.tableBody || !ns.store || !ns.ui) {
      return;
    }

    const products = ns.store.getProducts();
    elements.tableBody.innerHTML = products
      .map(
        (product) => `
          <tr>
            <td>${ns.ui.escapeHtml(product.id)}</td>
            <td>${ns.ui.escapeHtml(product.title)}</td>
            <td>${ns.ui.escapeHtml(product.category)}</td>
            <td>${ns.ui.formatCurrency(product.price)}</td>
            <td>${product.images.length}</td>
            <td>
              <div class="table-actions">
                <button class="button ghost small" type="button" data-edit="${ns.ui.escapeHtml(product.id)}">Edit</button>
                <button class="button danger small" type="button" data-delete="${ns.ui.escapeHtml(product.id)}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function fillForm(elements, product) {
    state.editingId = product ? product.id : null;

    elements.formTitle.textContent = product ? `Edit ${product.title}` : "Add Product";
    elements.idInput.value = product ? product.id : "";
    elements.titleInput.value = product ? product.title : "";
    elements.categoryInput.value = product ? product.category : "";
    elements.priceInput.value = product ? String(product.price) : "";
    elements.stockInput.value = product ? String(product.stockSeed || 8) : "8";
    elements.stripeInput.value = product ? product.stripePriceId : "";
    elements.featuredInput.checked = Boolean(product?.featured);
    elements.descriptionInput.value = product ? product.description : "";
    elements.specsInput.value = product ? product.specs.join("\n") : "";
    elements.imagesInput.value = product ? product.images.join("\n") : "";
    elements.cancelButton.hidden = !product;
  }

  function formToProduct(elements) {
    const products = ns.store.getProducts();
    const title = elements.titleInput.value.trim();
    const id = state.editingId || uniqueIdFromTitle(title, products);
    const category = elements.categoryInput.value.trim() || "Custom";
    const price = Number.parseFloat(elements.priceInput.value);
    const stockSeed = Number.parseInt(elements.stockInput.value, 10) || 8;
    const stripePriceId = elements.stripeInput.value.trim();
    const description = elements.descriptionInput.value.trim();
    const specs = parseList(elements.specsInput.value, ["Custom tuned build"]);
    const images = parseList(elements.imagesInput.value, ["images/products/vanta-s1.svg"]);

    return {
      id,
      title,
      category,
      price: Number.isFinite(price) ? price : 0,
      stockSeed,
      stripePriceId,
      description,
      specs,
      featured: elements.featuredInput.checked,
      images
    };
  }

  async function exportProductsFile(elements) {
    if (!ns.store || !ns.ui) {
      return;
    }

    const jsContent = `window.BPP_DEFAULT_PRODUCTS = ${JSON.stringify(ns.store.getProducts(), null, 2)};\n`;

    // Use File System Access API when available; fallback to download.
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "products.js",
          types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(jsContent);
        await writable.close();
        ns.ui.showToast("products.js saved");
        return;
      } catch (error) {
        // User cancelled or browser blocked; fallback below.
      }
    }

    const blob = new Blob([jsContent], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.js";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    ns.ui.showToast("Downloaded products.js");
  }

  function showDashboard(elements, show) {
    elements.loginPanel.hidden = show;
    elements.dashboardPanel.hidden = !show;
  }

  function login(elements) {
    const code = String(elements.loginInput.value || "").trim();
    if (code === String(window.BPP_CONFIG.adminCode || "901")) {
      ns.store.setAdminSession(true);
      showDashboard(elements, true);
      renderTable(elements);
      fillForm(elements, null);
      elements.loginError.textContent = "";
      elements.loginInput.value = "";
      ns.ui.showToast("Admin access granted");
      return;
    }

    elements.loginError.textContent = "Invalid code.";
    ns.ui.showToast("Invalid admin code");
  }

  function bindEvents(elements) {
    elements.loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      login(elements);
    });

    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const product = formToProduct(elements);
      if (!product.title) {
        ns.ui.showToast("Title is required");
        return;
      }
      ns.store.upsertProduct(product);
      renderTable(elements);
      fillForm(elements, null);
      ns.ui.showToast("Product saved");
    });

    elements.cancelButton.addEventListener("click", () => {
      fillForm(elements, null);
    });

    elements.newButton.addEventListener("click", () => {
      fillForm(elements, null);
      elements.titleInput.focus();
    });

    elements.logoutButton.addEventListener("click", () => {
      ns.store.clearAdminSession();
      showDashboard(elements, false);
      ns.ui.showToast("Logged out");
    });

    elements.resetButton.addEventListener("click", () => {
      ns.store.resetProducts();
      renderTable(elements);
      fillForm(elements, null);
      ns.ui.showToast("Catalog reset to defaults");
    });

    elements.exportButton.addEventListener("click", () => {
      exportProductsFile(elements);
    });

    elements.tableBody.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit]");
      if (editButton) {
        const id = editButton.getAttribute("data-edit");
        const product = ns.store.getProductById(id);
        if (product) {
          fillForm(elements, product);
          elements.titleInput.focus();
        }
        return;
      }

      const deleteButton = event.target.closest("[data-delete]");
      if (deleteButton) {
        const id = deleteButton.getAttribute("data-delete");
        const product = ns.store.getProductById(id);
        if (product && window.confirm(`Delete ${product.title}?`)) {
          ns.store.deleteProduct(id);
          renderTable(elements);
          if (state.editingId === id) {
            fillForm(elements, null);
          }
          ns.ui.showToast("Product deleted");
        }
      }
    });
  }

  function init() {
    const elements = getElements();
    if (!elements.page) {
      return;
    }

    bindEvents(elements);
    const sessionActive = ns.store.isAdminSession();
    showDashboard(elements, sessionActive);
    if (sessionActive) {
      renderTable(elements);
      fillForm(elements, null);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.BPP);
