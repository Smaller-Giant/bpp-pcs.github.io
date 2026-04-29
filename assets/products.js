const PRODUCT_IMAGES = {
  workReady: {
    main: "assets/images/work-ready-overview.png",
    case: "assets/images/work-ready-case.png",
    cpu: "assets/images/work-ready-cpu.png",
    motherboard: "assets/images/work-ready-motherboard.png",
    overview: "assets/images/work-ready-overview.png",
    motherboardKit: "assets/images/work-ready-motherboard-kit.png",
    power: "assets/images/work-ready-power.png",
    ram: "assets/images/work-ready-ram.png",
    ssd: "assets/images/work-ready-ssd.png"
  },
  ultimate: {
    main: "assets/images/ultimate-main.svg",
    cpu: "assets/images/ultimate-cpu.svg",
    gpu: "assets/images/ultimate-gpu.svg",
    power: "assets/images/ultimate-power.svg"
  },
  productivity: {
    main: "assets/images/productivity-overview.png",
    case: "assets/images/productivity-case.png",
    cpu: "assets/images/productivity-cpu.png",
    motherboard: "assets/images/productivity-motherboard.png",
    motherboardSpec: "assets/images/productivity-motherboard-spec.png",
    fan: "assets/images/productivity-fan.png",
    power: "assets/images/productivity-power.png",
    ram: "assets/images/productivity-ram.png",
    ssd: "assets/images/productivity-ssd.png"
  },
  fortnite: {
    main: "assets/images/fortnite-main.svg",
    cpu: "assets/images/fortnite-cpu.svg",
    gpu: "assets/images/fortnite-gpu.svg",
    power: "assets/images/fortnite-power.svg"
  },
  accessories: {
    mouse: "assets/images/bpp-gaming-mouse.jpg",
    keyboard: "assets/images/bpp-mechanical-gaming-keyboard.jpg"
  }
};

window.PC_PRODUCTS = [
  {
    id: "office-ready-pc",
    category: "PC",
    popular: "yes",
    name: "Office Ready",
    slug: "work-ready-pc",
    price: 379.99,
    description: "Perfect for school, office work, browsing, and everyday use.",
    longDescription: "The Office Ready PC is a tidy desktop for daily tasks, office software, online learning, and general home use. It combines a reliable Intel Core i3 platform with fast NVMe storage so setup feels simple and responsive straight out of the box.",
    keyFeatures: [
      "Quick startup for work, school, and browsing",
      "Compact design that fits neatly on smaller desks",
      "Fast NVMe storage keeps everyday tasks responsive",
      "Built and tested in the UK before dispatch"
    ],
    whatItCanRun: [
      "Microsoft Office and Google Workspace",
      "Zoom, Teams, and everyday web browsing",
      "Minecraft and lighter esports titles",
      "Streaming, homework, and daily admin tasks"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Case: Asus Prime AP201 Micro ATX Mini Tower Black with Mesh Side Panel and USB 3.2 Gen 2 Type-C and USB 3.2 Gen 1 Type-A",
      "CPU: Intel Core i3 10105 3.7 GHz 4-Core LGA1200",
      "Graphics: Intel UHD Graphics 630",
      "Motherboard: ASRock H470 M-HVS LGA1200 DDR4 Micro ATX",
      "Memory: G.Skill Ripjaws V Black DDR4-3200 CL16 8GB (2x4GB)",
      "Storage: Patriot P300 128GB M.2 SSD PCIe 3.0 NVMe",
      "Power Supply: MSI MAG A550BN Black 550W Non-Modular 80+ Bronze Certified"
    ],
    image: PRODUCT_IMAGES.workReady.main,
    images: [
      PRODUCT_IMAGES.workReady.overview,
      PRODUCT_IMAGES.workReady.case,
      PRODUCT_IMAGES.workReady.cpu,
      PRODUCT_IMAGES.workReady.motherboard,
      PRODUCT_IMAGES.workReady.motherboardKit,
      PRODUCT_IMAGES.workReady.power,
      PRODUCT_IMAGES.workReady.ram,
      PRODUCT_IMAGES.workReady.ssd
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.workReady.overview,
        title: "Compact case footprint",
        description: "The AP201 keeps the build compact on or under the desk while staying professional."
      },
      {
        image: PRODUCT_IMAGES.workReady.case,
        title: "ASUS Prime AP201 airflow interior",
        description: "Mesh panels and a clean internal layout keep airflow moving and maintenance straightforward."
      },
      {
        image: PRODUCT_IMAGES.workReady.cpu,
        title: "Intel Core i3-10105 processor",
        description: "10th Gen quad-core CPU that keeps everyday office apps responsive."
      },
      {
        image: PRODUCT_IMAGES.workReady.motherboard,
        title: "ASRock H470M-HVS platform",
        description: "Stable LGA1200 micro-ATX motherboard with the ports you need for office peripherals."
      },
      {
        image: PRODUCT_IMAGES.workReady.motherboardKit,
        title: "Platform overview",
        description: "Reliable ASRock board pairing that keeps the system stable for daily work."
      },
      {
        image: PRODUCT_IMAGES.workReady.power,
        title: "MSI MAG A550BN 550W PSU",
        description: "80+ Bronze certified power supply for dependable all-day use."
      },
      {
        image: PRODUCT_IMAGES.workReady.ram,
        title: "G.Skill Ripjaws V DDR4 memory",
        description: "8GB dual-channel DDR4 memory helps multitasking stay smooth."
      },
      {
        image: PRODUCT_IMAGES.workReady.ssd,
        title: "Patriot P300 NVMe SSD",
        description: "NVMe storage shortens boot times and speeds up file access."
      }
    ],
    otherInfo: [
      "Prebuilt and tested before dispatch by BPP PCs.",
      "Best suited to office software, school tasks, web platforms, and remote meeting tools.",
      "Integrated graphics only; not designed for high-end gaming."
    ]
  },
  {
    id: "bpp-ultimate-pc",
    category: "PC",
    triggersBundleUpsell: true,
    popular: "yes",
    name: "The BPP Ultimate PC",
    slug: "The BPP Ultimate PC",
    price: 2699,
    description: "Perfect for high-end gaming, streaming, and demanding creator work.",
    longDescription: "The BPP Ultimate PC is our highest performance desktop for players and creators who want serious headroom. With a Ryzen 7 9800X3D, RTX 5080 graphics, fast DDR5 memory, and 4TB of PCIe 5.0 storage, it is built for premium gaming and heavier workloads without the setup hassle.",
    keyFeatures: [
      "High-refresh 1440p and 4K-ready gaming performance",
      "Strong headroom for streaming and creator workflows",
      "Fast 4TB PCIe 5.0 storage for quick load times",
      "Premium airflow and cooling for longer sessions"
    ],
    whatItCanRun: [
      "Fortnite",
      "Call of Duty: Warzone",
      "GTA V",
      "Cyberpunk 2077",
      "Minecraft with shaders",
      "Streaming and creator apps"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Case: NZXT H9 Flow RGB+ (2025) ATX Mid Tower White Tempered Glass",
      "CPU: AMD Ryzen 7 9800X3D 4.7 GHz 8-Core AM5",
      "Motherboard: Gigabyte B850 AORUS ELITE WIFI7 ICE DDR5 ATX",
      "Graphics: MSI GeForce RTX 5080 16G GAMING TRIO OC WHITE",
      "Memory: Corsair Vengeance RGB White/Silver DDR5-6000 CL36 32GB (2x16GB)",
      "CPU Cooler: NZXT Kraken Elite RGB (2025) 420mm Water Cooler White",
      "Storage: Samsung 9100 PRO 4TB M.2-2280 PCIe 5.0 NVMe",
      "Power Supply: Lian Li SX Platinum 1000W SFX, ATX 3.1 / PCIe 5.1, fully modular"
    ],
    image: PRODUCT_IMAGES.ultimate.main,
    images: [
      PRODUCT_IMAGES.ultimate.main,
      PRODUCT_IMAGES.ultimate.cpu,
      PRODUCT_IMAGES.ultimate.gpu,
      PRODUCT_IMAGES.ultimate.power
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.ultimate.main,
        title: "Premium showcase build",
        description: "A high-end tower layout built around airflow, clean cable routing, and standout presentation."
      },
      {
        image: PRODUCT_IMAGES.ultimate.cpu,
        title: "Ryzen 7 9800X3D gaming CPU",
        description: "Fast gaming-focused CPU performance for high refresh-rate titles and heavy multitasking."
      },
      {
        image: PRODUCT_IMAGES.ultimate.gpu,
        title: "RTX 5080 graphics power",
        description: "Strong GPU horsepower for 1440p and 4K gaming, streaming, and demanding visual workloads."
      },
      {
        image: PRODUCT_IMAGES.ultimate.power,
        title: "1000W Platinum PSU",
        description: "High-efficiency power delivery ready for enthusiast-grade hardware."
      }
    ],
    otherInfo: [
      "Built, stress-tested, and quality-checked by BPP PCs before dispatch.",
      "Ideal for premium gaming setups, streaming, and advanced creator workloads.",
      "Keyboard and mouse are sold separately unless added as a bundle."
    ]
  },
  {
    id: "productivity-editing-pc",
    category: "PC",
    triggersBundleUpsell: false,
    popular: "no",
    name: "Content Creation PC",
    slug: "productivity-editing-pc",
    price: 649.99,
    description: "Perfect for editing, productivity, school, and everyday work.",
    longDescription: "The Content Creation PC is a practical desktop for productivity software, light editing, multitasking, and everyday home use. It pairs a strong Intel processor with fast storage and a clean airflow-focused build to keep the day-to-day experience simple.",
    keyFeatures: [
      "Smooth multitasking for editing and office workloads",
      "Responsive boot and project loading with PCIe 4.0 NVMe storage",
      "Clean airflow-focused case design for steady daily use",
      "Ready to use straight out of the box"
    ],
    whatItCanRun: [
      "Adobe Premiere Pro",
      "Photoshop and Canva",
      "Minecraft",
      "Valorant",
      "Roblox",
      "School and office apps"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Case: NZXT H3 Flow Micro ATX Mid Tower Black with Tinted Tempered Glass, USB 3.2 Gen 2x2 Type-C + USB 3.2 Gen 1 Type-A",
      "CPU: Intel Core i5-12400 2.5 GHz 6-Core LGA1700",
      "Graphics: Intel UHD 730 integrated graphics",
      "Motherboard: MSI H610 PRO H610M-G WIFI LGA1700 DDR4 Micro ATX",
      "Memory: G.Skill Trident Z RGB Black DDR4-4000 CL18 16GB (2x8GB)",
      "Storage: Western Digital WD Blue SN5000 500GB M.2-2280 PCIe 4.0 x4 NVMe",
      "Power Supply: MSI MAG A550BN Black 550W Non-Modular 80+ Bronze Certified",
      "Cooling: 2 x ARCTIC P14 Pro 140mm Black PWM Addressable RGB 110 CFM"
    ],
    image: PRODUCT_IMAGES.productivity.main,
    images: [
      PRODUCT_IMAGES.productivity.main,
      PRODUCT_IMAGES.productivity.case,
      PRODUCT_IMAGES.productivity.cpu,
      PRODUCT_IMAGES.productivity.motherboard,
      PRODUCT_IMAGES.productivity.motherboardSpec,
      PRODUCT_IMAGES.productivity.ram,
      PRODUCT_IMAGES.productivity.ssd,
      PRODUCT_IMAGES.productivity.power,
      PRODUCT_IMAGES.productivity.fan
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.productivity.main,
        title: "Productivity Editing PC overview",
        description: "A clean, professional look with strong front airflow."
      },
      {
        image: PRODUCT_IMAGES.productivity.case,
        title: "H3 Flow chassis",
        description: "Tinted tempered glass and mesh front panel keep the system tidy and well ventilated."
      },
      {
        image: PRODUCT_IMAGES.productivity.cpu,
        title: "Intel Core i5-12400",
        description: "6-core CPU for responsive productivity and entry-level editing workflows."
      },
      {
        image: PRODUCT_IMAGES.productivity.motherboard,
        title: "MSI H610M-G WIFI",
        description: "LGA1700 DDR4 Micro ATX platform with onboard WiFi."
      },
      {
        image: PRODUCT_IMAGES.productivity.motherboardSpec,
        title: "Board feature highlights",
        description: "Clear overview of the H610M-G layout and expansion support."
      },
      {
        image: PRODUCT_IMAGES.productivity.ram,
        title: "G.Skill Trident Z RGB 16GB",
        description: "DDR4-4000 CL18 memory for smooth multitasking."
      },
      {
        image: PRODUCT_IMAGES.productivity.ssd,
        title: "WD Blue SN5000 500GB",
        description: "PCIe 4.0 NVMe storage for faster boot and project load times."
      },
      {
        image: PRODUCT_IMAGES.productivity.power,
        title: "MSI MAG A550BN 550W",
        description: "80+ Bronze power supply for stable daily operation."
      },
      {
        image: PRODUCT_IMAGES.productivity.fan,
        title: "ARCTIC P14 Pro ARGB",
        description: "140mm fans to keep airflow steady during longer sessions."
      }
    ],
    otherInfo: [
      "Built and tested by BPP PCs before release.",
      "Best for productivity and editing workflows with light gaming on the side.",
      "A later graphics-card upgrade can help heavier GPU-accelerated workloads."
    ]
  },
  {
    id: "checkout-test-pc",
    category: "PC",
    triggersBundleUpsell: false,
    popular: "no",
    name: "Checkout Test PC",
    slug: "checkout-test-pc",
    price: 0.5,
    description: "Perfect for basket, checkout, and catalogue testing.",
    longDescription: "The Checkout Test PC is a low-value listing used to verify basket behaviour, checkout redirects, and the full product journey on the website. It behaves like a normal BPP PCs listing so the end-to-end buying flow can be checked without using a full-price product.",
    keyFeatures: [
      "Useful for end-to-end basket and checkout checks",
      "Low-value product for live payment testing",
      "Supports quantity changes and product-page testing",
      "Matches the same product structure as the main catalogue"
    ],
    whatItCanRun: [
      "Basket testing",
      "Quantity checks",
      "Checkout redirects",
      "Catalogue flow reviews"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Test Product Type: Catalogue and checkout verification item",
      "Price: GBP 0.50",
      "Availability: For internal order-flow testing",
      "Display Mode: Uses full product detail page, basket support, and Stripe checkout integration",
      "Shipping: Not intended as a physical customer dispatch item",
      "Support: Contact support@bpppcs.com if a test order needs to be reviewed"
    ],
    image: PRODUCT_IMAGES.workReady.main,
    images: [
      PRODUCT_IMAGES.workReady.overview,
      PRODUCT_IMAGES.workReady.case,
      PRODUCT_IMAGES.workReady.cpu,
      PRODUCT_IMAGES.workReady.power
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.workReady.overview,
        title: "Checkout flow test overview",
        description: "Use this listing to confirm the product page, basket, and checkout flow are working correctly."
      },
      {
        image: PRODUCT_IMAGES.workReady.case,
        title: "Basket and quantity testing",
        description: "Helpful for checking multiple quantities, basket edits, and item totals before payment."
      },
      {
        image: PRODUCT_IMAGES.workReady.cpu,
        title: "Low-value Stripe testing",
        description: "Priced at GBP 0.50 so the live payment flow can be tested with minimal value."
      },
      {
        image: PRODUCT_IMAGES.workReady.power,
        title: "Post-checkout verification",
        description: "Useful for checking success and cancel redirects after completing or exiting checkout."
      }
    ],
    otherInfo: [
      "Created for checkout and basket testing on the live website.",
      "Not intended as a standard retail dispatch product.",
      "Support can review test orders via support@bpppcs.com."
    ]
  },
  {
    id: "fortnite-ready",
    category: "PC",
    triggersBundleUpsell: true,
    popular: "no",
    name: "240FPS Fortnite Ready PC",
    slug: "240FPS Fortnite Ready PC",
    price: 1199,
    description: "Perfect for competitive Fortnite, fast-paced gaming, and streaming.",
    longDescription: "The 240FPS Fortnite Ready PC is built for players who want fast, responsive gameplay in competitive titles. With a strong Ryzen processor, RTX graphics, and generous storage, it is designed to keep gaming smooth while still being easy to set up and use from day one.",
    keyFeatures: [
      "Built for high frame-rate competitive play",
      "Strong CPU and GPU pairing for modern gaming and streaming",
      "Fast storage with plenty of room for a growing game library",
      "Ready to play straight out of the box"
    ],
    whatItCanRun: [
      "Fortnite",
      "GTA V",
      "Minecraft",
      "Apex Legends",
      "Rocket League",
      "Valorant"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "CPU: AMD Ryzen 9 7900X",
      "Graphics: NVIDIA GeForce RTX 5080",
      "Memory: 16GB DDR4 3200MHz",
      "Storage: 2TB NVMe Gen4 SSD + 4TB SATA SSD",
      "Power Supply: 850W 80 Plus Gold PSU",
      "Case: Quiet airflow tower chassis"
    ],
    image: PRODUCT_IMAGES.fortnite.main,
    images: [
      PRODUCT_IMAGES.fortnite.main,
      PRODUCT_IMAGES.fortnite.cpu,
      PRODUCT_IMAGES.fortnite.gpu,
      PRODUCT_IMAGES.fortnite.power
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.fortnite.main,
        title: "Fortnite-ready overview",
        description: "A gaming-focused tower built for smooth, high frame-rate play."
      },
      {
        image: PRODUCT_IMAGES.fortnite.cpu,
        title: "Ryzen 9 processing power",
        description: "Strong CPU performance helps keep competitive titles responsive."
      },
      {
        image: PRODUCT_IMAGES.fortnite.gpu,
        title: "RTX graphics muscle",
        description: "High-end GPU power aimed at fast, fluid gameplay and modern visuals."
      },
      {
        image: PRODUCT_IMAGES.fortnite.power,
        title: "Reliable power delivery",
        description: "Gold-rated PSU support for a performance-focused gaming build."
      }
    ],
    otherInfo: [
      "Built and tested by BPP PCs before shipping.",
      "Best suited to esports and performance-focused gaming setups.",
      "Keyboard and mouse are available separately or through the BPP Starter Gaming Combo."
    ]
  },
  {
    id: "bpp-gaming-mouse",
    category: "Accessory",
    visibleInCatalog: true,
    popular: "no",
    name: "BPP Gaming Mouse",
    slug: "bpp-gaming-mouse",
    price: 19.99,
    description: "Gaming mouse with up to 8000 DPI, RGB lighting, ergonomic design, and USB wired setup.",
    longDescription: "The BPP Gaming Mouse is a simple plug-and-play add-on for new desktop setups. It combines adjustable sensitivity, RGB styling, and a comfortable shape in a wired design that is easy to use straight away.",
    keyFeatures: [
      "Plug and play wired setup",
      "Up to 8000 DPI for quick control",
      "RGB lighting to match gaming desks",
      "Ergonomic shape for longer sessions"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Type: Gaming mouse",
      "Sensor: Up to 8000 DPI",
      "Lighting: RGB lighting",
      "Shape: Ergonomic design",
      "Connection: USB wired"
    ],
    image: PRODUCT_IMAGES.accessories.mouse,
    images: [
      PRODUCT_IMAGES.accessories.mouse
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.accessories.mouse,
        title: "BPP Gaming Mouse",
        description: "A clean wired gaming mouse designed to be easy to plug in and start using straight away."
      }
    ],
    otherInfo: [
      "Sold by BPP PCs as a simple add-on for new desktop setups.",
      "USB wired connection makes it easy to use with new systems right away.",
      "Pairs with the BPP Mechanical Gaming Keyboard in the BPP Starter Gaming Combo."
    ]
  },
  {
    id: "bpp-mechanical-gaming-keyboard",
    category: "Accessory",
    visibleInCatalog: true,
    popular: "no",
    name: "BPP Mechanical Gaming Keyboard",
    slug: "bpp-mechanical-gaming-keyboard",
    price: 24.99,
    description: "Mechanical keyboard with a 60% compact layout, RGB lighting, UK layout, and wired setup.",
    longDescription: "The BPP Mechanical Gaming Keyboard is a compact wired board built for tidy gaming desks and easy setup. Its 60 percent layout saves space while keeping the feel and styling expected from a gaming keyboard.",
    keyFeatures: [
      "Compact 60 percent layout saves desk space",
      "Mechanical feel for gaming and typing",
      "RGB lighting matches gaming setups",
      "Wired connection keeps setup simple"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Type: Mechanical keyboard",
      "Layout: 60% compact layout",
      "Lighting: RGB lighting",
      "Region: UK layout",
      "Connection: Wired"
    ],
    image: PRODUCT_IMAGES.accessories.keyboard,
    images: [
      PRODUCT_IMAGES.accessories.keyboard
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.accessories.keyboard,
        title: "BPP Mechanical Gaming Keyboard",
        description: "A compact keyboard designed to keep gaming desks neat while still feeling responsive."
      }
    ],
    otherInfo: [
      "Sold by BPP PCs as a clean starter keyboard option for gaming systems.",
      "UK layout is ready for local users without needing remapping.",
      "Pairs with the BPP Gaming Mouse in the BPP Starter Gaming Combo."
    ]
  },
  {
    id: "bpp-starter-gaming-combo",
    category: "Bundle",
    visibleInCatalog: false,
    popular: "no",
    name: "BPP Starter Gaming Combo",
    slug: "bpp-starter-gaming-combo",
    price: 34.99,
    description: "Mechanical RGB keyboard and gaming mouse bundle with a simple plug and play setup.",
    longDescription: "The BPP Starter Gaming Combo is an easy add-on for anyone buying a new PC and wanting the basics sorted in one click. It bundles the BPP Mechanical Gaming Keyboard with the BPP Gaming Mouse and offers better value than buying both separately.",
    keyFeatures: [
      "Better value than buying the keyboard and mouse separately",
      "Adds both starter peripherals in one quick basket action",
      "Simple plug and play wired setup",
      "Ideal first setup for a new gaming PC"
    ],
    measurements: {
      length: "",
      width: "",
      height: "",
      weight: ""
    },
    specifications: [
      "Includes: BPP Mechanical Gaming Keyboard",
      "Includes: BPP Gaming Mouse",
      "Setup: Plug and play wired setup",
      "Best For: Starter gaming PC setups",
      "Bundle Price: GBP 34.99"
    ],
    bundleItems: [
      "bpp-mechanical-gaming-keyboard",
      "bpp-gaming-mouse"
    ],
    image: PRODUCT_IMAGES.accessories.keyboard,
    images: [
      PRODUCT_IMAGES.accessories.keyboard,
      PRODUCT_IMAGES.accessories.mouse
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.accessories.keyboard,
        title: "Mechanical RGB keyboard included",
        description: "Compact wired keyboard included in the BPP Starter Gaming Combo."
      },
      {
        image: PRODUCT_IMAGES.accessories.mouse,
        title: "Gaming mouse included",
        description: "RGB gaming mouse included so a new setup is ready to go straight away."
      }
    ],
    otherInfo: [
      "Bundle created by BPP PCs to support new desktop purchases.",
      "Ideal for first-time setups, spare-room systems, and gift builds.",
      "Shown as the only upsell across the site to keep the buying journey simple."
    ]
  }
];
