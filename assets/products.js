// Stripe Payment Link redirects must be configured in the Stripe Dashboard.
// Set each link's successful payment redirect to: /thank-you.html
window.PC_PRODUCTS = [
  {
    id: "full-test",
    name: "FULL TEST",
    slug: "full-test",
    price: 1,
    description: "FULL TEST product for checkout and display testing.",
    longDescription: "FULL TEST is a test-only product used to verify product pages, gallery rendering, and Stripe checkout behavior in this site.",
    specifications: [
      "TEST SPEC: FULL TEST case",
      "TEST SPEC: FULL TEST processor",
      "TEST SPEC: FULL TEST memory",
      "TEST SPEC: FULL TEST storage",
      "TEST SPEC: FULL TEST power supply"
    ],
    image: "assets/images/full-test.svg",
    images: [
      "assets/images/full-test.svg",
      "assets/images/full-test.svg",
      "assets/images/full-test.svg",
      "assets/images/full-test.svg"
    ],
    gallerySlides: [
      {
        image: "assets/images/full-test.svg",
        title: "FULL TEST image slide 1",
        description: "FULL TEST gallery content for product testing."
      },
      {
        image: "assets/images/full-test.svg",
        title: "FULL TEST image slide 2",
        description: "FULL TEST gallery content for navigation testing."
      },
      {
        image: "assets/images/full-test.svg",
        title: "FULL TEST image slide 3",
        description: "FULL TEST gallery content for responsive testing."
      },
      {
        image: "assets/images/full-test.svg",
        title: "FULL TEST image slide 4",
        description: "FULL TEST gallery content for loading testing."
      }
    ],
    whyBuy: [
      "FULL TEST reason: verify checkout flow end to end.",
      "FULL TEST reason: confirm product detail content rendering.",
      "FULL TEST reason: validate card and gallery behavior.",
      "FULL TEST reason: exercise site-wide product search and filters."
    ],
    otherInfo: [
      "FULL TEST notice: this is a test product entry.",
      "FULL TEST notice: content is intentionally test-focused.",
      "FULL TEST notice: use this item for QA and checkout checks."
    ],
    stripeCheckoutLink: "https://buy.stripe.com/fZucN49y30C4gqZ9cT6kg03"
  },
  {
    id: "office-ready-pc",
    name: "Work Ready PC",
    slug: "work-ready-pc",
    price: 379.99,
    description: "A practical office desktop tuned for emails, browser tabs, spreadsheets, and video meetings without slowing down your workflow.",
    longDescription: "Built inside the compact ASUS Prime AP201 mesh chassis, the Work Ready PC is designed for day-to-day business workloads with stable performance, strong airflow, and straightforward reliability.",
    specifications: [
      "Case: ASUS Prime AP201 MicroATX mesh chassis with USB-C and USB-A front I/O",
      "CPU: Intel Core i3-10105 (4 cores, up to 4.4GHz boost)",
      "Graphics: Intel UHD Graphics 630 (integrated)",
      "Motherboard: ASRock H470M-HVS (LGA1200, DDR4)",
      "Memory: 8GB DDR4-3200 (2x4GB, dual-channel)",
      "Storage: Patriot P300 128GB M.2 NVMe SSD",
      "Power Supply: MSI MAG A550BN 550W 80+ Bronze"
    ],
    image: "assets/images/work-ready-pc-main.svg",
    images: [
      "assets/images/work-ready-pc-main.svg",
      "assets/images/work-ready-pc-cpu-workflow.svg",
      "assets/images/work-ready-pc-memory-storage.svg",
      "assets/images/work-ready-pc-reliability.svg"
    ],
    gallerySlides: [
      {
        image: "assets/images/work-ready-pc-main.svg",
        title: "Clean black AP201 build",
        description: "Compact mesh tower with a professional look, tempered side panel, and front USB-C for modern office setups."
      },
      {
        image: "assets/images/work-ready-pc-cpu-workflow.svg",
        title: "CPU tuned for office workflow",
        description: "The Intel Core i3-10105 boosts up to 4.4GHz, keeping browsing, spreadsheets, and communication tools responsive."
      },
      {
        image: "assets/images/work-ready-pc-memory-storage.svg",
        title: "Fast startup and smooth multitasking",
        description: "Dual-channel DDR4 memory and NVMe storage reduce load times and keep daily applications moving without delays."
      },
      {
        image: "assets/images/work-ready-pc-reliability.svg",
        title: "Reliable cooling and power delivery",
        description: "High-airflow mesh panels and a 550W 80+ Bronze PSU support stable temperatures and dependable all-day operation."
      }
    ],
    whyBuy: [
      "Intel Core i3-10105 boost speeds up to 4.4GHz help keep daily workflow apps feeling quick.",
      "Dual-channel 8GB DDR4 memory improves responsiveness when switching between browser tabs, docs, and calls.",
      "NVMe storage helps the system boot fast and open files or software with less waiting.",
      "Airflow-focused AP201 case and quality 550W PSU support stable business use over long sessions."
    ],
    otherInfo: [
      "Prebuilt and tested before dispatch by BPP PCs.",
      "Best suited to office software, admin workloads, web platforms, and remote meeting tools.",
      "This system uses integrated graphics and is not aimed at high-end gaming workloads."
    ],
    stripeCheckoutLink: "https://buy.stripe.com/test_fZucN49y30C4gqZ9cT6kg03"
  },
  {
    id: "bpp-ultimate-pc",
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
    image: "assets/images/bpp-ultimate-pc-main.jpeg",
    images: [
      "assets/images/bpp-ultimate-pc-main.jpeg",
      "assets/images/bpp-ultimate-pc-angle.jpeg",
      "assets/images/bpp-ultimate-pc-alt.jpeg",
      "assets/images/bpp-ultimate-pc-top.jpeg"
    ],
    stripeCheckoutLink: "https://buy.stripe.com/test_8x214m11x5Wob6F74L6kg02"
  },
  {
    id: "productivity-editing-pc",
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
    image: "assets/images/productivity-editing-pc-main.svg",
    images: [
      "assets/images/productivity-editing-pc-main.svg",
      "assets/images/productivity-editing-pc-cpu-workflow.svg",
      "assets/images/productivity-editing-pc-memory-storage.svg",
      "assets/images/productivity-editing-pc-airflow-reliability.svg"
    ],
    gallerySlides: [
      {
        image: "assets/images/productivity-editing-pc-main.svg",
        title: "Modern NZXT H3 Flow build",
        description: "Clean black case styling with a tinted glass side panel and front airflow for a professional workstation look."
      },
      {
        image: "assets/images/productivity-editing-pc-cpu-workflow.svg",
        title: "Strong CPU for productivity and editing",
        description: "The Intel Core i5-12400 delivers 6 cores of solid processing power for timelines, exports, and heavy multitasking."
      },
      {
        image: "assets/images/productivity-editing-pc-memory-storage.svg",
        title: "Fast memory and NVMe performance",
        description: "16GB dual-channel DDR4 plus PCIe 4.0 NVMe storage helps keep projects, app launches, and file access responsive."
      },
      {
        image: "assets/images/productivity-editing-pc-airflow-reliability.svg",
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
    stripeCheckoutLink: ""
  },
  {
    id: "fortnite-ready",
    name: "240FPS Fortnite Ready PC",
    slug: "240FPS Fortnite Ready PC",
    price: 1199,
    description: "A PC designed to get 240FPS on Fornite to give the smoothest gameplay",
    specifications: [
      "AMD Ryzen 9 7900X",
      "NVIDIA GeForce RTX 5080",
      "16GB DDR4 3200MHz",
      "2TB NVMe Gen4 SSD + 4TB SATA SSD",
      "850W 80 Plus Gold PSU",
      "Quiet airflow tower chassis"
    ],
    image: "assets/images/studio-x-pro.svg",
    stripeCheckoutLink: "https://buy.stripe.com/test_studioxpro"
  },

];
