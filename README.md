# BPP PCs - Futuristic Static Ecommerce

Fully static premium ecommerce website for **BPP PCs** (Buy it, Plug it, Play it), built with:

- HTML
- CSS
- Vanilla JavaScript

Works on GitHub Pages with no backend.

## Structure

```text
.
|- index.html
|- products.html
|- basket.html
|- admin.html
|- privacy.html
|- terms.html
|- refund.html
|- success.html
|- cancel.html
|- css/
|  |- styles.css
|- js/
|  |- config.js
|  |- products.js
|  |- store.js
|  |- app.js
|  |- home.js
|  |- products-page.js
|  |- basket-page.js
|  |- admin.js
|  |- success-page.js
|- images/
   |- products/
```

## Stripe Configuration

1. Open `js/config.js`
2. Set:
   - `stripePublishableKey` to your Stripe publishable key (`pk_test_...` or `pk_live_...`)
3. Open `js/products.js`
4. Set each product `stripePriceId` (`price_...`)

Checkout flow:

- Starts on `basket.html`
- Success redirect to `success.html`
- Cancel redirect to `cancel.html`
- Basket is cleared on success page

## Product Management (Admin)

Admin page: `admin.html`  
Login code: `901`

Features:

- Add product
- Edit product
- Delete product
- Reset catalog to defaults
- Export current catalog as `products.js`

Important static-site note:

- Browsers cannot directly overwrite repository files on GitHub Pages.
- Admin edits are saved in localStorage for the current browser.
- Use **Export products.js** and replace `js/products.js` in your repo to persist changes globally.

## Product Data File

Main editable catalog file: `js/products.js`

Each product supports:

- `id`
- `title`
- `description`
- `price`
- `category`
- `featured`
- `specs` (array)
- `images` (array for carousel)
- `stockSeed`
- `stripePriceId`

## Included Features

- Futuristic dark neon UI
- Product image carousel/slider
- Featured builds section
- Newsletter signup (dummy handler)
- LocalStorage basket
- Live basket counter
- Cookie banner (dismiss/accept)
- Legal pages
- Responsive desktop/mobile layout

## Local Preview

You can open `index.html` directly, or run:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.
