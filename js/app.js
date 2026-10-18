/**
 * ============================================================================
 * CARBON TECH - Interactive 3D Spotlight + Minimalist Ordering Logic
 * Strict Technical Rules:
 * 1. Read-only Sanity CMS architecture (No write tokens in frontend).
 * 2. Floating-point safe math using safeRound() + .toFixed(2) formatting.
 * 3. Universal WhatsApp link https://wa.me/PHONE?text=ENCODED_MESSAGE.
 * ============================================================================
 */

const SVG_ICONS = {
  cartEmpty: `<svg class="svg-icon" style="width:38px;height:38px;opacity:0.35;" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  sun: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.93 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
};

// Flagship Professional & Workstation Spotlight Items
const SPOTLIGHT_ITEMS = [
  {
    productId: "prod-dell-xps-14",
    tag: "تحفة الألمنيوم المصقول • شاشة 3.2K OLED لمس",
    orbColor: "rgba(56, 189, 248, 0.34)",
    chips: ["Core Ultra 7", "3.2K OLED 120Hz", "32GB LPDDR5x", "1TB Gen4 SSD"]
  },
  {
    productId: "prod-macbook-pro-16",
    tag: "أداء احترافي للمبرمجين والمونتاج • بطارية 22 ساعة",
    orbColor: "rgba(148, 163, 184, 0.36)",
    chips: ["Apple M3 Pro", "16.2\" Retina XDR", "18GB Unified", "140W MagSafe 3"]
  },
  {
    productId: "prod-precision-5690",
    tag: "محطة عمل هندسية متنقلة • هيكل ألياف الكربون",
    orbColor: "rgba(16, 185, 129, 0.32)",
    chips: ["Core Ultra 9 vPro", "RTX 2000 Ada 8GB", "64GB ECC RAM", "2TB Gen4 SSD"]
  }
];

const state = {
  products: [...PRODUCTS_DATA],
  filteredProducts: [...PRODUCTS_DATA],
  filters: {
    category: "all",
    search: "",
    sort: "featured"
  },
  spotlightIndex: 0,
  spotlightTimer: null,
  activeProduct: null,
  activeImageIndex: 0,
  selectedVariantId: "std",
  modalQty: 1,
  cart: [],
  appliedPromo: null,
  deliveryMethod: "delivery",
  theme: "light"
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
  }, 2400);
}

/* ==========================================================================
   Interactive 3D Flagship Spotlight Controller
   ========================================================================== */
function renderSpotlight() {
  const cfg = SPOTLIGHT_ITEMS[state.spotlightIndex] || SPOTLIGHT_ITEMS[0];
  const product = state.products.find((p) => p.id === cfg.productId) || state.products[0];
  if (!product) return;

  const orbEl = document.getElementById("spotlight-orb");
  if (orbEl) orbEl.style.setProperty("--orb-color", cfg.orbColor);

  const tagEl = document.getElementById("spotlight-tag");
  const titleEl = document.getElementById("spotlight-title");
  const descEl = document.getElementById("spotlight-desc");
  const chipsEl = document.getElementById("spotlight-chips");
  const priceEl = document.getElementById("spotlight-price");
  const imgEl = document.getElementById("spotlight-image");
  const openBtn = document.getElementById("spotlight-open-btn");
  const frameEl = document.getElementById("spotlight-3d-frame");

  if (tagEl) tagEl.textContent = cfg.tag;
  if (titleEl) titleEl.textContent = product.name;
  if (descEl) descEl.textContent = product.shortDesc;
  if (priceEl) priceEl.textContent = formatMoney(product.price);
  if (imgEl) {
    imgEl.src = product.images[0]?.url || "";
    imgEl.alt = product.name;
  }

  if (chipsEl) {
    chipsEl.innerHTML = cfg.chips
      .map((chip) => `<span class="spotlight-chip ltr-text">${chip}</span>`)
      .join("");
  }

  if (openBtn) {
    openBtn.onclick = () => openProductModal(product.id);
  }
  if (frameEl) {
    frameEl.onclick = () => openProductModal(product.id);
  }

  document.querySelectorAll(".spotlight-tab").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === state.spotlightIndex);
  });
}

function selectSpotlightIndex(index) {
  state.spotlightIndex = index % SPOTLIGHT_ITEMS.length;
  renderSpotlight();
  resetSpotlightTimer();
}

function resetSpotlightTimer() {
  if (state.spotlightTimer) clearInterval(state.spotlightTimer);
  state.spotlightTimer = setInterval(() => {
    state.spotlightIndex = (state.spotlightIndex + 1) % SPOTLIGHT_ITEMS.length;
    renderSpotlight();
  }, 5500);
}

function initSpotlight3DParallax() {
  const stage = document.getElementById("spotlight-stage");
  const frame = document.getElementById("spotlight-3d-frame");
  if (!stage || !frame) return;

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 18;
    const rotateX = -y * 14;
    frame.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`;
  });

  stage.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

/* ==========================================================================
   Sanity CMS Public Read-Only Fetcher (Ready for Phase 2 Dashboard)
   ========================================================================== */
async function loadCatalogData() {
  if (!STORE_CONFIG.sanity.enabled) {
    state.products = [...PRODUCTS_DATA];
    renderSpotlight();
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
  renderSpotlight();
  applyFilters();
}

/* ==========================================================================
   Step 1: Minimal Catalog Rendering & Filtering
   ========================================================================== */
function applyFilters() {
  const { category, search, sort } = state.filters;
  const query = search.trim().toLowerCase();

  let list = state.products.filter((item) => {
    const matchCategory = category === "all" || item.category === category;
    const matchSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.specs.cpu.toLowerCase().includes(query) ||
      item.specs.gpu.toLowerCase().includes(query) ||
      item.specs.ram.toLowerCase().includes(query);

    return matchCategory && matchSearch;
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
    countEl.textContent = `اختر أي جهاز لعرض صوره المتعددة وجدول المواصفات الكامل (${state.filteredProducts.length} أجهزة)`;
  }

  if (state.filteredProducts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-outer);">
        <h3 style="margin-bottom: 0.4rem; font-size: 1rem;">لا توجد نتائج مطابقة</h3>
        <button class="cart-pill-btn" onclick="resetAllFilters()" style="margin: 0.75rem auto 0;">عرض جميع الأجهزة</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = state.filteredProducts
    .map((product) => {
      const mainImage = product.images[0]?.url || "";
      const briefSpec = `${product.specs.ramFilter} RAM • ${product.specs.storage.split(" ")[0]} SSD`;

      return `
        <article class="product-card" onclick="openProductModal('${product.id}')" aria-label="${product.name}">
          <div class="card-media">
            <img src="${mainImage}" alt="${product.name}" loading="lazy" />
          </div>

          <div class="card-body">
            <span class="card-category">${product.categoryLabel}</span>
            <h3 class="card-title">${product.name}</h3>
            <p class="card-brief-spec ltr-text" style="text-align: right;">${briefSpec}</p>

            <div class="card-footer">
              <span class="current-price ltr-text">${formatMoney(product.price)}</span>
              <span class="card-open-hint">التفاصيل</span>
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
    sort: "featured"
  };

  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("filter-sort");

  if (searchInput) searchInput.value = "";
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
    <span class="tag-pill">${product.condition}</span>
    <span class="tag-pill">${product.categoryLabel}</span>
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
        <p style="font-size: 0.8rem;">اضغط على أي جهاز لعرض تفاصيله وإضافته للسلة.</p>
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
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  const btn = document.getElementById("theme-toggle-btn");
  if (btn) {
    btn.innerHTML = state.theme === "light" ? SVG_ICONS.moon : SVG_ICONS.sun;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCatalogData();
  updateCartUI();
  initSpotlight3DParallax();
  resetSpotlightTimer();

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
