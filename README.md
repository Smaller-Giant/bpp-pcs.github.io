# BPP PCs Website

Clean static ecommerce site for **BPP PCs** (Buy it, Plug it, Play it).

Built with:

- HTML
- CSS
- Vanilla JavaScript

No backend is required for deployment on GitHub Pages.

## Project Structure

```text
.
|- index.html
|- products.html
|- terms-and-conditions.html
|- privacy-policy.html
|- returns-and-refund-policy.html
|- css/
|  |- styles.css
|- js/
   |- config.js
   |- store.js
   |- app.js
   |- home.js
   |- products-page.js
```

## Checkout

Each product opens a Stripe Checkout Payment Link directly.

## Product Source

Products are defined as static catalog data in:

- `js/store.js` (homepage featured products)
- `js/products-page.js` (full products page)

## Local Preview

Run a static server:

```powershell
python -m http.server 8080
```

Open:

`http://localhost:8080`
