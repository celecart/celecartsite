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
    id: 71,
    name: "Beyoncé",
    profession: "Singer, Performer, Entrepreneur",
    imageUrl: "/assets/beyonce/profile.jpg",
    description: "Globally renowned performer and entrepreneur known for her impeccable stage costumes, red carpet appearances, and her athleisure brand Ivy Park.",
    category: "Stage Fashion",
    managerInfo: null
  },
  {
    id: 72,
    name: "Jay-Z",
    profession: "Rapper, Record Producer, Entrepreneur",
    imageUrl: "/assets/jay-z/profile.jpg",
    description: "Legendary rapper and business mogul known for his sophisticated style evolution from streetwear to luxury tailoring and his impact on hip-hop fashion.",
    category: "Musician Style",
    managerInfo: null
  },
  {
    id: 33,
    name: "Blake Lively",
    profession: "Actress, Producer, Fashion Icon",
    imageUrl: "/assets/blake-lively/profile.png",
    description: "Celebrated American actress known for her roles in 'Gossip Girl' and 'A Simple Favor', as well as her exceptional fashion sense and collaborations with luxury brands like Chanel and Louboutin.",
    category: "Red Carpet",
    managerInfo: {
      name: "William Morris",
      agency: "WME Entertainment",
      email: "contact@wmeentertainment.com",
      phone: "+1 310 285 9000",
      bookingInquiries: "For professional inquiries, please contact WME Entertainment with detailed project information and proposed terms."
    }
  },
  {
    id: 30,
    name: "Chris Evans",
    profession: "Actor, Director, Producer",
    imageUrl: "/assets/chris_evans.png",
    description: "American actor known worldwide for portraying Captain America in the Marvel Cinematic Universe, who combines classic Hollywood charm with sophisticated style choices from luxury fashion brands.",
    category: "Red Carpet",
    managerInfo: {
      name: "Kenneth Slotnick",
      agency: "Creative Artists Agency",
      email: "contact@caa.com",
      phone: "+1 424 288 2000",
      bookingInquiries: "For professional inquiries, please contact Creative Artists Agency with detailed project information and proposed terms."
    },
    stylingDetails: [
      {
        occasion: "Academy Awards 2023",
        outfit: {
          designer: "Gucci",
          price: "Custom piece, estimated $8,000",
          details: "Tailored navy blue tuxedo with satin lapels and custom fit",
          purchaseLink: "https://www.gucci.com/us/en/ca/men/ready-to-wear-for-men/suits-for-men-c-men-readytowear-suits"
        },
        hairStylist: {
          name: "Jason Schneidman",
          instagram: "themensgroomer",
          website: "https://www.themensgroomer.com/",
          details: "Classic side-parted style with natural texture and lightweight hold"
        },
        makeupArtist: null,
        image: "/assets/chris_evans.png"
      },
      {
        occasion: "Film Premiere - The Gray Man",
        outfit: {
          designer: "IWC Schaffhausen & Casual Luxury",
          price: "Watch: $12,000, Outfit: $3,500",
          details: "Casual luxury ensemble with fitted light blue shirt, navy trousers and limited edition IWC Portugieser Chronograph",
          purchaseLink: "https://www.iwc.com/us/en/watch-collections/portugieser.html"
        },
        hairStylist: {
          name: "Johnnie Sapong",
          instagram: "johnniesapong",
          website: "https://www.johnniehair.com/",
          details: "Textured, slightly longer top with clean sides"
        },
        makeupArtist: null,
        image: "/assets/chris_evans.png"
      }
    ]
  },



  {
    id: 24,
    name: "Priyanka Chopra",
    profession: "Actress, Producer, UNICEF Goodwill Ambassador",
    imageUrl: "/assets/priyanka-chopra/profile.png",
    description: "Award-winning international actress and former Miss World known for her stunning red carpet looks, innovative style choices, and successful career in both Bollywood and Hollywood.",
    category: "Red Carpet",
    managerInfo: {
      name: "Anjula Acharia",
      agency: "A-Series Management & Productions",
      email: "contact@aseries.com",
      phone: "+1 310 555 7890",
      bookingInquiries: "For endorsement and appearance inquiries, please contact A-Series Management with detailed project information and proposed collaboration terms."
    }
  },
  {
    id: 27,
    name: "Shah Rukh Khan",
    profession: "Actor, Producer, Entrepreneur",
    imageUrl: "/assets/shahrukh-khan/shahrukh-khan-new.png",
    description: "Indian film superstar known as 'King Khan', born on November 2, 1965. SRK has appeared in over 80 Hindi films and is one of the most successful actors in world cinema with a career spanning more than 30 years. Known for his elegant style, brand endorsements, and influence on fashion in Bollywood and beyond.",
    category: "Red Carpet",
    managerInfo: {
      name: "Pooja Dadlani",
      agency: "Red Chillies Entertainment",
      email: "contact@redchillies.com",
      phone: "+91 22 4971 2000",
      bookingInquiries: "For film, endorsement, and event bookings, please contact Red Chillies Entertainment with a detailed proposal and budget range."
    },
    stylingDetails: [
      {
        occasion: "Personal Favorite Restaurant",
        outfit: {
          designer: "Casual Elegant",
          price: "N/A",
          details: "Bungalow NYC - Exclusive NYC restaurant known for its upscale atmosphere, creative cocktails, and contemporary American cuisine with global influences",
          purchaseLink: "https://www.bungalowny.com/"
        },
        hairStylist: null,
        makeupArtist: null,
        image: "/assets/bungalow/entrance.jpg"
      },
      {
        occasion: "Filmfare Awards 2023",
        outfit: {
          designer: "Manish Malhotra",
          price: "Custom piece, estimated ₹350,000",
          details: "Custom-tailored black tuxedo with subtle embellishments and signature styling",
          purchaseLink: "https://www.manishmalhotra.in/"
        },
        hairStylist: {
          name: "Raaj Gupta",
          instagram: "raajguptahair",
          website: "https://www.raajgupta.com/",
          details: "Signature styled hair with classic side part and natural texture"
        },
        makeupArtist: null,
        image: "/assets/shahrukh-khan/shahrukh-khan-new.png"
      },
      {
        occasion: "Pathaan Movie Premiere 2023",
        outfit: {
          designer: "Falguni Shane Peacock",
          price: "₹275,000",
          details: "Modern silhouette black ensemble with subtle detailing for contemporary red carpet look",
          purchaseLink: "https://falgunishanepeacock.com/"
        },
        hairStylist: {
          name: "Aalim Hakim",
          instagram: "aalimhakim",
          website: "https://www.aalimhakim.com/",
          details: "Styled long hair with texture and volume"
        },
        makeupArtist: null,
        image: "/assets/shahrukh-khan/shahrukh-khan-new.png"
      }
    ]
  },


  {
    id: 60,
    name: "Cristiano Ronaldo",
    profession: "Football Superstar, Entrepreneur",
    imageUrl: "/assets/cristiano-ronaldo/profile.jpg",
    description: "Portuguese football legend known for his exceptional talent on the field and impeccable style off the pitch, with numerous high-profile brand endorsements and his own CR7 fashion line.",
    category: "Sports Fashion",
    managerInfo: null,
    stylingDetails: [
      {
        occasion: "Red Carpet Event",
        outfit: {
          designer: "CR7",
          price: "$2,500",
          details: "Custom tailored CR7 tuxedo with modern slim cut and subtle brand detailing",
          purchaseLink: "https://www.cr7.com/collections/formal"
        },
        hairStylist: {
          name: "Ricardo Marques Ferreira",
          instagram: "ricardohairstylist",
          website: "https://www.ricardohairstylist.com",
          details: "Signature precision fade with textured top"
        },
        makeupArtist: null,
        image: "/assets/cristiano-ronaldo/profile.jpg"
      },
      {
        occasion: "Casual Street Style",
        outfit: {
          designer: "CR7 Denim",
          price: "$180",
          details: "CR7 premium stretch denim with signature pocket design, paired with CR7 limited edition t-shirt",
          purchaseLink: "https://www.cr7.com/collections/denim"
        },
        hairStylist: {
          name: "Self-styled",
          instagram: "cristiano",
          website: null,
          details: "Textured casual look with natural movement"
        },
        makeupArtist: null,
        image: "/assets/cristiano-ronaldo/profile.jpg"
      }
    ]
  },

  {
    id: 9,
    name: "Lionel Messi",
    profession: "Football Legend, 8-time Ballon d'Or Winner",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
    description: "Argentinian football star known for his understated elegance and association with premium fashion brands in his casual style.",
    category: "Casual",
    managerInfo: null
  },



  {
    id: 10,
    name: "MrBeast",
    profession: "YouTuber, Entrepreneur, Philanthropist",
    imageUrl: "/assets/mrbeast/profile.jpg",
    description: "American YouTube personality and entrepreneur known for his viral challenges, philanthropy, and business ventures including MrBeast Burger and Feastables chocolate. His casual streetwear style has influenced millions of young fans worldwide.",
    category: "Streetwear",
    managerInfo: {
      name: "Reed Duchscher",
      agency: "Night Media",
      email: "contact@nightmedia.com",
      phone: "+1 214 414 3344",
      bookingInquiries: "For business inquiries, sponsorships, and collaborations, please contact Night Media with detailed proposal information."
    },
    stylingDetails: [
      {
        occasion: "YouTube Videos",
        outfit: {
          designer: "MrBeast Merchandise",
          price: "$30-60",
          details: "Signature branded hoodies, t-shirts, and casual wear featuring bold colors and logo designs",
          purchaseLink: "https://mrbeast.store/"
        },
        image: "/assets/mrbeast/merch.jpg"
      },
      {
        occasion: "Brand Partnership",
        outfit: {
          designer: "Casual Streetwear",
          price: "Various",
          details: "Comfortable, practical attire with emphasis on durability for challenge videos and philanthropic events",
          purchaseLink: ""
        },
        image: "/assets/mrbeast/casual.jpg"
      }
    ]
  },
  {
    id: 14,
    name: "Imran Khan",
    profession: "Former Cricket Captain, Politician",
    imageUrl: "/assets/imran-khan.png",
    description: "Legendary Pakistani cricket captain turned politician, known for his classic style that evolved from sports attire to formal political wear over the decades.",
    category: "Formal Wear",
    managerInfo: null
  },


  {
    id: 19,
    name: "Selena Gomez",
    profession: "Singer, Actress, Producer, Entrepreneur",
    imageUrl: "/assets/selena-gomez/profile.jpg",
    description: "Multi-talented artist known for her versatile style, beauty brand Rare Beauty, and influence in both music and film industries with a focus on mental health advocacy.",
    category: "Celebrity Entrepreneur",
    managerInfo: null
  },
  {
    id: 1,
    name: "Roger Federer",
    profession: "Tennis Champion, 20-time Grand Slam Winner",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Roger_Federer_%2818912657504%29.jpg",
    description: "Swiss tennis legend known for his elegant playing style and equally sophisticated fashion sense both on and off the court.",
    category: "On-Court Style",
    managerInfo: {
      name: "Tony Godsick",
      agency: "TEAM8",
      email: "contact@team8global.com",
      phone: "+41 44 214 6868",
      bookingInquiries: "For endorsement and appearance opportunities, please contact TEAM8 with project details and budget information."
    }
  },
  {
    id: 26,
    name: "LeBron James",
    profession: "NBA Superstar, Entrepreneur, Philanthropist",
    imageUrl: "/assets/lebron-james.png",
    description: "Legendary NBA player known for his athletic prowess, fashion influence, and business ventures including media production and various brand partnerships.",
    category: "Sports Fashion",
    managerInfo: {
      name: "Rich Paul",
      agency: "Klutch Sports Group",
      email: "contact@klutchsports.com",
      phone: "+1 310 558 3667",
      bookingInquiries: "For endorsement and appearance opportunities, please contact Klutch Sports Group with detailed project information and proposed terms."
    },
    stylingDetails: [
      {
        occasion: "NBA All-Star Game 2023",
        outfit: {
          designer: "Nike LeBron Signature Collection",
          price: "$200-250",
          details: "Custom Nike LeBron 20 shoes in exclusive colorway with matching performance apparel",
          purchaseLink: "https://www.nike.com/basketball/lebron-james"
        },
        hairStylist: {
          name: "Nick Castellanos",
          instagram: "nickthebarber",
          website: "https://www.nickthebarber.com/",
          details: "Precision fade with detailed line work and shaped beard"
        },
        makeupArtist: null,
        image: "/assets/lebron-james.png"
      },
      {
        occasion: "Lakers Game Day Equipment",
        outfit: {
          designer: "Nike Basketball",
          price: "$185-225",
          details: "Official Lakers Nike Dri-FIT uniform with custom LeBron James Nike basketball shoes",
          purchaseLink: "https://www.nike.com/basketball"
        },
        hairStylist: null,
        makeupArtist: null,
        image: "/assets/lebron-james.png"
      }
    ]
  },
  {
    id: 35,
    name: "Miss Rachel",
    profession: "Early Childhood Educator, YouTube Content Creator",
    imageUrl: "/assets/miss-rachel/profile.jpg",
    description: "Rachel Anne Griffin Accurso, known as Miss Rachel, is a beloved early childhood educator and YouTube sensation with 12+ million subscribers. Born November 30, 1982, she holds a Master's in Music Education from NYU and creates educational content for toddlers and preschoolers through her 'Songs for Littles' channel. Her gentle, research-backed approach to child development has earned her recognition as 'this generation's Mister Rogers.'",
    category: "Educational Content Creator",
    managerInfo: {
      name: "Creative Artists Agency",
      agency: "CAA",
      email: "info@caa.com",
      phone: "+1 424 288 2000",
      bookingInquiries: "For brand partnerships, educational collaborations, and media appearances, please contact CAA with detailed project information and educational alignment requirements."
    },
    stylingDetails: [
      {
        occasion: "YouTube Educational Videos",
        outfit: {
          designer: "Colorful Educational Wear",
          price: "$50-150",
          details: "Bright, child-friendly clothing including colorful cardigans, comfortable dresses, and engaging accessories that appeal to young learners while maintaining professionalism",
          purchaseLink: "https://www.msrachel.com/shop"
        },
        image: "/assets/miss-rachel/youtube-style.jpg"
      },
      {
        occasion: "Netflix Special Filming",
        outfit: {
          designer: "Professional Educational Attire",
          price: "$200-500",
          details: "Elevated versions of her signature style with premium fabrics and camera-ready colors optimized for educational content production",
          purchaseLink: ""
        },
        image: "/assets/miss-rachel/netflix-style.jpg"
      },
      {
        occasion: "Educational Conference Speaking",
        outfit: {
          designer: "Professional Educator Style",
          price: "$300-600",
          details: "Smart casual professional wear that maintains her approachable, child-friendly aesthetic while commanding respect in academic and professional settings",
          purchaseLink: ""
        },
        image: "/assets/miss-rachel/speaking-style.jpg"
      }
    ]
  },
  {
    id: 36,
    name: "Frazay Akbar",
    profession: "Fashion Influencer, Social Media Personality",
    imageUrl: "@assets/image_1754010696522.png",
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
        image: "@assets/image_1754010696522.png"
      },
      {
        occasion: "Brand Collaboration Events",
        outfit: {
          designer: "Brand Partnership Styling",
          price: "$200-800",
          details: "Professional yet trendy outfits for brand events, product launches, and fashion shows, maintaining her personal style while representing partner brands",
          purchaseLink: ""
        },
        image: "@assets/image_1754010696522.png"
      },
      {
        occasion: "Casual Street Style",
        outfit: {
          designer: "Accessible Fashion",
          price: "$50-300",
          details: "Everyday fashion choices that inspire followers with achievable looks combining high-street and boutique pieces for authentic personal style",
          purchaseLink: ""
        },
        image: "@assets/image_1754010696522.png"
      }
    ]
  },
  {
    id: 37,
    name: "Atif Aslam",
    profession: "Singer, Songwriter, Actor",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    description: "Pakistan's most celebrated playback singer and pop icon with a distinctive voice that has captivated audiences across South Asia. Known for his romantic ballads, Sufi music, and Bollywood soundtracks, Atif has won numerous awards and has a massive international following.",
    category: "Entertainment",
    managerInfo: {
      name: "Tariq Ahmed Productions",
      agency: "Independent",
      contact: "management@atifahslamusic.com"
    },
    socialMedia: {
      instagram: "@atifaslam",
      twitter: "@itsaadee", 
      youtube: "Atif Aslam Official"
    },
    careerHighlights: [
      "Bollywood playback singer with 100+ songs",
      "Multiple Lux Style Awards winner",
      "International concert performer",
      "Judge on music reality shows"
    ],
    personalStyle: "Contemporary casual with traditional Pakistani elements",
    stylingDetails: [
      {
        occasion: "Concert Performances",
        outfit: {
          designer: "Contemporary Stage Wear",
          price: "$300-1,200",
          details: "Modern fitted shirts, branded jackets, and comfortable stage attire suitable for live performances and music videos",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Award Shows & Red Carpet",
        outfit: {
          designer: "Formal Pakistani Designer Wear",
          price: "$800-2,500",
          details: "Elegant sherwanis, tailored suits, and traditional Pakistani formal wear for prestigious events and award ceremonies",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      },
      {
        occasion: "Casual Public Appearances",
        outfit: {
          designer: "Smart Casual",
          price: "$150-600",
          details: "Comfortable jeans, branded shirts, and casual jackets for everyday appearances and fan meet-and-greets",
          purchaseLink: ""
        },
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: 38,
    name: "Hania Amir",
    profession: "Actress, Model",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c95-24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
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
  }
];

// Export the rawCelebrities directly for use in the server
export const rawCelebritiesExport = rawCelebrities;

// Apply the helper function to ensure all celebrities have stylingDetails property
export const mockCelebrities: Celebrity[] = rawCelebrities.map(addStylingDetailsIfMissing);

export const mockBrands: Brand[] = [
  {
    id: 71,
    name: "Lamborghini",
    description: "Italian luxury sports car and SUV manufacturer known for exotic design and extreme performance.",
    founded: 1963,
    headquarters: "Sant'Agata Bolognese, Italy",
    website: "https://www.lamborghini.com/",
    logoUrl: "/assets/lamborghini-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 72,
    name: "Junaid Jamshed",
    description: "Leading Pakistani fashion brand known for premium menswear, traditional kurtas, and contemporary Islamic fashion with exceptional quality and authentic craftsmanship.",
    founded: 1970,
    headquarters: "Karachi, Pakistan",
    website: "https://us.junaidjamshed.com/",
    logoUrl: "/assets/junaid-jamshed-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 73,
    name: "Ferragamo",
    description: "Italian luxury fashion house renowned for its exceptional leather craftsmanship, elegant footwear, and sophisticated accessories since 1927.",
    founded: 1927,
    headquarters: "Florence, Italy",
    website: "https://www.ferragamo.com/",
    logoUrl: "/assets/ferragamo-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 74,
    name: "Bose",
    description: "American audio equipment manufacturer renowned for premium headphones, speakers, and sound systems with cutting-edge noise cancellation technology.",
    founded: 1964,
    headquarters: "Framingham, Massachusetts, USA",
    website: "https://www.bose.com/",
    logoUrl: "/assets/bose-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 75,
    name: "Rebecca Yarros",
    description: "Bestselling American author renowned for contemporary romance and fantasy novels, including the viral sensation The Empyrean series featuring dragons and military academies.",
    founded: 2014,
    headquarters: "Colorado Springs, Colorado, USA",
    website: "https://www.rebeccayarros.com/",
    logoUrl: "/assets/rebecca-yarros-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 76,
    name: "PwC",
    description: "Global professional services network and one of the Big Four accounting firms, providing audit, consulting, tax, and advisory services with cutting-edge AI and technology solutions.",
    founded: 1849,
    headquarters: "London, UK / New York, USA",
    website: "https://www.pwc.com/",
    logoUrl: "/assets/pwc-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 77,
    name: "Randolph Engineering",
    description: "American luxury eyewear manufacturer renowned for military-grade aviator sunglasses, handcrafted in Massachusetts since 1973 with precision engineering and premium materials.",
    founded: 1973,
    headquarters: "Randolph, Massachusetts, USA",
    website: "https://www.randolphusa.com/",
    logoUrl: "/assets/randolph-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 78,
    name: "Kiehl's",
    description: "Historic New York apothecary and luxury skincare brand since 1851, renowned for science-backed formulations and premium botanical ingredients trusted by celebrities and skincare enthusiasts worldwide.",
    founded: 1851,
    headquarters: "New York City, New York, USA",
    website: "https://www.kiehls.com/",
    logoUrl: "/assets/kiehls-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 79,
    name: "Titleist",
    description: "Premium golf equipment manufacturer and global leader in golf balls, golf clubs, and accessories. Trusted by Tour professionals worldwide for championship-level performance and precision engineering.",
    founded: 1932,
    headquarters: "Fairhaven, Massachusetts, USA",
    website: "https://www.titleist.com/",
    logoUrl: "/assets/titleist-logo.png",
    featuredIn: ["Masters Tournament", "PGA Tour"],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 70,
    name: "Creed",
    description: "Luxury French perfume house founded in 1760, known for creating exclusive fragrances using ancient infusion techniques and the finest natural ingredients.",
    founded: 1760,
    headquarters: "Paris, France",
    website: "https://www.creedboutique.com/",
    logoUrl: "/assets/creed-logo.png",
    featuredIn: [],
    celebWearers: ["Zulqadar Rehman"]
  },
  {
    id: 80,
    name: "Netflix Kids",
    description: "Leading streaming platform for educational children's content, featuring original series and educational programming that supports early childhood development and learning.",
    founded: 1997,
    headquarters: "Los Gatos, California, USA",
    website: "https://www.netflix.com/browse/genre/783",
    logoUrl: "/assets/netflix-kids-logo.png",
    featuredIn: ["Preschool Education"],
    celebWearers: ["Miss Rachel"]
  },
  {
    id: 81,
    name: "Fisher-Price",
    description: "American toy company and subsidiary of Mattel, specializing in educational toys and learning materials for infants and young children since 1930.",
    founded: 1930,
    headquarters: "East Aurora, New York, USA",
    website: "https://www.fisher-price.com/",
    logoUrl: "/assets/fisher-price-logo.png",
    featuredIn: ["Early Childhood Education"],
    celebWearers: ["Miss Rachel"]
  },
  {
    id: 82,
    name: "Melissa & Doug",
    description: "American toy company known for creative, imaginative play products and educational toys that inspire hands-on, screen-free fun for children.",
    founded: 1988,
    headquarters: "Wilton, Connecticut, USA",
    website: "https://www.melissaanddoug.com/",
    logoUrl: "/assets/melissa-doug-logo.png",
    featuredIn: ["Educational Toys"],
    celebWearers: ["Miss Rachel"]
  },
  {
    id: 83,
    name: "YouTube Kids",
    description: "Google's video sharing platform designed specifically for children, providing educational content and entertainment in a safe, controlled environment for young learners.",
    founded: 2015,
    headquarters: "San Bruno, California, USA",
    website: "https://www.youtubekids.com/",
    logoUrl: "/assets/youtube-kids-logo.png",
    featuredIn: ["Digital Education"],
    celebWearers: ["Miss Rachel"]
  },
  {
    id: 34,
    name: "Chanel",
    description: "Iconic French luxury fashion house known for timeless designs, the little black dress, and the No.5 perfume, representing unparalleled elegance and sophistication.",
    imageUrl: "https://images.unsplash.com/photo-1512646605205-78422b7c7896?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Blake"]
  },
  {
    id: 35,
    name: "Christian Louboutin",
    description: "French luxury footwear and fashion designer renowned for his signature red-soled shoes and exceptional craftsmanship in high-end accessories.",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Blake"]
  },
  {
    id: 32,
    name: "Gucci",
    description: "Italian luxury fashion house known for innovative designs, exquisite craftsmanship, and iconic accessories that define modern luxury.",
    imageUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Chris", "Blake"]
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
    description: "Cristiano Ronaldo's lifestyle brand offering premium clothing, footwear, fragrances, and accessories that reflect the footballer's distinctive personal style and commitment to excellence.",
    imageUrl: "https://images.unsplash.com/photo-1551854336-cacde78bacb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["Cristiano"]
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
    celebWearers: ["SRK"]
  },
  {
    id: 37,
    name: "Dunhill",
    description: "British luxury goods brand known for men's ready-to-wear, custom tailoring, leather goods, and distinguished fragrances with sophisticated, elegant notes.",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 38,
    name: "Diptyque",
    description: "French luxury fragrance house renowned for its distinctive scented candles, perfumes, and personal care products with sophisticated, unique compositions.",
    imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944b2e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 39,
    name: "Armani",
    description: "Italian luxury fashion house known for elegant, tailored designs, innovative fabrics, and classic silhouettes with modern sensibilities.",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK", "Zulqadar Rehman"]
  },
  {
    id: 40,
    name: "Tom Ford",
    description: "American luxury fashion brand renowned for sophisticated menswear, impeccable tailoring, and attention to detail in both clothing and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1519722417352-7d6959729417?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 41,
    name: "Dior",
    description: "French luxury fashion house known for elegant designs, fine craftsmanship, and innovative approaches to haute couture and ready-to-wear collections.",
    imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 42,
    name: "Anamika Khanna",
    description: "Indian luxury fashion designer known for contemporary interpretation of traditional Indian textiles and techniques with a global aesthetic.",
    imageUrl: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 43,
    name: "Audemars Piguet",
    description: "Swiss luxury watch manufacturer known for precision engineering, exceptional craftsmanship, and innovative designs in haute horlogerie.",
    imageUrl: "https://images.unsplash.com/photo-1628599071624-8ac40575a186?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 44,
    name: "Patek Philippe",
    description: "Prestigious Swiss luxury watch manufacturer known for creating some of the world's most complicated mechanical watches with timeless elegance.",
    imageUrl: "https://images.unsplash.com/photo-1615218532870-8a5811f60d14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 45,
    name: "Rolex",
    description: "Iconic Swiss luxury watchmaker renowned for precision timepieces that combine exceptional engineering with timeless design and status.",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK", "Zulqadar Rehman"]
  },
  {
    id: 46,
    name: "BMW",
    description: "German luxury automobile manufacturer known for high-performance vehicles that combine advanced engineering, innovative technology, and sophisticated design.",
    imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 47,
    name: "Hyundai",
    description: "South Korean automotive manufacturer known for reliable, innovative vehicles with modern design and advanced technology features.",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["SRK"]
  },
  {
    id: 60,
    name: "MrBeast Burger",
    description: "Fast-food chain founded by YouTube star MrBeast featuring smash burgers, chicken sandwiches, and fries available via delivery apps and ghost kitchens.",
    imageUrl: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["MrBeast"]
  },
  {
    id: 61,
    name: "Feastables",
    description: "MrBeast's chocolate bar brand offering high-quality, better-for-you chocolate products with eco-friendly packaging and prize competitions.",
    imageUrl: "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["MrBeast"]
  },
  {
    id: 62,
    name: "Beast Philanthropy",
    description: "Non-profit organization founded by MrBeast dedicated to combating food insecurity and supporting communities in need through various charitable initiatives.",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    celebWearers: ["MrBeast"]
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
      sku: "JJK-S-34951/S25/JJ97"
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
      model: "Parigi New 786963"
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
      model: "QuietComfort Ultra"
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
      model: "The Empyrean #3"
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
      model: "Big Four Excellence"
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
      model: "AF282 Military Special Edition"
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
      model: "Midnight Recovery Concentrate"
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
      releaseYear: "2025",
      price: "$1,897",
      purchaseLink: "https://www.titleist.com/golf-clubs/irons/t100",
      stockStatus: "Available",
      size: "7-piece Iron Set (4-PW)",
      model: "T100 Irons"
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
    id: 401,
    celebrityId: 60, // Cristiano Ronaldo
    brandId: 2, // Nike
    description: "Cristiano Ronaldo's long-standing Nike partnership featuring signature Mercurial soccer cleats and training apparel",
    itemType: "Athletic Footwear & Apparel",
    categoryId: 2, // Sports Performance
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "High-performance fabrics, engineered mesh, carbon fiber",
      color: "Bold Red, Black, White",
      releaseYear: 2023,
      price: "$90-$375",
      purchaseLink: "https://www.nike.com/cr7",
      stockStatus: "Available",
      size: "Various sizes"
    },
    occasionPricing: {
      "pro": {
        price: "$275.00-$375.00",
        availableColors: ["Signature CR7 colorways", "Limited Editions"],
        customOptions: ["Professional specifications", "Custom fit"]
      },
      "consumer": {
        price: "$90.00-$250.00",
        availableColors: ["Red", "Black", "White", "Blue"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2003,
    grandSlamAppearances: []
  },
  {
    id: 400,
    celebrityId: 60, // Cristiano Ronaldo
    brandId: 40, // CR7
    description: "Cristiano Ronaldo's signature CR7 fashion line featuring premium clothing and accessories that reflect his modern, sophisticated style",
    itemType: "Lifestyle Brand",
    categoryId: 4, // Casual
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium cotton, leather, and performance fabrics",
      color: "Black, White, Navy",
      releaseYear: 2023,
      price: "$50-$500",
      purchaseLink: "https://www.cr7.com/",
      stockStatus: "Available",
      size: "S-XXL"
    },
    occasionPricing: {
      "casual": {
        price: "$50.00-$150.00",
        availableColors: ["Black", "White", "Navy", "Red"]
      },
      "premium": {
        price: "$200.00-$500.00",
        customOptions: ["Limited Edition CR7 Signature Items"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2014,
    grandSlamAppearances: []
  },
  {
    id: 300,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 37, // Dunhill
    description: "Dunhill Icon Absolute, an exclusive fragrance with dark rose, oud, and tobacco leaf notes that Shah Rukh Khan layers for his signature scent.",
    itemType: "Fragrance",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Perfume essence in luxury glass bottle",
      color: "Amber Gold",
      releaseYear: 2022,
      price: "$150.00",
      purchaseLink: "https://www.dunhill.com/fragrance/icon-absolute",
      stockStatus: "Available in London flagship store",
      size: "100ml"
    },
    occasionPricing: {
      "standard": {
        price: "$150.00",
        availableColors: ["Signature Bottle"]
      }
    },
    relationshipStartYear: 2017,
    grandSlamAppearances: []
  },
  {
    id: 301,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 38, // Diptyque
    description: "Diptyque Tam Dao, a sandalwood-focused fragrance that Shah Rukh Khan reportedly pairs with his Dunhill scent to create his distinctive personal fragrance signature.",
    itemType: "Fragrance",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium fragrance in artisan glass bottle",
      color: "Clear with signature label",
      releaseYear: 2021,
      price: "$180.00",
      purchaseLink: "https://www.diptyqueparis.com/en_us/p/eau-de-parfum-tam-dao.html",
      stockStatus: "Available",
      size: "75ml"
    },
    occasionPricing: {
      "standard": {
        price: "$180.00",
        availableColors: ["Signature Bottle"]
      }
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: []
  },
  {
    id: 302,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 39, // Armani
    description: "Armani custom tailored suits that Shah Rukh Khan frequently wears for red carpet events and formal appearances, known for their elegant cut and premium fabrics.",
    itemType: "Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium wool blend with silk lining",
      color: "Black, Navy, Charcoal",
      releaseYear: 2023,
      price: "$4,500.00+",
      purchaseLink: "https://www.armani.com/en-us/men/clothing/suits",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "red carpet": {
        price: "$4,500.00",
        availableColors: ["Black", "Navy", "Charcoal"],
        customOptions: ["Custom fitting", "Personalized details"]
      },
      "premiere": {
        price: "$6,000.00+",
        availableColors: ["Premium fabrics"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2015,
    grandSlamAppearances: []
  },
  {
    id: 303,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 40, // Tom Ford
    description: "Tom Ford shirts and suits that Shah Rukh Khan includes in his formal wardrobe, appreciated for their impeccable craftsmanship and modern cut.",
    itemType: "Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Egyptian cotton and premium Italian fabrics",
      color: "White, Light Blue, Black",
      releaseYear: 2023,
      price: "$650.00 - $5,000.00",
      purchaseLink: "https://www.tomford.com/men/ready-to-wear/",
      stockStatus: "Available",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "formal": {
        price: "$650.00 - $5,000.00",
        availableColors: ["White", "Light Blue", "Black"]
      },
      "custom": {
        price: "$7,500.00+",
        customOptions: ["Custom monogram", "Special fabrics"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2017,
    grandSlamAppearances: []
  },
  {
    id: 304,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 41, // Dior
    description: "Dior Men's collection pieces that Shah Rukh Khan occasionally wears for international events, featuring the brand's distinctive modern elegance.",
    itemType: "Designer Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium wool, silk, and innovative textiles",
      color: "Black, Grey, Patterned",
      releaseYear: 2022,
      price: "$3,800.00+",
      purchaseLink: "https://www.dior.com/en_us/mens-fashion",
      stockStatus: "Seasonal Collection",
      size: "Made to Measure"
    },
    occasionPricing: {
      "international events": {
        price: "$3,800.00+",
        availableColors: ["Black", "Grey", "Seasonal Patterns"]
      },
      "special collection": {
        price: "$6,500.00+",
        customOptions: ["Bespoke details"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2018,
    grandSlamAppearances: []
  },
  {
    id: 305,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 42, // Anamika Khanna
    description: "Anamika Khanna designs that Shah Rukh Khan chooses for traditional Indian events, featuring contemporary interpretations of classic Indian formalwear.",
    itemType: "Traditional Wear",
    categoryId: 3, // Formal Events
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Silk, handwoven textiles, intricate embroidery",
      color: "Black, Gold, Royal Blue",
      releaseYear: 2023,
      price: "$3,000.00+",
      purchaseLink: "https://www.anamikakhanna.in/collections",
      stockStatus: "Custom Order",
      size: "Bespoke"
    },
    occasionPricing: {
      "traditional events": {
        price: "$3,000.00+",
        availableColors: ["Black", "Gold", "Royal Blue", "Cream"]
      },
      "wedding ceremonies": {
        price: "$5,500.00+",
        customOptions: ["Hand embroidery", "Heritage techniques"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: []
  },
  {
    id: 306,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 43, // Audemars Piguet
    description: "Audemars Piguet luxury timepieces from Shah Rukh Khan's watch collection, showcasing the brand's exceptional craftsmanship and prestigious heritage.",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "18K gold case, alligator strap, sapphire crystal",
      color: "Rose Gold, Silver",
      releaseYear: 2022,
      price: "$30,000.00+",
      purchaseLink: "https://www.audemarspiguet.com/",
      stockStatus: "Limited Production",
      size: "41mm"
    },
    occasionPricing: {
      "formal": {
        price: "$30,000.00+",
        availableColors: ["Rose Gold", "Silver", "Two-tone"]
      },
      "limited edition": {
        price: "$55,000.00+",
        customOptions: ["Engraved case back", "Special complications"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2015,
    grandSlamAppearances: []
  },
  {
    id: 307,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 44, // Patek Philippe
    description: "Patek Philippe timepieces from Shah Rukh Khan's personal collection, representing the pinnacle of Swiss watchmaking with exceptional complications.",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Platinum, 18K gold, handcrafted leather straps",
      color: "Silver, Gold",
      releaseYear: 2021,
      price: "$35,000.00 - $120,000.00",
      purchaseLink: "https://www.patek.com/",
      stockStatus: "Waitlist",
      size: "39-42mm"
    },
    occasionPricing: {
      "high-profile events": {
        price: "$35,000.00+",
        availableColors: ["Silver", "Gold", "Blue dial"]
      },
      "collector's pieces": {
        price: "$80,000.00+",
        customOptions: ["Grand complications", "Limited series"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2014,
    grandSlamAppearances: []
  },
  {
    id: 308,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 45, // Rolex
    description: "Rolex watches that are part of Shah Rukh Khan's extensive luxury timepiece collection, known for their iconic design and precision engineering.",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Oystersteel, 18K gold, sapphire crystal",
      color: "Silver, Gold, Two-tone",
      releaseYear: 2023,
      price: "$12,000.00 - $45,000.00",
      purchaseLink: "https://www.rolex.com/",
      stockStatus: "Limited Availability",
      size: "40-44mm"
    },
    occasionPricing: {
      "everyday luxury": {
        price: "$12,000.00+",
        availableColors: ["Silver", "Black dial", "Blue dial"]
      },
      "special collection": {
        price: "$30,000.00+",
        customOptions: ["Precious metals", "Diamond settings"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2010,
    grandSlamAppearances: []
  },
  {
    id: 309,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 46, // BMW
    description: "BMW luxury vehicles that Shah Rukh Khan has been seen driving and has featured in his collection of premium automobiles.",
    itemType: "Luxury Vehicle",
    categoryId: 9, // Luxury Lifestyle
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium leather interior, advanced engineering",
      color: "Black, Metallic Silver",
      releaseYear: 2023,
      price: "$85,000.00 - $150,000.00",
      purchaseLink: "https://www.bmw.com/",
      stockStatus: "Available",
      size: "Luxury Sedan/SUV"
    },
    occasionPricing: {
      "standard": {
        price: "$85,000.00+",
        availableColors: ["Black", "Metallic Silver", "Mineral White"]
      },
      "customized": {
        price: "$120,000.00+",
        customOptions: ["Full customization", "Performance upgrades"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2017,
    grandSlamAppearances: []
  },
  {
    id: 310,
    celebrityId: 4, // Shah Rukh Khan
    brandId: 47, // Hyundai
    description: "Hyundai vehicles that Shah Rukh Khan has been associated with as a long-time brand ambassador, showcasing their premium models.",
    itemType: "Automobile",
    categoryId: 9, // Luxury Lifestyle
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Luxury interior finishes, advanced technology",
      color: "Various premium finishes",
      releaseYear: 2023,
      price: "$40,000.00 - $65,000.00",
      purchaseLink: "https://www.hyundai.com/",
      stockStatus: "Available",
      size: "Premium Models"
    },
    occasionPricing: {
      "standard": {
        price: "$40,000.00+",
        availableColors: ["White", "Black", "Silver", "Blue"]
      },
      "luxury edition": {
        price: "$60,000.00+",
        customOptions: ["Premium packages", "Technology upgrades"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 1998,
    grandSlamAppearances: []
  },

  {
    id: 124,
    celebrityId: 33, // Blake Lively
    brandId: 34, // Chanel
    description: "Chanel Haute Couture Gown",
    itemType: "Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Silk, Chiffon, Hand-sewn embellishments",
      color: "Champagne Gold, Rose Gold",
      releaseYear: 2023,
      price: "$25,000.00",
      purchaseLink: "https://www.chanel.com/us/haute-couture/",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "red carpet": {
        price: "$25,000.00",
        availableColors: ["Champagne Gold", "Rose Gold", "Silver"],
        customOptions: ["Custom fitting", "Hand-embroidered details"]
      },
      "gala": {
        price: "$30,000.00",
        availableColors: ["Platinum", "Diamond White"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2017,
    grandSlamAppearances: []
  },
  {
    id: 125,
    celebrityId: 33, // Blake Lively
    brandId: 35, // Christian Louboutin
    description: "Christian Louboutin Stiletto Pumps",
    itemType: "Footwear",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Italian Leather, Signature red sole",
      color: "Nude, Black, Red",
      releaseYear: 2023,
      price: "$795.00",
      purchaseLink: "https://us.christianlouboutin.com/us_en/shop/women/kate-patent.html",
      stockStatus: "Available",
      size: "34-42 EU"
    },
    occasionPricing: {
      "casual": {
        price: "$795.00",
        availableColors: ["Nude", "Black", "Red"]
      },
      "custom": {
        price: "$1,500.00",
        customOptions: ["Crystal embellishments", "Custom height"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: []
  },
  {
    id: 126,
    celebrityId: 33, // Blake Lively
    brandId: 32, // Gucci
    description: "Gucci Bamboo Handle Handbag",
    itemType: "Accessories",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium leather, Bamboo handle",
      color: "Cream, Forest Green, Burgundy",
      releaseYear: 2022,
      price: "$2,490.00",
      purchaseLink: "https://www.gucci.com/us/en/pr/women/handbags/top-handles-boston-bags-for-women",
      stockStatus: "Limited Stock",
      size: "Medium"
    },
    occasionPricing: {
      "everyday": {
        price: "$2,490.00",
        availableColors: ["Cream", "Forest Green", "Burgundy"]
      },
      "special edition": {
        price: "$3,200.00",
        availableColors: ["Limited Edition Gold"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2018,
    grandSlamAppearances: []
  },
  {
    id: 122,
    celebrityId: 30, // Chris Evans
    brandId: 32, // Gucci
    description: "Gucci Made to Measure Suit",
    itemType: "Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Premium wool with silk lining",
      color: "Navy Blue, Charcoal Grey",
      releaseYear: 2023,
      price: "$4,200.00",
      purchaseLink: "https://www.gucci.com/us/en/pr/men/ready-to-wear-for-men/suits-for-men",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "red carpet": {
        price: "$4,200.00",
        availableColors: ["Navy Blue", "Charcoal Grey", "Black"],
        customOptions: ["Monogrammed lining", "Custom buttons"]
      },
      "premiere": {
        price: "$5,500.00",
        availableColors: ["Black", "Midnight Blue"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2019,
    grandSlamAppearances: []
  },
  {
    id: 123,
    celebrityId: 30, // Chris Evans
    brandId: 33, // IWC Schaffhausen
    description: "IWC Portugieser Chronograph",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Stainless steel case, alligator leather strap",
      color: "Blue dial, Silver case",
      releaseYear: 2022,
      price: "$7,950.00",
      purchaseLink: "https://www.iwc.com/us/en/watch-collections/portugieser/iw371606-portugieser-chronograph.html",
      stockStatus: "Available",
      size: "41mm"
    },
    occasionPricing: {
      "formal": {
        price: "$7,950.00",
        availableColors: ["Blue dial", "Silver dial", "Black dial"]
      },
      "limited": {
        price: "$12,000.00",
        customOptions: ["Engraved case back", "Custom strap"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2018,
    grandSlamAppearances: []
  },






  {
    id: 1,
    celebrityId: 1, // Roger Federer
    brandId: 1, // Wilson
    description: "Pro Staff RF97 Autograph Tennis Racquet",
    itemType: "Racquet",
    categoryId: 7, // Sports Equipment
    imagePosition: { top: "35%", left: "70%" },
    equipmentSpecs: {
      weight: "340g",
      material: "Graphite",
      stringTension: "50-60 pounds",
      size: "97 sq. inches",
      color: "Black/Red",
      releaseYear: 2018,
      ratings: {
        quality: 4.9,
        comfort: 4.5,
        style: 4.8,
        value: 4.2
      }
    },
    occasionPricing: {
      "standard": {
        price: "$249.99",
        availableColors: ["Black/Red", "White/Black"]
      },
      "limited": {
        price: "$299.99",
        discount: "10% for ATP members",
        availableColors: ["Custom Gold/Black", "Wimbledon Special Edition"],
        limitedEdition: true
      },
      "professional": {
        price: "Custom pricing",
        customOptions: ["Custom string pattern", "Custom weight balance", "Personal grip size"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 1997,
    grandSlamAppearances: ["Australian Open", "Wimbledon", "US Open", "Roland Garros"]
  },
  {
    id: 2,
    celebrityId: 1, // Roger Federer
    brandId: 5, // Uniqlo
    description: "Performance tennis apparel from exclusive collection",
    itemType: "On-Court Outfit",
    categoryId: 1, // On-Court Style
    imagePosition: { top: "45%", left: "30%" },
    equipmentSpecs: {
      material: "Advanced fabric with moisture management",
      color: "Navy/White",
      releaseYear: 2021,
      price: "$89.99",
      stockStatus: "In Stock",
      ratings: {
        quality: 4.6,
        comfort: 4.8,
        style: 4.7,
        value: 4.5
      }
    },
    occasionPricing: {
      "tournament": {
        price: "$89.99",
        availableColors: ["Navy/White", "White/Red", "Black/Gold"]
      },
      "practice": {
        price: "$69.99",
        discount: "Buy 2 get 1 free",
        availableColors: ["Navy/White", "Grey/White"]
      },
      "fan": {
        price: "$129.99",
        customOptions: ["Custom name printing", "Autograph replica"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2018,
    grandSlamAppearances: ["Australian Open", "Wimbledon", "US Open"]
  },
  {
    id: 3,
    celebrityId: 1, // Roger Federer
    brandId: 3, // Rolex
    description: "Datejust 41 stainless steel watch",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "25%", left: "25%" },
    equipmentSpecs: {
      material: "Stainless steel and white gold",
      color: "Silver/Blue",
      releaseYear: 2020
    },
    occasionPricing: {
      "formal": {
        price: "$12,000",
        availableColors: ["Silver/Blue", "Gold/Champagne"]
      }
    },
    relationshipStartYear: 2006,
    grandSlamAppearances: ["All trophy ceremonies"]
  },




  {
    id: 127,
    celebrityId: 27, // Shah Rukh Khan
    brandId: 36, // Tag Heuer
    description: "Tag Heuer Monaco Calibre Heuer 02 Watch",
    itemType: "Luxury Watch",
    categoryId: 6, // Accessories
    imagePosition: { top: "50%", left: "50%" },
    equipmentSpecs: {
      material: "Stainless steel case, leather strap",
      color: "Blue dial, Silver case",
      releaseYear: 2023,
      price: "$7,200.00",
      purchaseLink: "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-monaco/",
      stockStatus: "Available",
      size: "39mm"
    },
    occasionPricing: {
      "formal": {
        price: "$7,200.00",
        availableColors: ["Blue dial", "Black dial"]
      },
      "limited": {
        price: "$10,500.00",
        customOptions: ["Special SRK Edition", "Custom engraving"],
        limitedEdition: true
      }
    },
    relationshipStartYear: 2016,
    grandSlamAppearances: []
  },



  {
    id: 18,
  },
  {
    id: 19,
  },
  {
    id: 20,
  },
  {
    id: 21,
  },
  {
    id: 22,
  },
  {
    id: 16,
    celebrityId: 9, // Lionel Messi
    brandId: 4, // Adidas
    description: "X Speedflow Messi.1 signature cleats",
    itemType: "Football Boots",
    categoryId: 4, // Sports Equipment
    imagePosition: { top: "85%", left: "45%" },
    equipmentSpecs: {
      material: "PRIMEKNIT with SPEEDFRAME technology",
      color: "Blue/Pink/White",
      releaseYear: 2022
    },
    occasionPricing: {
      "Standard": {
        price: "$275",
        availableColors: ["Blue/Pink", "Black/Gold", "White/Blue"]
      }
    },
    relationshipStartYear: 2006,
    grandSlamAppearances: []
  },
  {
    id: 90,
    celebrityId: 10, // MrBeast
    brandId: 60, // MrBeast Burger
    description: "MrBeast's fast-food chain featuring signature burgers and sandwiches",
    itemType: "Fast Food",
    categoryId: 8, // Food & Beverage
    imagePosition: { top: "40%", left: "50%" },
    equipmentSpecs: {
      material: "Quality ingredients with premium packaging",
      color: "Brand colors - blue and red",
      releaseYear: 2020,
      price: "$6.99-$10.99",
      purchaseLink: "https://mrbeastburger.com/",
      stockStatus: "Available via delivery apps",
      size: "Multiple locations nationwide"
    },
    occasionPricing: {
      "standard": {
        price: "$6.99-$8.99",
        availableColors: ["Signature packaging"]
      },
      "combo": {
        price: "$10.99-$15.99",
        availableColors: ["Signature packaging"],
        customOptions: ["Meal deals with fries and drink"]
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  },
  {
    id: 91,
    celebrityId: 10, // MrBeast
    brandId: 61, // Feastables
    description: "MrBeast's chocolate bar line featuring simple ingredients and prize competitions",
    itemType: "Chocolate",
    categoryId: 8, // Food & Beverage
    imagePosition: { top: "40%", left: "50%" },
    equipmentSpecs: {
      material: "High-quality chocolate with simple ingredients",
      color: "Colorful branded packaging",
      releaseYear: 2022,
      price: "$3.49-$29.99",
      purchaseLink: "https://feastables.com/",
      stockStatus: "Available online and in select retailers",
      size: "Original, Quinoa Crunch, Almond"
    },
    occasionPricing: {
      "single": {
        price: "$3.49",
        availableColors: ["Signature packaging"]
      },
      "bundle": {
        price: "$19.99-$29.99",
        availableColors: ["Gift packaging"],
        customOptions: ["Variety packs"]
      }
    },
    relationshipStartYear: 2022,
    grandSlamAppearances: []
  },
  {
    id: 92,
    celebrityId: 10, // MrBeast
    brandId: 62, // Beast Philanthropy
    description: "MrBeast's charity organization focused on fighting food insecurity",
    itemType: "Non-profit Organization",
    categoryId: 10, // Philanthropy
    imagePosition: { top: "40%", left: "50%" },
    equipmentSpecs: {
      material: "Charitable initiatives and food distribution",
      color: "Branded blue/white",
      releaseYear: 2020,
      price: "Donation-based",
      purchaseLink: "https://beastphilanthropy.org/",
      stockStatus: "Ongoing operations",
      size: "Global reach"
    },
    occasionPricing: {
      "donation": {
        price: "Various",
        customOptions: ["One-time or recurring donations"]
      },
      "merch": {
        price: "$20-$60",
        availableColors: ["Various styles"],
        customOptions: ["Proceeds go to charity"]
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  },
  {
    id: 17,
    celebrityId: 9, // Lionel Messi
    brandId: 9, // Louis Vuitton
    description: "Horizon Soft luggage collection",
    itemType: "Travel Accessories",
    categoryId: 5, // Lifestyle
    imagePosition: { top: "50%", left: "30%" },
    equipmentSpecs: {
      material: "Monogram Eclipse canvas",
      color: "Black/Gray",
      releaseYear: 2020
    },
    occasionPricing: {
      "Standard": {
        price: "$3,200",
        availableColors: ["Monogram Eclipse", "Damier Graphite"]
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  },
  {
    id: 23,
    celebrityId: 27, // Shah Rukh Khan
    brandId: 12, // Khaadi
    description: "Exclusive Formal Collection",
    itemType: "Traditional Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "40%", left: "30%" },
    equipmentSpecs: {
      material: "Premium cotton with embroidery",
      color: "Blue/White",
      releaseYear: 2023,
      price: "$250",
      purchaseLink: "https://www.khaadi.com/",
      stockStatus: "Available",
      size: "M-XL"
    },
    occasionPricing: {
      "formal": {
        price: "$250",
        availableColors: ["Blue/White", "Black/Gold", "Maroon"]
      },
      "wedding": {
        price: "$350",
        discount: "Custom embroidery included",
        availableColors: ["Gold", "Royal Blue"]
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  },
  {
    id: 24,
    celebrityId: 14, // Imran Khan
    brandId: 13, // HSY
    description: "Signature Men's Collection",
    itemType: "Formal Wear",
    categoryId: 4, // High Fashion
    imagePosition: { top: "45%", left: "35%" },
    equipmentSpecs: {
      material: "Wool blend with custom stitching",
      color: "Charcoal Gray",
      releaseYear: 2023,
      price: "$550",
      purchaseLink: "https://hsystudio.com/",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    occasionPricing: {
      "formal": {
        price: "$550",
        availableColors: ["Charcoal Gray", "Navy Blue", "Black"]
      },
      "wedding": {
        price: "$750",
        discount: "Complete outfit with accessories",
        availableColors: ["Signature HSY Designs"]
      }
    },
    relationshipStartYear: 2018,
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
    grandSlamAppearances: []
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
    grandSlamAppearances: []
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
    grandSlamAppearances: []
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
    grandSlamAppearances: []
  },
  {
    id: 31,
    celebrityId: 14, // Imran Khan
    brandId: 17, // CA Sports
    description: "Vintage Cricket Bat",
    itemType: "Cricket Equipment",
    imagePosition: { top: "60%", left: "65%" },
    equipmentSpecs: {
      material: "English willow with traditional crafting",
      color: "Natural wood with green grip",
      releaseYear: 2021,
      price: "$200",
      purchaseLink: "https://ca-sports.com.pk/",
      stockStatus: "Collector's Edition",
      weight: "2lb 10oz"
    },
    relationshipStartYear: 1990,
    grandSlamAppearances: []
  },
  {
    id: 32,
    celebrityId: 14, // Imran Khan
    brandId: 13, // HSY
    description: "Formal Traditional Suit",
    itemType: "Formal Wear",
    imagePosition: { top: "40%", left: "30%" },
    equipmentSpecs: {
      material: "Premium wool with handmade embroidery",
      color: "Dark blue with white stitching",
      releaseYear: 2022,
      price: "$450",
      purchaseLink: "https://hsystudio.com/",
      stockStatus: "Made to Order",
      size: "Custom Tailored"
    },
    relationshipStartYear: 2015,
    grandSlamAppearances: []
  },
  {
    id: 45,
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
    id: 48,
  },
  {
    id: 49,
    celebrityId: 24, // Priyanka Chopra
    brandId: 9, // Louis Vuitton
    description: "Red Carpet Collection",
    itemType: "Formal Wear",
    categoryId: 3, // Red Carpet
    imagePosition: { top: "40%", left: "40%" },
    equipmentSpecs: {
      material: "Premium silk with custom embellishments",
      color: "Gold/White",
      releaseYear: 2023,
      price: "Custom pricing",
      purchaseLink: "https://www.louisvuitton.com/",
      stockStatus: "Custom Order",
      size: "Custom Fitted"
    },
    occasionPricing: {
      "award-ceremony": {
        price: "Custom pricing",
        availableColors: ["Gold/White", "Silver", "Emerald"]
      },
      "premiere": {
        price: "Custom pricing",
        availableColors: ["Premiere Collection"]
      }
    },
    relationshipStartYear: 2021,
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
    id: 128,
    celebrityId: 35, // Miss Rachel
    brandId: 80, // Netflix Kids
    description: "Educational partnership with Netflix Kids for preschool learning content and special programming focused on early childhood development.",
    itemType: "Educational Content",
    categoryId: 1, // Digital Learning
    imagePosition: { top: "30%", left: "50%" },
    equipmentSpecs: {
      material: "Digital streaming platform with educational focus",
      color: "Netflix Brand Colors",
      releaseYear: 2023,
      price: "Netflix Subscription ($15.49/month)",
      purchaseLink: "https://www.netflix.com/browse/genre/783",
      stockStatus: "Available",
      size: "Streaming Content"
    },
    occasionPricing: {
      "educational": {
        price: "$15.49/month",
        availableColors: ["Standard streaming quality"]
      },
      "premium": {
        price: "$22.99/month",
        customOptions: ["4K streaming", "Multiple devices"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2023,
    grandSlamAppearances: []
  },
  {
    id: 129,
    celebrityId: 35, // Miss Rachel
    brandId: 83, // YouTube Kids
    description: "Primary platform for Miss Rachel's 'Songs for Littles' educational content reaching 12+ million subscribers with developmental learning videos.",
    itemType: "Digital Platform",
    categoryId: 1, // Digital Learning
    imagePosition: { top: "40%", left: "60%" },
    equipmentSpecs: {
      material: "YouTube Kids safe viewing environment",
      color: "YouTube Kids Brand Colors",
      releaseYear: 2020,
      price: "Free with ads / YouTube Premium $11.99/month",
      purchaseLink: "https://www.youtubekids.com/",
      stockStatus: "Active Platform",
      size: "Digital Content"
    },
    occasionPricing: {
      "free": {
        price: "Free",
        availableColors: ["Ad-supported viewing"]
      },
      "premium": {
        price: "$11.99/month",
        customOptions: ["Ad-free viewing", "Background play"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2020,
    grandSlamAppearances: []
  },
  {
    id: 130,
    celebrityId: 35, // Miss Rachel
    brandId: 82, // Melissa & Doug
    description: "Educational toy brand partnership featuring creative, hands-on learning toys that complement Miss Rachel's screen-free play philosophy.",
    itemType: "Educational Toys",
    categoryId: 7, // Learning Materials
    imagePosition: { top: "50%", left: "40%" },
    equipmentSpecs: {
      material: "High-quality wood and safe, non-toxic materials",
      color: "Natural wood with bright, child-safe colors",
      releaseYear: 2024,
      price: "$15.99 - $199.99",
      purchaseLink: "https://www.melissaanddoug.com/",
      stockStatus: "In Stock",
      size: "Various educational toy sizes"
    },
    occasionPricing: {
      "individual toys": {
        price: "$15.99 - $49.99",
        availableColors: ["Wooden puzzles", "Art supplies", "Pretend play sets"]
      },
      "learning sets": {
        price: "$79.99 - $199.99",
        customOptions: ["Complete learning systems", "Age-appropriate collections"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
    grandSlamAppearances: []
  },
  {
    id: 131,
    celebrityId: 35, // Miss Rachel
    brandId: 81, // Fisher-Price
    description: "Classic educational toy brand known for developmental learning products that support early childhood milestones and cognitive development.",
    itemType: "Developmental Toys",
    categoryId: 7, // Learning Materials
    imagePosition: { top: "35%", left: "45%" },
    equipmentSpecs: {
      material: "Child-safe plastics and soft materials",
      color: "Bright, engaging primary colors",
      releaseYear: 2024,
      price: "$9.99 - $149.99",
      purchaseLink: "https://www.fisher-price.com/",
      stockStatus: "Widely Available",
      size: "Age-appropriate sizing for infants to preschoolers"
    },
    occasionPricing: {
      "infant toys": {
        price: "$9.99 - $39.99",
        availableColors: ["Soft rattles", "Musical toys", "Teething toys"]
      },
      "learning systems": {
        price: "$79.99 - $149.99",
        customOptions: ["Interactive learning tables", "Musical instruments", "STEM learning toys"],
        limitedEdition: false
      }
    },
    relationshipStartYear: 2024,
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
    id: 1,
    celebrityId: 1, // Roger Federer
    tournamentId: 1, // Wimbledon
    year: 2019,
    description: "Classic all-white ensemble with gold accents for his 20th anniversary at Wimbledon",
    imageUrl: "https://images.unsplash.com/photo-1531315396756-905d68d21b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    result: "Finalist",
    outfitDetails: {
      mainColor: "White",
      accentColor: "Gold",
      specialFeatures: "RF logo on jacket and sneakers",
      designInspiration: "Tennis heritage and tradition"
    },
    associatedBrands: [5, 3] // Uniqlo, Rolex
  },


  {
    id: 8,
