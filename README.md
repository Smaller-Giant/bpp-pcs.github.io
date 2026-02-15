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
|- basket.html
|- css/
|  |- styles.css
|- js/
   |- config.js
   |- store.js
   |- app.js
   |- home.js
   |- products-page.js
   |- basket-page.js
```

## Checkout

Checkout uses a static Stripe test link configured in `js/config.js`:

`stripeCheckoutLink`

Current value:

`https://buy.stripe.com/test_9B6aEW11x5Wo3Ed3Sz6kg00`

In `js/basket-page.js`, there is a comment marking where to replace this redirect with a dynamic serverless Stripe Checkout Session in the future.

## Basket Behavior

- Basket is stored in `localStorage`
- Quantity updates and remove actions are supported
- Subtotal, shipping, and total are calculated client-side

## Product Source

Products are defined in `js/store.js` as static catalog data.

This is intentionally simple for now and can later be replaced with Stripe-backed product/session APIs.

## Local Preview

Run a static server:

```powershell
python -m http.server 8080
```

Open:

`http://localhost:8080`
