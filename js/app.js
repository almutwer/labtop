/**
 * ============================================================================
 * CARBON TECH - Main Application Logic (5-Step Ordering Flow + Gallery Modal)
 * Visual Identity: Luxury Carbon Dark + Inline SVG Icons (Zero Emojis)
 * Strict Technical Rules:
 * 1. Read-only Sanity CMS architecture (No write tokens in frontend).
 * 2. Floating-point safe math using safeRound() + .toFixed(2) formatting.
 * 3. Universal WhatsApp link https://wa.me/PHONE?text=ENCODED_MESSAGE.
 * ============================================================================
 */

const SVG_ICONS = {
  images: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  cpu: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  ram: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M2 15h20a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Z"/></svg>`,
  storage: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  gpu: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/></svg>`,
  plus: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  cartEmpty: `<svg class="svg-icon" style="width:42px;height:42px;opacity:0.4;" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  sun: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.93 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
};

const state = {
  products: [...PRODUCTS_DATA],
  filteredProducts: [...PRODUCTS_DATA],
  filters: {
    category: "all",
    search: "",
    brand: "all",
    ram: "all",
    sort: "featured"
  },
  activeProduct: null,
  activeImageIndex: 0,
  selectedVariantId: "std",
  modalQty: 1,
  cart: [],
  appliedPromo: null,
  deliveryMethod: "delivery",
  theme: "dark"
};

/* ==========================================================================
   Utility Functions (Strict Math & Phone Sanitization)
   ========================================================================== */
function safeRound(value) {
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function formatMoney(amount) {
  const safeVal = safeRound(amount);
  return `${safeVal.toFixed(2)} ${STORE_CONFIG.currencySymbol}`;
}

function cleanPhoneNumber(rawPhone) {
  return String(rawPhone || "").replace(/\D/g, "");
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2600);
}

/* ==========================================================================
   Sanity CMS Public Read-Only Fetcher (Ready for Phase 2 Dashboard)
   ========================================================================== */
async function loadCatalogData() {
  if (!STORE_CONFIG.sanity.enabled) {
    state.products = [...PRODUCTS_DATA];
    applyFilters();
    return;
  }

  const { projectId, dataset, apiVersion } = STORE_CONFIG.sanity;
  const query = encodeURIComponent(
    `*[_type == "product" && inStock == true] | order(_createdAt desc)`
  );
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch from Sanity CMS");
    const data = await response.json();
    if (Array.isArray(data.result) && data.result.length > 0) {
      state.products = data.result;
    }
  } catch (err) {
    console.warn("Using local fallback catalog:", err.message);
    state.products = [...PRODUCTS_DATA];
  }
  applyFilters();
}

/* ==========================================================================
   Step 1: Catalog Rendering, Filtering & Product Details Modal
   ========================================================================== */
function applyFilters() {
  const { category, search, brand, ram, sort } = state.filters;
  const query = search.trim().toLowerCase();

  let list = state.products.filter((item) => {
    const matchCategory = category === "all" || item.category === category;
    const matchBrand = brand === "all" || item.brand === brand;
    const matchRam = ram === "all" || item.specs.ramFilter === ram;
    const matchSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.specs.cpu.toLowerCase().includes(query) ||
      item.specs.gpu.toLowerCase().includes(query) ||
      item.specs.ram.toLowerCase().includes(query) ||
      item.specs.storage.toLowerCase().includes(query);

    return matchCategory && matchBrand && matchRam && matchSearch;
  });

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  state.filteredProducts = list;
  renderProductsGrid();
}

function renderProductsGrid() {
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("results-count");
  if (!grid) return;

  if (countEl) {
    countEl.textContent = `عرض ${state.filteredProducts.length} من أصل ${state.products.length} جهاز`;
  }

  if (state.filteredProducts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <h3 style="margin-bottom: 0.4rem; font-size: 1.05rem;">لا توجد أجهزة مطابقة لخيارات الفلترة</h3>
        <p style="color: var(--text-muted); font-size: 0.86rem; margin-bottom: 1.1rem;">جرّب تغيير الفئة أو إعادة ضبط الفلاتر لعرض جميع الأجهزة.</p>
        <button class="btn-quick-add" onclick="resetAllFilters()" style="margin: 0 auto;">إعادة ضبط الفلاتر</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = state.filteredProducts
    .map((product) => {
      const mainImage = product.images[0]?.url || "";
      const imageCount = product.images.length;
      const hasDiscount = product.oldPrice && product.oldPrice > product.price;
      const discountAmount = hasDiscount
        ? safeRound(product.oldPrice - product.price).toFixed(2)
        : null;

      return `
        <article class="product-card" onclick="openProductModal('${product.id}')" aria-label="${product.name}">
          <div class="card-media">
            <div class="card-badges">
              <span class="badge badge-condition">${product.condition}</span>
              ${hasDiscount ? `<span class="badge badge-discount">خصم ${discountAmount}${STORE_CONFIG.currencySymbol}</span>` : ""}
            </div>
            <img src="${mainImage}" alt="${product.name}" loading="lazy" />
            <span class="gallery-count-pill">
              ${SVG_ICONS.images}
              <span>${imageCount} صور</span>
            </span>
          </div>

          <div class="card-body">
            <div class="card-meta">
              <span class="card-brand-tag">${product.brand}</span>
              <span class="ltr-text">${product.sku}</span>
            </div>
            <h3 class="card-title">${product.name}</h3>

            <!-- Technical Specs Matrix inside Product Card -->
            <div class="card-specs-preview">
              <div class="spec-mini">
                <span class="spec-mini-label">${SVG_ICONS.cpu} المعالج</span>
                <span class="spec-mini-value" title="${product.specs.cpu}">${product.specs.cpu}</span>
              </div>
              <div class="spec-mini">
                <span class="spec-mini-label">${SVG_ICONS.ram} الرامات</span>
                <span class="spec-mini-value" title="${product.specs.ram}">${product.specs.ram}</span>
              </div>
              <div class="spec-mini">
                <span class="spec-mini-label">${SVG_ICONS.storage} التخزين</span>
                <span class="spec-mini-value" title="${product.specs.storage}">${product.specs.storage}</span>
              </div>
              <div class="spec-mini">
                <span class="spec-mini-label">${SVG_ICONS.gpu} كرت الشاشة</span>
                <span class="spec-mini-value" title="${product.specs.gpu}">${product.specs.gpu}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-block">
                ${hasDiscount ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
                <span class="current-price">${formatMoney(product.price)}</span>
              </div>
              <div class="card-actions">
                <button
                  type="button"
                  class="btn-details"
                  onclick="event.stopPropagation(); openProductModal('${product.id}')"
                >
                  المواصفات والصور
                </button>
                <button
                  type="button"
                  class="btn-quick-add"
                  onclick="event.stopPropagation(); quickAddToCart('${product.id}')"
                  title="إضافة سريعة للسلة"
                >
                  ${SVG_ICONS.plus}
                  <span>للسلة</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function resetAllFilters() {
  state.filters = {
    category: "all",
    search: "",
    brand: "all",
    ram: "all",
    sort: "featured"
  };

  const searchInput = document.getElementById("search-input");
  const brandSelect = document.getElementById("filter-brand");
  const ramSelect = document.getElementById("filter-ram");
  const sortSelect = document.getElementById("filter-sort");

  if (searchInput) searchInput.value = "";
  if (brandSelect) brandSelect.value = "all";
  if (ramSelect) ramSelect.value = "all";
  if (sortSelect) sortSelect.value = "featured";

  document.querySelectorAll(".category-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === "all");
  });

  applyFilters();
}

/* ==========================================================================
   Product Details Modal & Multi-Image Interactive Gallery
   ========================================================================== */
function openProductModal(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  state.activeProduct = product;
  state.activeImageIndex = 0;
  state.selectedVariantId = product.variants?.[0]?.id || "std";
  state.modalQty = 1;

  renderModalContent();

  const backdrop = document.getElementById("product-modal-backdrop");
  if (backdrop) {
    backdrop.classList.add("open");
    document.body.classList.add("modal-open");
  }
}

function closeProductModal() {
  const backdrop = document.getElementById("product-modal-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    document.body.classList.remove("modal-open");
  }
  state.activeProduct = null;
}

function getActiveUnitPrice() {
  if (!state.activeProduct) return 0;
  const variant = state.activeProduct.variants?.find(
    (v) => v.id === state.selectedVariantId
  );
  const delta = variant ? safeRound(variant.priceDelta) : 0;
  return safeRound(state.activeProduct.price + delta);
}

function renderModalContent() {
  const product = state.activeProduct;
  if (!product) return;

  const activeImg = product.images[state.activeImageIndex] || product.images[0];
  const unitPrice = getActiveUnitPrice();
  const totalModalPrice = safeRound(unitPrice * state.modalQty);

  document.getElementById("modal-sku-title").textContent = `${product.brand} — ${product.sku}`;

  const mainImgEl = document.getElementById("modal-main-image");
  mainImgEl.src = activeImg.url;
  mainImgEl.alt = `${product.name} - ${activeImg.caption}`;
  document.getElementById("modal-image-caption").textContent = activeImg.caption;
  document.getElementById("modal-image-counter").textContent = `${state.activeImageIndex + 1} / ${product.images.length}`;

  const thumbsContainer = document.getElementById("modal-thumbnails");
  thumbsContainer.innerHTML = product.images
    .map(
      (img, idx) => `
      <button
        type="button"
        class="gallery-thumb ${idx === state.activeImageIndex ? "active" : ""}"
        onclick="selectModalImage(${idx})"
        aria-label="${img.caption}"
      >
        <img src="${img.url}" alt="${img.caption}" />
      </button>
    `
    )
    .join("");

  document.getElementById("modal-badges").innerHTML = `
    <span class="badge badge-condition">${product.condition}</span>
    <span class="badge badge-stock">${product.inStock ? "متوفر في المعرض" : "غير متوفر"}</span>
    <span class="badge" style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary);">${product.categoryLabel}</span>
  `;
  document.getElementById("modal-title").textContent = product.name;
  document.getElementById("modal-desc").textContent = product.shortDesc;

  document.getElementById("modal-price-value").textContent = formatMoney(unitPrice);
  document.getElementById("modal-old-price").textContent =
    product.oldPrice && product.oldPrice > product.price
      ? formatMoney(product.oldPrice)
      : "";

  const variantsBox = document.getElementById("modal-variants-box");
  if (product.variants && product.variants.length > 0) {
    variantsBox.style.display = "block";
    document.getElementById("modal-variants-list").innerHTML = product.variants
      .map(
        (v) => `
        <button
          type="button"
          class="variant-btn ${v.id === state.selectedVariantId ? "active" : ""}"
          onclick="selectProductVariant('${v.id}')"
        >
          ${v.label}
        </button>
      `
      )
      .join("");
  } else {
    variantsBox.style.display = "none";
  }

  const s = product.specs;
  const specRows = [
    { label: "المعالج (CPU)", val: s.cpu },
    { label: "الرامات (RAM)", val: s.ram },
    { label: "التخزين (SSD)", val: s.storage },
    { label: "كرت الشاشة (GPU)", val: s.gpu },
    { label: "الشاشة (Display)", val: s.display },
    { label: "البطارية / الطاقة", val: s.battery },
    { label: "نظام التشغيل (OS)", val: s.os },
    { label: "المنافذ (Ports)", val: s.ports },
    { label: "الضمان (Warranty)", val: s.warranty }
  ];

  document.getElementById("modal-specs-list").innerHTML = specRows
    .map(
      (row) => `
      <div class="spec-row">
        <span class="spec-label">${row.label}</span>
        <span class="spec-val">${row.val}</span>
      </div>
    `
    )
    .join("");

  document.getElementById("modal-qty-value").textContent = state.modalQty;
  document.getElementById("modal-add-btn-text").textContent = `إضافة للسلة (${formatMoney(totalModalPrice)})`;
}

function selectModalImage(index) {
  if (!state.activeProduct) return;
  const count = state.activeProduct.images.length;
  state.activeImageIndex = (index + count) % count;
  renderModalContent();
}

function stepModalImage(direction) {
  if (!state.activeProduct) return;
  selectModalImage(state.activeImageIndex + direction);
}

function selectProductVariant(variantId) {
  state.selectedVariantId = variantId;
  renderModalContent();
}

function changeModalQty(delta) {
  const nextQty = state.modalQty + delta;
  if (nextQty < 1 || nextQty > 20) return;
  state.modalQty = nextQty;
  renderModalContent();
}

/* ==========================================================================
   Step 2 & 3: Cart State Management, Validation & Safe Calculations
   ========================================================================== */
function addToCart(product, variantId, quantity) {
  const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
  const variant =
    product.variants?.find((v) => v.id === variantId) ||
    product.variants?.[0] || { id: "std", label: "النسخة القياسية", priceDelta: 0 };

  const unitPrice = safeRound(product.price + (variant.priceDelta || 0));
  const cartKey = `${product.id}__${variant.id}`;

  const existingItem = state.cart.find((item) => item.cartKey === cartKey);
  if (existingItem) {
    existingItem.qty = Math.min(20, existingItem.qty + cleanQty);
  } else {
    state.cart.push({
      cartKey,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      variantLabel: variant.label,
      specsSummary: `${product.specs.cpu} | ${product.specs.ram} | ${product.specs.storage}`,
      unitPrice,
      qty: cleanQty,
      image: product.images[0]?.url || ""
    });
  }

  updateCartUI();
  showToast(`تمت إضافة "${product.name}" إلى السلة`);
}

function quickAddToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;
  const defaultVariant = product.variants?.[0]?.id || "std";
  addToCart(product, defaultVariant, 1);
}

function addActiveModalProductToCart(openCheckoutImmediately = false) {
  if (!state.activeProduct) return;
  addToCart(state.activeProduct, state.selectedVariantId, state.modalQty);
  closeProductModal();
  if (openCheckoutImmediately) {
    openCartDrawer();
  }
}

function updateCartItemQty(cartKey, delta) {
  const idx = state.cart.findIndex((item) => item.cartKey === cartKey);
  if (idx === -1) return;

  const newQty = state.cart[idx].qty + delta;
  if (newQty <= 0) {
    state.cart.splice(idx, 1);
  } else if (newQty <= 20) {
    state.cart[idx].qty = newQty;
  }
  updateCartUI();
}

function applyPromoCode() {
  const input = document.getElementById("promo-input");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    state.appliedPromo = null;
    updateCartUI();
    return;
  }

  const promo = STORE_CONFIG.promoCodes[code];
  if (!promo) {
    showToast("كود الخصم غير صالح. جرب TECH10 أو LAPTOP50");
    return;
  }

  state.appliedPromo = { code, ...promo };
  showToast(`تم تفعيل كود الخصم (${promo.label})`);
  updateCartUI();
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => {
    const lineTotal = safeRound(item.unitPrice * item.qty);
    return safeRound(sum + lineTotal);
  }, 0);

  let discount = 0;
  if (state.appliedPromo && subtotal > 0) {
    if (state.appliedPromo.type === "percent") {
      discount = safeRound(subtotal * (state.appliedPromo.value / 100));
    } else if (state.appliedPromo.type === "fixed") {
      discount = Math.min(subtotal, safeRound(state.appliedPromo.value));
    }
  }

  const afterDiscount = safeRound(Math.max(0, subtotal - discount));

  let deliveryFee = 0;
  if (state.cart.length > 0 && state.deliveryMethod === "delivery") {
    deliveryFee =
      afterDiscount >= STORE_CONFIG.freeDeliveryThreshold
        ? 0
        : safeRound(STORE_CONFIG.deliveryFee);
  }

  const finalTotal = safeRound(afterDiscount + deliveryFee);

  return {
    subtotal,
    discount,
    deliveryFee,
    finalTotal
  };
}

function updateCartUI() {
  const totalCount = state.cart.reduce((acc, item) => acc + item.qty, 0);
  const badgeEl = document.getElementById("cart-count-badge");
  if (badgeEl) badgeEl.textContent = totalCount;

  const listEl = document.getElementById("cart-items-container");
  const checkoutSection = document.getElementById("cart-checkout-section");
  const submitBtn = document.getElementById("whatsapp-submit-btn");

  if (!listEl) return;

  if (state.cart.length === 0) {
    listEl.innerHTML = `
      <div class="cart-empty-state">
        ${SVG_ICONS.cartEmpty}
        <h4>سلة المشتريات فارغة</h4>
        <p style="font-size: 0.82rem;">اختر اللابتوب أو الكمبيوتر المطلوب وأضفه للسلة لإتمام الطلب عبر واتساب.</p>
      </div>
    `;
    if (checkoutSection) checkoutSection.style.display = "none";
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  if (checkoutSection) checkoutSection.style.display = "flex";
  if (submitBtn) submitBtn.disabled = false;

  listEl.innerHTML = state.cart
    .map((item) => {
      const lineTotal = safeRound(item.unitPrice * item.qty);
      return `
        <div class="cart-item">
          <div class="cart-item-img-box">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-variant">${item.variantLabel}</div>
            <div class="cart-item-bottom">
              <span class="cart-item-math ltr-text">
                ${item.qty} × ${item.unitPrice.toFixed(2)} = ${formatMoney(lineTotal)}
              </span>
              <div class="cart-qty-mini">
                <button type="button" onclick="updateCartItemQty('${item.cartKey}', -1)">-</button>
                <span class="ltr-text">${item.qty}</span>
                <button type="button" onclick="updateCartItemQty('${item.cartKey}', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const totals = calculateCartTotals();
  document.getElementById("summary-subtotal").textContent = formatMoney(totals.subtotal);
  document.getElementById("summary-discount").textContent = `- ${formatMoney(totals.discount)}`;
  document.getElementById("summary-delivery").textContent =
    totals.deliveryFee === 0 ? "مجاني (0.00)" : formatMoney(totals.deliveryFee);
  document.getElementById("summary-final-total").textContent = formatMoney(totals.finalTotal);
}

function openCartDrawer() {
  const drawerBackdrop = document.getElementById("cart-drawer-backdrop");
  if (drawerBackdrop) {
    drawerBackdrop.classList.add("open");
    document.body.classList.add("modal-open");
  }
}

function closeCartDrawer() {
  const drawerBackdrop = document.getElementById("cart-drawer-backdrop");
  if (drawerBackdrop) {
    drawerBackdrop.classList.remove("open");
    document.body.classList.remove("modal-open");
  }
}

/* ==========================================================================
   Step 4 & 5: Message Generation & WhatsApp Deep Link Redirection
   ========================================================================== */
function completeOrderViaWhatsApp(event) {
  if (event) event.preventDefault();

  if (state.cart.length === 0) {
    showToast("السلة فارغة، يرجى إضافة جهاز أولاً");
    return;
  }

  const nameInput = document.getElementById("cust-name");
  const phoneInput = document.getElementById("cust-phone");
  const addressInput = document.getElementById("cust-address");
  const notesInput = document.getElementById("cust-notes");

  const customerName = (nameInput?.value || "").trim();
  const customerPhone = (phoneInput?.value || "").trim();
  const customerAddress = (addressInput?.value || "").trim();
  const customerNotes = (notesInput?.value || "").trim();

  if (!customerName || !customerPhone) {
    showToast("يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب");
    nameInput?.focus();
    return;
  }

  if (state.deliveryMethod === "delivery" && !customerAddress) {
    showToast("يرجى إدخال عنوان التوصيل أو اختيار الاستلام من المعرض");
    addressInput?.focus();
    return;
  }

  const totals = calculateCartTotals();

  const lines = [
    `*طلب جديد — ${STORE_CONFIG.storeName}*`,
    `────────────────────`,
    `*بيانات العميل:*`,
    `• الاسم: ${customerName}`,
    `• الهاتف: ${cleanPhoneNumber(customerPhone)}`,
    `• الاستلام: ${state.deliveryMethod === "delivery" ? "توصيل للعنوان" : "استلام من المعرض"}`,
    state.deliveryMethod === "delivery" ? `• العنوان: ${customerAddress}` : null,
    customerNotes ? `• ملاحظات: ${customerNotes}` : null,
    `────────────────────`,
    `*الأجهزة المطلوبة:*`
  ].filter(Boolean);

  state.cart.forEach((item, idx) => {
    const lineTotal = safeRound(item.unitPrice * item.qty).toFixed(2);
    lines.push(
      `${idx + 1}. *${item.name}* (${item.sku})`,
      `   - النسخة: ${item.variantLabel}`,
      `   - المواصفات: ${item.specsSummary}`,
      `   - السعر: ${item.qty} × ${item.unitPrice.toFixed(2)}${STORE_CONFIG.currencySymbol} = *${lineTotal}${STORE_CONFIG.currencySymbol}*`
    );
  });

  lines.push(
    `────────────────────`,
    `*ملخص الحساب:*`,
    `• المجموع الفرعي: ${totals.subtotal.toFixed(2)} ${STORE_CONFIG.currencySymbol}`,
    totals.discount > 0
      ? `• الخصم (${state.appliedPromo?.code}): -${totals.discount.toFixed(2)} ${STORE_CONFIG.currencySymbol}`
      : null,
    `• رسوم التوصيل: ${totals.deliveryFee.toFixed(2)} ${STORE_CONFIG.currencySymbol}`,
    `*الإجمالي النهائي: ${totals.finalTotal.toFixed(2)} ${STORE_CONFIG.currencySymbol}*`
  );

  const finalMessage = lines.filter(Boolean).join("\n");
  const cleanStorePhone = cleanPhoneNumber(STORE_CONFIG.whatsappNumber);
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsappUrl = `https://wa.me/${cleanStorePhone}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/* ==========================================================================
   Theme Toggle & Event Listeners Initialization
   ========================================================================== */
function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  const btn = document.getElementById("theme-toggle-btn");
  if (btn) {
    btn.innerHTML =
      state.theme === "dark"
        ? `${SVG_ICONS.sun}<span>مظهر فاتح</span>`
        : `${SVG_ICONS.moon}<span>مظهر داكن</span>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCatalogData();
  updateCartUI();

  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.filters.category = tab.dataset.category || "all";
      applyFilters();
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      applyFilters();
    });
  }

  document.getElementById("filter-brand")?.addEventListener("change", (e) => {
    state.filters.brand = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-ram")?.addEventListener("change", (e) => {
    state.filters.ram = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-sort")?.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    applyFilters();
  });

  document.getElementById("cust-delivery-method")?.addEventListener("change", (e) => {
    state.deliveryMethod = e.target.value;
    const addrField = document.getElementById("address-field-wrapper");
    if (addrField) {
      addrField.style.display = state.deliveryMethod === "delivery" ? "flex" : "none";
    }
    updateCartUI();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeCartDrawer();
    } else if (state.activeProduct && e.key === "ArrowLeft") {
      stepModalImage(1);
    } else if (state.activeProduct && e.key === "ArrowRight") {
      stepModalImage(-1);
    }
  });
});
