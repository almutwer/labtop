/**
 * ============================================================================
 * CARBON TECH - Catalog Data & Sanity CMS Schema Blueprint
 * Focus: Business Laptops, Engineering Workstations, and Professional Desktops
 * Client-side data is read-only. Never store Sanity Write Tokens here.
 * ============================================================================
 */

const STORE_CONFIG = {
  storeName: "كربون تك | Carbon Tech",
  whatsappNumber: "+966 50 123-4567",
  currencySymbol: "$",
  deliveryFee: 15.00,
  freeDeliveryThreshold: 1500.00,
  promoCodes: {
    TECH10: { type: "percent", value: 10, label: "خصم 10%" },
    LAPTOP50: { type: "fixed", value: 50, label: "خصم 50$" }
  },
  // Phase 2 Sanity CMS Read-Only Config (Public Dataset Only - No Write Token)
  sanity: {
    enabled: false,
    projectId: "YOUR_SANITY_PROJECT_ID",
    dataset: "production",
    apiVersion: "2025-01-01",
    useCdn: true
  }
};

const PRODUCTS_DATA = [
  {
    id: "prod-dell-xps-14",
    sku: "DELL-XPS-9440",
    name: "Dell XPS Platinum Edition OLED",
    brand: "Dell",
    category: "workstations",
    categoryLabel: "محطات العمل والمونتاج",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 1580.00,
    oldPrice: 1720.00,
    shortDesc: "تصميم CNC من الألمنيوم المصقول مع لوحة لمس زجاجية متصلة وشاشة OLED بدقة 3.2K للمهندسين والمصممين.",
    specs: {
      cpu: "Intel Core Ultra 7 155H (16 Cores)",
      ram: "32GB LPDDR5x 7467MHz",
      ramFilter: "32GB",
      storage: "1TB NVMe PCIe Gen4 SSD",
      gpu: "NVIDIA RTX 4050 Studio 6GB",
      display: "14.5\" 3.2K OLED Touch 120Hz InfinityEdge",
      battery: "69.5Wh شحن سريع ExpressCharge",
      os: "Windows 11 Pro أصلية",
      ports: "3x Thunderbolt 4 (USB-C), MicroSDXC, Audio Jack",
      warranty: "ضمان سنتين Dell ProSupport"
    },
    variants: [
      { id: "std", label: "32GB RAM + 1TB SSD", priceDelta: 0 },
      { id: "upg-2tb", label: "32GB RAM + 2TB SSD (+110$)", priceDelta: 110.00 },
      { id: "upg-64gb", label: "64GB RAM + 2TB SSD (+260$)", priceDelta: 260.00 }
    ],
    images: [
      { url: "assets/products/xps-1.png", caption: "الواجهة الأمامية وشاشة InfinityEdge" },
      { url: "assets/products/xps-2.png", caption: "الزاوية الجانبية اليمنى" },
      { url: "assets/products/xps-4.png", caption: "لوحة المفاتيح واللمس الزجاجية المتصلة" },
      { url: "assets/products/xps-5.png", caption: "الغطاء الخلفي من الألمنيوم المصقول" }
    ]
  },
  {
    id: "prod-macbook-pro-16",
    sku: "APL-MBP16-M3P",
    name: "Apple MacBook Pro 16 M3 Pro",
    brand: "Apple",
    category: "workstations",
    categoryLabel: "محطات العمل والمونتاج",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 2150.00,
    oldPrice: 2299.00,
    shortDesc: "أداء فائق للمبرمجين وصناع المحتوى مع شاشة Liquid Retina XDR بتردد 120Hz وبطارية تدوم حتى 22 ساعة.",
    specs: {
      cpu: "Apple M3 Pro (12-Core CPU)",
      ram: "18GB Unified Memory",
      ramFilter: "18GB",
      storage: "512GB SuperFast SSD",
      gpu: "Apple 18-Core GPU",
      display: "16.2\" Liquid Retina XDR 120Hz ProMotion",
      battery: "100Wh + شاحن 140W MagSafe 3",
      os: "macOS Sonoma",
      ports: "3x Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3",
      warranty: "ضمان سنة دولي"
    },
    variants: [
      { id: "std", label: "18GB RAM + 512GB SSD", priceDelta: 0 },
      { id: "upg-1tb", label: "18GB RAM + 1TB SSD (+170$)", priceDelta: 170.00 },
      { id: "upg-36gb", label: "36GB RAM + 1TB SSD (+360$)", priceDelta: 360.00 }
    ],
    images: [
      { url: "assets/products/macbook-1.png", caption: "الواجهة الأمامية لشاشة Retina" },
      { url: "assets/products/macbook-2.png", caption: "الزاوية الجانبية ولوحة المفاتيح" },
      { url: "assets/products/xps-4.png", caption: "تصميم لوحة المفاتيح ومساحة العمل" },
      { url: "assets/products/precision-4.png", caption: "السمك الجانبي" }
    ]
  },
  {
    id: "prod-precision-5690",
    sku: "PREC-5690-PRO",
    name: "Dell Precision 5690 Carbon Workstation",
    brand: "Dell",
    category: "workstations",
    categoryLabel: "محطات العمل والمونتاج",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 1890.00,
    oldPrice: 2050.00,
    shortDesc: "محطة عمل متنقلة مخصصة للمهندسين ومطوري الذكاء الاصطناعي والريندر المعماري بهيكل كربوني فائق المتانة.",
    specs: {
      cpu: "Intel Core Ultra 9 185H vPro (16 Cores)",
      ram: "64GB LPDDR5x ECC",
      ramFilter: "64GB",
      storage: "2TB NVMe PCIe Gen4 RAID",
      gpu: "NVIDIA RTX 2000 Ada Generation 8GB",
      display: "16.0\" FHD+ Non-Touch 100% DCI-P3 500nits",
      battery: "100Wh + شاحن 165W USB-C",
      os: "Windows 11 Pro for Workstations",
      ports: "3x Thunderbolt 4, HDMI 2.1, SD Card Reader, SmartCard",
      warranty: "ضمان 3 سنوات ProSupport"
    },
    variants: [
      { id: "std", label: "64GB RAM + 2TB SSD", priceDelta: 0 },
      { id: "upg-4tb", label: "64GB RAM + 4TB SSD (+220$)", priceDelta: 220.00 }
    ],
    images: [
      { url: "assets/products/precision-1.png", caption: "الواجهة الأمامية والشاشة المضادة للتوهج" },
      { url: "assets/products/precision-2.png", caption: "الزاوية الجانبية ومنافذ التوصيل الاحترافية" },
      { url: "assets/products/precision-3.png", caption: "عرض لوحة التحكم الهندسية" },
      { url: "assets/products/precision-4.png", caption: "التصميم الجانبي النحيف" }
    ]
  },
  {
    id: "prod-dell-16-plus",
    sku: "DL-16PLUS-U7",
    name: "Dell 16 Plus Creator & Business",
    brand: "Dell",
    category: "business-laptops",
    categoryLabel: "الأعمال والدراسة",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 1090.00,
    oldPrice: 1220.00,
    shortDesc: "لابتوب أعمال وبرمجة بشاشة 16 بوصة مريحة للعين ولوحة مفاتيح كاملة مع أرقام جانبية وذاكرة DDR5.",
    specs: {
      cpu: "Intel Core i7-13700H (14 Cores)",
      ram: "16GB LPDDR5 6400MHz",
      ramFilter: "16GB",
      storage: "1TB NVMe PCIe 4.0 SSD",
      gpu: "Intel Iris Xe Graphics",
      display: "16.0\" 2.5K (2560x1600) IPS 120Hz",
      battery: "86Wh شحن سريع عبر USB-C",
      os: "Windows 11 Pro",
      ports: "Thunderbolt 4, 2x USB 3.2, HDMI 2.0, MicroSD",
      warranty: "ضمان سنتين"
    },
    variants: [
      { id: "std", label: "16GB RAM + 1TB SSD", priceDelta: 0 },
      { id: "upg-32", label: "32GB RAM + 1TB SSD (+95$)", priceDelta: 95.00 }
    ],
    images: [
      { url: "assets/products/pro16-1.png", caption: "الزاوية الجانبية وشاشة 16 بوصة" },
      { url: "assets/products/pro16-2.png", caption: "الواجهة الأمامية الكاملة" },
      { url: "assets/products/pro16-3.png", caption: "لوحة المفاتيح الكاملة مع الأرقام" },
      { url: "assets/products/precision-4.png", caption: "المنافذ والسمك الجانبي" }
    ]
  },
  {
    id: "prod-inspiron-15-pro",
    sku: "DL-15-AZURITE",
    name: "Dell 15 Business Dark Azurite",
    brand: "Dell",
    category: "business-laptops",
    categoryLabel: "الأعمال والدراسة",
    condition: "استيراد نظيف (كالجديد)",
    inStock: true,
    price: 620.00,
    oldPrice: 740.00,
    shortDesc: "خيار اقتصادي عملي للشركات والطلاب والمحاسبة، مفحوص بالكامل بحالة الوكالة مع ضمان المعرض.",
    specs: {
      cpu: "Intel Core i5-1335U (10 Cores)",
      ram: "16GB DDR4 3200MHz",
      ramFilter: "16GB",
      storage: "512GB NVMe M.2 SSD",
      gpu: "Intel Iris Xe Graphics",
      display: "15.6\" FHD (1920x1080) IPS Anti-Glare",
      battery: "54Wh حالة ممتازة + شاحن أصلي",
      os: "Windows 11 Pro",
      ports: "USB-C, 2x USB-A, HDMI, RJ-45, SD Card",
      warranty: "ضمان المعرض 6 أشهر"
    },
    variants: [
      { id: "std", label: "16GB RAM + 512GB SSD", priceDelta: 0 },
      { id: "upg-1tb", label: "16GB RAM + 1TB SSD (+45$)", priceDelta: 45.00 }
    ],
    images: [
      { url: "assets/products/pro16-2.png", caption: "الواجهة الأمامية للجهاز" },
      { url: "assets/products/pro16-3.png", caption: "الزاوية الجانبية" },
      { url: "assets/products/pro16-1.png", caption: "تفاصيل الهيكل" },
      { url: "assets/products/xps-4.png", caption: "تفاصيل لوحة المفاتيح" }
    ]
  },
  {
    id: "prod-xps-13-executive",
    sku: "DELL-XPS13-9340",
    name: "Dell XPS 13 Executive UltraLight",
    brand: "Dell",
    category: "business-laptops",
    categoryLabel: "الأعمال والدراسة",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 1290.00,
    oldPrice: 1390.00,
    shortDesc: "لابتوب تنفيذي فائق الخفة (1.17 كجم) لرجال الأعمال والتنقل المستمر مع بطارية تدوم طوال يوم العمل.",
    specs: {
      cpu: "Intel Core Ultra 7 155H (16 Cores)",
      ram: "16GB LPDDR5x 7467MHz",
      ramFilter: "16GB",
      storage: "1TB NVMe PCIe Gen4 SSD",
      gpu: "Intel Arc Graphics",
      display: "13.4\" FHD+ InfinityEdge 120Hz 500nits",
      battery: "55Wh شحن سريع USB-C",
      os: "Windows 11 Pro",
      ports: "2x Thunderbolt 4 (USB-C)",
      warranty: "ضمان سنتين"
    },
    variants: [
      { id: "std", label: "16GB RAM + 1TB SSD", priceDelta: 0 },
      { id: "upg-32", label: "32GB RAM + 1TB SSD (+120$)", priceDelta: 120.00 }
    ],
    images: [
      { url: "assets/products/xps-3.png", caption: "الزاوية الأمامية للتصميم النحيف" },
      { url: "assets/products/xps-1.png", caption: "الواجهة الأمامية" },
      { url: "assets/products/xps-4.png", caption: "لوحة المفاتيح واللمس الزجاجية" },
      { url: "assets/products/xps-5.png", caption: "الغطاء الخلفي المعدني" }
    ]
  },
  {
    id: "prod-workstation-tower-pro",
    sku: "WS-CAD-4080S",
    name: "محطة عمل مكتبية ProStudio CAD & 3D Render",
    brand: "Workstation PC",
    category: "desktop-pcs",
    categoryLabel: "الكمبيوترات المكتبية",
    condition: "محطة عمل جديدة",
    inStock: true,
    price: 2390.00,
    oldPrice: 2550.00,
    shortDesc: "كمبيوتر مكتبي هندسي مخصص للمكاتب الاستشارية، الريندر المعماري (Lumion, 3ds Max, Revit)، والمونتاج بدقة 8K.",
    specs: {
      cpu: "Intel Core i9-14900K (24 Cores / 6.0GHz)",
      ram: "64GB DDR5 6000MHz",
      ramFilter: "64GB",
      storage: "2TB NVMe Gen4 SSD (7400MB/s)",
      gpu: "NVIDIA RTX 4080 Super Studio 16GB",
      display: "يدعم 4 شاشات احترافية 4K / 8K",
      battery: "مزود طاقة 850W 80+ Gold ATX 3.0",
      os: "Windows 11 Pro for Workstations",
      ports: "Wi-Fi 6E, 2.5G LAN, USB-C 20Gbps, 8x USB 3.2",
      warranty: "ضمان سنتين شامل الصيانة"
    },
    variants: [
      { id: "std", label: "64GB DDR5 + 2TB NVMe (الوحدة المكتبية)", priceDelta: 0 },
      { id: "upg-128", label: "128GB DDR5 + 4TB NVMe (+290$)", priceDelta: 290.00 },
      { id: "with-monitor", label: "مع شاشة 27\" 4K IPS خاصة بالمصممين (+260$)", priceDelta: 260.00 }
    ],
    images: [
      { url: "assets/products/pc-blue-1.png", caption: "وحدة المعالجة المكتبية ونظام التبريد السائل" },
      { url: "assets/products/pc-white-3.png", caption: "النسخة البيضاء للمكاتب والاستوديوهات" },
      { url: "assets/products/pc-purple-2.png", caption: "التصميم الداخلي وتنظيم القطع" },
      { url: "assets/products/precision-3.png", caption: "بيئة العمل الهندسية" }
    ]
  },
  {
    id: "prod-studio-desktop-i7",
    sku: "WS-STUDIO-I7",
    name: "كمبيوتر مكتبي Studio Creator Core i7",
    brand: "Workstation PC",
    category: "desktop-pcs",
    categoryLabel: "الكمبيوترات المكتبية",
    condition: "جديد بالكرتون",
    inStock: true,
    price: 1320.00,
    oldPrice: 1450.00,
    shortDesc: "جهاز مكتبي هادئ وعالي الكفاءة لبرامج التصميم الجرافيكي، المونتاج، وإدارة الأعمال المتقدمة.",
    specs: {
      cpu: "Intel Core i7-14700 (20 Cores / 5.4GHz)",
      ram: "32GB DDR5 6000MHz",
      ramFilter: "32GB",
      storage: "1TB NVMe PCIe 4.0 SSD",
      gpu: "NVIDIA RTX 4060 Ti 16GB VRAM",
      display: "منافذ 3x DisplayPort 1.4a + HDMI 2.1",
      battery: "مزود طاقة 750W 80+ Gold",
      os: "Windows 11 Pro",
      ports: "Wi-Fi 6, Bluetooth 5.2, USB-C, 7x USB",
      warranty: "ضمان سنتين"
    },
    variants: [
      { id: "std", label: "32GB RAM + 1TB NVMe", priceDelta: 0 },
      { id: "upg-2tb", label: "32GB RAM + 2TB NVMe (+65$)", priceDelta: 65.00 }
    ],
    images: [
      { url: "assets/products/pc-white-3.png", caption: "التصميم الأبيض الهادئ للاستوديو" },
      { url: "assets/products/pc-blue-1.png", caption: "النسخة الداكنة" },
      { url: "assets/products/pc-purple-2.png", caption: "العتاد الداخلي" },
      { url: "assets/products/precision-1.png", caption: "التوافق مع أنظمة العرض" }
    ]
  }
];
