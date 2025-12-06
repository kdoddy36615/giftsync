// Gift data organized by person

const giftData = {
    emily: [
        {
            name: "14k Gold Emerald Earrings",
            status: "required",
            priority: true,
            low: 280,
            high: 500,
            notes: "Main wow gift. White gold preferred. Ready-to-ship.",
            value: null,
            hasResearch: true,
            googleSearch: "14k white gold emerald stud earrings",
            research: {
                title: "Reddit Research: Best Way to Buy Emerald Earrings",
                sections: [
                    {
                        heading: "Avoid Retail Markup (30-50%+)",
                        points: [
                            "Brick & mortar stores have massive markups - you're paying for overhead",
                            "Online vendors like James Allen, Blue Nile offer 20-40% savings",
                            "Etsy has independent jewelers with competitive prices and unique designs"
                        ]
                    },
                    {
                        heading: "Natural vs Lab Emeralds",
                        points: [
                            "Lab emeralds are chemically identical, 50-70% cheaper, and more ethical",
                            "Natural emeralds have inclusions (normal for emeralds) - look for 'eye clean'",
                            "Lab stones are more durable and have better color consistency"
                        ]
                    },
                    {
                        heading: "What to Check",
                        points: [
                            "14k white gold is perfect - durable and doesn't need frequent replating like 18k",
                            "Get certificate/authentication for stones (GIA, IGI, or AGS)",
                            "Check return policy and warranty - reputable sellers offer 30+ day returns",
                            "Look for screw-backs or friction backs (not butterfly backs which fall off)"
                        ]
                    },
                    {
                        heading: "Recommended by Redditors",
                        points: [
                            "James Allen - great 360° videos, lifetime warranty, free resizing",
                            "Brilliant Earth - ethical sourcing, lab options",
                            "Local independent jewelers on Etsy - custom work at good prices",
                            "Avoid: Kay, Zales, Jared (overpriced, poor quality)"
                        ]
                    }
                ],
                images: [
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=200&fit=crop"
                ],
                source: "Compiled from r/jewelry, r/EngagementRings, r/Moissanite"
            },
            prices: [
                { store: "Etsy", price: 295, url: "https://www.etsy.com/search?q=14k+white+gold+emerald+earrings", best: true },
                { store: "Amazon", price: 340, url: "https://www.amazon.com/s?k=14k+white+gold+emerald+earrings" },
                { store: "James Allen", price: 385, url: "https://www.jamesallen.com/loose-diamonds/emerald-earrings/" },
                { store: "Blue Nile", price: 420, url: "https://www.bluenile.com/jewelry/earrings/emerald", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Swimsuits (x2)",
            status: "required",
            priority: true,
            low: 60,
            high: 120,
            notes: "Tummy control, ruched/tankini. For Feb cruise.",
            value: null,
            hasResearch: true,
            googleSearch: "tummy control swimsuit ruched one piece",
            research: {
                title: "Reddit Research: Best Swimsuits for Stretch Marks & Tummy Coverage",
                sections: [
                    {
                        heading: "Key Features for Confidence",
                        points: [
                            "Ruching/gathering on the stomach area disguises and flatters",
                            "High-waisted bottoms or tankini tops cover belly completely",
                            "Thicker, quality fabric (80%+ nylon/polyamide) doesn't show skin texture",
                            "Darker colors (black, navy, deep purple) are more forgiving than pastels"
                        ]
                    },
                    {
                        heading: "Top Recommended Brands (Reddit Approved)",
                        points: [
                            "Miraclesuit - 'Instant tummy control', thick fabric, lasts years. Worth the price.",
                            "Lands' End - Great for apple shapes, high-waisted options, long torso friendly",
                            "Summersalt - Inclusive sizing, thick material, trendy designs",
                            "Swimsuits For All - Plus-size focused, huge variety, excellent reviews"
                        ]
                    },
                    {
                        heading: "Styles That Work Best",
                        points: [
                            "One-piece with ruched sides or wrap detail across stomach",
                            "Tankini with high-waisted bottoms (gives two-piece look with coverage)",
                            "Swim dress with built-in shorts (most coverage, still flattering)",
                            "Avoid: String bikinis, low-rise bottoms, thin white/light fabrics"
                        ]
                    },
                    {
                        heading: "Sizing & Fabric Tips",
                        points: [
                            "Size up if between sizes - too tight = unflattering bulges",
                            "Look for 'tummy control' or 'shaping' in description",
                            "Check fabric thickness - should be 200+ GSM (grams per square meter)",
                            "Read reviews for 'true to size' feedback and stretch marks mentions"
                        ]
                    }
                ],
                images: [
                    "https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1621951753015-0a2e08e28370?w=300&h=200&fit=crop"
                ],
                source: "Compiled from r/PlusSize, r/ABraThatFits, r/femalefashionadvice"
            },
            prices: [
                { store: "Amazon", price: 75, url: "https://www.amazon.com/s?k=ruched+swimsuit+tummy+control", best: true },
                { store: "Walmart", price: 82, url: "https://www.walmart.com/browse/clothing/womens-swimsuits/5438_133197_1045804" },
                { store: "Target", price: 95, url: "https://www.target.com/c/women-s-swimsuits/-/N-55oya" },
                { store: "Lands' End", price: 110, url: "https://www.landsend.com/shop/womens-swimwear/-/N-fzo", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1621951753015-0a2e08e28370?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1582639639510-c80b5de9f148?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Heated Blanket",
            status: "required",
            priority: false,
            low: 30,
            high: 80,
            notes: "Office/home use. USB or plug-in.",
            value: null,
            hasResearch: true,
            googleSearch: "best heated throw blanket for office",
            research: {
                title: "Reddit Research: Best Heated Blankets for Office/Home",
                sections: [
                    {
                        heading: "USB vs Electric - Which is Better?",
                        points: [
                            "USB blankets: Portable, safe for office use, lower heat (good for lap/shoulders)",
                            "Electric blankets: Much warmer, better for couch/full body, need outlet access",
                            "For office: USB is more practical and won't trip breakers",
                            "For home couch: Electric gives better warmth"
                        ]
                    },
                    {
                        heading: "Safety Features to Look For",
                        points: [
                            "Auto shut-off (2-4 hours) - ESSENTIAL for safety",
                            "Overheat protection - prevents fire hazards",
                            "UL certification - quality electrical components",
                            "Machine washable with removable controller"
                        ]
                    },
                    {
                        heading: "Top Brands (Reddit Favorites)",
                        points: [
                            "Sunbeam - Most reliable, 5-year warranty, even heating",
                            "Beautyrest - Soft fabric, good heat distribution, reasonable price",
                            "Pure Enrichment - Best USB option for office use",
                            "Avoid: Cheap Amazon basics - inconsistent heating, safety concerns"
                        ]
                    },
                    {
                        heading: "What to Check",
                        points: [
                            "Size: 50x60\" (throw size) perfect for lap/shoulders",
                            "Heat settings: At least 3 levels for flexibility",
                            "Fabric: Microplush or fleece (soft), not scratchy polyester",
                            "Cord length: 6ft+ for office flexibility",
                            "Reviews mentioning 'cold always' - these people are your best testers!"
                        ]
                    }
                ],
                images: [
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=200&fit=crop"
                ],
                source: "Compiled from r/BuyItForLife, r/FemaleLivingSpace, r/HomeImprovement"
            },
            prices: [
                { store: "Amazon", price: 45, url: "https://www.amazon.com/s?k=heated+throw+blanket+office", best: true },
                { store: "Walmart", price: 52, url: "https://www.walmart.com/browse/home/heated-blankets-throws/4044_90828_90829_90831" },
                { store: "Target", price: 58, url: "https://www.target.com/c/heated-blankets-throws/-/N-5xtva", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Work Mouse (Logitech MX)",
            status: "optional",
            priority: false,
            low: 50,
            high: 120,
            notes: "Daily 8hr use. MX Anywhere 3 or Master 3S.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 79, url: "https://www.amazon.com/s?k=logitech+mx+master", best: true },
                { store: "Walmart", price: 85, url: "https://www.walmart.com/search?q=logitech+mx+master" },
                { store: "Target", price: 89, url: "https://www.target.com/s?searchTerm=logitech+mx+master", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1613141411244-0f4ac9de2050?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Mug Warmer",
            status: "optional",
            priority: false,
            low: 10,
            high: 120,
            notes: "Basic $15-25 or Ember $100-120. Cozy work theme.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 20, url: "https://www.amazon.com/s?k=coffee+mug+warmer", best: true },
                { store: "Walmart", price: 22, url: "https://www.walmart.com/search?q=mug+warmer" },
                { store: "Target", price: 25, url: "https://www.target.com/s?searchTerm=mug+warmer" },
                { store: "Ember (Premium)", price: 110, url: "https://www.amazon.com/s?k=ember+mug", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1514676783321-b152cff1048b?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Hand Mixer",
            status: "required",
            priority: false,
            low: 26,
            high: 40,
            notes: "5-7 speed. KitchenAid/Cuisinart preferred.",
            value: null,
            prices: [
                { store: "Amazon", price: 32, url: "https://www.amazon.com/s?k=hand+mixer+kitchenaid", best: true },
                { store: "Walmart", price: 35, url: "https://www.walmart.com/browse/home/hand-mixers/4044_623679_133020_7332096" },
                { store: "Target", price: 38, url: "https://www.target.com/c/hand-mixers/-/N-5xtyb", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Sourdough Starter Kit",
            status: "required",
            priority: false,
            low: 20,
            high: 40,
            notes: "Starter, jar, tools. Sets up future bread class.",
            value: null,
            prices: [
                { store: "Amazon", price: 28, url: "https://www.amazon.com/s?k=sourdough+starter+kit", best: true },
                { store: "Walmart", price: 32, url: "https://www.walmart.com/search?q=sourdough+starter+kit" },
                { store: "Etsy", price: 35, url: "https://www.etsy.com/search?q=sourdough+starter+kit", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1549931319-a545dcf3bc36?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Bathroom Tray + Organizer",
            status: "required",
            priority: false,
            low: 15,
            high: 30,
            notes: "Vanity organization, hotel-level feel.",
            value: null,
            prices: [
                { store: "Amazon", price: 22, url: "https://www.amazon.com/s?k=bathroom+vanity+tray+organizer", best: true },
                { store: "Walmart", price: 24, url: "https://www.walmart.com/browse/home/bathroom-storage-organization/4044_133012_133025" },
                { store: "Target", price: 25, url: "https://www.target.com/c/bathroom-storage-organization/-/N-5xt9z" },
                { store: "Etsy", price: 28, url: "https://www.etsy.com/search?q=bathroom+vanity+tray+organizer", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Puppy Present",
            status: "required",
            priority: false,
            low: 15,
            high: 35,
            notes: "Toys/treats. Fun for her emotionally.",
            value: null,
            prices: [
                { store: "Amazon", price: 25, url: "https://www.amazon.com/s?k=dog+toys+and+treats", best: true },
                { store: "Walmart", price: 28, url: "https://www.walmart.com/browse/pets/dog-toys/5440_202072_1557314" },
                { store: "Target", price: 30, url: "https://www.target.com/c/dog-toys/-/N-5xt3m" },
                { store: "Etsy", price: 32, url: "https://www.etsy.com/search?q=dog+toys+treat+bundle", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Hershey Chocolate",
            status: "required",
            priority: false,
            low: 5,
            high: 20,
            notes: "Stocking stuffer classic.",
            value: null,
            prices: [
                { store: "Amazon", price: 12, url: "https://www.amazon.com/s?k=hershey+chocolate+variety+pack", best: true },
                { store: "Walmart", price: 14, url: "https://www.walmart.com/browse/food/hersheys-chocolate/976759_1001391_9176479" },
                { store: "Target", price: 15, url: "https://www.target.com/s?searchTerm=hershey+chocolate", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Coffee Gift Set",
            status: "optional",
            priority: false,
            low: 25,
            high: 60,
            notes: "Beans/sampler/syrups. Pairs with mug warmer.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=coffee+gift+set+variety", best: true },
                { store: "Walmart", price: 42, url: "https://www.walmart.com/search?q=coffee+gift+set" },
                { store: "Target", price: 45, url: "https://www.target.com/s?searchTerm=coffee+gift+set" },
                { store: "Etsy", price: 48, url: "https://www.etsy.com/search?q=coffee+gift+set", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Glasses Finder (Tile)",
            status: "optional",
            priority: false,
            low: 20,
            high: 30,
            notes: "Tracker. Low cost, high sanity value.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 25, url: "https://www.amazon.com/s?k=tile+slim+glasses+tracker", best: true },
                { store: "Walmart", price: 27, url: "https://www.walmart.com/search?q=tile+tracker" },
                { store: "Target", price: 28, url: "https://www.target.com/s?searchTerm=tile+tracker", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Nespresso Variety Pack",
            status: "optional",
            priority: false,
            low: 30,
            high: 40,
            notes: "One-time variety pack, NOT subscription.",
            value: null,
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=nespresso+compatible+pods+variety+pack", best: true },
                { store: "Walmart", price: 38, url: "https://www.walmart.com/search?q=nespresso+pods+variety" },
                { store: "Target", price: 39, url: "https://www.target.com/s?searchTerm=nespresso+pods", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Super Warm Scarf",
            status: "optional",
            priority: false,
            low: 20,
            high: 40,
            notes: "For black coat. Cashmere/wool blend.",
            value: null,
            prices: [
                { store: "Amazon", price: 28, url: "https://www.amazon.com/s?k=warm+winter+scarf+women", best: true },
                { store: "Walmart", price: 32, url: "https://www.walmart.com/browse/clothing/womens-scarves/5438_1045804_1045806_7314887" },
                { store: "Target", price: 35, url: "https://www.target.com/c/scarves-wraps-women-s-accessories/-/N-55b8h" },
                { store: "Etsy", price: 38, url: "https://www.etsy.com/search?q=cashmere+wool+scarf+women", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1604390965369-ce8ae3b0b9f8?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Candle",
            status: "optional",
            priority: false,
            low: 15,
            high: 25,
            notes: "Large jar. Pairs with bathroom spa theme.",
            value: null,
            prices: [
                { store: "Amazon", price: 18, url: "https://www.amazon.com/s?k=large+jar+candle", best: true },
                { store: "Walmart", price: 20, url: "https://www.walmart.com/browse/home/candles/4044_133012_1032619_9344534" },
                { store: "Target", price: 22, url: "https://www.target.com/c/candles-home-fragrance/-/N-5xtfs" },
                { store: "Etsy", price: 25, url: "https://www.etsy.com/search?q=large+soy+candle", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1602874801006-e4fc01d3e3e5?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1587486937413-fb84c1ccb8d2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Comfy Loungewear",
            status: "optional",
            priority: false,
            low: 20,
            high: 60,
            notes: "Wireless bra or soft lounge set. Sizing risk.",
            value: null,
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=wireless+bra+comfortable", best: true },
                { store: "Walmart", price: 38, url: "https://www.walmart.com/browse/clothing/womens-bras/5438_1045804_1045806_5680983" },
                { store: "Target", price: 42, url: "https://www.target.com/c/bras-women-s-clothing/-/N-5xt9j", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Lap Desk",
            status: "optional",
            priority: false,
            low: 20,
            high: 80,
            notes: "Portable for couch/bed.",
            value: null,
            drop: "Bulky - moving in 6mo",
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=lap+desk+portable", best: true },
                { store: "Walmart", price: 40, url: "https://www.walmart.com/search?q=lap+desk" },
                { store: "Target", price: 45, url: "https://www.target.com/s?searchTerm=lap+desk", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Paper Towels Bulk",
            status: "optional",
            priority: false,
            low: 26,
            high: 30,
            notes: "Household value.",
            value: null,
            drop: "No gift feel",
            prices: [
                { store: "Walmart", price: 26, url: "https://www.walmart.com/browse/household-essentials/paper-towels/1115193_1068613_5478633", best: true },
                { store: "Amazon", price: 28, url: "https://www.amazon.com/s?k=paper+towels+bulk" },
                { store: "Target", price: 29, url: "https://www.target.com/c/paper-towels/-/N-5q0i0", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Fish Tank Starter",
            status: "optional",
            priority: false,
            low: 20,
            high: 100,
            notes: "Starter kit with gear.",
            value: null,
            drop: "Maintenance burden",
            prices: [
                { store: "Amazon", price: 45, url: "https://www.amazon.com/s?k=small+fish+tank+starter+kit", best: true },
                { store: "Walmart", price: 52, url: "https://www.walmart.com/browse/pets/fish-tanks-aquariums/5440_202073_1557309_5995701" },
                { store: "Target", price: 58, url: "https://www.target.com/c/fish-aquariums-pets/-/N-5xt2q", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1520990682426-9493ca79f1e6?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1524704796725-9fc3044a58b1?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1516992654410-9309d4587e94?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Dog Toothbrush for Ally",
            status: "required",
            priority: false,
            low: 8,
            high: 25,
            notes: "Dental care for Ally; keeps teeth clean and breath fresh.",
            value: null,
            prices: [
                { store: "Amazon", price: 12, url: "https://www.amazon.com/s?k=dog+toothbrush+kit", best: true },
                { store: "Walmart", price: 15, url: "https://www.walmart.com/search?q=dog+toothbrush" },
                { store: "Target", price: 18, url: "https://www.target.com/s?searchTerm=dog+toothbrush", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Squeakless Puppy Toys",
            status: "required",
            priority: false,
            low: 15,
            high: 35,
            notes: "Quiet toys for Ally - no annoying squeaks, safe and durable.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 18, url: "https://www.amazon.com/s?k=silent+squeakless+dog+toys", best: true },
                { store: "Walmart", price: 22, url: "https://www.walmart.com/search?q=squeakless+dog+toys" },
                { store: "Target", price: 28, url: "https://www.target.com/s?searchTerm=dog+toys+no+squeak", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Dog Nail Scratching Board",
            status: "required",
            priority: false,
            low: 20,
            high: 45,
            notes: "Scratching board for Ally to naturally file down nails - safer than clipping.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 25, url: "https://www.amazon.com/s?k=dog+nail+scratch+board+file", best: true },
                { store: "Walmart", price: 32, url: "https://www.walmart.com/search?q=dog+nail+scratch+pad" },
                { store: "Target", price: 38, url: "https://www.target.com/s?searchTerm=dog+nail+scratcher", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Free People Tie Dye Beanie (Environmental/Save Lands)",
            status: "required",
            priority: true,
            low: 40,
            high: 80,
            notes: "Emily's favorite beanie from 2021-2022. Tie dye, curved rims, shaped her head perfectly. Had square icon and environmental message like 'save lands'. This exact one or similar.",
            value: null,
            prices: [
                { store: "Free People", price: 48, url: "https://www.freepeople.com/shop/beanies/", best: true },
                { store: "eBay", price: 55, url: "https://www.ebay.com/sch/i.html?_nkw=free+people+tie+dye+beanie+2021+2022" },
                { store: "Poshmark", price: 62, url: "https://poshmark.com/search?query=free+people+beanie+tie+dye" },
                { store: "Etsy", price: 70, url: "https://www.etsy.com/search?q=free+people+tie+dye+beanie", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1548126032-079d3fdb58f1?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1606913084506-8507c8d39cfc?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1577580583556-f5dbdba23281?w=400&h=400&fit=crop"
            ]
        }
    ],
    lucas: [
        // REQUIRED ITEMS
        {
            name: "Bike",
            status: "required",
            priority: true,
            low: 250,
            high: 450,
            notes: "Main 'wow' gift; sized/fitted for him, big outdoor freedom & exercise.",
            value: null,
            prices: [
                { store: "Amazon", price: 299, url: "https://www.amazon.com/s?k=kids+bike", best: true },
                { store: "Walmart", price: 315, url: "https://www.walmart.com/browse/sports-outdoors/kids-bikes/4125_1074765_1225395" },
                { store: "Target", price: 329, url: "https://www.target.com/c/kids-bikes/-/N-5xt5t" },
                { store: "REI", price: 399, url: "https://www.rei.com/c/kids-bikes", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Bike accessories (helmet, lights, lock)",
            status: "required",
            priority: true,
            low: 60,
            high: 150,
            notes: "Makes riding safer & more practical; helmet is essential and lights/lock let him use it more.",
            value: null,
            prices: [
                { store: "Amazon", price: 75, url: "https://www.amazon.com/s?k=kids+bike+helmet+lock+lights", best: true },
                { store: "Walmart", price: 85, url: "https://www.walmart.com/browse/sports-outdoors/bike-helmets/4125_1074765_1225395_1225400" },
                { store: "Target", price: 95, url: "https://www.target.com/c/bike-helmets/-/N-5xt5x" },
                { store: "REI", price: 125, url: "https://www.rei.com/c/kids-bike-helmets", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1514672013381-c6d0df1c8b18?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1596073419667-1595020d0b9e?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "New soccer ball + basic baseball gear",
            status: "required",
            priority: false,
            low: 40,
            high: 120,
            notes: "Supports both sports he's into (soccer + baseball); used for practice, backyard, and with friends.",
            value: null,
            prices: [
                { store: "Amazon", price: 55, url: "https://www.amazon.com/s?k=youth+soccer+ball+baseball+glove", best: true },
                { store: "Walmart", price: 65, url: "https://www.walmart.com/browse/sports-outdoors/soccer-balls/4125_1074765_1224928_1224929" },
                { store: "Target", price: 75, url: "https://www.target.com/c/soccer-balls/-/N-5xtam" },
                { store: "Dick's Sporting Goods", price: 95, url: "https://www.dickssportinggoods.com/f/youth-baseball-equipment", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Fidget / tactile toys",
            status: "required",
            priority: false,
            low: 10,
            high: 40,
            notes: "Small, sensory, very 'him' (likes things that feel nice / fidgets). Great short-term joy, low cost.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 18, url: "https://www.amazon.com/s?k=fidget+toys+pack", best: true },
                { store: "Walmart", price: 22, url: "https://www.walmart.com/search?q=fidget+toys" },
                { store: "Target", price: 25, url: "https://www.target.com/s?searchTerm=fidget+toys", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Kinder candy",
            status: "required",
            priority: false,
            low: 5,
            high: 20,
            notes: "Fun stocking stuffer / treat; quick hit of happiness.",
            value: null,
            prices: [
                { store: "Amazon", price: 12, url: "https://www.amazon.com/s?k=kinder+chocolate+variety+pack", best: true },
                { store: "Walmart", price: 14, url: "https://www.walmart.com/search?q=kinder+chocolate" },
                { store: "Target", price: 15, url: "https://www.target.com/s?searchTerm=kinder+chocolate", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "USB flash drive for his PC",
            status: "required",
            priority: false,
            low: 8,
            high: 20,
            notes: "Practical tech; can be used for saves, mods, school stuff, etc.",
            value: null,
            prices: [
                { store: "Amazon", price: 12, url: "https://www.amazon.com/s?k=usb+flash+drive+32gb", best: true },
                { store: "Walmart", price: 15, url: "https://www.walmart.com/browse/electronics/usb-flash-drives/3944_3951_132959" },
                { store: "Target", price: 18, url: "https://www.target.com/c/usb-flash-drives/-/N-5xtak", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Pad for his bed frame (VR safety)",
            status: "required",
            priority: false,
            low: 10,
            high: 30,
            notes: "Prevents him from smacking into the bed while in VR; quiet but high-value safety/comfort.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 18, url: "https://www.amazon.com/s?k=furniture+corner+edge+protector+foam", best: true },
                { store: "Walmart", price: 22, url: "https://www.walmart.com/search?q=furniture+edge+guard" },
                { store: "Target", price: 25, url: "https://www.target.com/s?searchTerm=furniture+edge+protector", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "\"Lucas-core\" outfit",
            status: "required",
            priority: false,
            low: 40,
            high: 80,
            notes: "Full outfit that matches his style (swishy/patterned, comfy, maybe red) that he'll be excited to wear often.",
            value: null,
            prices: [
                { store: "Amazon", price: 55, url: "https://www.amazon.com/s?k=boys+athletic+outfit+joggers", best: true },
                { store: "Walmart", price: 62, url: "https://www.walmart.com/browse/clothing/boys-activewear/5438_1045803_1045806" },
                { store: "Target", price: 68, url: "https://www.target.com/c/boys-activewear/-/N-55b8c", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=400&h=400&fit=crop"
            ]
        },
        // OPTIONAL ITEMS
        {
            name: "Warm outdoor + biking gear",
            status: "optional",
            priority: false,
            low: 40,
            high: 90,
            notes: "Thermal/outerwear and gloves/hat for outdoor play & biking; useful all winter but more 'responsible parent' than hype gift.",
            value: null,
            prices: [
                { store: "Amazon", price: 55, url: "https://www.amazon.com/s?k=boys+winter+bike+gloves+thermal", best: true },
                { store: "Walmart", price: 65, url: "https://www.walmart.com/browse/clothing/boys-cold-weather-accessories/5438_1045803_1045806_9034126" },
                { store: "Target", price: 75, url: "https://www.target.com/c/boys-winter-accessories/-/N-55b89", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1609255331596-aea4af1c3c92?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Long-sleeve warm button-down shirts (2)",
            status: "optional",
            priority: false,
            low: 40,
            high: 80,
            notes: "Extra nice shirts in styles he likes; good for school/outings, but not strictly necessary.",
            value: null,
            prices: [
                { store: "Amazon", price: 48, url: "https://www.amazon.com/s?k=boys+button+down+shirts+long+sleeve", best: true },
                { store: "Walmart", price: 55, url: "https://www.walmart.com/browse/clothing/boys-dress-shirts/5438_1045803_1045806_1045807" },
                { store: "Target", price: 65, url: "https://www.target.com/c/boys-dress-shirts/-/N-55b8b", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "\"5th-grader cool\" outfit",
            status: "optional",
            priority: false,
            low: 40,
            high: 90,
            notes: "Trend-driven outfit that feels current with his peers (graphic tee/hoodie + joggers/tech pants, maybe a hat).",
            value: null,
            prices: [
                { store: "Amazon", price: 58, url: "https://www.amazon.com/s?k=boys+hoodie+joggers+outfit", best: true },
                { store: "Walmart", price: 65, url: "https://www.walmart.com/browse/clothing/boys-hoodies-sweatshirts/5438_1045803_1045806_1045818" },
                { store: "Target", price: 75, url: "https://www.target.com/c/boys-hoodies-sweatshirts/-/N-55b8e", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Updated lunchbox",
            status: "optional",
            priority: false,
            low: 15,
            high: 45,
            notes: "Everyday-use item for school; better function or cooler design, but more of a utility upgrade.",
            value: null,
            prices: [
                { store: "Amazon", price: 22, url: "https://www.amazon.com/s?k=kids+insulated+lunch+box", best: true },
                { store: "Walmart", price: 28, url: "https://www.walmart.com/browse/household-essentials/lunch-boxes-bags/1115193_1094642_4428_1436368" },
                { store: "Target", price: 32, url: "https://www.target.com/c/lunch-boxes-bags/-/N-5xta9", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Oculus gift card",
            status: "optional",
            priority: false,
            low: 25,
            high: 50,
            notes: "Lets him pick his own VR games/experiences; pure fun and very on-brand for him.",
            value: "HIGH",
            prices: [
                { store: "Amazon", price: 25, url: "https://www.amazon.com/s?k=meta+quest+gift+card", best: true },
                { store: "Target", price: 25, url: "https://www.target.com/s?searchTerm=meta+quest+gift+card" },
                { store: "Meta Store", price: 50, url: "https://www.meta.com/quest/", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Typing game (Steam or similar)",
            status: "optional",
            priority: false,
            low: 0,
            high: 30,
            notes: "Turns typing practice into a game, especially if we play versus each other.",
            value: null,
            prices: [
                { store: "Steam", price: 15, url: "https://store.steampowered.com/search/?term=typing+game", best: true },
                { store: "Amazon (Download)", price: 20, url: "https://www.amazon.com/s?k=typing+game+pc", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "PC stylus",
            status: "optional",
            priority: false,
            low: 10,
            high: 30,
            notes: "For drawing/writing on his PC if he's into art or handwriting on screen.",
            value: null,
            prices: [
                { store: "Amazon", price: 18, url: "https://www.amazon.com/s?k=pc+stylus+pen+touchscreen", best: true },
                { store: "Walmart", price: 22, url: "https://www.walmart.com/search?q=stylus+pen+pc" },
                { store: "Target", price: 25, url: "https://www.target.com/s?searchTerm=stylus+pen", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Keyboard or big desk-mat upgrade",
            status: "optional",
            priority: false,
            low: 25,
            high: 80,
            notes: "Makes his battlestation feel more 'real gamer' and encourages time at the desk in a good way.",
            value: null,
            prices: [
                { store: "Amazon", price: 42, url: "https://www.amazon.com/s?k=gaming+keyboard+or+desk+mat", best: true },
                { store: "Walmart", price: 55, url: "https://www.walmart.com/browse/electronics/gaming-keyboards/3944_3951_447913_8119671" },
                { store: "Target", price: 65, url: "https://www.target.com/c/gaming-keyboards/-/N-5xtad", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Marble run / gravity set",
            status: "optional",
            priority: false,
            low: 25,
            high: 60,
            notes: "Physics toy: building + experimenting with motion; fun and STEM-y.",
            value: null,
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=marble+run+gravity+maze", best: true },
                { store: "Walmart", price: 42, url: "https://www.walmart.com/search?q=marble+run+set" },
                { store: "Target", price: 48, url: "https://www.target.com/s?searchTerm=marble+run", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1605645405917-0b0e90db3345?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Electronics kit (Snap-circuits style)",
            status: "optional",
            priority: false,
            low: 30,
            high: 70,
            notes: "Click-together circuits to explore electricity; good long-term STEM toy.",
            value: null,
            prices: [
                { store: "Amazon", price: 45, url: "https://www.amazon.com/s?k=snap+circuits+kit", best: true },
                { store: "Walmart", price: 52, url: "https://www.walmart.com/search?q=snap+circuits" },
                { store: "Target", price: 58, url: "https://www.target.com/s?searchTerm=snap+circuits", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1581092918484-8313e1f151a3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "VR floor / center mat",
            status: "optional",
            priority: false,
            low: 20,
            high: 60,
            notes: "Defines the VR 'safe zone' and adds comfort; used every VR session.",
            value: null,
            prices: [
                { store: "Amazon", price: 35, url: "https://www.amazon.com/s?k=vr+floor+mat+play+area", best: true },
                { store: "Walmart", price: 42, url: "https://www.walmart.com/search?q=vr+mat" },
                { store: "Target", price: 48, url: "https://www.target.com/s?searchTerm=exercise+mat", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Extra wall / furniture pads",
            status: "optional",
            priority: false,
            low: 10,
            high: 25,
            notes: "Additional safety padding for corners/walls; low excitement, but prevents damage & bruises.",
            value: null,
            prices: [
                { store: "Amazon", price: 15, url: "https://www.amazon.com/s?k=wall+bumpers+furniture+pads+foam", best: true },
                { store: "Walmart", price: 18, url: "https://www.walmart.com/search?q=furniture+pads+safety" },
                { store: "Target", price: 22, url: "https://www.target.com/s?searchTerm=furniture+corner+guards", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=400&h=400&fit=crop"
            ]
        },
        {
            name: "Dip sampler",
            status: "optional",
            priority: false,
            low: 15,
            high: 40,
            notes: "Fun food 'experiment' to branch out from ketchup during nugget nights; a small family activity.",
            value: null,
            prices: [
                { store: "Amazon", price: 22, url: "https://www.amazon.com/s?k=dipping+sauce+variety+pack", best: true },
                { store: "Walmart", price: 28, url: "https://www.walmart.com/search?q=sauce+variety+pack" },
                { store: "Target", price: 32, url: "https://www.target.com/s?searchTerm=condiment+variety+pack", highend: true }
            ],
            productImages: [
                "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400&h=400&fit=crop"
            ]
        }
    ]
};

// Initialize data with defaults
Object.keys(giftData).forEach(person => {
    giftData[person].forEach(item => {
        if (!item.googleSearch) {
            item.googleSearch = `${item.name} best options`;
        }
        if (!item.rating) {
            item.rating = 0;
        }
    });
});
