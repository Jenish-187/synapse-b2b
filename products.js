// ==========================================================================
// SYNAPSE B2B — Raw Materials & Industrial Bulk Procurement Dataset
// Direct Factory Mills, Refineries, and Pooled Group Wholesale Catalog
// ==========================================================================

var RAW_MATERIALS = [
  {
    id: "mat-1",
    name: "Grade 304 Stainless Steel Industrial Coils",
    grade: "ASTM A240 / EN 10088-2",
    category: "metals",
    categoryName: "Metals & Alloys",
    unit: "Metric Ton (MT)",
    basePricePerUnit: 2450.00,
    tiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 2450.00, discountPct: 0 },
      { minQty: 5, maxQty: 19, pricePerUnit: 2280.00, discountPct: 7 },
      { minQty: 20, maxQty: 999, pricePerUnit: 2110.00, discountPct: 14 }
    ],
    moq: 1, // 1 Metric Ton
    leadTime: "3 - 5 Dispatch Days",
    origin: "ArcelorMittal Mill Direct",
    certifications: ["ISO 9001", "RoHS Compliant", "MTC 3.1 Mill Cert"],
    inStockUnits: 84,
    rating: 4.9,
    ordersCount: 420,
    hasActivePool: true,
    poolDetails: {
      targetQty: 50,
      currentQty: 39,
      poolDiscount: 18, // 18% off when combined
      deadlineHours: 36,
      joinedBusinesses: 12,
      participantTypes: "Fabricators, HVAC OEM, Marine Contractors"
    },
    image: "images/steel_coils.jpg",
    images: ["images/steel_coils.jpg"],
    summary: "Cold-rolled Austenitic grade stainless coils with 2B finish. High corrosion resistance for chemical, pharmaceutical, architectural, and kitchen equipment manufacturing.",
    technicalSpecs: [
      { param: "Chemical Composition", value: "Cr 18.2% | Ni 8.1% | C 0.05% | Mn 1.8%" },
      { param: "Yield Strength (Rp 0.2)", value: "≥ 205 MPa" },
      { param: "Tensile Strength (Rm)", value: "520 - 720 MPa" },
      { param: "Thickness Range", value: "0.5mm – 4.0mm (Custom Slit)" }
    ]
  },
  {
    id: "mat-2",
    name: "Prime Virgin HDPE Polymer Granules (Blow Molding)",
    grade: "ISO 17855 / ASTM D1238",
    category: "polymers",
    categoryName: "Polymers & Resins",
    unit: "Pallet (1,000 kg)",
    basePricePerUnit: 1280.00,
    tiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 1280.00, discountPct: 0 },
      { minQty: 10, maxQty: 29, pricePerUnit: 1160.00, discountPct: 9 },
      { minQty: 30, maxQty: 999, pricePerUnit: 1040.00, discountPct: 19 }
    ],
    moq: 2, // 2 Pallets (2 Tons)
    leadTime: "Immediate Stock (48h)",
    origin: "SABIC Petrochemical Hub",
    certifications: ["FDA Food Grade", "REACH Registered", "UL 94 HB"],
    inStockUnits: 140,
    rating: 4.85,
    ordersCount: 312,
    hasActivePool: true,
    poolDetails: {
      targetQty: 40,
      currentQty: 31,
      poolDiscount: 22,
      deadlineHours: 24,
      joinedBusinesses: 8,
      participantTypes: "Bottle Molders, Packaging Plants, Chemical Cans"
    },
    image: "images/hdpe_polymer.jpg",
    images: ["images/hdpe_polymer.jpg"],
    summary: "High-density polyethylene pellets designed for rigid packaging, industrial drums, cosmetics bottles, and conduit piping. Superior environmental stress crack resistance (ESCR).",
    technicalSpecs: [
      { param: "Melt Flow Index (190°C/2.16kg)", value: "0.28 g/10 min" },
      { param: "Density", value: "0.954 g/cm³" },
      { param: "Flexural Modulus", value: "1150 MPa" },
      { param: "Environmental Crack Resistance", value: "> 1,000 Hours" }
    ]
  },
  {
    id: "mat-3",
    name: "Aerospace-Grade 6061-T6 Aluminum Structural Billets",
    grade: "AMS 4027 / ASTM B221",
    category: "metals",
    categoryName: "Metals & Alloys",
    unit: "Metric Ton (MT)",
    basePricePerUnit: 3150.00,
    tiers: [
      { minQty: 1, maxQty: 3, pricePerUnit: 3150.00, discountPct: 0 },
      { minQty: 4, maxQty: 14, pricePerUnit: 2890.00, discountPct: 8 },
      { minQty: 15, maxQty: 999, pricePerUnit: 2650.00, discountPct: 16 }
    ],
    moq: 1,
    leadTime: "4 - 7 Business Days",
    origin: "Alcoa Certified Smelter",
    certifications: ["AS9100D Aerospace", "Nadcap Certified", "EN 10204 3.1"],
    inStockUnits: 65,
    rating: 4.95,
    ordersCount: 289,
    hasActivePool: false,
    image: "images/aluminum_billets.jpg",
    images: ["images/aluminum_billets.jpg"],
    summary: "Pre-heat treated Al-Mg-Si extrusion billets optimized for precision CNC machining, robotics armatures, automotive structural chassis, and defense marine fixtures.",
    technicalSpecs: [
      { param: "Yield Strength (0.2% Offset)", value: "276 MPa (40 ksi)" },
      { param: "Ultimate Tensile Strength", value: "310 MPa (45 ksi)" },
      { param: "Machinability Index", value: "90% (Free-cutting)" },
      { param: "Hardness", value: "95 Brinell (HB)" }
    ]
  },
  {
    id: "mat-4",
    name: "Fe-550D Seismic-Resistant TMT Steel Rebars",
    grade: "IS 1786 / BS 4449",
    category: "construction",
    categoryName: "Construction & Infrastructure",
    unit: "Metric Ton (MT)",
    basePricePerUnit: 780.00,
    tiers: [
      { minQty: 5, maxQty: 24, pricePerUnit: 780.00, discountPct: 0 },
      { minQty: 25, maxQty: 99, pricePerUnit: 720.00, discountPct: 8 },
      { minQty: 100, maxQty: 999, pricePerUnit: 660.00, discountPct: 15 }
    ],
    moq: 5, // 5 Metric Tons
    leadTime: "Scheduled Crane Delivery (24-48h)",
    origin: "Jindal Steel Integrated Mill",
    certifications: ["BIS Fe-550D", "ISO 14001 GreenPro", "Third-Party SGS"],
    inStockUnits: 320,
    rating: 4.8,
    ordersCount: 890,
    hasActivePool: true,
    poolDetails: {
      targetQty: 100,
      currentQty: 84,
      poolDiscount: 16,
      deadlineHours: 18,
      joinedBusinesses: 19,
      participantTypes: "Civil Contractors, Real Estate Developers, Bridge Builders"
    },
    image: "images/tmt_rebar.jpg",
    images: ["images/tmt_rebar.jpg"],
    summary: "Thermex quenched high-ductility rebar with uniform rib geometry. Specially engineered for high seismic vibration resistance in high-rise towers, ports, and highways.",
    technicalSpecs: [
      { param: "0.2% Proof Stress", value: "≥ 550 N/mm²" },
      { param: "Total Elongation (Agt)", value: "≥ 16% High Ductility" },
      { param: "Bend / Re-bend Angle", value: "180° / 135° Crack Free" },
      { param: "Carbon Equivalent (CE)", value: "≤ 0.42% (Superior Weldability)" }
    ]
  },
  {
    id: "mat-5",
    name: "Industrial Anhydrous Ethanol 99.9% Purity",
    grade: "ACS Grade / BP Pharma Certified",
    category: "chemicals",
    categoryName: "Chemicals & Solvents",
    unit: "Steel Drum (200 Liters)",
    basePricePerUnit: 340.00,
    tiers: [
      { minQty: 4, maxQty: 15, pricePerUnit: 340.00, discountPct: 0 },
      { minQty: 16, maxQty: 49, pricePerUnit: 295.00, discountPct: 13 },
      { minQty: 50, maxQty: 999, pricePerUnit: 260.00, discountPct: 24 }
    ],
    moq: 4, // 4 Drums (800 Liters)
    leadTime: "HazMat Certified Tanker / Lorry (3 Days)",
    origin: "BioRefine International",
    certifications: ["HazMat Class 3", "COA Lot Verified", "GMP Compliant"],
    inStockUnits: 190,
    rating: 4.9,
    ordersCount: 245,
    hasActivePool: true,
    poolDetails: {
      targetQty: 60,
      currentQty: 48,
      poolDiscount: 20,
      deadlineHours: 42,
      joinedBusinesses: 7,
      participantTypes: "Pharma Formulations, Sanitizer Plants, Paint Synthetics"
    },
    image: "images/chemical_drums.jpg",
    images: ["images/chemical_drums.jpg"],
    summary: "High-assay non-denatured / denatured ethyl alcohol with ultra-low moisture (<0.1%). Fundamental feedstock for solvents, pharmaceutical extraction, varnishes, and perfumes.",
    technicalSpecs: [
      { param: "Purity Assay", value: "≥ 99.9% v/v" },
      { param: "Moisture Content (Karl Fischer)", value: "≤ 0.08% w/w" },
      { param: "Boiling Point", value: "78.3 °C" },
      { param: "Non-Volatile Residue", value: "≤ 0.001%" }
    ]
  },
  {
    id: "mat-6",
    name: "IE3 Premium Efficiency 3-Phase Induction Motors (15 kW)",
    grade: "IEC 60034-30-1 / IP55 Enclosure",
    category: "electrical",
    categoryName: "Machinery & Electrical",
    unit: "Unit (Crated)",
    basePricePerUnit: 890.00,
    tiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 890.00, discountPct: 0 },
      { minQty: 5, maxQty: 19, pricePerUnit: 780.00, discountPct: 12 },
      { minQty: 20, maxQty: 999, pricePerUnit: 690.00, discountPct: 22 }
    ],
    moq: 1,
    leadTime: "2 - 4 Days",
    origin: "Siemens-Compatible Foundry Line",
    certifications: ["CE", "IE3 Super Premium", "ATEX Zone 2 Option"],
    inStockUnits: 48,
    rating: 4.92,
    ordersCount: 167,
    hasActivePool: false,
    image: "images/electric_motors.jpg",
    images: ["images/electric_motors.jpg"],
    summary: "Heavy-duty cast iron squirrel cage motors with Class H insulation. Designed for continuous 24/7 duty cycles on industrial pumps, conveyor belts, compressors, and blowers.",
    technicalSpecs: [
      { param: "Rated Power", value: "15 kW (20 HP) @ 1475 RPM" },
      { param: "Full Load Efficiency", value: "92.1% (IE3)" },
      { param: "Voltage / Frequency", value: "400V Delta / 50 Hz" },
      { param: "Insulation / Thermal Class", value: "Class F temp rise (155°C)" }
    ]
  },
  {
    id: "mat-7",
    name: "Toray T700 12K Unidirectional Carbon Fiber Fabric (300 GSM)",
    grade: "Aero Composite Grade / AS9100",
    category: "polymers",
    categoryName: "Polymers & Resins",
    unit: "Roll (100 Sq. Meters)",
    basePricePerUnit: 1450.00,
    tiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 1450.00, discountPct: 0 },
      { minQty: 5, maxQty: 14, pricePerUnit: 1280.00, discountPct: 12 },
      { minQty: 15, maxQty: 999, pricePerUnit: 1120.00, discountPct: 23 }
    ],
    moq: 1,
    leadTime: "3 - 6 Days",
    origin: "Toray Advanced Composites",
    certifications: ["EN 9100", "FAA Approved Lot", "M&P Spec Passed"],
    inStockUnits: 34,
    rating: 4.98,
    ordersCount: 198,
    hasActivePool: true,
    poolDetails: {
      targetQty: 25,
      currentQty: 19,
      poolDiscount: 25,
      deadlineHours: 50,
      joinedBusinesses: 6,
      participantTypes: "Drone OEMs, Automotive Carbon Body, Sporting Goods"
    },
    image: "images/carbon_fiber.jpg",
    images: ["images/carbon_fiber.jpg"],
    summary: "Standard modulus high-tensile continuous carbon fibers woven into precision unidirectional dry tape with hot-melt synthetic yarn binders for epoxy resin infusion.",
    technicalSpecs: [
      { param: "Tensile Strength", value: "4,900 MPa (710 ksi)" },
      { param: "Tensile Modulus", value: "230 GPa (33.4 Msi)" },
      { param: "Areal Weight", value: "300 g/m² ± 3%" },
      { param: "Filament Count", value: "12,000 filaments/tow" }
    ]
  },
  {
    id: "mat-8",
    name: "Virgin Kraft Linerboard Industrial Paper Rolls (250 GSM)",
    grade: "FSC 100% / TAPPI T-826",
    category: "packaging",
    categoryName: "Packaging & Textiles",
    unit: "Metric Ton (MT)",
    basePricePerUnit: 640.00,
    tiers: [
      { minQty: 3, maxQty: 9, pricePerUnit: 640.00, discountPct: 0 },
      { minQty: 10, maxQty: 49, pricePerUnit: 580.00, discountPct: 9 },
      { minQty: 50, maxQty: 999, pricePerUnit: 510.00, discountPct: 20 }
    ],
    moq: 3,
    leadTime: "2 - 4 Days",
    origin: "Mondi Forest Paper Mill",
    certifications: ["FSC 100%", "ISO 14001", "ISEGA Food Contact"],
    inStockUnits: 175,
    rating: 4.75,
    ordersCount: 520,
    hasActivePool: true,
    poolDetails: {
      targetQty: 60,
      currentQty: 52,
      poolDiscount: 18,
      deadlineHours: 28,
      joinedBusinesses: 14,
      participantTypes: "Corrugators, E-commerce Box Factories, Export Crating"
    },
    image: "images/kraft_paper.jpg",
    images: ["images/kraft_paper.jpg"],
    summary: "Unbleached long-fiber softwood kraft paper designed for high-burst corrugated cartons, export heavy-duty boxing, and moisture-resistant industrial pallet wrapping.",
    technicalSpecs: [
      { param: "Bursting Index (Mullen)", value: "≥ 4.2 kPa·m²/g" },
      { param: "Cobb 60 (Water Absorption)", value: "≤ 30 g/m²" },
      { param: "Moisture Content", value: "7.5% ± 1.0%" },
      { param: "Roll Width Available", value: "1200mm – 2500mm custom slit" }
    ]
  }
];

// Live Commodity Indexes Ticker
var COMMODITY_TICKER = [
  { symbol: "STAINLESS 304", price: "$2,450/MT", delta: "+1.2%", status: "up" },
  { symbol: "ALUMINUM LME", price: "$2,380/MT", delta: "-0.4%", status: "down" },
  { symbol: "POLYPROPYLENE", price: "$1,120/MT", delta: "+0.8%", status: "up" },
  { symbol: "CRUDE FEEDSTOCK", price: "$74.20/bbl", delta: "-1.1%", status: "down" },
  { symbol: "TMT REBAR EX-MILL", price: "$780/MT", delta: "+0.3%", status: "up" },
  { symbol: "ETHANOL INDUSTRIAL", price: "$1.70/L", delta: "0.0%", status: "neutral" },
  { symbol: "KRAFT LINER FSC", price: "$640/MT", delta: "+2.1%", status: "up" }
];

// Verified B2B Corporate Procurement Sample Accounts
var SAMPLE_ENTERPRISE_ACCOUNTS = [
  {
    companyName: "Nexus Aerospace & Fabrication Ltd",
    gstin: "27AABCN1234F1Z8",
    buyerName: "Jenish Patel",
    email: "procurement@nexusaero.com",
    industry: "Heavy Fabrication & Defense",
    creditLimit: "$250,000 Approved (Net 30)",
    billingAddress: "Plot 84, Industrial Hub Phase II, Whitefield, Bengaluru 560066"
  }
];

// Global attachment for cross-script safety
if (typeof window !== 'undefined') {
  window.RAW_MATERIALS = RAW_MATERIALS;
  window.COMMODITY_TICKER = COMMODITY_TICKER;
  window.SAMPLE_ENTERPRISE_ACCOUNTS = SAMPLE_ENTERPRISE_ACCOUNTS;
}
