#!/usr/bin/env node
/**
 * Builds the printable product catalogue from content/ into public/tarana-handicrafts-catalogue.pdf.
 *
 *   npm run catalogue               # with "From ₹…" prices
 *   npm run catalogue -- --no-prices  # trade version without prices
 *
 * Needs Google Chrome (or set CHROME_PATH). Re-run after editing products or images.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import QRCode from "qrcode";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");
const SHOW_PRICES = !process.argv.includes("--no-prices");
const OUT = path.join(PUBLIC, SHOW_PRICES ? "tarana-handicrafts-catalogue.pdf" : "tarana-handicrafts-trade-catalogue.pdf");
const YEAR = new Date().getFullYear();

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const site = readJson(path.join(CONTENT, "site.json"));
const categories = readJson(path.join(CONTENT, "categories.json"));
const products = fs
  .readdirSync(path.join(CONTENT, "products"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ slug: f.replace(/\.json$/, ""), ...readJson(path.join(CONTENT, "products", f)) }));

// ─── Helpers ───
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const img = (p) => pathToFileURL(path.join(PUBLIC, "images/products", p.slug, p.images[0].file)).href;
const minPrice = (p) => Math.min(...p.sizes.map((s) => s.price));
const productUrl = (p) => `${site.url}/products/${p.slug}?utm_source=catalogue&utm_medium=pdf`;
const waUrl = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const orderUrl = (p) => waUrl(`Hi Tarana Handicrafts! I saw the *${p.name}* in your catalogue and would like to order / know more.`);
const qr = (url) => QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#2B2118", light: "#0000" } });

/** First sentences of the description that fit in `max` characters. */
function excerpt(text, max) {
  const first = text.split(/\n\s*\n/)[0].trim();
  if (first.length <= max) return first;
  const sentences = first.match(/[^.!?]+[.!?]+/g) ?? [first];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length > max) break;
    out += s;
  }
  return (out || first.slice(0, first.lastIndexOf(" ", max - 1)).replace(/[,;:—–-]\s*$/, "") + "…").trim();
}

// Top-level category for every slug, in categories.json order.
const topOf = new Map();
(function walk(nodes, top) {
  for (const c of nodes) {
    topOf.set(c.slug, top ?? c);
    walk(c.children ?? [], top ?? c);
  }
})(categories);
const leafName = new Map();
(function walk(nodes) {
  for (const c of nodes) {
    leafName.set(c.slug, c.name);
    walk(c.children ?? []);
  }
})(categories);

// Marketing copy per chapter; falls back to the category description for new categories.
const CHAPTERS = {
  elephants: {
    title: "The Elephant Collection",
    hook: "Good fortune, carved by hand.",
    intro:
      "In Rajasthan, an elephant with its trunk raised is a blessing at the door — a symbol of strength, wisdom and welcome. Our artisans carve each one by hand, piercing the body with jaali so light passes through the wood like lace.",
    perfectFor: ["Entryways & shelves", "Housewarming gifts", "Corporate gifting"],
  },
  figurines: {
    title: "Folk & Wild",
    hook: "Stories of Rajasthan, in wood.",
    intro:
      "From the dancing peacock to the camels of the Thar desert and the musicians of Rajasthani folk tradition, these figurines carry the stories of the land they come from.",
    perfectFor: ["Living rooms", "Collectors", "Gifts that travel well"],
  },
  spiritual: {
    title: "Sacred Spaces",
    hook: "Carved with stillness.",
    intro: "Serene, finely detailed pieces for a puja corner, a meditation room or a thoughtful housewarming gift.",
    perfectFor: ["Puja rooms", "Meditation corners", "Festive gifting"],
  },
  "home-decor": {
    title: "For the Home",
    hook: "Heirlooms you live with.",
    intro:
      "Wall art that becomes the conversation starter of the room, and tableware that makes every gathering feel festive.",
    perfectFor: ["Feature walls", "Dining tables", "Hotels & interiors"],
  },
};

function badge(p) {
  if (p.featured) return "Signature Piece";
  if (minPrice(p) >= 5000) return "Statement Piece";
  if (minPrice(p) < 1000) return "Gift under ₹1,000";
  return "Handmade in Jaipur";
}

// Large single-size pieces and featured items get a full page; the rest share a page.
const isFeature = (p) => p.featured || (p.sizes.length === 1 && minPrice(p) >= 3000);

const sizeLine = (p) =>
  p.sizes.length > 1
    ? `${p.sizes.length} sizes · ${p.sizes.map((s) => s.label.replace(/\s*inch$/i, '"')).join(" · ")}`
    : p.sizes[0].label;

const priceHtml = (p) =>
  SHOW_PRICES
    ? `<div class="price"><span>${p.sizes.length > 1 ? "From" : "Price"}</span>${inr(minPrice(p))}</div>`
    : `<div class="price"><span>Trade price</span>On request</div>`;

// ─── Page builders ───
let pageNo = 0;
const footer = (dark = false) =>
  `<footer class="folio${dark ? " dark" : ""}"><span>${esc(site.name)} · Collection ${YEAR}</span><span>${String(pageNo).padStart(2, "0")}</span></footer>`;
const page = (cls, inner, { folio = true, dark = false } = {}) => {
  pageNo++;
  return `<section class="page ${cls}">${inner}${folio ? footer(dark) : ""}</section>`;
};

const ctas = (p, qrSvg) => `
  <div class="ctas">
    <a class="btn wa" href="${esc(orderUrl(p))}">Order on WhatsApp</a>
    <a class="btn ghost" href="${esc(productUrl(p))}">View online</a>
    <div class="qr" title="Scan to view">${qrSvg}<small>Scan to view</small></div>
  </div>`;

async function featurePage(p, chapter) {
  const details = (p.details ?? []).filter((d) => !/^(use cases|order options)$/i.test(d.label)).slice(0, 4);
  return page(
    "feature",
    `
    <div class="feature-img"><img src="${img(p)}" alt="${esc(p.name)}"><span class="ribbon">${esc(badge(p))}</span></div>
    <div class="feature-body">
      <div class="kicker">${esc(leafName.get(p.category) ?? "")} · ${esc(p.material)}</div>
      <h2>${esc(p.name)}</h2>
      <p class="lede">${esc(p.shortDescription)}</p>
      <div class="cols">
        <div>
          <p class="desc">${esc(excerpt(p.description, 420))}</p>
          <div class="perfect"><b>Perfect for</b> ${chapter.perfectFor.map(esc).join(" · ")}</div>
        </div>
        <div class="spec">
          ${priceHtml(p)}
          <div class="size">${esc(sizeLine(p))}</div>
          <dl>${details.map((d) => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div>`).join("")}</dl>
        </div>
      </div>
      ${ctas(p, await qr(productUrl(p)))}
    </div>`
  );
}

async function pairCard(p, chapter) {
  return `
  <article class="card">
    <div class="card-img"><img src="${img(p)}" alt="${esc(p.name)}"><span class="ribbon">${esc(badge(p))}</span></div>
    <div class="card-body">
      <div class="kicker">${esc(leafName.get(p.category) ?? "")}</div>
      <h3>${esc(p.name)}</h3>
      <p class="lede">${esc(p.shortDescription)}</p>
      <p class="desc">${esc(excerpt(p.description, 230))}</p>
      <div class="perfect"><b>Perfect for</b> ${chapter.perfectFor.slice(0, 2).map(esc).join(" · ")}</div>
      <div class="row">
        <div>${priceHtml(p)}<div class="size">${esc(sizeLine(p))}</div></div>
        <div class="qr">${await qr(productUrl(p))}<small>Scan to view</small></div>
      </div>
      <div class="ctas">
        <a class="btn wa" href="${esc(orderUrl(p))}">Order on WhatsApp</a>
        <a class="btn ghost" href="${esc(productUrl(p))}">View online</a>
      </div>
    </div>
  </article>`;
}

const customPromo = `
  <article class="card promo">
    <div>
      <div class="kicker light">Made to order</div>
      <h3>Make it yours.</h3>
      <p>Need a different size, finish or your logo on the packaging? Many pieces can be customised, and we create custom designs for bulk orders.</p>
      <a class="btn gold" href="${esc(`${site.url}/rfq?utm_source=catalogue&utm_medium=pdf`)}">Request a custom quote</a>
    </div>
  </article>`;

function chapterPage(index, top, items, chapter) {
  return page(
    "chapter",
    `
    <div class="chapter-inner">
      <div class="chapter-no">${String(index).padStart(2, "0")}</div>
      <div class="kicker light">${esc(top.name)}</div>
      <h2>${esc(chapter.title)}</h2>
      <p class="hook">${esc(chapter.hook)}</p>
      <p class="intro">${esc(chapter.intro)}</p>
      <div class="chapter-perfect">${chapter.perfectFor.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
      <div class="thumbs" style="grid-template-columns:repeat(${items.length <= 4 ? 2 : 4},1fr)">${items
        .map((p) => `<figure><img src="${img(p)}" alt=""><figcaption>${esc(p.name)}</figcaption></figure>`)
        .join("")}</div>
    </div>`,
    { dark: true }
  );
}

// ─── Assemble ───
const groups = categories
  .map((top) => ({ top, items: products.filter((p) => topOf.get(p.category)?.slug === top.slug) }))
  .filter((g) => g.items.length)
  .map((g) => ({
    ...g,
    // Signature pieces first, then by price, so each chapter opens strong.
    items: g.items.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || minPrice(b) - minPrice(a)),
  }));

const hero = products.find((p) => p.slug === "dancing-peacock") ?? products.find((p) => p.featured) ?? products[0];
const storyImgs = [...products.filter((p) => p.featured), ...products].filter((p, i, a) => a.indexOf(p) === i && p !== hero).slice(0, 3);
const allFrom = Math.min(...products.map(minPrice));

const pages = [];

pageNo++; // cover has no folio
pages.push(`
<section class="page cover">
  <img class="cover-img" src="${img(hero)}" alt="${esc(hero.name)}">
  <div class="cover-top">
    <div class="brand">${esc(site.name.toUpperCase())}</div>
    <div class="edition">Collection ${YEAR}</div>
  </div>
  <div class="cover-title">
    <div class="kicker">Hand-carved wooden art from Jaipur</div>
    <h1>Carved by hand.<br><em>Made to be handed down.</em></h1>
  </div>
  <div class="cover-band">
    <span>${products.length} heirloom pieces</span><span>Retail · Wholesale · Export</span><span>${SHOW_PRICES ? `From ${inr(allFrom)}` : "Trade edition"}</span>
  </div>
</section>`);

pages.push(
  page(
    "story",
    `
  <div class="story-head">
    <div class="kicker">Our craft</div>
    <h2>Every piece begins as a block of wood<br><em>and the patience of an artisan.</em></h2>
  </div>
  <div class="story-grid">
    <div class="story-text">
      <p class="dropcap">In the workshops of Jaipur, carving is a craft passed from one generation to the next. Our artisan families shape seasoned wood with chisels and hand drills, building up every feather, flower and jaali opening by hand.</p>
      <p>No two pieces are ever exactly alike. Small variations in grain, finish and size are the signature of genuine handwork — proof that what you hold was made by a person, not a machine.</p>
      <p>We work directly with our carvers, so you get authentic craft at honest, manufacturer-direct prices — whether you're buying a single gift or stocking a store.</p>
    </div>
    <div class="story-imgs">${storyImgs.map((p) => `<img src="${img(p)}" alt="">`).join("")}</div>
  </div>
  <div class="pillars">
    <div><b>100% hand-carved</b><span>Shaped by artisan families in Jaipur, Rajasthan.</span></div>
    <div><b>Seasoned wood</b><span>Kadam wood, dried and finished to last for generations.</span></div>
    <div><b>Direct from the maker</b><span>No middlemen — fair prices for you and our artisans.</span></div>
    <div><b>Ships worldwide</b><span>Careful packing for gifts, retail and export orders.</span></div>
  </div>
  <blockquote class="quote">“A machine makes a thousand identical objects.<br>Our artisans make one — <em>yours.</em>”</blockquote>`
  )
);

// Index page: page numbers are known up front because the layout is deterministic.
const indexPageNo = pageNo + 1;
let cursor = indexPageNo;
const plan = groups.map((g) => {
  const chapterAt = ++cursor;
  const features = g.items.filter(isFeature);
  const smalls = g.items.filter((p) => !isFeature(p));
  const seq = [];
  const pairs = [];
  for (let i = 0; i < smalls.length; i += 2) pairs.push(smalls.slice(i, i + 2));
  // Interleave full pages and paired pages for rhythm.
  while (features.length || pairs.length) {
    if (features.length) seq.push({ kind: "feature", items: [features.shift()] });
    if (pairs.length) seq.push({ kind: "pair", items: pairs.shift() });
  }
  const located = seq.map((s) => ({ ...s, at: ++cursor }));
  return { ...g, chapterAt, seq: located };
});
const pageOf = new Map(plan.flatMap((g) => g.seq.flatMap((s) => s.items.map((p) => [p.slug, s.at]))));

pages.push(
  page(
    "index",
    `
  <div class="kicker">Inside this collection</div>
  <h2>${products.length} pieces, <em>${groups.length} collections.</em></h2>
  ${plan
    .map(
      (g, gi) => `
    <div class="index-group">
      <div class="index-head"><span>${String(gi + 1).padStart(2, "0")}</span>${esc(CHAPTERS[g.top.slug]?.title ?? g.top.name)}<i>p. ${g.chapterAt}</i></div>
      <div class="index-grid">${g.items
        .map(
          (p) => `<a class="index-item" href="${esc(productUrl(p))}"><img src="${img(p)}" alt=""><b>${esc(p.name)}</b><small>${
            SHOW_PRICES ? `${p.sizes.length > 1 ? "From " : ""}${inr(minPrice(p))} · ` : ""
          }p. ${pageOf.get(p.slug)}</small></a>`
        )
        .join("")}</div>
    </div>`
    )
    .join("")}`
  )
);

for (const [gi, g] of plan.entries()) {
  const chapter = CHAPTERS[g.top.slug] ?? {
    title: g.top.name,
    hook: "Hand-carved in Jaipur.",
    intro: g.top.description ?? "",
    perfectFor: ["Home decor", "Gifting"],
  };
  pages.push(chapterPage(gi + 1, g.top, g.items, chapter));
  for (const s of g.seq) {
    if (s.kind === "feature") pages.push(await featurePage(s.items[0], chapter));
    else {
      const cards = await Promise.all(s.items.map((p) => pairCard(p, chapter)));
      if (cards.length === 1) cards.push(customPromo);
      pages.push(page("pair", cards.join("")));
    }
  }
}

const rfqUrl = `${site.url}/rfq?utm_source=catalogue&utm_medium=pdf`;
pages.push(
  page(
    "trade",
    `
  <div class="kicker">Gifting · Wholesale · Export</div>
  <h2>Buying for more than one?<br><em>Let's talk.</em></h2>
  <p class="intro">We're the manufacturer, so you get direct tiered pricing on bulk quantities, custom sizes and finishes, and branded packaging — with export documentation handled for you.</p>
  <div class="uses">
    <div><b>Corporate gifting</b><span>Diwali, client and employee gifts with your branding on the box.</span></div>
    <div><b>Weddings & events</b><span>Return gifts and favours that guests actually keep.</span></div>
    <div><b>Retail & boutiques</b><span>Manufacturer-direct wholesale for gift and decor stores.</span></div>
    <div><b>Hotels & interiors</b><span>Statement décor and custom pieces for hospitality projects.</span></div>
    <div><b>Importers & export</b><span>Worldwide shipping by air or sea on agreed Incoterms.</span></div>
    <div><b>Custom designs</b><span>Share a sketch or reference — we'll carve it for bulk orders.</span></div>
  </div>
  <div class="trade-cta">
    <div>
      <h3>Get a quote within 24 business hours</h3>
      <p>Tell us the pieces, quantities and destination. MOQ depends on the product and customisation; we'll confirm it in your quotation.</p>
      <a class="btn gold" href="${esc(rfqUrl)}">Request a bulk quote</a>
    </div>
    <div class="qr big">${await qr(rfqUrl)}<small>Scan for the quote form</small></div>
  </div>
  <div class="strip">${products.slice(0, 5).map((p) => `<img src="${img(p)}" alt="">`).join("")}</div>`
  )
);

const siteQr = await qr(`${site.url}?utm_source=catalogue&utm_medium=pdf`);
const waQr = await qr(waUrl("Hi Tarana Handicrafts! I have your catalogue and would like to order."));
pageNo++;
pages.push(`
<section class="page back">
  <div class="back-inner">
    <div class="kicker light">How to order</div>
    <h2>Three taps to your<br><em>own piece of Jaipur.</em></h2>
    <ol class="steps">
      <li><b>Choose</b><span>Pick your favourites from this catalogue or our website.</span></li>
      <li><b>Message us</b><span>Tap “Order on WhatsApp” on any product — we'll confirm size, price and delivery.</span></li>
      <li><b>Receive</b><span>Your piece is packed with care and shipped to your door, in India or abroad.</span></li>
    </ol>
    <div class="qrs">
      <a href="${esc(waUrl("Hi Tarana Handicrafts! I have your catalogue and would like to order."))}"><div class="qr light">${waQr}</div><b>Order on WhatsApp</b></a>
      <a href="${esc(`${site.url}?utm_source=catalogue&utm_medium=pdf`)}"><div class="qr light">${siteQr}</div><b>Shop online</b></a>
    </div>
    <div class="contact">
      <div class="brand">${esc(site.name.toUpperCase())}</div>
      <p>${esc(site.phone)} · ${esc(site.email)}</p>
      <p>${esc(site.url.replace(/^https?:\/\//, ""))} · ${esc(site.hours ?? "")}</p>
      <p>${esc([site.address.street, site.address.city, site.address.region, site.address.postalCode].join(", "))}</p>
    </div>
    <div class="strip dark">${products.slice(-5).map((p) => `<img src="${img(p)}" alt="">`).join("")}</div>
    <p class="fine">Handmade pieces vary slightly in grain, colour and size. ${
      SHOW_PRICES ? "Prices are in INR, exclude shipping and may change; please confirm when ordering." : "Trade prices on request."
    }</p>
  </div>
</section>`);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(site.name)} — Collection ${YEAR}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,500&display=block" rel="stylesheet">
<style>
:root{--ink:#2B2118;--muted:#6F6253;--paper:#FBF8F3;--cream:#F3EADB;--gold:#B8893E;--gold-l:#D9B977;--wood:#3A2A1E;--wa:#1FAF55}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Inter,system-ui,sans-serif;color:var(--ink);font-size:9.5pt;line-height:1.55}
a{color:inherit;text-decoration:none}
h1,h2,h3{font-family:"Playfair Display",Georgia,serif;font-weight:500;line-height:1.08;letter-spacing:-.01em}
em{font-style:italic;color:var(--gold)}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;break-after:page;background:var(--paper);padding:18mm 16mm 20mm}
.kicker{font-size:7pt;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);margin-bottom:3mm}
.kicker.light{color:var(--gold-l)}
.folio{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);border-top:.3mm solid #e4d9c6;padding-top:2.5mm}
.folio.dark{color:#b9a890;border-color:#5a4635}
.ribbon{position:absolute;top:5mm;left:5mm;background:var(--ink);color:#fff;font-size:6.5pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:1.6mm 3mm}
.btn{display:inline-block;font-size:7.5pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:3mm 5mm;border-radius:10mm}
.btn.wa{background:var(--wa);color:#fff}
.btn.ghost{border:.35mm solid var(--ink)}
.btn.gold{background:var(--gold);color:#fff;margin-top:4mm}
.qr svg{width:100%;height:auto;display:block}
.qr small{display:block;font-size:5.5pt;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:1mm;text-align:center;white-space:nowrap}
.price{font-family:"Playfair Display",serif;font-size:19pt;line-height:1}
.price span{display:block;font-family:Inter,sans-serif;font-size:6.5pt;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin-bottom:1mm}
.size{font-size:8pt;color:var(--muted);margin-top:1.5mm}
.perfect{font-size:8pt;color:var(--muted);margin-top:3mm}
.perfect b{color:var(--ink);font-weight:600;margin-right:1.5mm}
.lede{font-family:"Playfair Display",serif;font-style:italic;font-size:12pt;line-height:1.35;color:var(--wood);margin:2mm 0 3mm}

/* Cover */
.cover{padding:0;background:var(--cream)}
.cover-img{position:absolute;left:0;right:0;bottom:0;width:100%;height:215mm;object-fit:cover}
.cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--cream) 0%,var(--cream) 27%,rgba(243,234,219,0) 40%,rgba(43,33,24,0) 70%,rgba(43,33,24,.85) 100%)}
.cover>div{position:absolute;z-index:1;left:16mm;right:16mm}
.cover-top{top:14mm;display:flex;justify-content:space-between;align-items:center}
.brand{font-family:"Playfair Display",serif;font-size:13pt;letter-spacing:.38em}
.edition{font-size:7pt;letter-spacing:.3em;text-transform:uppercase;border:.3mm solid var(--ink);padding:1.5mm 3mm}
.cover-title{top:30mm}
.cover h1{font-size:40pt}
.cover h1 em{color:var(--wood)}
.cover-band{bottom:14mm;display:flex;justify-content:space-between;color:#fff;font-size:7.5pt;letter-spacing:.24em;text-transform:uppercase;border-top:.3mm solid rgba(255,255,255,.5);padding-top:4mm}

/* Story */
.story h2{font-size:24pt;margin-bottom:9mm}
.story-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:9mm}
.story-text p{margin-bottom:4mm;font-size:10pt;color:#3d3126}
.dropcap::first-letter{font-family:"Playfair Display",serif;float:left;font-size:38pt;line-height:.85;padding:1.5mm 2.5mm 0 0;color:var(--gold)}
.story-imgs{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.story-imgs img{width:100%;aspect-ratio:1;object-fit:cover}
.story-imgs img:first-child{grid-column:span 2;aspect-ratio:16/10}
.pillars{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:12mm;border-top:.3mm solid #e4d9c6;padding-top:7mm}
.pillars b{display:block;font-family:"Playfair Display",serif;font-size:12pt;font-weight:500;margin-bottom:1.5mm}
.pillars span{font-size:8pt;color:var(--muted)}

/* Index */
.index h2{font-size:26pt;margin-bottom:7mm}
.index-group{margin-bottom:5mm}
.index-head{display:flex;align-items:baseline;gap:3mm;font-family:"Playfair Display",serif;font-size:13pt;border-bottom:.3mm solid #e4d9c6;padding-bottom:1.5mm;margin-bottom:3mm}
.index-head span{font-size:8pt;color:var(--gold);font-family:Inter,sans-serif;font-weight:600}
.index-head i{margin-left:auto;font-size:7.5pt;font-style:normal;color:var(--muted);font-family:Inter,sans-serif}
.index-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:2.5mm}
.index-item img{width:100%;aspect-ratio:1;object-fit:cover;background:var(--cream)}
.index-item b{display:block;font-size:7pt;font-weight:600;line-height:1.25;margin-top:1.2mm}
.index-item small{font-size:6.5pt;color:var(--muted)}

/* Chapter */
.chapter{background:var(--wood);color:#f3eadb}
.chapter-inner{position:absolute;inset:22mm 16mm 22mm}
.chapter-no{font-family:"Playfair Display",serif;font-size:90pt;line-height:.9;color:var(--gold);opacity:.9;margin-bottom:6mm}
.chapter h2{font-size:36pt;margin-bottom:3mm}
.chapter .hook{font-family:"Playfair Display",serif;font-style:italic;font-size:16pt;color:var(--gold-l);margin-bottom:7mm}
.chapter .intro{font-size:10.5pt;max-width:140mm;color:#d9cbb6;margin-bottom:12mm}
.chapter-perfect{display:flex;gap:2.5mm;margin:-6mm 0 10mm}
.chapter-perfect span{font-size:7pt;letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #6a5440;color:#d9cbb6;padding:1.5mm 3mm;border-radius:10mm}
.thumbs{display:grid;gap:4mm}
.thumbs img{width:100%;aspect-ratio:1;object-fit:cover;border:.6mm solid #5a4635}
.thumbs figcaption{font-size:7pt;letter-spacing:.06em;color:#cbb89c;margin-top:1.5mm}

/* Feature */
.feature{padding:0}
.feature-img{position:relative;height:150mm;background:var(--cream)}
.feature-img img{width:100%;height:100%;object-fit:cover}
.feature-img .ribbon{top:10mm;left:16mm}
.feature-body{padding:9mm 16mm 0}
.feature h2{font-size:28pt}
.cols{display:grid;grid-template-columns:1.45fr 1fr;gap:9mm;margin-top:1mm}
.desc{font-size:9pt;color:#3d3126}
.spec{border-left:.3mm solid #e4d9c6;padding-left:6mm}
.spec dl{margin-top:4mm}
.spec dl div{display:flex;justify-content:space-between;gap:3mm;font-size:7.5pt;border-top:.25mm dashed #e4d9c6;padding:1.4mm 0}
.spec dt{color:var(--muted)}
.spec dd{text-align:right;font-weight:500}
.ctas{display:flex;align-items:center;gap:3mm;margin-top:5mm}
.ctas .qr{margin-left:auto;width:17mm}

/* Pair */
.pair{display:grid;grid-template-rows:1fr 1fr;gap:7mm;padding-bottom:20mm}
.card{display:grid;grid-template-columns:96mm 1fr;gap:7mm;min-height:0}
.card-img{position:relative;background:var(--cream)}
.card-img img{width:100%;height:100%;object-fit:cover}
.card-body{display:flex;flex-direction:column;min-height:0}
.card h3{font-size:19pt}
.card .lede{font-size:10.5pt}
.card .desc{font-size:8.5pt}
.card .row{margin-top:auto;padding-top:3mm;display:flex;justify-content:space-between;align-items:flex-end}
.card .row .qr{width:15mm}
.card .ctas{margin-top:3.5mm;gap:2mm}
.card .btn{padding:2.4mm 3.2mm;font-size:6.5pt;letter-spacing:.1em;white-space:nowrap}
.promo{grid-template-columns:1fr;background:var(--wood);color:#f3eadb;padding:14mm;align-items:center}
.promo h3{font-size:26pt;margin-bottom:4mm}
.promo p{font-size:10pt;color:#d9cbb6;max-width:120mm}

.quote{margin-top:26mm;padding:16mm 0 0;border-top:.3mm solid #e4d9c6;font-family:"Playfair Display",serif;font-size:22pt;line-height:1.35;text-align:center;color:var(--wood)}
.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:3mm;margin-top:10mm}
.strip img{width:100%;aspect-ratio:1;object-fit:cover}
.strip.dark{position:absolute;left:0;right:0;bottom:10mm}
.strip.dark img{border:.6mm solid #5a4635}

/* Trade */
.trade h2{font-size:28pt;margin-bottom:5mm}
.trade .intro{font-size:10.5pt;color:#3d3126;max-width:150mm;margin-bottom:9mm}
.uses{display:grid;grid-template-columns:1fr 1fr;gap:5mm 9mm}
.uses div{border-top:.3mm solid #e4d9c6;padding-top:3mm}
.uses b{display:block;font-family:"Playfair Display",serif;font-size:13pt;font-weight:500;margin-bottom:1mm}
.uses span{font-size:8.5pt;color:var(--muted)}
.trade-cta{display:flex;gap:9mm;align-items:center;background:var(--cream);padding:9mm;margin-top:11mm}
.trade-cta h3{font-size:17pt;margin-bottom:2mm}
.trade-cta p{font-size:8.5pt;color:var(--muted)}
.qr.big{width:30mm;flex:none}

/* Back */
.back{background:var(--wood);color:#f3eadb}
.back-inner{position:absolute;inset:22mm 16mm 16mm}
.back h2{font-size:32pt;margin-bottom:9mm}
.steps{list-style:none;counter-reset:s;display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin-bottom:12mm}
.steps li{counter-increment:s;border-top:.3mm solid #5a4635;padding-top:4mm}
.steps li::before{content:"0" counter(s);display:block;font-family:"Playfair Display",serif;font-size:22pt;color:var(--gold)}
.steps b{display:block;font-family:"Playfair Display",serif;font-size:14pt;font-weight:500;margin:1mm 0}
.steps span{font-size:8.5pt;color:#d9cbb6}
.qrs{display:flex;gap:12mm;margin-bottom:14mm}
.qrs a{text-align:center;font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase}
.qr.light{background:#fbf8f3;padding:3mm;width:36mm;margin-bottom:2.5mm}
.contact .brand{color:var(--gold-l);margin-bottom:3mm}
.contact p{font-size:9pt;color:#d9cbb6}
.fine{position:absolute;bottom:0;font-size:6.5pt;color:#9b8a73}
</style></head><body>${pages.join("\n")}</body></html>`;

// ─── Render ───
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tarana-catalogue-"));
const htmlPath = path.join(tmpDir, "catalogue.html");
fs.writeFileSync(htmlPath, html);

const chrome =
  process.env.CHROME_PATH ||
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Chrome not found. Install Google Chrome or set CHROME_PATH.");
  process.exit(1);
}

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--virtual-time-budget=15000",
    `--print-to-pdf=${OUT}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);
if (process.argv.includes("--keep-html")) console.log(`HTML: ${htmlPath}`);
else fs.rmSync(tmpDir, { recursive: true, force: true });

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`✓ ${path.relative(ROOT, OUT)} — ${pageNo} pages, ${kb} KB`);
