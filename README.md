# BPP PCs Ecommerce (Static)

Premium static ecommerce website for **BPP PCs**  
Tagline: **Buy it, Plug it, Play it**

## Tech Stack

- Pure HTML, CSS, and vanilla JavaScript
- Static files only (GitHub Pages friendly)
- Client-side basket with `localStorage`
- Stripe Checkout via publishable key + Stripe Price IDs

## Project Structure

```text
.
|- index.html
|- products.html
|- basket.html
|- privacy.html
|- terms.html
|- refund.html
|- success.html
|- cancel.html
|- css/
|  |- styles.css
|- js/
|  |- config.js
|  |- product-data.js
|  |- store.js
|  |- ui.js
|  |- main.js
|  |- home.js
|  |- products-page.js
|  |- basket-page.js
|  |- success-page.js
|- assets/
   |- images/
```

## Local Run

Because this is static HTML, you can open `index.html` directly, or run a static server:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Stripe Setup (No Backend)

1. Open `js/config.js`
2. Replace:
   - `stripePublishableKey` with your Stripe publishable key (`pk_test_...` or `pk_live_...`)
3. Open `js/product-data.js`
4. For every product, replace `priceId` with a real Stripe Price ID (`price_...`)

Checkout uses:

- `mode: "payment"`
- Success redirect: `success.html`
- Cancel redirect: `cancel.html`

Basket is cleared on `success.html`.

## How To Edit Products

All catalog details are in one file: `js/product-data.js`

For each product you can edit:

- `name`
- `price`
- `shortDescription`
- `description`
- `image`
- `tier`
- `category`
- `stockSeed`
- `priceId`

## Included Premium Features

- Recently viewed products
- Wishlist
- Live simulated stock counters
- Product search/filter/sort
- Performance tier indicators (Entry / Enthusiast / Elite)

## GitHub Pages Deployment

1. Push this repo to GitHub.
2. In repository settings, enable **Pages** for the default branch/root.
3. Wait for deployment, then open the Pages URL.

## Notes

- Legal page content is template text and should be reviewed by legal counsel.
- Stripe Checkout requires valid publishable key and Price IDs before going live.
