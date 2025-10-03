import type { Celebrity, Brand, CelebrityBrand, Category, Tournament, TournamentOutfit } from "./schema";

// Helper function to add stylingDetails to celebrities to ensure schema compliance
const addStylingDetailsIfMissing = (celebrity: any): Celebrity => {
  if (!celebrity.stylingDetails) {
    celebrity.stylingDetails = null;
  }
  return celebrity as Celebrity;
};

const rawCelebrities = [
  {
    id: 100,
    name: "Zulqadar Rehman",
    profession: "Entrepreneur, Co-Founder/CEO of Starly",
    imageUrl: "/assets/zulqadar-rehman/profile.jpg",
    description: "Visionary founder of Starly, the revolutionary celebrity fashion discovery platform. With a background in finance at KPMG, Deloitte, and PWC, Zulqadar brings business acumen and creative vision to the fashion technology industry. NYU Stern MBA candidate specializing in entrepreneurship and digital innovation.",
    category: "Fashion Tech",
    managerInfo: {
      name: "Self-Represented",
      agency: "Starly Enterprises",
      email: "rehmanzulqadar@stern.nyu.edu",
      phone: "(424)-208-9946",
      bookingInquiries: "Available for speaking engagements, partnerships, and investment opportunities"
    },
    stylingDetails: [
      {
        occasion: "Executive Fashion",
        outfit: {
          designer: "Ralph Lauren",
          price: "$125+",
          details: "Signature navy blue button-down Ralph Lauren shirt with iconic red polo emblem, representing the perfect blend of professional elegance and entrepreneurial confidence.",
          purchaseLink: "https://www.ralphlauren.com/men-clothing-polo-shirts"
        },
        image: "/assets/brands/ralph-lauren.jpg"
      },
      {
        occasion: "Favorite Restaurant",
        outfit: {
          designer: "Cut by Wolfgang Puck",
          price: "Fine Dining",
          details: "Michelin-starred steakhouse by legendary chef Wolfgang Puck, known for premium cuts of beef, sophisticated ambiance, and exceptional service.",
          purchaseLink: "https://www.wolfgangpuck.com/dining/cut/"
        },
        image: "/assets/places/cut_wolfgang_puck.jpg"
      },
      {
        occasion: "Favorite Cities",
        outfit: {
          designer: "Global Lifestyle",
          price: "Premium",
          details: "London and Dubai - Cosmopolitan hubs blending tradition with innovation, offering unparalleled luxury experiences and cultural diversity.",
          purchaseLink: ""
        },
        image: "/assets/places/london_dubai.jpg"
      },
      {
        occasion: "Favorite Lounge",
        outfit: {
          designer: "Bungalow Santa Monica",
          price: "Exclusive",
          details: "Stylish beachfront lounge in Santa Monica offering craft cocktails, ocean views, and sophisticated atmosphere with a curated music selection.",
          purchaseLink: "https://www.thebungalow.com/"
        },
        image: "/assets/places/bungalow_santa_monica.jpg"
      },
      {
        occasion: "Luxury Fragrance",
        outfit: {
          designer: "Creed",
          price: "$450",
          details: "Creed Aventus - Iconic luxury men's fragrance with notes of blackcurrant, Italian bergamot, French apple, and royal pineapple, creating a sophisticated and distinctive scent profile.",
          purchaseLink: "https://www.creedboutique.com/products/aventus"
        },
        image: "/assets/brands/creed/aventus.jpg"
      },
      {
        occasion: "Luxury Watch",
        outfit: {
          designer: "Rolex",
          price: "$14,800+",
          details: "Rolex Datejust - Classic 41mm stainless steel timepiece with fluted bezel, representing timeless sophistication and precision engineering.",
          purchaseLink: "https://www.rolex.com/watches/datejust"
        },
        image: "/assets/brands/rolex/datejust.jpg"
      },
      {
        occasion: "Luxury Vehicle",
        outfit: {
          designer: "Lamborghini",
          price: "$225,000+",
          details: "Lamborghini Urus Performante - The ultimate Super Sport Utility Vehicle featuring a twin-turbo V8 engine with 657 HP, combining exceptional performance with luxurious Italian craftsmanship.",
          purchaseLink: "https://www.lamborghini.com/en-en/models/urus/urus-performante"
        },
        image: "/assets/brands/lamborghini/urus.jpg"
      },
      {
        occasion: "Formal Attire",
        outfit: {
          designer: "Ralph Lauren",
          price: "$1,995+",
          details: "Ralph Lauren Purple Label suit - Impeccably tailored beige suit crafted from premium Italian wool, featuring a timeless silhouette with clean lines and expert detailing for sophisticated elegance.",
          purchaseLink: "https://www.ralphlauren.com/men-clothing-suits"
        },
        image: "/assets/brands/ralph-lauren-suit.jpg"
      },
      {
        occasion: "Traditional Wear",
        outfit: {
          designer: "Junaid Jamshed",
          price: "$90",
          details: "JJK-S-34951/S25/JJ97 - Premium semi-formal kurta from New Arrivals '25 collection in cream cotton, representing traditional Pakistani elegance with contemporary styling and regular fit.",
          purchaseLink: "https://us.junaidjamshed.com/collections/men-kurta/products/jjk-s-34951-s25-jj97"
        },
        image: "/assets/brands/junaid-jamshed/kurta.jpg"
      },
      {
        occasion: "Business Casual",
        outfit: {
          designer: "Ferragamo",
          price: "$625",
          details: "Parigi New driving shoes in navy suede - Italian luxury footwear featuring hand-stitched construction, premium suede leather, and iconic Gancini hardware for sophisticated elegance.",
          purchaseLink: "https://www.ferragamo.com/shop/us/en/men/shoes-1/drivers-men/parigi-new-786963"
        },
        image: "/assets/brands/ferragamo/parigi-drivers.jpg"
      },
      {
        occasion: "Work & Travel",
        outfit: {
          designer: "Bose",
          price: "$449",
          details: "QuietComfort Ultra Headphones - Premium noise-cancelling headphones with spatial audio technology, world-class comfort, and superior sound quality for professional and travel use.",
          purchaseLink: "https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html"
        },
        image: "/assets/brands/bose/quietcomfort-ultra.jpg"
      },
      {
        occasion: "Reading & Leisure",
        outfit: {
          designer: "Rebecca Yarros",
          price: "$28.99",
          details: "Onyx Storm (The Empyrean #3) - The highly anticipated third book in the bestselling fantasy romance series featuring dragons, war college intrigue, and epic love stories.",
          purchaseLink: "https://www.amazon.com/Onyx-Storm-Empyrean-Rebecca-Yarros/dp/1649374178"
        },
        image: "/assets/brands/rebecca-yarros/onyx-storm.jpg"
      },
      {
        occasion: "Professional Career",
        outfit: {
          designer: "PwC",
          price: "Career Excellence",
          details: "PwC (PricewaterhouseCoopers) - Global leader in professional services offering transformative business insights, cutting-edge AI solutions, and unmatched expertise across consulting, audit, and tax services.",
          purchaseLink: "https://www.pwc.com/us/en/leadingedge.html"
        },
        image: "/assets/brands/pwc/professional-services.jpg"
      },
      {
        occasion: "Luxury Eyewear",
        outfit: {
          designer: "Randolph Engineering",
          price: "$299",
          details: "Aviator Military Special Edition 23K Gold - Authentic military-grade sunglasses worn by U.S. pilots for 40+ years, featuring jewelry-quality 23K gold finish and American Gray lenses.",
          purchaseLink: "https://www.randolphusa.com/products/aviator-military-special-edition-23k-gold"
        },
        image: "/assets/brands/randolph/aviator-gold.jpg"
      },
      {
        occasion: "Skincare Routine",
        outfit: {
          designer: "Kiehl's",
          price: "$57",
          details: "Midnight Recovery Concentrate - Luxurious botanical face oil featuring evening primrose oil and lavender essential oil for overnight skin renewal, reducing signs of aging and promoting healthy-looking skin.",
          purchaseLink: "https://www.kiehls.com/skincare/face-oils/midnight-recovery-concentrate-moisturizing-face-oil-serum/819.html"
        },
        image: "/assets/brands/kiehls/midnight-recovery.jpg"
      },
      {
        occasion: "Golf Course",
        outfit: {
          designer: "Titleist",
          price: "$1,897",
          details: "T100 Tour-Level Precision Iron Set - Premium forged irons featuring minimalistic design and championship performance. Used by PGA Tour professionals for ultimate precision and feel on the golf course.",
          purchaseLink: "https://www.titleist.com/golf-clubs/irons/t100"
        },
        image: "/assets/brands/titleist/t100-irons.jpg"
      }
    ]
  },


  {
    id: 41,
    name: "Mahira Khan",
    profession: "Actress, Producer, Fashion Icon",
    imageUrl: "/assets/image_1754012580228.png",
    description: "Pakistan's leading actress and fashion icon, known for her roles in hit dramas like 'Humsafar' and films like 'Raees'. Recognized for her elegant style and influential presence in Pakistani entertainment industry.",
    category: "Entertainment",
    managerInfo: {
      name: "Mahira Khan Management",
      agency: "Independent Artist",
      email: "info@mahirakhan.com",
      phone: "+92 21 1234 5678",
      bookingInquiries: "For brand collaborations and acting projects, please contact through official management with detailed proposals."
    }
  },
  {
    id: 42,
    name: "Ahmed Ali Akbar",
    profession: "Actor, Director, Writer",
    imageUrl: "/assets/image_1754012611587.png",
    description: "Versatile Pakistani actor known for his powerful performances in dramas like 'Parizaad' and 'Ehd-e-Wafa'. Recognized for his method acting and sophisticated personal style that blends traditional and contemporary fashion.",
    category: "Entertainment",
    managerInfo: {
      name: "Ahmed Ali Akbar Productions",
      agency: "Independent Artist",
      email: "contact@ahmedaliakbar.com",
      phone: "+92 21 9876 5432",
      bookingInquiries: "Available for acting projects, brand endorsements, and creative collaborations. Please contact with detailed project information."
    }
  },
  {
    id: 43,
    name: "Ayeza Khan",
    profession: "Actress, Model, Fashion Icon",
    imageUrl: "/assets/ayeza-khan/profile.jpg",
    description: "One of Pakistan's most popular television actresses, known for her versatile performances and impeccable fashion sense. Recognized as one of the highest-paid actresses in Pakistani drama industry.",
    category: "Fashion",
    managerInfo: {
      name: "Ayeza Khan Management",
      agency: "AK Productions",
      email: "info@ayezakhan.com",
      phone: "+92 21 35667895",
      bookingInquiries: "For drama projects, endorsements, and fashion collaborations, contact AK Productions."
    },
    stylingDetails: [
      {
        occasion: "Drama Serial Fashion",
        outfit: {
          designer: "Maria B, Sana Safinaz",
          price: "$400-$1,500",
          details: "Elegant traditional and contemporary Pakistani outfits for television drama appearances"
        },
        image: "/assets/ayeza-khan/drama.jpg"
      },
      {
        occasion: "Award Shows",
        outfit: {
          designer: "HSY, Faraz Manan",
          price: "$800-$2,800",
          details: "Glamorous gowns and sophisticated formal wear for entertainment industry events"
        },
        image: "/assets/ayeza-khan/awards.jpg"
      },
      {
        occasion: "Fashion Events",
        outfit: {
          designer: "Zara Shahjahan, Elan",
          price: "$500-$2,000",
          details: "Designer wear and high-fashion outfits for fashion week and style events"
        },
        image: "/assets/ayeza-khan/fashion.jpg"
      }
    ]
  },
























  {
    id: 36,
    name: "Frazay Akbar",
    profession: "Fashion Influencer, Social Media Personality",
    imageUrl: "/assets/image_1754013029728.png",
    description: "Rising fashion influencer and social media personality known for her elegant, feminine style featuring floral prints, delicate jewelry, and sophisticated casual wear. Active on Instagram (@frazay), she showcases contemporary fashion trends with a focus on romantic, travel-inspired aesthetics and collaborates with fashion brands to inspire her growing community of followers.",
    category: "Social Media Influencer",
    managerInfo: {
      name: "Digital Talent Management",
      agency: "Independent",
      email: "collaborations@frazayakbar.com",
      phone: "+1 XXX XXX XXXX",
      bookingInquiries: "For brand partnerships, fashion collaborations, and content creation opportunities, please contact through direct Instagram message @frazay or email with campaign details and collaboration terms."
    },
    stylingDetails: [
      {
        occasion: "Instagram Fashion Content",
        outfit: {
          designer: "Contemporary Fashion Mix",
          price: "$100-500",
          details: "Curated mix of affordable and mid-range fashion pieces including statement accessories, trendy outerwear, and versatile basics that resonate with her audience",
          purchaseLink: "https://www.instagram.com/frazay/"
        },
        image: "/assets/image_1754010696522.png"
      },
      {
        occasion: "Brand Collaboration Events",
        outfit: {
          designer: "Brand Partnership Styling",
          price: "$200-800",
          details: "Professional yet trendy outfits for brand events, product launches, and fashion shows, maintaining her personal style while representing partner brands",
          purchaseLink: ""
        },
        image: "/assets/image_1754010696522.png"
      },
      {
        occasion: "Casual Street Style",
        outfit: {
          designer: "Accessible Fashion",
          price: "$50-300",
          details: "Everyday fashion choices that inspire followers with achievable looks combining high-street and boutique pieces for authentic personal style",
          purchaseLink: ""
        },
        image: "/assets/image_1754010696522.png"
      }
    ]
  },
  {
    id: 38,
    name: "Hania Amir",
    profession: "Actress, Model",
    imageUrl: "/assets/image_1754013723953.png",
    description: "One of Pakistan's most popular young actresses known for her versatile acting in both television dramas and films. With her natural charm and talent, Hania has become a household name and style icon, particularly popular among young audiences.",
    category: "Entertainment",
    managerInfo: {
      name: "Star Management Group",
      agency: "Independent",
      contact: "management@haniamir.com"
    },
    socialMedia: {
      instagram: "@haniaheheofficial",
      twitter: "@realhaniaamir",
      youtube: ""
    },
    careerHighlights: [
      "Lead roles in popular Pakistani dramas",
      "Award-winning film performances",
      "Brand ambassador for major Pakistani brands",
      "Social media influencer with millions of followers"
    ],
    personalStyle: "Modern Pakistani chic with contemporary international influences",
    stylingDetails: [
      {
        occasion: "Drama Serial Shoots",
        outfit: {
          designer: "Pakistani Designer Wear",
          price: "$200-800",
          details: "Elegant Pakistani outfits including modern lawn suits, designer kurtas, and contemporary eastern wear for television roles",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1494790108755-2616c95-24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Film Premieres & Events",
        outfit: {
          designer: "High Fashion Pakistani & International",
          price: "$1,000-3,000",
          details: "Glamorous gowns, designer Pakistani formal wear, and international fashion pieces for red carpet events and film premieres",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1494790108755-2616c95-24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Social Media Content",
        outfit: {
          designer: "Trendy Contemporary",
          price: "$100-500",
          details: "Stylish casual wear, trendy outfits, and fashionable pieces perfect for Instagram content and daily social media posts",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1494790108755-2616c95-24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: 39,
    name: "Fawad Khan",
    profession: "Actor, Singer, Model",
    imageUrl: "/assets/image_1754012676476.png",
    description: "Pakistan's leading actor and former musician who has achieved success in both Pakistani and Indian entertainment industries. Known for his sophisticated style, charismatic screen presence, and versatile acting, Fawad is considered one of the most handsome and talented actors in South Asian cinema.",
    category: "Entertainment",
    managerInfo: {
      name: "Elite Artist Management",
      agency: "Independent",
      contact: "management@fawadkhan.com"
    },
    socialMedia: {
      instagram: "",
      twitter: "",
      youtube: ""
    },
    careerHighlights: [
      "Lead actor in critically acclaimed Pakistani dramas",
      "Bollywood film success in India",
      "Former lead singer of rock band EP",
      "Multiple award winner for acting excellence"
    ],
    personalStyle: "Sophisticated gentleman with impeccable tailoring and classic elegance",
    stylingDetails: [
      {
        occasion: "Film Shoots & Acting Projects",
        outfit: {
          designer: "Character-Specific Styling",
          price: "$500-2,000",
          details: "Versatile wardrobe ranging from contemporary casual to period costumes, tailored specifically for film and television roles",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Award Ceremonies & Galas",
        outfit: {
          designer: "Luxury Pakistani & International Designers",
          price: "$1,500-4,000",
          details: "Impeccably tailored tuxedos, elegant sherwanis, and sophisticated formal wear for prestigious award shows and gala events",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Personal Appearances",
        outfit: {
          designer: "Smart Sophisticated Casual",
          price: "$300-1,000",
          details: "Well-fitted blazers, quality shirts, and refined casual wear that maintains his gentleman image in public appearances",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: 142,
    name: "Priyanka Chopra",
    profession: "Actress, Singer, Producer, Philanthropist",
    imageUrl: "/assets/priyanka-chopra/profile.png",
    description: "Global superstar who seamlessly transitioned from Bollywood to Hollywood, becoming one of the most influential fashion icons of her generation. Known for her impeccable red carpet style, haute couture choices, and ability to blend traditional Indian elegance with contemporary international fashion. As a Goodwill Ambassador and entrepreneur, she represents modern luxury and sophisticated glamour.",
    category: "High Fashion",
    managerInfo: {
      name: "Anjula Acharia",
      agency: "DesiHits Entertainment",
      email: "management@priyankachopra.com",
      phone: "(212) 555-0142",
      bookingInquiries: "Available for fashion campaigns, film projects, and international appearances"
    },
    stylingDetails: [
      {
        occasion: "Red Carpet & Film Premieres",
        outfit: {
          designer: "Valentino, Versace, Sabyasachi",
          price: "$5,000-25,000",
          details: "Stunning haute couture gowns featuring intricate beadwork, dramatic silhouettes, and luxurious fabrics. Known for making bold fashion statements that blend Eastern and Western aesthetics.",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1594736797933-d0301ba9d97a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Met Gala & Award Shows",
        outfit: {
          designer: "Custom Couture Houses",
          price: "$15,000-50,000",
          details: "Show-stopping custom creations featuring avant-garde designs, precious embellishments, and architectural silhouettes that consistently earn best-dressed honors.",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1551804447-5dd934c3a7f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "International Fashion Events",
        outfit: {
          designer: "Giorgio Armani, Elie Saab, Manish Malhotra",
          price: "$3,000-15,000",
          details: "Sophisticated cocktail dresses and elegant separates showcasing global luxury brands, often featuring cultural fusion elements that celebrate her Indian heritage.",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1551804447-5dd934c3a7f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Luxury Brand Collaborations",
        outfit: {
          designer: "Bulgari, Chopard, Christian Louboutin",
          price: "$2,000-10,000",
          details: "Exquisite jewelry pieces, luxury handbags, and designer accessories that complement her status as a global ambassador for premium lifestyle brands.",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: 143,
    name: "Kim Kardashian",
    profession: "Reality TV Star, Entrepreneur, Fashion Icon",
    imageUrl: "/assets/kim-kardashian.png",
    description: "Global fashion and beauty mogul who revolutionized shapewear and skincare industries. Founder of SKIMS shapewear, SKKN BY KIM skincare line, and KKW Fragrance. Known for her influential red carpet style, Met Gala appearances, and business acumen. With over 350 million social media followers, she sets trends in luxury fashion, beauty standards, and entrepreneurial success.",
    category: "High Fashion",
    managerInfo: {
      name: "Kris Jenner",
      agency: "Jenner Communications",
      email: "management@kimkardashian.com",
      phone: "(310) 555-0143",
      bookingInquiries: "For business partnerships, fashion campaigns, and appearance bookings, contact Jenner Communications with detailed proposals."
    },
    stylingDetails: [
      {
        occasion: "Met Gala & Award Shows",
        outfit: {
          designer: "Balenciaga, Versace, Thierry Mugler",
          price: "$25,000-100,000",
          details: "Iconic custom haute couture gowns and avant-garde pieces that consistently dominate fashion headlines. Known for bold, curve-hugging silhouettes and show-stopping metallics.",
          purchaseLink: ""
        },
        image: "/assets/kim-kardashian-looks/met-gala-and-jungle-event.png"
      },
      {
        occasion: "Business Meetings & SKIMS Events",
        outfit: {
          designer: "SKIMS, Bottega Veneta, The Row",
          price: "$1,000-5,000",
          details: "Sophisticated business casual featuring her own SKIMS shapewear foundation with luxury blazers, tailored pants, and minimalist accessories for a powerful yet feminine aesthetic.",
          purchaseLink: "https://skims.com/"
        },
        image: "/assets/kim-kardashian/fashion/skims-bodysuit.png"
      },
      {
        occasion: "Red Carpet Events",
        outfit: {
          designer: "Balmain, Tom Ford, Rick Owens",
          price: "$15,000-50,000",
          details: "Glamorous evening wear featuring form-fitting gowns, dramatic trains, and statement jewelry. Known for championing emerging designers and vintage couture pieces.",
          purchaseLink: ""
        },
        image: "/assets/kim-kardashian/fashion-favorites/preferred-designers-new.png"
      },
      {
        occasion: "Street Style & Daily Wear",
        outfit: {
          designer: "Yeezy, Balenciaga, Chrome Hearts",
          price: "$500-3,000",
          details: "Trend-setting casual looks featuring oversized blazers, leather pants, statement sneakers, and luxury accessories that influence global street style movements.",
          purchaseLink: ""
        },
        image: "/assets/kim-kardashian-looks/met-gala-and-jungle-event.png"
      },
      {
        occasion: "Beauty & Skincare Routine",
        outfit: {
          designer: "SKKN BY KIM",
          price: "$29-95",
          details: "Complete skincare regimen featuring cleanser, toner, serums, and moisturizers from her own premium beauty line focused on clean, effective formulations.",
          purchaseLink: "https://skkn.com/"
        },
        image: "/assets/kim-kardashian/skkn/cleanser.png"
      },
      {
        occasion: "Luxury Accessories",
        outfit: {
          designer: "Manolo Blahnik, Hermès, Cartier",
          price: "$1,200-25,000",
          details: "Exquisite designer heels, luxury handbags, and statement jewelry pieces including her famous diamond collections and custom Cartier pieces.",
          purchaseLink: ""
        },
        image: "/assets/kim-kardashian/fashion/manolo-blahnik-heels.png"
      }
    ]
  },
  {
    id: 160,
    name: "Katrina Kaif",
    profession: "Bollywood Actress, Kay Beauty Co-founder, Global Brand Ambassador",
    imageUrl: "/assets/katrina-kaif/profile.jpg",
    description: "One of Bollywood's highest-paid actresses and most influential brand ambassadors. Co-founder of Kay Beauty and global ambassador for luxury brands like Rado. Commands Rs 7 crores per endorsement deal.",
    category: "Entertainment",
    managerInfo: {
      name: "Katrina Kaif Management",
      agency: "Excel Entertainment",
      email: "management@katrinakaif.com", 
      phone: "+91 22 6666-0160",
      bookingInquiries: "For film projects, brand endorsements, and commercial partnerships."
    },
    stylingDetails: [
      {
        occasion: "Red Carpet Events",
        outfit: {
          designer: "Sabyasachi, Manish Malhotra, Tarun Tahiliani",
          price: "$2,000-15,000",
          details: "Exquisite Indian designer wear including lehengas, sarees, and gowns with intricate embroidery and premium fabrics for award ceremonies and film premieres.",
          purchaseLink: "https://www.sabyasachi.com/"
        },
        image: "/assets/katrina-kaif/red-carpet.jpg"
      },
      {
        occasion: "Brand Ambassador - Rado Watches",
        outfit: {
          designer: "Rado Swiss Watches",
          price: "$1,200-8,000",
          details: "Global ambassador for Swiss luxury watchmaker Rado, featuring the Centrix collection with elegant timepieces that blend innovation with timeless design.",
          purchaseLink: "https://www.rado.com/"
        },
        image: "/assets/katrina-kaif/rado-campaign.jpg"
      },
      {
        occasion: "Kay Beauty - Own Brand",
        outfit: {
          designer: "Kay Beauty by Katrina",
          price: "$15-85",
          details: "Co-founder of Kay Beauty cosmetics brand with Nykaa, featuring inclusive makeup products designed for Indian skin tones with international quality standards.",
          purchaseLink: "https://www.kaybeauty.in/"
        },
        image: "/assets/katrina-kaif/kay-beauty.jpg"
      },
      {
        occasion: "UNIQLO Global Campaign",
        outfit: {
          designer: "UNIQLO",
          price: "$20-150",
          details: "First Indian Global Brand Ambassador for Japanese fashion retailer UNIQLO, promoting their LifeWear philosophy of simple, high-quality, innovative clothing.",
          purchaseLink: "https://www.uniqlo.com/"
        },
        image: "/assets/katrina-kaif/uniqlo-campaign.jpg"
      },
      {
        occasion: "Fitness & Wellness - Reebok",
        outfit: {
          designer: "Reebok",
          price: "$50-200",
          details: "Brand ambassador for Reebok sportswear, promoting active lifestyle and fitness fashion with performance-driven athletic wear and sneakers.",
          purchaseLink: "https://www.reebok.com/"
        },
        image: "/assets/katrina-kaif/reebok-fitness.jpg"
      }
    ]
  },
  {
    id: 177,
    name: "Ariana Grande",
    profession: "Singer, Actress, R.E.M. Beauty Founder",
    imageUrl: "/assets/ariana-grande/profile.jpg",
    description: "Grammy-winning pop superstar and entrepreneur. Founded R.E.M. Beauty, brand ambassador for Swarovski, and one of the most influential artists in music and fashion with over 250 million social media followers.",
    category: "Entertainment",
    managerInfo: {
      name: "Scooter Braun Management",
      agency: "SB Projects",
      email: "booking@arianagrande.com",
      phone: "+1 323 555-0177",
      bookingInquiries: "For music collaborations, brand partnerships, and entertainment appearances."
    },
    stylingDetails: [
      {
        occasion: "Swarovski Brand Ambassador",
        outfit: {
          designer: "Swarovski x Ariana Grande Collection",
          price: "$50-500",
          details: "Co-created capsule collection with Global Creative Director featuring earrings, necklaces, and jewelry accessories inspired by Old Hollywood glamour for the 2024 Holiday campaign.",
          purchaseLink: "https://www.swarovski.com/"
        },
        image: "/assets/ariana-grande/swarovski-campaign.jpg"
      },
      {
        occasion: "R.E.M. Beauty - Own Brand",
        outfit: {
          designer: "R.E.M. Beauty by Ariana Grande",
          price: "$16-65",
          details: "Vegan cosmetics line available exclusively at Ulta with 60+ foundation shades, lip makeup, eye makeup, face products, and skincare expanding since 2021.",
          purchaseLink: "https://www.ulta.com/brand/rem-beauty"
        },
        image: "/assets/ariana-grande/rem-beauty.jpg"
      },
      {
        occasion: "Red Carpet & Awards",
        outfit: {
          designer: "Givenchy, Versace, Valentino",
          price: "$5,000-50,000",
          details: "Signature high ponytail with designer gowns featuring dramatic silhouettes, often in soft pastels or classic black. Known for elegant ballgowns and sophisticated couture pieces.",
          purchaseLink: ""
        },
        image: "/assets/ariana-grande/red-carpet.jpg"
      },
      {
        occasion: "Street Style & Casual",
        outfit: {
          designer: "Thom Browne, Marc Jacobs, Custom Pieces",
          price: "$200-2,000",
          details: "Signature oversized hoodies, thigh-high boots, mini skirts, and crop tops. Known for girly yet edgy aesthetic mixing luxury pieces with accessible fashion.",
          purchaseLink: ""
        },
        image: "/assets/ariana-grande/street-style.jpg"
      },
      {
        occasion: "Music Videos & Performances",
        outfit: {
          designer: "Custom Stage Costumes, Moschino",
          price: "$1,000-15,000",
          details: "Bold performance outfits featuring sparkles, pastels, and dramatic silhouettes. Often incorporates space-age and retro-futuristic elements with signature cat-eye makeup.",
          purchaseLink: ""
        },
        image: "/assets/ariana-grande/performance.jpg"
      }
    ]
  },
  {
    id: 178,
    name: "Aishwarya Rai Bachchan",
    profession: "Bollywood Actress, Former Miss World, Global Brand Ambassador",
    imageUrl: "/assets/aishwarya-rai/profile.jpg",
    description: "Former Miss World and Bollywood superstar with 20+ year career. Global ambassador for L'Oréal Paris and Longines. Commands ₹6-7 crores per endorsement and has ₹900 crore net worth. Cannes Film Festival regular.",
    category: "Entertainment",
    managerInfo: {
      name: "Celebrity Management Associates",
      agency: "Aishwarya Rai Management",
      email: "management@aishwaryarai.com",
      phone: "+91 22 6666-0178",
      bookingInquiries: "For film projects, luxury brand endorsements, and international appearances."
    },
    stylingDetails: [
      {
        occasion: "L'Oréal Paris Global Ambassador",
        outfit: {
          designer: "L'Oréal Paris Beauty",
          price: "$15-85",
          details: "Global ambassador for over 20 years representing complete beauty range from skincare to makeup. Recently walked L'Oréal Paris Fashion Week runway in red Mossi gown.",
          purchaseLink: "https://www.lorealparisusa.com/"
        },
        image: "/assets/aishwarya-rai/loreal-campaign.jpg"
      },
      {
        occasion: "Longines Ambassador of Elegance",
        outfit: {
          designer: "Longines Swiss Watches",
          price: "$1,500-25,000",
          details: "Ambassador for 22+ years since 1999. In 2019, Longines released special DolceVita Elegance Celebration timepiece dedicated to Aishwarya for their 20th anniversary.",
          purchaseLink: "https://www.longines.com/"
        },
        image: "/assets/aishwarya-rai/longines-campaign.jpg"
      },
      {
        occasion: "Cannes Film Festival",
        outfit: {
          designer: "Roberto Cavalli, Armani Privé, Ashi Studio",
          price: "$10,000-100,000",
          details: "Cannes red carpet mainstay known for butterfly-inspired gowns, intricate embroidery, and dramatic silhouettes. Famous for viral lavender lipstick and couture masterpieces.",
          purchaseLink: ""
        },
        image: "/assets/aishwarya-rai/cannes-looks.jpg"
      },
      {
        occasion: "Indian Designer Wear",
        outfit: {
          designer: "Sabyasachi, Manish Malhotra, Abu Jani Sandeep Khosla",
          price: "$2,000-50,000",
          details: "Exquisite traditional Indian wear including handwoven sarees, lehengas with intricate embroidery, and contemporary Indo-western fusion pieces for cultural events.",
          purchaseLink: ""
        },
        image: "/assets/aishwarya-rai/indian-designer.jpg"
      },
      {
        occasion: "Kalyan Jewellers & Luxury",
        outfit: {
          designer: "Kalyan Jewellers, De Beers Diamonds",
          price: "$5,000-500,000",
          details: "Brand ambassador for premium jewelry showcasing exquisite craftsmanship, heritage pieces, and luxury diamond collections reinforcing elegance and sophistication.",
          purchaseLink: "https://www.kalyanjewellers.net/"
        },
        image: "/assets/aishwarya-rai/jewelry-campaign.jpg"
      }
    ]
  }
];

// Export the rawCelebrities directly for use in the server
export const rawCelebritiesExport = rawCelebrities;

// Apply the helper function to ensure all celebrities have stylingDetails property
export const mockCelebrities: Celebrity[] = rawCelebrities.map(addStylingDetailsIfMissing);

export const mockCategories: Category[] = [
  { id: 1, name: "On-Court Style", description: "Professional tennis attire and equipment", imageUrl: "/assets/categories/on-court-style.jpg" },
  { id: 2, name: "Training Gear", description: "Athletic training and fitness equipment", imageUrl: "/assets/categories/training-gear.jpg" },
  { id: 3, name: "Red Carpet", description: "Formal and luxury fashion for special events", imageUrl: "/assets/categories/red-carpet.jpg" },
  { id: 4, name: "High Fashion", description: "Designer fashion and haute couture", imageUrl: "/assets/categories/high-fashion.jpg" },
  { id: 5, name: "Street Style", description: "Casual and everyday fashion", imageUrl: "/assets/categories/street-style.jpg" },
  { id: 6, name: "Accessories", description: "Jewelry, watches, and luxury accessories", imageUrl: "/assets/categories/accessories.jpg" },
  { id: 7, name: "Sports Equipment", description: "Professional sports gear and equipment", imageUrl: "/assets/categories/sports-equipment.jpg" },
  { id: 8, name: "Lifestyle", description: "Lifestyle products and personal items", imageUrl: "/assets/categories/lifestyle.jpg" },
  { id: 9, name: "Luxury Lifestyle", description: "Premium lifestyle and luxury goods", imageUrl: "/assets/categories/luxury-lifestyle.jpg" },
  { id: 10, name: "Beauty", description: "Beauty products and cosmetics", imageUrl: "/assets/categories/beauty.jpg" }
];

export const mockBrands: Brand[] = [
  {
    id: 71,
    name: "Lamborghini",
    imageUrl: "/assets/lamborghini-logo.png",
    description: "Italian luxury sports car and SUV manufacturer known for exotic design and extreme performance.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 72,
    name: "Junaid Jamshed",
    imageUrl: "/assets/junaid-jamshed-logo.png",
    description: "Leading Pakistani fashion brand known for premium menswear, traditional kurtas, and contemporary Islamic fashion with exceptional quality and authentic craftsmanship.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 73,
    name: "Ferragamo",
    imageUrl: "/assets/ferragamo-logo.png",
    description: "Italian luxury fashion house renowned for its exceptional leather craftsmanship, elegant footwear, and sophisticated accessories since 1927.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 74,
    name: "Bose",
    imageUrl: "/assets/bose-logo.png",
    description: "American audio equipment manufacturer renowned for premium headphones, speakers, and sound systems with cutting-edge noise cancellation technology.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 75,
    name: "Rebecca Yarros",
    imageUrl: "/assets/rebecca-yarros-logo.png",
    description: "Bestselling American author renowned for contemporary romance and fantasy novels, including the viral sensation The Empyrean series featuring dragons and military academies.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 76,
    name: "PwC",
    imageUrl: "/assets/pwc-logo.png",
    description: "Global professional services network and one of the Big Four accounting firms, providing audit, consulting, tax, and advisory services with cutting-edge AI and technology solutions.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 77,
    name: "Randolph Engineering",
    imageUrl: "/assets/randolph-logo.png",
    description: "American luxury eyewear manufacturer renowned for military-grade aviator sunglasses, handcrafted in Massachusetts since 1973 with precision engineering and premium materials.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 78,
    name: "Kiehl's",
    imageUrl: "/assets/kiehls-logo.png",
    description: "Historic New York apothecary and luxury skincare brand since 1851, renowned for science-backed formulations and premium botanical ingredients trusted by celebrities and skincare enthusiasts worldwide.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 79,
    name: "Titleist",
    imageUrl: "/assets/titleist-logo.png",
    description: "Premium golf equipment manufacturer and global leader in golf balls, golf clubs, and accessories. Trusted by Tour professionals worldwide for championship-level performance and precision engineering.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 70,
    name: "Creed",
    imageUrl: "/assets/creed-logo.png",
    description: "Luxury French perfume house founded in 1760, known for creating exclusive fragrances using ancient infusion techniques and the finest natural ingredients.",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 80,
    name: "Netflix Kids",
    imageUrl: "/assets/netflix-kids-logo.png",
    description: "Leading streaming platform for educational children's content, featuring original series and educational programming that supports early childhood development and learning.",
    celebWearers: []
  },
  {
    id: 81,
    name: "Fisher-Price",
    imageUrl: "/assets/fisher-price-logo.png",
    description: "American toy company and subsidiary of Mattel, specializing in educational toys and learning materials for infants and young children since 1930.",
    celebWearers: []
  },
  {
    id: 82,
    name: "Melissa & Doug",
    imageUrl: "/assets/melissa-doug-logo.png",
    description: "American toy company known for creative, imaginative play products and educational toys that inspire hands-on, screen-free fun for children.",
    celebWearers: []
  },
  {
    id: 83,
    name: "YouTube Kids",
    imageUrl: "/assets/youtube-kids-logo.png",
    description: "Google's video sharing platform designed specifically for children, providing educational content and entertainment in a safe, controlled environment for young learners.",
    celebWearers: []
  },
  {
    id: 34,
    name: "Chanel",
    description: "Iconic French luxury fashion house known for timeless designs, the little black dress, and the No.5 perfume, representing unparalleled elegance and sophistication.",
    imageUrl: "https://images.unsplash.com/photo-1512646605205-78422b7c7896?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 35,
    name: "Christian Louboutin",
    description: "French luxury footwear and fashion designer renowned for his signature red-soled shoes and exceptional craftsmanship in high-end accessories.",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 32,
    name: "Gucci",
    description: "Italian luxury fashion house known for innovative designs, exquisite craftsmanship, and iconic accessories that define modern luxury.",
    imageUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 33,
    name: "IWC Schaffhausen",
    description: "Swiss luxury watch manufacturer known for precision timepieces with sophisticated design and innovative complications.",
    imageUrl: "https://images.unsplash.com/photo-1548171632-c19010beba5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Chris"]
  },
  {
    id: 1,
    name: "Wilson",
    description: "Leading tennis equipment manufacturer providing racquets for many top players, known for their quality and performance technology.",
    imageUrl: "https://images.unsplash.com/photo-1617080890991-aedcc6ac2bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "S"]
  },
  {
    id: 2,
    name: "Nike",
    description: "Global sportswear giant that sponsors many elite tennis players with cutting-edge performance apparel and footwear.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "S", "C", "Cristiano"]
  },
  {
    id: 3,
    name: "Rolex",
    description: "Prestigious Swiss luxury watch manufacturer with a long history of sponsoring tennis tournaments and brand ambassadors.",
    imageUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "M", "C"]
  },
  {
    id: 4,
    name: "Adidas",
    description: "German sportswear company providing performance tennis apparel and footwear with advanced technology.",
    imageUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["A", "M", "S"]
  },
  {
    id: 5,
    name: "Uniqlo",
    description: "Japanese casual wear designer and manufacturer known for simple, high-quality basics and performance sportswear.",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "K"]
  },
  {
    id: 6,
    name: "Babolat",
    description: "French tennis equipment company specializing in racquets, strings, and accessories used by many top professionals.",
    imageUrl: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "D", "T"]
  },
  {
    id: 7,
    name: "Lacoste",
    description: "French clothing company founded by tennis player René Lacoste, known for their iconic crocodile logo and tennis heritage.",
    imageUrl: "https://images.unsplash.com/photo-1565115021788-6d3f1ade4980?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["V", "T"]
  },
  {
    id: 8,
    name: "Yonex",
    description: "Japanese sports equipment manufacturer specializing in tennis, badminton and golf products with innovative technology.",
    imageUrl: "https://images.unsplash.com/photo-1625911731261-e2398b20716f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["A", "D"]
  },
  {
    id: 9,
    name: "Louis Vuitton",
    description: "French luxury fashion house and company that tennis stars often choose for their off-court formal appearances.",
    imageUrl: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["R", "S", "M", "C"]
  },
  {
    id: 10,
    name: "Atelier Jolie",
    description: "Angelina Jolie's sustainable fashion collective focused on ethical production, creating employment opportunities for refugees, and emphasizing environmentally conscious design.",
    imageUrl: "https://images.unsplash.com/photo-1524749292158-7540c2494485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["A"]
  },
  {
    id: 11,
    name: "Jacob & Co.",
    description: "Luxury watch and jewelry brand known for its extraordinary timepieces and exceptional diamonds, popular among athletes and celebrities.",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["C", "F"]
  },
  {
    id: 12,
    name: "Khaadi",
    description: "Leading Pakistani fashion brand known for its ethnic wear, fusion collections and textile excellence with a contemporary design philosophy.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Khaadi_logo.jpg/220px-Khaadi_logo.jpg",
    celebWearers: ["H"]
  },
  {
    id: 13,
    name: "HSY",
    description: "Luxury Pakistani fashion house founded by Hassan Sheheryar Yasin, specializing in couture, bridal wear, and formal menswear.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/PFDC_Sunsilk_Fashion_Week_2011_HSY_Lawn.jpg/1024px-PFDC_Sunsilk_Fashion_Week_2011_HSY_Lawn.jpg",
    celebWearers: ["H", "I"]
  },
  {
    id: 14,
    name: "Adidas Cricket",
    description: "Cricket equipment line from the global sportswear giant, providing professional cricket gear including bats, pads, gloves and apparel.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    celebWearers: ["S", "I"]
  },
  {
    id: 15,
    name: "Amir Khan Boxing Academy",
    description: "Boxing equipment and training gear associated with Amir Khan's boxing academy, promoting boxing through quality equipment and apparel.",
    imageUrl: "https://i2-prod.mirror.co.uk/incoming/article27116290.ece/ALTERNATES/s615/0_FBL-PAK-AKA.jpg",
    celebWearers: ["A"]
  },
  {
    id: 16,
    name: "Sapphire",
    description: "Pakistani ready-to-wear fashion brand known for its seasonal collections combining traditional aesthetics with modern design sensibilities.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/Sapphire_%28clothing_brand%29_Logo.jpg/800px-Sapphire_%28clothing_brand%29_Logo.jpg",
    celebWearers: ["H"]
  },
  {
    id: 17,
    name: "CA Sports",
    description: "Leading cricket equipment manufacturer from Pakistan providing professional cricket gear to international players and teams.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Cricket_bat.jpg/800px-Cricket_bat.jpg",
    celebWearers: ["S", "I"]
  },
  {
    id: 18,
    name: "SKIMS",
    description: "Kim Kardashian's shapewear and loungewear brand known for inclusive sizing and innovative fabrics designed to enhance silhouettes.",
    imageUrl: "https://images.unsplash.com/photo-1609748507255-66516aa6a9c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 19,
    name: "Kylie Cosmetics",
    description: "Kylie Jenner's beauty empire featuring lip kits, eyeshadows, and skincare with a focus on bold colors and luxury packaging.",
    imageUrl: "https://images.unsplash.com/photo-1599305090951-836474229666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 20,
    name: "Good American",
    description: "Khloe Kardashian's inclusive denim and apparel brand offering sizes 00-24 with designs that celebrate all body types.",
    imageUrl: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Khloe"]
  },
  {
    id: 21,
    name: "818 Tequila",
    description: "Kendall Jenner's premium tequila brand crafted from 100% Weber Blue agaves and featuring multiple award-winning varieties.",
    imageUrl: "https://images.unsplash.com/photo-1592485287707-5edd3f6765de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 24,
    name: "Giorgio Armani",
    description: "Luxury Italian fashion house known for elegant, tailored menswear and red carpet attire favored by Hollywood's elite.",
    imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 25,
    name: "Ray-Ban",
    description: "Iconic eyewear brand known for timeless designs like the Aviator and Wayfarer, popular among celebrities for both function and style.",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 40,
    name: "CR7",
    description: "Premium lifestyle brand offering clothing, footwear, fragrances, and accessories that reflect modern style and commitment to excellence.",
    imageUrl: "https://images.unsplash.com/photo-1551854336-cacde78bacb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 26,
    name: "Burberry",
    description: "Luxury British fashion house known for its signature check pattern and timeless designs combining heritage with modern creativity.",
    imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 27,
    name: "Being Human",
    description: "Fashion and lifestyle brand founded by Salman Khan that combines style with philanthropy, donating profits to charitable causes.",
    imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Salman"]
  },
  {
    id: 28,
    name: "KKW Fragrance",
    description: "Kim Kardashian West's fragrance line featuring luxury scents in unique crystal-inspired packaging.",
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 29,
    name: "Rolls-Royce",
    description: "British ultra-luxury automobile manufacturer known for handcrafted vehicles offering the pinnacle of refinement and status.",
    imageUrl: "https://images.unsplash.com/photo-1632548260498-b7246fa466ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 30,
    name: "Balenciaga",
    description: "Luxury fashion house known for its avant-garde designs, architectural shapes, and innovative approach to haute couture.",
    imageUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 31,
    name: "SKKN BY KIM",
    description: "Kim Kardashian's premium skincare line featuring clean, sustainable products with minimalist packaging and high-quality formulations.",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 36,
    name: "Tag Heuer",
    description: "Swiss luxury watchmaker known for its high-precision timepieces, sports chronographs, and long-standing association with motorsports and elite athletes.",
    imageUrl: "https://images.unsplash.com/photo-1524592094857-b06aef4717da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 37,
    name: "Dunhill",
    description: "British luxury goods brand known for men's ready-to-wear, custom tailoring, leather goods, and distinguished fragrances with sophisticated, elegant notes.",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 38,
    name: "Diptyque",
    description: "French luxury fragrance house renowned for its distinctive scented candles, perfumes, and personal care products with sophisticated, unique compositions.",
    imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944b2e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 39,
    name: "Armani",
    description: "Italian luxury fashion house known for elegant, tailored designs, innovative fabrics, and classic silhouettes with modern sensibilities.",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 40,
    name: "Tom Ford",
    description: "American luxury fashion brand renowned for sophisticated menswear, impeccable tailoring, and attention to detail in both clothing and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1519722417352-7d6959729417?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 41,
    name: "Dior",
    description: "French luxury fashion house known for elegant designs, fine craftsmanship, and innovative approaches to haute couture and ready-to-wear collections.",
    imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 42,
    name: "Anamika Khanna",
    description: "Indian luxury fashion designer known for contemporary interpretation of traditional Indian textiles and techniques with a global aesthetic.",
    imageUrl: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 43,
    name: "Audemars Piguet",
    description: "Swiss luxury watch manufacturer known for precision engineering, exceptional craftsmanship, and innovative designs in haute horlogerie.",
    imageUrl: "https://images.unsplash.com/photo-1628599071624-8ac40575a186?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 44,
    name: "Patek Philippe",
    description: "Prestigious Swiss luxury watch manufacturer known for creating some of the world's most complicated mechanical watches with timeless elegance.",
    imageUrl: "https://images.unsplash.com/photo-1615218532870-8a5811f60d14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 45,
    name: "Rolex",
    description: "Iconic Swiss luxury watchmaker renowned for precision timepieces that combine exceptional engineering with timeless design and status.",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 46,
    name: "BMW",
    description: "German luxury automobile manufacturer known for high-performance vehicles that combine advanced engineering, innovative technology, and sophisticated design.",
    imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 47,
    name: "Hyundai",
    description: "South Korean automotive manufacturer known for reliable, innovative vehicles with modern design and advanced technology features.",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 60,
    name: "MrBeast Burger",
    description: "Fast-food chain featuring smash burgers, chicken sandwiches, and fries available via delivery apps and ghost kitchens.",
    imageUrl: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 61,
    name: "Feastables",
    description: "Chocolate bar brand offering high-quality, better-for-you chocolate products with eco-friendly packaging and prize competitions.",
    imageUrl: "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 62,
    name: "Beast Philanthropy",
    description: "Non-profit organization dedicated to combating food insecurity and supporting communities in need through various charitable initiatives.",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: []
  },
  {
    id: 63,
    name: "ZARA",
    description: "Spanish fast fashion brand known for trendy, affordable clothing that quickly adapts to current fashion trends, popular among young fashion influencers.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Frazay Akbar"]
  },
  {
    id: 64,
    name: "H&M",
    description: "Swedish multinational fashion retailer offering affordable, trend-conscious fashion for young consumers and social media influencers.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Frazay Akbar"]
  },
  {
    id: 65,
    name: "ASOS",
    description: "British online fashion retailer offering contemporary fashion for young adults, especially popular among social media influencers and digital creators.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Frazay Akbar"]
  },
  {
    id: 66,
    name: "Shein",
    description: "Chinese fast fashion e-commerce platform offering ultra-affordable trendy clothing, highly popular among young fashion influencers and social media creators.",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Frazay Akbar"]
  },
  {
    id: 67,
    name: "Khaadi",
    description: "Pakistan's leading fashion brand known for premium traditional and contemporary clothing, featuring handwoven fabrics and exquisite embroidery work.",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Hania Amir", "Atif Aslam"]
  },
  {
    id: 68,
    name: "HSY",
    description: "Hassan Sheheryar Yasin's luxury Pakistani fashion house specializing in haute couture, bridal wear, and sophisticated formal attire.",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Fawad Khan", "Hania Amir"]
  },
  {
    id: 69,
    name: "Sapphire",
    description: "Premium Pakistani fashion brand offering contemporary and traditional clothing with modern cuts and sophisticated designs for the fashion-forward.",
    imageUrl: "https://images.unsplash.com/photo-1551318181-655e2c75734e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Hania Amir", "Atif Aslam"]
  },
  {
    id: 70,
    name: "Sana Safinaz",
    description: "Iconic Pakistani fashion duo known for luxury pret, lawn collections, and high-end formal wear with distinctive prints and elegant designs.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Hania Amir"]
  },
  {
    id: 76,
    name: "Princess Polly",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    description: "Australian-based online fashion retailer popular among TikTok influencers for trendy, affordable pieces perfect for content creation.",
    celebWearers: ["Michaela Connolly"]
  },
  {
    id: 77,
    name: "Urban Outfitters",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    description: "Lifestyle retailer offering contemporary fashion, accessories, and home goods that appeal to young, creative demographics.",
    celebWearers: ["Michaela Connolly"]
  },
  {
    id: 78,
    name: "Reformation",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    description: "Sustainable fashion brand known for feminine, vintage-inspired pieces that are perfect for social media content creation.",
    celebWearers: ["Michaela Connolly"]
  }
];

export const mockCelebrityBrands: CelebrityBrand[] = [
  {
    id: 500,
    celebrityId: 100,
    brandId: 50,
    description: "Founder and visionary behind Celecart, the revolutionary fashion discovery platform.",
    itemType: "Technology Platform",
    categoryId: 5,
    imagePosition: {
      top: "20%",
      left: "10%"
    },
    equipmentSpecs: {
      releaseYear: 2024,
      price: "Premium Platform",
      purchaseLink: "https://starly.com",
      stockStatus: "Active",
      material: "Digital Technology",
      color: "Brand Colors",
      weight: "Cloud-based"
    },
    occasionPricing: {
      "standard": {
        price: "Free",
        availableColors: ["Default UI"],
        customOptions: ["User Preferences"]
      },
      "premium": {
        price: "$9.99/month",
        discount: "Annual subscription discount",
        availableColors: ["Custom UI"],
        customOptions: ["Premium Features"],
        limitedEdition: false
      },
      "enterprise": {
        price: "Custom Pricing",
        discount: "Volume discount available",
        availableColors: ["White Label Options"],
        customOptions: ["API Access", "Data Analytics"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 501,
    celebrityId: 100,
    brandId: 39, // Armani
    description: "Armani suits are a key element of Zulqadar Rehman's executive style, representing sophistication and entrepreneurial success.",
    itemType: "Formal Suits",
    categoryId: 3,
    imagePosition: {
      top: "30%",
      left: "20%"
    },
    equipmentSpecs: {
      material: "Premium Wool and Silk",
      color: "Navy Blue, Charcoal Grey, Black",
      releaseYear: 2024,
      price: "$1,995-$3,500",
      purchaseLink: "https://www.armani.com/en-us/men/clothing/suits",
      stockStatus: "Available",
      size: "European Cut"
    },
    occasionPricing: {
      "standard": {
        price: "$1,995",
        availableColors: ["Navy", "Black", "Charcoal Grey"],
        customOptions: ["Italian Tailoring"]
      },
      "premium": {
        price: "$3,500",
        availableColors: ["Custom Colors"],
        customOptions: ["Made to Measure"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2022,
    grandSlamAppearances: []
  },
  {
    id: 502,
    celebrityId: 100,
    brandId: 45, // Rolex
    description: "Rolex timepieces are an essential accessory in Zulqadar Rehman's collection, combining precision engineering with timeless luxury.",
    itemType: "Luxury Watch",
    categoryId: 6,
    imagePosition: {
      top: "40%",
      left: "30%"
    },
    equipmentSpecs: {
      material: "Oystersteel, 18k Gold, Sapphire Crystal",
      color: "Silver/Gold",
      releaseYear: 2023,
      price: "$14,800",
      purchaseLink: "https://www.rolex.com/",
      stockStatus: "Limited Availability",
      size: "41mm"
    },
    occasionPricing: {
      "standard": {
        price: "$14,800",
        availableColors: ["Silver", "Gold", "Two-tone"]
      },
      "premium": {
        price: "$35,000",
        availableColors: ["Platinum", "Rose Gold"],
        customOptions: ["Special Editions"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2021,
    grandSlamAppearances: []
  },
  {
    id: 503,
    celebrityId: 100,
    brandId: 70, // Creed
    description: "Creed Aventus is Zulqadar Rehman's signature fragrance, known for its sophisticated blend of fruity and woody notes.",
    itemType: "Luxury Fragrance",
    categoryId: 6,
    imagePosition: {
      top: "50%",
      left: "40%"
    },
    equipmentSpecs: {
      material: "Premium Fragrance",
      color: "Clear/Black",
      releaseYear: 2010,
      price: "$435",
      purchaseLink: "https://www.creedboutique.com/products/aventus",
      stockStatus: "In Stock",
      size: "100ml"
    },
    occasionPricing: {
      "standard": {
        price: "$435",
        availableColors: ["Signature Bottle"]
      },
      "limited": {
        price: "$795",
        customOptions: ["Gift Set", "Collector's Edition"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2018,
    grandSlamAppearances: []
  },
  {
    id: 504,
    celebrityId: 100,
    brandId: 71, // Lamborghini
    description: "The Lamborghini Urus is Zulqadar Rehman's vehicle of choice, embodying the perfect blend of luxury SUV performance and distinctive Italian design.",
    itemType: "Luxury Vehicle",
    categoryId: 9,
    imagePosition: {
      top: "60%",
      left: "50%"
    },
    equipmentSpecs: {
      material: "Premium Leather, Carbon Fiber",
      color: "Nero Noctis (Black)",
      releaseYear: 2023,
      price: "$225,500",
      purchaseLink: "https://www.lamborghini.com/en-en/models/urus",
      stockStatus: "Custom Order",
      size: "Super SUV"
    },
    occasionPricing: {
      "standard": {
        price: "$225,500",
        availableColors: ["Nero Noctis", "Bianco Monocerus", "Blu Eleos"]
      },
      "pearl": {
        price: "$245,000+",
        availableColors: ["Custom Colors"],
        customOptions: ["Premium Package", "Off-Road Package"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2022,
    grandSlamAppearances: []
  },
  {
    id: 505,
    celebrityId: 100,
    brandId: 72, // Junaid Jamshed
    description: "Premium semi-formal kurta from Junaid Jamshed's New Arrivals '25 collection, representing traditional Pakistani elegance with contemporary styling.",
    itemType: "Traditional Wear",
    categoryId: 1,
    imagePosition: {
      top: "50%",
      left: "50%"
    },
    equipmentSpecs: {
      material: "100% Cotton",
      color: "Cream",
      releaseYear: 2025,
      price: "$90",
      purchaseLink: "https://us.junaidjamshed.com/collections/men-kurta/products/jjk-s-34951-s25-jj97",
      stockStatus: "In Stock",
      size: "Regular Fit",

    },
    occasionPricing: {
      "standard": {
        price: "$90",
        availableColors: ["Cream"],
        customOptions: ["XS", "S", "M", "L", "XL", "XXL"]
      },
      "collection": {
        price: "$90",
        discount: "New Arrivals '25 Collection",
        availableColors: ["Cream"],
        customOptions: ["Premium Cotton", "Regular Fit"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2025,
    grandSlamAppearances: []
  },
  {
    id: 506,
    celebrityId: 100,
    brandId: 73, // Ferragamo
    description: "Ferragamo Parigi New driving shoes in sophisticated navy suede, representing Italian luxury craftsmanship and timeless elegance for sophisticated occasions.",
    itemType: "Luxury Footwear",
    categoryId: 6,
    imagePosition: {
      top: "40%",
      left: "60%"
    },
    equipmentSpecs: {
      material: "Premium Suede Leather",
      color: "Navy Blue",
      releaseYear: 2024,
      price: "$625",
      purchaseLink: "https://www.ferragamo.com/shop/us/en/men/shoes-1/drivers-men/parigi-new-786963",
      stockStatus: "Available",
      size: "Italian Sizing",

    },
    occasionPricing: {
      "standard": {
        price: "$625",
        availableColors: ["Navy Blue", "Black", "Cognac"],
        customOptions: ["Italian Craftsmanship", "Hand-stitched"]
      },
      "premium": {
        price: "$675",
        availableColors: ["Custom Colors"],
        customOptions: ["Personalization Available"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 507,
    celebrityId: 100,
    brandId: 74, // Bose
    description: "Bose QuietComfort Ultra Headphones featuring world-class noise cancellation and spatial audio technology for premium listening experience.",
    itemType: "Premium Audio Equipment",
    categoryId: 6,
    imagePosition: {
      top: "45%",
      left: "70%"
    },
    equipmentSpecs: {
      material: "Premium Materials, Soft Cushions",
      color: "Black",
      releaseYear: 2024,
      price: "$449",
      purchaseLink: "https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html",
      stockStatus: "Available",
      size: "Over-ear",

    },
    occasionPricing: {
      "standard": {
        price: "$449",
        availableColors: ["Black", "White Smoke", "Lunar Blue"],
        customOptions: ["Spatial Audio", "Noise Cancellation"]
      },
      "premium": {
        price: "$549",
        availableColors: ["Limited Edition Colors"],
        customOptions: ["BoseCare Protection Plan", "Custom Engraving"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 508,
    celebrityId: 100,
    brandId: 75, // Rebecca Yarros
    description: "Onyx Storm, the highly anticipated third installment in The Empyrean series, continuing the epic fantasy romance saga of dragons, war college, and forbidden love.",
    itemType: "Fantasy Literature",
    categoryId: 6,
    imagePosition: {
      top: "50%",
      left: "80%"
    },
    equipmentSpecs: {
      material: "Hardcover Edition",
      color: "Dark Cover Design",
      releaseYear: 2025,
      price: "$28.99",
      purchaseLink: "https://www.amazon.com/Onyx-Storm-Empyrean-Rebecca-Yarros/dp/1649374178",
      stockStatus: "Pre-order Available",
      size: "Standard Book Size",

    },
    occasionPricing: {
      "standard": {
        price: "$28.99",
        availableColors: ["Hardcover", "Paperback"],
        customOptions: ["Signed Edition", "Special Edition"]
      },
      "collectors": {
        price: "$45.99",
        availableColors: ["Limited Edition Cover"],
        customOptions: ["Signed by Author", "Special Dust Jacket"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2025,
    grandSlamAppearances: []
  },
  {
    id: 509,
    celebrityId: 100,
    brandId: 76, // PwC
    description: "PwC represents Zulqadar Rehman's preferred professional services firm, known for transformative business insights, cutting-edge AI solutions, and industry expertise.",
    itemType: "Professional Services",
    categoryId: 6,
    imagePosition: {
      top: "55%",
      left: "90%"
    },
    equipmentSpecs: {
      material: "Global Professional Network",
      color: "Corporate Excellence",
      releaseYear: 2025,
      price: "Premium Consulting",
      purchaseLink: "https://www.pwc.com/us/en/leadingedge.html",
      stockStatus: "Leading Edge Services",
      size: "Global Scale",

    },
    occasionPricing: {
      "consulting": {
        price: "Premium Rates",
        availableColors: ["Strategic Advisory", "Technology Implementation"],
        customOptions: ["AI Solutions", "Digital Transformation"]
      },
      "enterprise": {
        price: "Custom Engagement",
        availableColors: ["Full-Service Partnership"],
        customOptions: ["C-Suite Strategy", "Industry Expertise"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 510,
    celebrityId: 100,
    brandId: 77, // Randolph Engineering
    description: "Randolph Engineering Aviator Military Special Edition in 23K Gold - authentic military-grade sunglasses worn by U.S. pilots for over 40 years, handcrafted in Massachusetts.",
    itemType: "Military-Grade Eyewear",
    categoryId: 6,
    imagePosition: {
      top: "60%",
      left: "100%"
    },
    equipmentSpecs: {
      material: "23K Gold, SkyTec Glass",
      color: "23K Gold Frame, American Gray Lens",
      releaseYear: 2024,
      price: "$299-$359",
      purchaseLink: "https://www.randolphusa.com/products/aviator-military-special-edition-23k-gold",
      stockStatus: "Available",
      size: "Regular (55mm)",

    },
    occasionPricing: {
      "standard": {
        price: "$299",
        availableColors: ["23K Gold", "Matte Chrome", "Matte Black"],
        customOptions: ["Non-Polarized", "Polarized +$60"]
      },
      "premium": {
        price: "$334",
        availableColors: ["Custom Engraving Available"],
        customOptions: ["Military Case", "Dog Tag Keychain", "Cleaning Cloth"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 511,
    celebrityId: 100,
    brandId: 78, // Kiehl's
    description: "Kiehl's Midnight Recovery Concentrate - Premium botanical face oil with evening primrose oil and lavender essential oil for overnight skin renewal and restoration.",
    itemType: "Luxury Skincare",
    categoryId: 6,
    imagePosition: {
      top: "65%",
      left: "110%"
    },
    equipmentSpecs: {
      material: "Botanical Oils & Essential Oils",
      color: "Golden Amber Oil",
      releaseYear: 2024,
      price: "$57-$142",
      purchaseLink: "https://www.kiehls.com/skincare/face-oils/midnight-recovery-concentrate-moisturizing-face-oil-serum/819.html",
      stockStatus: "Available",
      size: "1.0 fl oz (30ml)",

    },
    occasionPricing: {
      "standard": {
        price: "$57",
        availableColors: ["30ml Size"],
        customOptions: ["Anti-Aging", "Overnight Renewal", "Botanical Formula"]
      },
      "deluxe": {
        price: "$142",
        availableColors: ["100ml Size"],
        customOptions: ["Premium Size", "Evening Primrose Oil", "Lavender Essential Oil"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 512,
    celebrityId: 100,
    brandId: 79, // Titleist
    description: "Titleist T100 Tour-Level Precision Iron Set - Premium forged irons used by PGA Tour professionals, featuring minimalistic design and championship-level performance for serious golfers.",
    itemType: "Premium Golf Equipment",
    categoryId: 1,
    imagePosition: {
      top: "75%",
      left: "120%"
    },
    equipmentSpecs: {
      material: "Forged Carbon Steel",
      color: "Classic Chrome Finish",
      releaseYear: 2025,
      price: "$1,897",
      purchaseLink: "https://www.titleist.com/golf-clubs/irons/t100",
      stockStatus: "Available",
      size: "7-piece Iron Set (4-PW)",

    },
    occasionPricing: {
      "standard": {
        price: "$1,897",
        availableColors: ["Chrome Finish"],
        customOptions: ["Custom Shaft Options", "Grip Selection", "Lie/Loft Adjustments"]
      },
      "custom_fitting": {
        price: "$2,200",
        availableColors: ["Chrome", "DLC Black"],
        customOptions: ["Professional Fitting", "Premium Shafts", "Tour-Level Specs"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2025,
    grandSlamAppearances: []
  },































  {
    id: 25,
    celebrityId: 11, // Shoaib Akhtar
    brandId: 14, // Adidas Cricket
    description: "Professional Cricket Bowling Shoes",
    itemType: "Cricket Footwear",
    categoryId: 1, // On-Court Style
    imagePosition: { top: "85%", left: "40%" },
    equipmentSpecs: {
      material: "Synthetic with rubber studs",
      color: "White/Green",
      releaseYear: 2022,
      price: "$120",
      purchaseLink: "https://www.adidas.com/cricket",
      stockStatus: "Available",
      size: "UK 10"
    },
    occasionPricing: {
      "match": {
        price: "$120",
        availableColors: ["White/Green", "White/Blue", "Black/Red"]
      },
      "training": {
        price: "$95",
        discount: "Practice variant with similar technology",
        availableColors: ["All colors"]
      }
    },
    relationshipStartYear: 2000,
    grandSlamAppearances: []
  },
  {
    id: 26,
    celebrityId: 11, // Shoaib Akhtar
    brandId: 17, // CA Sports
    description: "Professional Cricket Ball",
    itemType: "Cricket Equipment",
    imagePosition: { top: "60%", left: "70%" },
    equipmentSpecs: {
      material: "Premium leather with hand stitching",
      color: "Red",
      releaseYear: 2023,
      price: "$30",
      purchaseLink: "https://ca-sports.com.pk/",
      stockStatus: "In Stock",
      weight: "5.5 oz"
    },
    relationshipStartYear: 1999,
    grandSlamAppearances: [],
    categoryId: 7, // Sports Equipment
    occasionPricing: {
      "professional": {
        price: "$30",
        availableColors: ["Red", "White"]
      }
    }
  },
  {
    id: 27,
    celebrityId: 12, // Amir Khan
    brandId: 15, // Amir Khan Boxing Academy
    description: "Pro Boxing Gloves",
    itemType: "Fighting Gear",
    imagePosition: { top: "50%", left: "60%" },
    equipmentSpecs: {
      material: "Premium leather with multi-layer padding",
      color: "Red/Black with UK flag",
      releaseYear: 2022,
      price: "$150",
      purchaseLink: "https://amirkhanboxing.com/",
      stockStatus: "Available",
      weight: "10oz, 12oz, 14oz, 16oz"
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: [],
    categoryId: 7, // Sports Equipment
    occasionPricing: {
      "professional": {
        price: "$150",
        availableColors: ["Red/Black", "Blue/White"]
      }
    }
  },
  {
    id: 28,
    celebrityId: 12, // Amir Khan
    brandId: 4, // Adidas
    description: "Training Collection",
    itemType: "Training Apparel",
    imagePosition: { top: "45%", left: "30%" },
    equipmentSpecs: {
      material: "Performance fabric with moisture-wicking",
      color: "Black with silver accents",
      releaseYear: 2022,
      price: "$65",
      purchaseLink: "https://www.adidas.com/boxing",
      stockStatus: "Available",
      size: "S-XXL"
    },
    relationshipStartYear: 2010,
    grandSlamAppearances: [],
    categoryId: 2, // Training Gear
    occasionPricing: {
      "training": {
        price: "$65",
        availableColors: ["Black", "Navy", "Red"]
      }
    }
  },

  {
    id: 30,
    celebrityId: 13, // Hania Amir
    brandId: 12, // Khaadi
    description: "Signature Collection",
    itemType: "Traditional Wear",
    imagePosition: { top: "45%", left: "40%" },
    equipmentSpecs: {
      material: "Embroidered fabric with handcrafted details",
      color: "Turquoise with gold accents",
      releaseYear: 2023,
      price: "$120",
      purchaseLink: "https://www.khaadi.com/",
      stockStatus: "Limited Edition",
      size: "XS-L"
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: [],
    categoryId: 4, // High Fashion
    occasionPricing: {
      "formal": {
        price: "$120",
        availableColors: ["Turquoise", "Emerald", "Royal Blue"]
      }
    }
  },




  {
    id: 47,
    celebrityId: 17, // Khloe Kardashian
    brandId: 20, // Good American
    description: "Good American Good Legs Jeans",
    itemType: "Denim",
    categoryId: 6, // Athleisure
    imagePosition: { top: "60%", left: "40%" },
    equipmentSpecs: {
      material: "Premium stretch denim",
      color: "Blue001",
      releaseYear: 2023,
      price: "$159",
      purchaseLink: "https://www.goodamerican.com/products/good-legs-blue001",
      stockStatus: "In Stock",
      size: "00-24"
    },
    occasionPricing: {
      "standard": {
        price: "$159",
        availableColors: ["Blue001", "Blue155", "Black", "White"]
      },
      "sale": {
        price: "$99",
        discount: "Select styles on sale",
        availableColors: ["Last season styles"]
      }
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: []
  },

  {
    id: 50,
    celebrityId: 25, // Salman Khan
    brandId: 27, // Being Human
    description: "Being Human Signature Collection",
    itemType: "Casual Wear",
    categoryId: 4, // Street Style
    imagePosition: { top: "50%", left: "35%" },
    equipmentSpecs: {
      material: "Premium cotton with signature logo",
      color: "Black/White",
      releaseYear: 2023,
      price: "$45-$125",
      purchaseLink: "https://www.beinghumanclothing.com/",
      stockStatus: "In Stock",
      size: "S-XXL"
    },
    occasionPricing: {
      "casual": {
        price: "$45",
        availableColors: ["Black", "White", "Grey", "Blue"]
      },
      "limited": {
        price: "$125",
        discount: "20% donated to Being Human Foundation",
        availableColors: ["Special Edition"]
      }
    },
    relationshipStartYear: 2012,
    grandSlamAppearances: []
  },




  {
    id: 132,
    celebrityId: 36, // Frazay Akbar
    brandId: 63, // ZARA
    description: "Contemporary fashion pieces perfect for Instagram content creation, featuring trendy styles and versatile pieces for everyday and special occasions.",
    itemType: "Contemporary Fashion",
    categoryId: 2, // Street Style
    imagePosition: { top: "30%", left: "40%" },
    equipmentSpecs: {
      material: "Mix of cotton, polyester, and sustainable fabrics",
      color: "Seasonal trend colors and neutral basics",
      releaseYear: 2024,
      price: "$25.90 - $129.90",
      purchaseLink: "https://www.zara.com/",
      stockStatus: "Regularly Updated",
      size: "XS-XXL"
    },
    occasionPricing: {
      "everyday wear": {
        price: "$25.90 - $69.90",
        availableColors: ["Basic wardrobe essentials", "Seasonal colors"]
      },
      "statement pieces": {
        price: "$79.90 - $129.90",
        customOptions: ["Limited edition collections", "Designer collaborations"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2023,
    grandSlamAppearances: []
  },
  {
    id: 133,
    celebrityId: 36, // Frazay Akbar
    brandId: 64, // H&M
    description: "Affordable fashion-forward pieces ideal for creating diverse content across different style aesthetics and trends.",
    itemType: "Fast Fashion",
    categoryId: 2, // Street Style
    imagePosition: { top: "45%", left: "35%" },
    equipmentSpecs: {
      material: "Sustainable and conventional fabric blends",
      color: "Wide range of seasonal and classic colors",
      releaseYear: 2024,
      price: "$9.99 - $79.99",
      purchaseLink: "https://www2.hm.com/",
      stockStatus: "Constantly Updated",
      size: "XS-3XL"
    },
    occasionPricing: {
      "basics": {
        price: "$9.99 - $29.99",
        availableColors: ["Wardrobe staples", "Basic tees and accessories"]
      },
      "trend pieces": {
        price: "$39.99 - $79.99",
        customOptions: ["Designer collaborations", "Conscious collection"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2023,
    grandSlamAppearances: []
  },
  {
    id: 134,
    celebrityId: 36, // Frazay Akbar
    brandId: 65, // ASOS
    description: "Online fashion destination offering unique pieces and emerging brand collaborations perfect for creating distinctive influencer content.",
    itemType: "Online Fashion",
    categoryId: 2, // Street Style
    imagePosition: { top: "25%", left: "55%" },
    equipmentSpecs: {
      material: "Diverse range from sustainable to luxury materials",
      color: "Extensive color palette and exclusive designs",
      releaseYear: 2024,
      price: "$15.00 - $200.00",
      purchaseLink: "https://www.asos.com/",
      stockStatus: "Regular New Arrivals",
      size: "4-30 (UK sizing)"
    },
    occasionPricing: {
      "everyday essentials": {
        price: "$15.00 - $49.99",
        availableColors: ["ASOS Design basics", "Affordable accessories"]
      },
      "premium pieces": {
        price: "$79.99 - $200.00",
        customOptions: ["ASOS Edition", "Exclusive brand collaborations"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 135,
    celebrityId: 36, // Frazay Akbar
    brandId: 66, // Shein
    description: "Ultra-affordable trendy pieces ideal for frequent content creation and experimenting with new styles without breaking the budget.",
    itemType: "Ultra Fast Fashion",
    categoryId: 2, // Street Style
    imagePosition: { top: "40%", left: "50%" },
    equipmentSpecs: {
      material: "Mixed synthetic and natural fiber blends",
      color: "Trend-driven colors and prints",
      releaseYear: 2024,
      price: "$2.00 - $40.00",
      purchaseLink: "https://www.shein.com/",
      stockStatus: "Daily New Arrivals",
      size: "XS-5XL"
    },
    occasionPricing: {
      "budget finds": {
        price: "$2.00 - $15.00",
        availableColors: ["Basic accessories", "Trend testing pieces"]
      },
      "statement items": {
        price: "$20.00 - $40.00",
        customOptions: ["Curve plus size", "Premium collection"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 136,
    celebrityId: 37, // Atif Aslam
    brandId: 67, // Khaadi
    description: "Premium Pakistani traditional wear for concerts and cultural events, featuring elegant kurtas and sophisticated casual pieces.",
    itemType: "Traditional Pakistani Wear",
    categoryId: 2, // Performance Style
    imagePosition: { top: "40%", left: "45%" },
    equipmentSpecs: {
      material: "Premium cotton and silk blends with handwoven details",
      color: "Classic whites, earth tones, and cultural patterns",
      releaseYear: 2024,
      price: "$80 - $300",
      purchaseLink: "https://www.khaadi.com/",
      stockStatus: "Available",
      size: "S-XXL"
    },
    occasionPricing: {
      "casual wear": {
        price: "$80 - $150",
        availableColors: ["Traditional kurtas", "Contemporary shirts"]
      },
      "concert attire": {
        price: "$200 - $300",
        customOptions: ["Designer kurtas", "Stage performance wear"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2023,
    grandSlamAppearances: []
  },
  {
    id: 137,
    celebrityId: 37, // Atif Aslam
    brandId: 69, // Sapphire
    description: "Contemporary Pakistani fashion perfect for award shows and formal events, combining modern cuts with traditional aesthetics.",
    itemType: "Contemporary Pakistani Fashion",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "35%", left: "50%" },
    equipmentSpecs: {
      material: "High-quality fabrics with modern tailoring",
      color: "Sophisticated neutrals and bold statement colors",
      releaseYear: 2024,
      price: "$120 - $450",
      purchaseLink: "https://pk.sapphireonline.pk/",
      stockStatus: "Seasonal Collections",
      size: "S-XXL"
    },
    occasionPricing: {
      "everyday wear": {
        price: "$120 - $250",
        availableColors: ["Smart casual pieces", "Contemporary shirts"]
      },
      "formal events": {
        price: "$300 - $450",
        customOptions: ["Award show attire", "Premium formal wear"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 138,
    celebrityId: 38, // Hania Amir
    brandId: 67, // Khaadi
    description: "Elegant Pakistani designer wear perfect for drama shoots and cultural events, featuring beautiful embroidery and modern cuts.",
    itemType: "Pakistani Designer Wear",
    categoryId: 2, // Professional Styling
    imagePosition: { top: "30%", left: "40%" },
    equipmentSpecs: {
      material: "Embroidered lawn, silk, and premium cotton fabrics",
      color: "Vibrant prints and sophisticated solid colors",
      releaseYear: 2024,
      price: "$60 - $250",
      purchaseLink: "https://www.khaadi.com/",
      stockStatus: "Regular Collections",
      size: "XS-L"
    },
    occasionPricing: {
      "casual wear": {
        price: "$60 - $120",
        availableColors: ["Lawn suits", "Casual kurtas"]
      },
      "formal occasions": {
        price: "$150 - $250",
        customOptions: ["Designer embroidered pieces", "Formal wear"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2022,
    grandSlamAppearances: []
  },
  {
    id: 139,
    celebrityId: 38, // Hania Amir
    brandId: 68, // HSY
    description: "Luxury haute couture pieces for red carpet events and film premieres, showcasing sophisticated Pakistani fashion at its finest.",
    itemType: "Haute Couture",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "25%", left: "55%" },
    equipmentSpecs: {
      material: "Premium silks, chiffons, and hand-embellished fabrics",
      color: "Elegant pastels and rich jewel tones",
      releaseYear: 2024,
      price: "$800 - $3,000",
      purchaseLink: "https://hsystudio.com/",
      stockStatus: "Limited Edition",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "special events": {
        price: "$800 - $1,500",
        availableColors: ["Formal gowns", "Pakistani formal wear"]
      },
      "red carpet": {
        price: "$2,000 - $3,000",
        customOptions: ["Custom haute couture", "Film premiere wear"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2023,
    grandSlamAppearances: []
  },
  {
    id: 140,
    celebrityId: 38, // Hania Amir
    brandId: 70, // Sana Safinaz
    description: "Trendy Pakistani fashion perfect for social media content and casual appearances, featuring contemporary prints and modern silhouettes.",
    itemType: "Contemporary Pakistani Fashion",
    categoryId: 2, // Social Media Style
    imagePosition: { top: "45%", left: "35%" },
    equipmentSpecs: {
      material: "Premium lawn, cotton, and silk with distinctive prints",
      color: "Seasonal prints and contemporary color palettes",
      releaseYear: 2024,
      price: "$90 - $400",
      purchaseLink: "https://www.sanasafinaz.com/",
      stockStatus: "Seasonal Collections",
      size: "XS-L"
    },
    occasionPricing: {
      "casual wear": {
        price: "$90 - $180",
        availableColors: ["Printed lawn suits", "Casual kurtas"]
      },
      "formal occasions": {
        price: "$250 - $400",
        customOptions: ["Designer formal wear", "Party wear"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2021,
    grandSlamAppearances: []
  },
  {
    id: 141,
    celebrityId: 39, // Fawad Khan
    brandId: 68, // HSY
    description: "Sophisticated men's formal wear and sherwanis for award ceremonies and prestigious events, representing the pinnacle of Pakistani men's fashion.",
    itemType: "Men's Luxury Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "40%", left: "50%" },
    equipmentSpecs: {
      material: "Premium wool, silk, and hand-embellished fabrics",
      color: "Classic blacks, navy, and rich traditional colors",
      releaseYear: 2024,
      price: "$600 - $2,500",
      purchaseLink: "https://hsystudio.com/",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "formal events": {
        price: "$600 - $1,200",
        availableColors: ["Tailored suits", "Formal sherwanis"]
      },
      "award ceremonies": {
        price: "$1,500 - $2,500",
        customOptions: ["Custom tuxedos", "Designer sherwanis"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: "Wimbledon",
    location: "London, UK",
    surfaceType: "Grass",
    startDate: "June 27, 2023",
    endDate: "July 10, 2023",
    description: "The oldest and most prestigious tennis tournament in the world, featuring strict all-white dress code for players.",
    imageUrl: "https://images.unsplash.com/photo-1622279488999-f0096dc58c7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Grand Slam"
  },
  {
    id: 2,
    name: "US Open",
    location: "New York, USA",
    surfaceType: "Hard",
    startDate: "August 28, 2023",
    endDate: "September 10, 2023",
    description: "Known for its electric atmosphere and night sessions, players often wear bold colors and urban-inspired designs.",
    imageUrl: "https://images.unsplash.com/photo-1555739041-6838f1d0e1c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Grand Slam"
  },
  {
    id: 3,
    name: "Australian Open",
    location: "Melbourne, Australia",
    surfaceType: "Hard",
    startDate: "January 14, 2024",
    endDate: "January 28, 2024",
    description: "The first Grand Slam of the year, featuring heat-optimized lightweight outfits due to the summer temperatures.",
    imageUrl: "https://images.unsplash.com/photo-1530915658866-a2d9c505bbfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Grand Slam"
  },
  {
    id: 4,
    name: "Roland Garros",
    location: "Paris, France",
    surfaceType: "Clay",
    startDate: "May 22, 2023",
    endDate: "June 5, 2023",
    description: "Famous for its distinctive red clay courts, players often wear terra-cotta inspired colors that complement the surface.",
    imageUrl: "https://images.unsplash.com/photo-1622211885269-18dde7e80ca3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Grand Slam"
  },
  {
    id: 5,
    name: "Money in the Bank",
    location: "Las Vegas, USA",
    surfaceType: "Ring",
    startDate: "May 10, 2023",
    endDate: "May 10, 2023",
    description: "One of boxing's most prestigious events featuring the biggest paydays in the sport with elaborate entrance gear.",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Championship"
  },
  {
    id: 6,
    name: "Fight of the Century",
    location: "MGM Grand, Las Vegas",
    surfaceType: "Ring",
    startDate: "March 8, 2023",
    endDate: "March 8, 2023",
    description: "Historic boxing match between global superstars with custom-designed fight gear representing their personal brands.",
    imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Championship"
  },
  {
    id: 7,
    name: "FIFA World Cup",
    location: "Qatar",
    surfaceType: "Grass",
    startDate: "November 20, 2022",
    endDate: "December 18, 2022",
    description: "The biggest international football tournament featuring national team kits with cultural design elements.",
    imageUrl: "https://images.unsplash.com/photo-1616514197671-15d99ce7a6f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "International"
  },
  {
    id: 8,
    name: "UEFA Champions League",
    location: "Multiple European Venues",
    surfaceType: "Grass",
    startDate: "September 19, 2023",
    endDate: "June 1, 2024",
    description: "Europe's premier club football competition where players showcase the latest football boot technology and kit designs.",
    imageUrl: "https://images.unsplash.com/photo-1590552515252-3a5a1bce7bed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    tier: "Club"
  }
];

export const mockTournamentOutfits: TournamentOutfit[] = [




  {
    id: 10,
    celebrityId: 11, // Shoaib Akhtar
    tournamentId: 8, // Using Champions League as stand-in for Cricket World Cup
    year: 2003,
    description: "Iconic Pakistan cricket team blazer with traditional cricket whites",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    result: "Top Wicket Taker",
    outfitDetails: {
      mainColor: "Green",
      accentColor: "White",
      specialFeatures: "Pakistan Cricket Board emblem with performance fabric",
      designInspiration: "National pride and cricket tradition"
    },
    associatedBrands: [17] // CA Sports
  }
];
