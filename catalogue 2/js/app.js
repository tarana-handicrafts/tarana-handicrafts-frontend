/* =============================================================
   TARANA HANDICRAFTS — APP LOGIC
   Renders the catalogue grid (index.html) and the product
   detail view (product.html?id=<product-id>).
   No frameworks, no dependencies — vanilla JavaScript.
   ============================================================= */

(function () {
  "use strict";

  var list = (typeof window !== "undefined" && window.products) ? window.products : [];

  // small helper to escape user-facing text safely
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /* ---------------- Catalogue grid ---------------- */
  function renderGrid() {
    var grid = document.getElementById("product-grid");
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML = '<div class="empty"><h2>No products yet</h2><p>Add products in <code>js/products.js</code>.</p></div>';
      return;
    }

    grid.innerHTML = list.map(function (p) {
      return '' +
        '<article class="card">' +
          '<a class="card-media" href="product.html?id=' + encodeURIComponent(p.id) + '" aria-label="View ' + esc(p.name) + '">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" />' +
          '</a>' +
          '<div class="card-body">' +
            '<h3>' + esc(p.name) + '</h3>' +
            '<p class="desc">' + esc(p.shortDescription) + '</p>' +
            '<div class="card-foot">' +
              '<span class="price">' + esc(p.price) + '</span>' +
              '<a class="btn btn-sm" href="product.html?id=' + encodeURIComponent(p.id) + '">View Details</a>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  /* ---------------- Product detail ---------------- */
  function renderDetail() {
    var wrap = document.getElementById("detail");
    if (!wrap) return;

    var id = getParam("id");
    var p = list.filter(function (x) { return x.id === id; })[0];

    if (!p) {
      wrap.innerHTML = '<div class="empty"><h2>Product not found</h2><p>This piece may have moved. <a href="index.html" class="btn btn-sm" style="margin-top:16px;">Back to Catalogue</a></p></div>';
      return;
    }

    document.title = p.name + " — Tarana Handicrafts";
    var crumb = document.getElementById("crumb-name");
    if (crumb) crumb.textContent = p.name;

    var specsHtml = (p.details && p.details.length)
      ? '<div class="rule"></div><h2 class="section-label">Product Information</h2><ul class="specs">' +
          p.details.map(function (d) {
            return '<li><span class="k">' + esc(d.label) + '</span><span class="v">' + esc(d.value) + '</span></li>';
          }).join("") + '</ul>'
      : "";

    var faqHtml = (p.faqs && p.faqs.length)
      ? '<div class="rule"></div><h2 class="section-label">Frequently Asked</h2><div class="faq">' +
          p.faqs.map(function (f) {
            return '<div class="faq-item">' +
                     '<button class="faq-q" type="button" aria-expanded="false">' +
                       '<span>' + esc(f.question) + '</span><span class="faq-icon" aria-hidden="true"></span>' +
                     '</button>' +
                     '<div class="faq-a"><div class="faq-a-inner">' + esc(f.answer) + '</div></div>' +
                   '</div>';
          }).join("") + '</div>'
      : "";

    wrap.innerHTML = '' +
      '<div class="detail-grid">' +
        '<figure class="detail-media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" />' +
        '</figure>' +
        '<div class="detail-info">' +
          '<div class="eyebrow">Tarana Collection</div>' +
          '<h1>' + esc(p.name) + '</h1>' +
          '<p class="short">' + esc(p.shortDescription) + '</p>' +
          '<div class="detail-price">' + esc(p.price) + '<small>' + esc(p.currency || "") + '</small></div>' +
          '<div class="rule"></div>' +
          '<h2 class="section-label">Description</h2>' +
          '<p class="long-desc">' + esc(p.longDescription) + '</p>' +
          specsHtml +
          faqHtml +
        '</div>' +
      '</div>';

    wireFaq(wrap);
  }

  /* ---------------- FAQ accordion behaviour ---------------- */
  function wireFaq(scope) {
    var items = scope.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var ans = item.querySelector(".faq-a");
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        // close others for a clean single-open accordion
        items.forEach(function (o) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          ans.style.maxHeight = ans.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid();
    renderDetail();
  });
})();
