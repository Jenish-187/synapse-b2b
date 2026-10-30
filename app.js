/**
 * SYNAPSE B2B — INDUSTRIAL COMMERCE & POOLED CO-PROCUREMENT PLATFORM ENGINE
 * Pure vanilla ES6: Enterprise Wholesale Tier Calculations, Pooled Group Buying,
 * Mill Test Certificate (MTC) Inspection, and Corporate PO Generation.
 */

// Fallback Enterprise Account
const DEFAULT_ENTERPRISE_ACCOUNT = {
  companyName: "Nexus Aerospace & Fabrication Ltd",
  gstin: "27AABCN1234F1Z8",
  buyerName: "Jenish Patel",
  email: "procurement@nexusaero.com",
  industry: "Heavy Fabrication & Defense",
  creditLimit: "$250,000 Approved (Net 30)",
  billingAddress: "Plot 84, Industrial Hub Phase II, Whitefield, Bengaluru 560066"
};

// Application State
const b2bState = {
  poCart: (() => {
    try {
      const raw = JSON.parse(localStorage.getItem('synapse_b2b_cart') || '[]');
      if (Array.isArray(raw) && typeof RAW_MATERIALS !== 'undefined') {
        return raw.filter(item => RAW_MATERIALS.some(m => m.id === item.id));
      }
      return [];
    } catch (e) {
      return [];
    }
  })(),
  currency: localStorage.getItem('synapse_b2b_currency') || 'USD',
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  filterOnlyPools: false,
  selectedIncoterm: 'CIF', // CIF, FOB, EXW
  theme: 'light',
  activeMaterialForModal: null,
  activeAccount: (typeof SAMPLE_ENTERPRISE_ACCOUNTS !== 'undefined' && SAMPLE_ENTERPRISE_ACCOUNTS.length > 0)
    ? SAMPLE_ENTERPRISE_ACCOUNTS[0]
    : DEFAULT_ENTERPRISE_ACCOUNT
};

// Trade Currencies & Rates
const TRADE_CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, position: 'before' },
  EUR: { symbol: '€', rate: 0.92, position: 'before' },
  INR: { symbol: '₹', rate: 83.2, position: 'before' },
  GBP: { symbol: '£', rate: 0.79, position: 'before' }
};

// Incoterm Freight Adjustments
const INCOTERMS_RATES = {
  CIF: { label: "CIF (Port/Hub)", freight: 450.00, desc: "Cost, Insurance & Freight to destination port" },
  FOB: { label: "FOB (Origin)", freight: 120.00, desc: "Free on Board at manufacturer loading dock" },
  EXW: { label: "EXW (Factory)", freight: 0.00, desc: "Ex Works pickup directly by buyer's transport" }
};

// DOM Cache
const dom = {
  commodityTickerTrack: document.getElementById('commodity-ticker-track'),
  materialsGrid: document.getElementById('materials-grid'),
  industryTabs: document.getElementById('industry-tabs'),
  sortSelect: document.getElementById('b2b-sort-select'),
  poolFilterToggle: document.getElementById('pool-filter-toggle'),
  poolFilterLabel: document.getElementById('pool-filter-label'),
  searchInput: document.getElementById('search-input'),
  catalogCountText: document.getElementById('catalog-count-text'),
  activeTagIndicator: document.getElementById('active-tag-indicator'),
  activeTagName: document.getElementById('active-tag-name'),
  resetFilterBtn: document.getElementById('reset-filter-btn'),
  currencySelect: document.getElementById('currency-select'),
  // Header Badges
  poBadgeCount: document.getElementById('po-badge-count'),
  poWeightMetric: document.getElementById('po-weight-metric'),
  poDrawerTrigger: document.getElementById('po-drawer-trigger'),
  // PO Drawer
  poDrawerBackdrop: document.getElementById('po-drawer-backdrop'),
  poDrawerClose: document.getElementById('po-drawer-close'),
  drawerItemsCount: document.getElementById('drawer-items-count'),
  poItemsContainer: document.getElementById('po-items-container'),
  poDrawerFooter: document.getElementById('po-drawer-footer'),
  poGrossVal: document.getElementById('po-gross-val'),
  poTierSaveLine: document.getElementById('po-tier-save-line'),
  poTierSaveVal: document.getElementById('po-tier-save-val'),
  poPoolSaveLine: document.getElementById('po-pool-save-line'),
  poPoolSaveVal: document.getElementById('po-pool-save-val'),
  poFreightVal: document.getElementById('po-freight-val'),
  poTaxVal: document.getElementById('po-tax-val'),
  poNetVal: document.getElementById('po-net-val'),
  generatePoBtn: document.getElementById('generate-po-btn'),
  // Spec Modal
  specModal: document.getElementById('spec-modal'),
  specModalClose: document.getElementById('spec-modal-close'),
  modalMatCat: document.getElementById('modal-mat-cat'),
  modalMatCert: document.getElementById('modal-mat-cert'),
  modalMatTitle: document.getElementById('modal-mat-title'),
  modalMatGrade: document.getElementById('modal-mat-grade'),
  modalMatDesc: document.getElementById('modal-mat-desc'),
  modalSpecTbody: document.getElementById('modal-spec-tbody'),
  requestSampleBtn: document.getElementById('request-sample-btn'),
  modalAddPoBtn: document.getElementById('modal-add-po-btn'),
  // PO Sheet Modal
  poSheetModal: document.getElementById('po-sheet-modal'),
  poSheetClose: document.getElementById('po-sheet-close'),
  poInteractiveView: document.getElementById('po-interactive-view'),
  poSuccessView: document.getElementById('po-success-view'),
  autofillPoBtn: document.getElementById('autofill-po-btn'),
  poRefNum: document.getElementById('po-ref-num'),
  poDateStr: document.getElementById('po-date-str'),
  poBuyerName: document.getElementById('po-buyer-name'),
  poBuyerGst: document.getElementById('po-buyer-gst'),
  poBuyerAddr: document.getElementById('po-buyer-addr'),
  poSheetIncoterm: document.getElementById('po-sheet-incoterm'),
  poSheetItemsTbody: document.getElementById('po-sheet-items-tbody'),
  poSheetSubtotal: document.getElementById('po-sheet-subtotal'),
  poSheetSavings: document.getElementById('po-sheet-savings'),
  poSheetGrandtotal: document.getElementById('po-sheet-grandtotal'),
  submitPoBtn: document.getElementById('submit-po-btn'),
  downloadPoBtn: document.getElementById('download-po-btn'),
  poSuccessDoneBtn: document.getElementById('po-success-done-btn'),
  successPoRef: document.getElementById('success-po-ref'),
  // Hero Pool Actions
  heroJoinPoolBtn: document.getElementById('hero-join-pool-btn'),
  heroInspectBtn: document.getElementById('hero-inspect-btn'),
  poolTimer: document.getElementById('pool-time-text'),
  // Notifications & Canvas
  toastStack: document.getElementById('toast-stack'),
  confettiCanvas: document.getElementById('confetti-canvas')
};

/* ==========================================================================
   FORMATTERS & HELPERS
   ========================================================================== */
function formatCurrency(amountUSD) {
  const cur = TRADE_CURRENCIES[b2bState.currency] || TRADE_CURRENCIES.USD;
  const converted = amountUSD * cur.rate;
  const formatted = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return cur.position === 'before' ? `${cur.symbol}${formatted}` : `${formatted} ${cur.symbol}`;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast-pill toast-${type}`;
  let iconSvg = '';

  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'pool') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  dom.toastStack.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function saveCart() {
  localStorage.setItem('synapse_b2b_cart', JSON.stringify(b2bState.poCart));
}

/* ==========================================================================
   WHOLESALE TIER PRICING LOGIC
   ========================================================================== */
function getMaterialEffectiveRate(material, qty, isPoolOrder = false) {
  if (isPoolOrder && material.hasActivePool && material.poolDetails) {
    // If buyer joined the collective group pool, apply full pool discount
    const poolDiscountPct = material.poolDetails.poolDiscount / 100;
    const discountedRate = material.basePricePerUnit * (1 - poolDiscountPct);
    return {
      ratePerUnit: discountedRate,
      discountPct: material.poolDetails.poolDiscount,
      tierIndex: -1,
      isPool: true
    };
  }

  // Look up volume tier
  let applicableTier = material.tiers[0];
  let applicableIndex = 0;

  for (let i = 0; i < material.tiers.length; i++) {
    const tier = material.tiers[i];
    if (qty >= tier.minQty) {
      applicableTier = tier;
      applicableIndex = i;
    }
  }

  return {
    ratePerUnit: applicableTier.pricePerUnit,
    discountPct: applicableTier.discountPct,
    tierIndex: applicableIndex,
    isPool: false
  };
}

function getRawMaterialsList() {
  return (typeof window !== 'undefined' && window.RAW_MATERIALS) || (typeof RAW_MATERIALS !== 'undefined' ? RAW_MATERIALS : []);
}

function getCommodityTickersList() {
  return (typeof window !== 'undefined' && window.COMMODITY_TICKER) || (typeof COMMODITY_TICKER !== 'undefined' ? COMMODITY_TICKER : []);
}

/* ==========================================================================
   COMMODITY MARKET TICKER
   ========================================================================== */
function renderCommodityTicker() {
  const tickerData = getCommodityTickersList();
  if (!dom.commodityTickerTrack || tickerData.length === 0) return;
  // Duplicate array once for seamless infinite CSS marquee
  const tickerItems = [...tickerData, ...tickerData];
  dom.commodityTickerTrack.innerHTML = tickerItems.map(item => `
    <div class="ticker-item">
      <span class="ticker-symbol">${item.symbol}:</span>
      <span class="ticker-price">${item.price}</span>
      <span class="ticker-delta ${item.status}">${item.delta}</span>
    </div>
  `).join('');
}

/* ==========================================================================
   HERO GROUP POOL COUNTDOWN TIMER
   ========================================================================== */
function initPoolCountdown() {
  let totalSeconds = 35 * 3600 + 48 * 60 + 12;
  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 48 * 3600;
    totalSeconds--;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    if (dom.poolTimer) {
      dom.poolTimer.textContent = `Pool Closes in ${h}h : ${m}m : ${s}s`;
    }
  }, 1000);
}

/* ==========================================================================
   CATALOG RENDERING
   ========================================================================== */
function getFilteredMaterials() {
  const allMaterials = getRawMaterialsList();
  return allMaterials.filter(item => {
    // Category match
    if (b2bState.currentCategory !== 'all' && item.category !== b2bState.currentCategory) {
      return false;
    }
    // Search query match
    if (b2bState.searchQuery.trim() !== '') {
      const q = b2bState.searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchGrade = item.grade.toLowerCase().includes(q);
      const matchCat = item.categoryName.toLowerCase().includes(q);
      const matchOrigin = item.origin.toLowerCase().includes(q);
      if (!matchName && !matchGrade && !matchCat && !matchOrigin) {
        return false;
      }
    }
    // Only Pools filter
    if (b2bState.filterOnlyPools && !item.hasActivePool) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (b2bState.sortBy === 'moq-low') return a.moq - b.moq;
    if (b2bState.sortBy === 'price-low') return a.basePricePerUnit - b.basePricePerUnit;
    if (b2bState.sortBy === 'price-high') return b.basePricePerUnit - a.basePricePerUnit;
    if (b2bState.sortBy === 'pool-active') {
      return (b.hasActivePool ? 1 : 0) - (a.hasActivePool ? 1 : 0);
    }
    return 0;
  });
}

function renderCatalog() {
  const materials = getFilteredMaterials();

  // Meta count text
  dom.catalogCountText.textContent = `Displaying ${materials.length} of ${getRawMaterialsList().length} verified industrial grade materials`;

  // Filter indicator
  if (b2bState.currentCategory !== 'all' || b2bState.searchQuery || b2bState.filterOnlyPools) {
    dom.activeTagIndicator.style.display = 'inline-flex';
    const label = b2bState.filterOnlyPools 
      ? 'Active Group Pools' 
      : (b2bState.searchQuery ? `"${b2bState.searchQuery}"` : b2bState.currentCategory);
    dom.activeTagName.textContent = label;
  } else {
    dom.activeTagIndicator.style.display = 'none';
  }

  dom.materialsGrid.innerHTML = '';

  if (materials.length === 0) {
    dom.materialsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 4rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: var(--radius-md);">
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">No Raw Materials Matched</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">
          Try adjusting your technical search query or reset the industry filters.
        </p>
        <button class="btn-inspect" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  materials.forEach(mat => {
    const card = document.createElement('article');
    card.className = 'material-card';
    card.setAttribute('data-id', mat.id);

    // Wholesale Tier Table Markup
    const tierColsHtml = mat.tiers.map((tier, idx) => {
      const isDefaultTier = idx === 0;
      const label = tier.maxQty >= 900 ? `${tier.minQty}+` : `${tier.minQty} - ${tier.maxQty}`;
      return `
        <div class="tier-col ${isDefaultTier ? 'highlight-tier' : ''}">
          <div class="tier-qty-label">${label}</div>
          <div class="tier-price-val">${formatCurrency(tier.pricePerUnit)}</div>
          <div class="tier-save-badge">${tier.discountPct > 0 ? `-${tier.discountPct}%` : 'Base'}</div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="material-media-box" onclick="openSpecModal('${mat.id}')">
        <img class="material-img" src="${mat.image}" alt="${mat.name}" loading="lazy" onerror="this.onerror=null; this.src='images/steel_coils.jpg';">
        <div class="material-overlay-tags">
          ${mat.certifications.map(c => `<span class="cert-pill">${c}</span>`).join('')}
          ${mat.hasActivePool ? `<span class="cert-pill pool-tag">⚡ Save ${mat.poolDetails.poolDiscount}% in Group Pool</span>` : ''}
        </div>
      </div>

      <div class="material-body">
        <span class="material-category-tag">${mat.categoryName}</span>
        <h3 class="material-title" onclick="openSpecModal('${mat.id}')">${mat.name}</h3>
        <div class="material-grade">${mat.grade} · ${mat.origin}</div>
        <p class="material-summary">${mat.summary}</p>

        <!-- Tier Matrix -->
        <div class="tier-pricing-box">
          <div class="tier-title-row">
            <span>Wholesale Tiers (${mat.unit})</span>
            <span style="color:var(--brand-cyan); font-family:'JetBrains Mono';">Stock: ${mat.inStockUnits}</span>
          </div>
          <div class="tier-grid">
            ${tierColsHtml}
          </div>
        </div>

        <div class="material-footer">
          <div class="moq-indicator">
            MOQ: <span class="moq-bold">${mat.moq} ${mat.unit}</span><br>
            <span style="font-size:0.7rem; color:var(--text-muted);">${mat.leadTime}</span>
          </div>
          <div class="card-action-btns">
            <button class="btn-inspect" onclick="openSpecModal('${mat.id}')" title="Inspect MTC Datasheet">
              MTC Specs
            </button>
            <button class="btn-add-po" onclick="addMaterialToPo('${mat.id}', ${mat.moq}, false, this)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ PO Draft</span>
            </button>
          </div>
        </div>
      </div>
    `;

    dom.materialsGrid.appendChild(card);
  });
}

/* ==========================================================================
   PURCHASE ORDER (PO) / RFQ BAG OPERATIONS
   ========================================================================== */
function addMaterialToPo(materialId, qty, isPoolOrder = false, triggerBtn = null) {
  const mat = getRawMaterialsList().find(m => m.id === materialId);
  if (!mat) return;

  const existing = b2bState.poCart.find(item => item.id === materialId && item.isPoolOrder === isPoolOrder);
  if (existing) {
    existing.qty += qty;
  } else {
    b2bState.poCart.push({
      id: materialId,
      qty: Math.max(mat.moq, qty),
      isPoolOrder: isPoolOrder
    });
  }

  saveCart();
  updatePoUI();

  if (isPoolOrder) {
    showToast(`Committed ${qty} ${mat.unit} of "${mat.name}" to Active Group Pool (18% Savings applied!)`, 'pool');
    openPoDrawer();
  } else {
    showToast(`Added ${qty} ${mat.unit} of "${mat.name}" to PO Draft`, 'success');
  }

  if (triggerBtn) {
    const originalText = triggerBtn.innerHTML;
    triggerBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Added</span>
    `;
    setTimeout(() => {
      triggerBtn.innerHTML = originalText;
    }, 1200);
  }
}

function updatePoItemQty(materialId, isPoolOrder, delta) {
  const itemIndex = b2bState.poCart.findIndex(i => i.id === materialId && i.isPoolOrder === isPoolOrder);
  if (itemIndex === -1) return;

  const mat = getRawMaterialsList().find(m => m.id === materialId);
  const step = mat ? mat.moq : 1;

  b2bState.poCart[itemIndex].qty += (delta * step);

  if (b2bState.poCart[itemIndex].qty <= 0) {
    b2bState.poCart.splice(itemIndex, 1);
  }

  saveCart();
  updatePoUI();
}

function removePoItem(materialId, isPoolOrder) {
  b2bState.poCart = b2bState.poCart.filter(i => !(i.id === materialId && i.isPoolOrder === isPoolOrder));
  saveCart();
  updatePoUI();
  showToast('Removed material from PO Draft', 'info');
}

function calculatePoFinancials() {
  let grossSubtotal = 0;
  let totalTierSavings = 0;
  let totalPoolSavings = 0;
  let totalWeightMT = 0;
  let totalItemCount = 0;

  b2bState.poCart.forEach(item => {
    const mat = getRawMaterialsList().find(m => m.id === item.id);
    if (!mat) return;

    totalItemCount += 1;
    totalWeightMT += item.qty;

    const baseGross = mat.basePricePerUnit * item.qty;
    grossSubtotal += baseGross;

    const calc = getMaterialEffectiveRate(mat, item.qty, item.isPoolOrder);
    const actualCost = calc.ratePerUnit * item.qty;
    const savings = baseGross - actualCost;

    if (item.isPoolOrder) {
      totalPoolSavings += savings;
    } else {
      totalTierSavings += savings;
    }
  });

  const materialsSubtotalAfterDiscounts = grossSubtotal - totalTierSavings - totalPoolSavings;
  const freightCost = totalItemCount > 0 ? INCOTERMS_RATES[b2bState.selectedIncoterm].freight : 0;
  const corporateTax = materialsSubtotalAfterDiscounts * 0.18; // 18% GST / Corporate trade duty
  const netPayable = materialsSubtotalAfterDiscounts + freightCost + corporateTax;

  return {
    grossSubtotal,
    totalTierSavings,
    totalPoolSavings,
    materialsSubtotalAfterDiscounts,
    freightCost,
    corporateTax,
    netPayable,
    totalWeightMT,
    totalItemCount
  };
}

function updatePoUI() {
  const fin = calculatePoFinancials();

  // Header Counters
  dom.poBadgeCount.textContent = `${fin.totalItemCount} ${fin.totalItemCount === 1 ? 'Lot' : 'Lots'}`;
  dom.poWeightMetric.textContent = `${fin.totalWeightMT} MT`;
  dom.drawerItemsCount.textContent = fin.totalItemCount;

  // Render items list
  dom.poItemsContainer.innerHTML = '';
  if (b2bState.poCart.length === 0) {
    dom.poItemsContainer.innerHTML = `
      <div style="text-align:center; padding: 4rem 1.5rem; color: var(--text-muted); margin: auto;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:1rem;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <h4 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.4rem;">No Materials in PO Draft</h4>
        <p style="font-size: 0.85rem; margin-bottom: 1.5rem;">
          Select verified metals, polymers, chemicals or join active collective pools.
        </p>
        <button class="btn-inspect" onclick="closePoDrawer()">Return to Catalog</button>
      </div>
    `;
    dom.poDrawerFooter.style.display = 'none';
    return;
  }

  dom.poDrawerFooter.style.display = 'block';

  b2bState.poCart.forEach(item => {
    const mat = getRawMaterialsList().find(m => m.id === item.id);
    if (!mat) return;

    const calc = getMaterialEffectiveRate(mat, item.qty, item.isPoolOrder);
    const itemTotal = calc.ratePerUnit * item.qty;

    const row = document.createElement('div');
    row.className = 'po-item-row';
    row.innerHTML = `
      <div class="po-item-top">
        <img class="po-item-thumb" src="${mat.image}" alt="${mat.name}" onerror="this.onerror=null; this.src='images/steel_coils.jpg';">
        <div class="po-item-info">
          <div class="po-item-name">${mat.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${mat.grade}</div>
          <div class="po-item-rate">
            ${formatCurrency(calc.ratePerUnit)} / ${mat.unit}
            ${(item.isPoolOrder && mat.poolDetails) ? `<span style="color:var(--brand-cyan); font-weight:700;"> (⚡ Group Pool -${mat.poolDetails.poolDiscount}%)</span>` : (calc.discountPct > 0 ? `<span style="color:var(--brand-emerald);"> (-${calc.discountPct}% Tier)</span>` : '')}
          </div>
        </div>
        <button class="po-close-btn" style="width:28px; height:28px;" onclick="removePoItem('${mat.id}', ${item.isPoolOrder})" title="Remove lot">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:0.6rem;">
        <div class="po-qty-stepper">
          <button class="stepper-btn" onclick="updatePoItemQty('${mat.id}', ${item.isPoolOrder}, -1)">−</button>
          <span class="stepper-val">${item.qty} ${mat.unit}</span>
          <button class="stepper-btn" onclick="updatePoItemQty('${mat.id}', ${item.isPoolOrder}, 1)">+</button>
        </div>
        <div style="font-weight:800; font-family:'Outfit'; font-size:1.05rem; color:var(--text-primary);">
          ${formatCurrency(itemTotal)}
        </div>
      </div>
    `;
    dom.poItemsContainer.appendChild(row);
  });

  // Financial lines
  dom.poGrossVal.textContent = formatCurrency(fin.grossSubtotal);
  dom.poTierSaveVal.textContent = `-${formatCurrency(fin.totalTierSavings)}`;

  if (fin.totalPoolSavings > 0) {
    dom.poPoolSaveLine.style.display = 'flex';
    dom.poPoolSaveVal.textContent = `-${formatCurrency(fin.totalPoolSavings)}`;
  } else {
    dom.poPoolSaveLine.style.display = 'none';
  }

  dom.poFreightVal.textContent = formatCurrency(fin.freightCost);
  dom.poTaxVal.textContent = formatCurrency(fin.corporateTax);
  dom.poNetVal.textContent = formatCurrency(fin.netPayable);
}

function openPoDrawer() {
  dom.poDrawerBackdrop.classList.add('active');
  dom.poDrawerBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePoDrawer() {
  dom.poDrawerBackdrop.classList.remove('active');
  dom.poDrawerBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   TECHNICAL SPECIFICATION & MILL TEST CERTIFICATE (MTC) MODAL
   ========================================================================== */
function openSpecModal(materialId) {
  const mat = getRawMaterialsList().find(m => m.id === materialId);
  if (!mat) return;

  b2bState.activeMaterialForModal = mat;
  dom.modalMatCat.textContent = mat.categoryName;
  dom.modalMatCert.textContent = mat.certifications[0] || 'MTC 3.1 Verified';
  dom.modalMatTitle.textContent = mat.name;
  dom.modalMatGrade.textContent = `${mat.grade} · Sourced direct from ${mat.origin}`;
  dom.modalMatDesc.textContent = mat.summary;

  // Render spec table
  dom.modalSpecTbody.innerHTML = mat.technicalSpecs.map(s => `
    <tr>
      <td style="font-weight:600; color:var(--text-primary);">${s.param}</td>
      <td style="color:var(--brand-cyan); font-weight:700;">${s.value}</td>
    </tr>
  `).join('');

  // Wire add to PO button in modal
  dom.modalAddPoBtn.onclick = () => {
    addMaterialToPo(mat.id, mat.moq, false, dom.modalAddPoBtn);
  };

  dom.specModal.classList.add('active');
  dom.specModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSpecModal() {
  dom.specModal.classList.remove('active');
  dom.specModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   OFFICIAL PURCHASE ORDER (PO) GENERATOR & TRANSMISSION
   ========================================================================== */
function openPoSheetModal() {
  if (b2bState.poCart.length === 0) {
    showToast('Your PO draft is empty', 'info');
    return;
  }
  closePoDrawer();

  const fin = calculatePoFinancials();
  const poNumber = 'PO-2026-' + Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  dom.poRefNum.textContent = poNumber;
  dom.poDateStr.textContent = dateStr;
  dom.poSheetIncoterm.textContent = INCOTERMS_RATES[b2bState.selectedIncoterm].label;

  // Render items into official PO sheet table
  dom.poSheetItemsTbody.innerHTML = b2bState.poCart.map(item => {
    const mat = getRawMaterialsList().find(m => m.id === item.id);
    if (!mat) return '';
    const calc = getMaterialEffectiveRate(mat, item.qty, item.isPoolOrder);
    const itemTotal = calc.ratePerUnit * item.qty;

    return `
      <tr>
        <td>
          <strong>${mat.name}</strong><br>
          <span style="font-size:0.75rem; color:#64748b;">${mat.grade} · Origin: ${mat.origin}</span>
        </td>
        <td><strong>${item.qty} ${mat.unit}</strong></td>
        <td>${formatCurrency(calc.ratePerUnit)}</td>
        <td style="font-weight:700;">${formatCurrency(itemTotal)}</td>
      </tr>
    `;
  }).join('');

  dom.poSheetSubtotal.textContent = formatCurrency(fin.grossSubtotal);
  dom.poSheetSavings.textContent = `-${formatCurrency(fin.totalTierSavings + fin.totalPoolSavings)}`;
  dom.poSheetGrandtotal.textContent = formatCurrency(fin.netPayable);

  // Switch to interactive view
  dom.poInteractiveView.style.display = 'block';
  dom.poSuccessView.style.display = 'none';

  dom.poSheetModal.classList.add('active');
  dom.poSheetModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePoSheetModal() {
  dom.poSheetModal.classList.remove('active');
  dom.poSheetModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function autofillEnterpriseProfile() {
  const acc = b2bState.activeAccount;
  dom.poBuyerName.textContent = acc.companyName;
  dom.poBuyerGst.textContent = `GSTIN / TAX: ${acc.gstin}`;
  dom.poBuyerAddr.textContent = acc.billingAddress;
  showToast('Verified enterprise credit profile populated!', 'info');
}

function submitPoToMill() {
  const fin = calculatePoFinancials();
  const currentPoRef = dom.poRefNum.textContent;

  // Fire celebratory particles
  fireConfetti();

  // Clear cart
  b2bState.poCart = [];
  saveCart();
  updatePoUI();

  // Show success screen
  dom.successPoRef.textContent = currentPoRef;
  dom.poInteractiveView.style.display = 'none';
  dom.poSuccessView.style.display = 'block';
  showToast(`Purchase Order ${currentPoRef} Transmitted to Mill network!`, 'success');
}

function downloadDigitalPo() {
  const poRef = dom.poRefNum.textContent;
  const sheetContent = `
==================================================================
SYNAPSE B2B — CORPORATE PURCHASE ORDER
Reference: ${poRef}
Date: ${dom.poDateStr.textContent}
Buyer: ${dom.poBuyerName.textContent}
GSTIN: ${dom.poBuyerGst.textContent}
Incoterms: ${INCOTERMS_RATES[b2bState.selectedIncoterm].label}
==================================================================
Total Payable: ${dom.poSheetGrandtotal.textContent}
Payment Terms: Net 30 Corporate Line
Inspection: SGS Lab Certified & MTC 3.1
==================================================================
Authorized Electronic Mill Dispatch Voucher.
  `;

  const blob = new Blob([sheetContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${poRef}_Synapse_B2B.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Digital Purchase Order ${poRef} downloaded!`, 'info');
}

/* ==========================================================================
   CONFETTI CANNON
   ========================================================================== */
function fireConfetti() {
  const canvas = dom.confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#f8fafc'];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.009;

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  updateConfetti();
}

/* ==========================================================================
   EVENT LISTENERS & BINDINGS
   ========================================================================== */
function initEventListeners() {
  // Industry Category Tabs
  dom.industryTabs.addEventListener('click', e => {
    const tab = e.target.closest('.industry-tab-btn');
    if (!tab) return;
    document.querySelectorAll('.industry-tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    b2bState.currentCategory = tab.dataset.category;
    renderCatalog();
  });

  // Sort select
  dom.sortSelect.addEventListener('change', e => {
    b2bState.sortBy = e.target.value;
    renderCatalog();
  });

  // Pool Filter Toggle
  dom.poolFilterToggle.addEventListener('click', () => {
    b2bState.filterOnlyPools = !b2bState.filterOnlyPools;
    dom.poolFilterToggle.style.borderColor = b2bState.filterOnlyPools ? 'var(--brand-cyan)' : 'var(--border-medium)';
    dom.poolFilterToggle.style.color = b2bState.filterOnlyPools ? 'var(--brand-cyan)' : 'inherit';
    renderCatalog();
  });

  // Live Search
  dom.searchInput.addEventListener('input', e => {
    b2bState.searchQuery = e.target.value;
    renderCatalog();
  });

  // Reset Filters
  dom.resetFilterBtn.addEventListener('click', resetAllFilters);

  // Currency select
  dom.currencySelect.value = b2bState.currency;
  dom.currencySelect.addEventListener('change', e => {
    b2bState.currency = e.target.value;
    localStorage.setItem('synapse_b2b_currency', b2bState.currency);
    renderCatalog();
    updatePoUI();
  });

  // PO Drawer triggers
  dom.poDrawerTrigger.addEventListener('click', openPoDrawer);
  dom.poDrawerClose.addEventListener('click', closePoDrawer);
  dom.poDrawerBackdrop.addEventListener('click', e => {
    if (e.target === dom.poDrawerBackdrop) closePoDrawer();
  });

  // Incoterms Selector in Drawer
  document.querySelectorAll('.incoterm-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.incoterm-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      b2bState.selectedIncoterm = chip.dataset.incoterm;
      updatePoUI();
    });
  });

  // Spec Modal Close
  dom.specModalClose.addEventListener('click', closeSpecModal);
  dom.specModal.addEventListener('click', e => {
    if (e.target === dom.specModal) closeSpecModal();
  });

  // Request Sample
  dom.requestSampleBtn.addEventListener('click', () => {
    showToast('Sample request logged. SGS certified lab box dispatched via express courier.', 'success');
  });

  // PO Sheet Modal Trigger & Actions
  dom.generatePoBtn.addEventListener('click', openPoSheetModal);
  dom.poSheetClose.addEventListener('click', closePoSheetModal);
  dom.poSheetModal.addEventListener('click', e => {
    if (e.target === dom.poSheetModal) closePoSheetModal();
  });
  dom.autofillPoBtn.addEventListener('click', autofillEnterpriseProfile);
  dom.submitPoBtn.addEventListener('click', submitPoToMill);
  dom.downloadPoBtn.addEventListener('click', downloadDigitalPo);
  dom.poSuccessDoneBtn.addEventListener('click', closePoSheetModal);

  // Hero Join Pool Action (Commits 5 MT to the featured pool)
  dom.heroJoinPoolBtn.addEventListener('click', () => {
    addMaterialToPo('mat-1', 5, true, dom.heroJoinPoolBtn);
  });
  dom.heroInspectBtn.addEventListener('click', () => {
    openSpecModal('mat-1');
  });

  // Corporate Profile Pill
  document.getElementById('corporate-profile-btn').addEventListener('click', () => {
    showToast('Authenticated as: Nexus Aerospace & Fabrication (Credit Limit: $250,000)', 'info');
  });

  // Keyboard accessibility
  window.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== dom.searchInput) {
      e.preventDefault();
      dom.searchInput.focus();
    }
    if (e.key === 'Escape') {
      closePoDrawer();
      closeSpecModal();
      closePoSheetModal();
    }
  });

  // Canvas Resize
  window.addEventListener('resize', () => {
    dom.confettiCanvas.width = window.innerWidth;
    dom.confettiCanvas.height = window.innerHeight;
  });
}

function resetAllFilters() {
  b2bState.currentCategory = 'all';
  b2bState.searchQuery = '';
  b2bState.filterOnlyPools = false;
  dom.searchInput.value = '';
  dom.poolFilterToggle.style.borderColor = 'var(--border-medium)';
  dom.poolFilterToggle.style.color = 'inherit';

  document.querySelectorAll('.industry-tab-btn').forEach(t => {
    t.classList.toggle('active', t.dataset.category === 'all');
  });

  renderCatalog();
}

function selectCategory(categoryKey) {
  b2bState.currentCategory = categoryKey;
  b2bState.filterOnlyPools = false;
  document.querySelectorAll('.industry-tab-btn').forEach(t => {
    t.classList.toggle('active', t.dataset.category === categoryKey);
  });
  renderCatalog();
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function initB2B() {
  document.documentElement.setAttribute('data-theme', 'light');
  renderCommodityTicker();
  initPoolCountdown();
  renderCatalog();
  updatePoUI();
  initEventListeners();
}

document.addEventListener('DOMContentLoaded', initB2B);
