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
  }
};

window.PC_PRODUCTS = [
  {
    id: "office-ready-pc",
    popular: "yes",
    name: "Office Ready",
    slug: "work-ready-pc",
    price: 379.99,
    description: "A tidy office desktop built for email, browser tabs, spreadsheets, and video calls, powered by an Intel Core i3 and fast NVMe storage.",
    longDescription: "The Work Ready PC pairs the Intel Core i3-10105 with the ASRock H470M-HVS motherboard, 8GB dual-channel DDR4, and a Patriot P300 NVMe SSD, all housed in the compact ASUS Prime AP201 mesh case. Integrated Intel UHD 630 graphics handle day-to-day business workloads, while the MSI MAG A550BN 550W PSU keeps power delivery stable.",
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
    whyBuy: [
      "Intel Core i3-10105 with integrated UHD 630 graphics is ideal for office workloads.",
      "ASUS Prime AP201 mesh case keeps the system cool in a compact footprint.",
      "8GB dual-channel DDR4 plus Patriot P300 NVMe storage helps apps open quickly.",
      "MSI MAG A550BN 550W 80+ Bronze PSU provides stable, efficient power."
    ],
    otherInfo: [
      "Prebuilt and tested before dispatch by BPP PCs.",
      "Best suited to office software, admin workloads, web platforms, and remote meeting tools.",
      "Integrated graphics only; not designed for high-end gaming or GPU-heavy tasks."
    ]
  },
  {
    id: "bpp-ultimate-pc",
    popular: "yes",
    name: "The BPP Ultimate PC",
    slug: "The BPP Ultimate PC",
    price: 2699,
    description: "The highest performance PC that BPP offers. A 4K-ready gaming tower with a Ryzen 7 9800X3D, RTX 5080, DDR5 memory, and PCIe 5.0 storage.",
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
    ]
  },
  {
    id: "productivity-editing-pc",
    popular: "no",
    name: "Content Creation PC",
    slug: "productivity-editing-pc",
    price: 649.99,
    description: "A productivity-focused desktop with a strong Intel CPU for content workflows, fast editing timelines, and responsive multitasking.",
    longDescription: "Built in the NZXT H3 Flow chassis, this system is tuned for office productivity and entry-to-mid video editing with good CPU performance, fast DDR4 memory, and PCIe 4.0 NVMe storage.",
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
    whyBuy: [
      "Intel Core i5-12400 gives stronger CPU headroom for productivity software and video editing tasks.",
      "16GB dual-channel DDR4 memory helps smoother timeline work and stable multitasking across creator apps.",
      "PCIe 4.0 NVMe SSD improves startup, loading, and media/project handling speed.",
      "NZXT H3 Flow airflow design with added 140mm fans helps maintain stable thermals during longer workloads."
    ],
    otherInfo: [
      "Built and tested by BPP PCs before release.",
      "Best for productivity and editing workflows; heavier GPU-accelerated effects may benefit from a dedicated graphics card upgrade later."
    ]
  },
  {
    id: "checkout-test-pc",
    popular: "no",
    name: "Checkout Test PC",
    slug: "checkout-test-pc",
    price: 0.5,
    description: "A full catalogue test product priced at GBP 0.50 for checking the basket and Stripe checkout flow.",
    longDescription: "The Checkout Test PC is a dedicated low-value listing for verifying product pages, basket behaviour, quantity handling, and Stripe checkout redirects. It is set up like a normal BPP PCs product so the full buying journey can be tested end to end.",
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
    whyBuy: [
      "Lets you test the live basket and Stripe journey without using a normal product price.",
      "Behaves like a full product page, so the customer flow can be reviewed properly.",
      "Supports quantity changes, basket edits, and checkout redirects.",
      "Useful for confirming success and cancel pages are working as expected."
    ],
    otherInfo: [
      "Created for checkout and basket testing on the live website.",
      "Not intended as a standard retail dispatch product.",
      "If a test order is placed, support can review it via support@bpppcs.com."
    ]
  },
  {
    id: "fortnite-ready",
    popular: "no",
    name: "240FPS Fortnite Ready PC",
    slug: "240FPS Fortnite Ready PC",
    price: 1199,
    description: "A PC designed to get 240FPS on Fortnite to give the smoothest gameplay",
    specifications: [
      "AMD Ryzen 9 7900X",
      "NVIDIA GeForce RTX 5080",
      "16GB DDR4 3200MHz",
      "2TB NVMe Gen4 SSD + 4TB SATA SSD",
      "850W 80 Plus Gold PSU",
      "Quiet airflow tower chassis"
    ],
    image: PRODUCT_IMAGES.fortnite.main,
    images: [
      PRODUCT_IMAGES.fortnite.main,
      PRODUCT_IMAGES.fortnite.cpu,
      PRODUCT_IMAGES.fortnite.gpu,
      PRODUCT_IMAGES.fortnite.power
    ]
  },

];
