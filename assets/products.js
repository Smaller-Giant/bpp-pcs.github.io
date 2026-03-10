// Stripe Payment Link redirects must be configured in the Stripe Dashboard.
// Set each link's successful payment redirect to: /thank-you.html
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
    main: "assets/images/productivity-main.svg",
    cpu: "assets/images/productivity-cpu.svg",
    memory: "assets/images/productivity-memory.svg",
    cooling: "assets/images/productivity-cooling.svg"
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
    name: "Work Ready PC",
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
    ],
    stripeCheckoutLink: "https://buy.stripe.com/9B6aEW11x5Wo3Ed3Sz6kg00"
  },
  {
    id: "bpp-ultimate-pc",
    popular: "yes",
    name: "The BPP Ultimate PC",
    slug: "The BPP Ultimate PC",
    price: 2699,
    description: "The highest performance PC that BPP offers. Its a 4K ready gaming tower built for ultra settings and high refresh displays.",
    specifications: [
      "Intel Core Ultra 7 265K",
      "NVIDIA GeForce RTX 5080 16GB",
      "32GB DDR5 6400MHz",
      "2TB NVMe Gen4 SSD",
      "1000W 80 Plus Gold PSU",
      "360mm liquid CPU cooler"
    ],
    image: PRODUCT_IMAGES.ultimate.main,
    images: [
      PRODUCT_IMAGES.ultimate.main,
      PRODUCT_IMAGES.ultimate.cpu,
      PRODUCT_IMAGES.ultimate.gpu,
      PRODUCT_IMAGES.ultimate.power
    ],
    stripeCheckoutLink: "https://buy.stripe.com/28EaEW6lR98AgqZ88P6kg01"
  },
  {
    id: "productivity-editing-pc",
    popular: "no",
    name: "Productivity Editing PC",
    slug: "productivity-editing-pc",
    price: 649.99,
    description: "A productivity-focused desktop with a strong Intel CPU for content workflows, fast editing timelines, and responsive multitasking.",
    longDescription: "Built in the NZXT H3 Flow chassis, this system is tuned for office productivity and entry-to-mid video editing with good CPU performance, fast DDR4 memory, and PCIe 4.0 NVMe storage.",
    specifications: [
      "Case: NZXT H3 Flow MicroATX mid-tower (black, tinted tempered glass, front USB-C + USB-A)",
      "CPU: Intel Core i5-12400 (6 cores, up to 4.4GHz boost)",
      "Graphics: Intel UHD 730 integrated graphics",
      "Motherboard: MSI PRO H610M-G WIFI (LGA1700, DDR4, MicroATX)",
      "Memory: 16GB DDR4-4000 CL18 (2x8GB, dual-channel)",
      "Storage: WD Blue SN5000 500GB M.2 NVMe PCIe 4.0 x4 SSD",
      "Power Supply: MSI MAG A550BN 550W 80+ Bronze",
      "Cooling: 2 x ARCTIC P14 Pro 140mm PWM ARGB case fans"
    ],
    image: PRODUCT_IMAGES.productivity.main,
    images: [
      PRODUCT_IMAGES.productivity.main,
      PRODUCT_IMAGES.productivity.cpu,
      PRODUCT_IMAGES.productivity.memory,
      PRODUCT_IMAGES.productivity.cooling
    ],
    gallerySlides: [
      {
        image: PRODUCT_IMAGES.productivity.main,
        title: "Modern NZXT H3 Flow build",
        description: "Clean black case styling with a tinted glass side panel and front airflow for a professional workstation look."
      },
      {
        image: PRODUCT_IMAGES.productivity.cpu,
        title: "Strong CPU for productivity and editing",
        description: "The Intel Core i5-12400 delivers 6 cores of solid processing power for timelines, exports, and heavy multitasking."
      },
      {
        image: PRODUCT_IMAGES.productivity.memory,
        title: "Fast memory and NVMe performance",
        description: "16GB dual-channel DDR4 plus PCIe 4.0 NVMe storage helps keep projects, app launches, and file access responsive."
      },
      {
        image: PRODUCT_IMAGES.productivity.cooling,
        title: "Airflow and reliability",
        description: "Dual 140mm fans, a flow-focused chassis, and a dependable 550W PSU support consistent long-session performance."
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
      "Best for productivity and editing workflows; heavier GPU-accelerated effects may benefit from a dedicated graphics card upgrade later.",
      "Stripe checkout link is intentionally left blank for now and can be added when ready."
    ],
    stripeCheckoutLink: "https://buy.stripe.com/5kQ6oGeSndoQ5Mldt96kg05"
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
    ],
    stripeCheckoutLink: "https://buy.stripe.com/aFa00i39FacE7UtgFl6kg04"
  },

];
