# Tarana Handicrafts — Product Catalogue

A clean, premium, fully static product catalogue built with plain HTML, CSS and
vanilla JavaScript. No backend, database, build step or dependencies.

## Structure
```
catalogue/
├── index.html        # Catalogue listing (product grid)
├── product.html      # Product detail view (product.html?id=<product-id>)
├── standalone.html   # Single-file version (everything inlined) — handy for quick preview
├── css/styles.css
├── js/products.js    # <-- edit this file to manage products
├── js/app.js         # rendering logic (no need to touch)
└── images/           # product-1.jpg … product-8.jpg
```

## Managing products
All content lives in `js/products.js`. Copy a product object, give it a unique
`id`, set `image` (a path inside `images/`) and `productUrl` (the real product
page on taranahandicrafts.com), then drop the image file into `images/`.

## Run locally
```
cd catalogue
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Drag-and-drop the `catalogue` folder into Netlify or Vercel, or push to GitHub
Pages. No configuration required.

> Note: sample images are AI-generated placeholders for visual evaluation, and
> every sample `productUrl` points to the example product page — replace both
> with your real photography and product URLs before going live.
