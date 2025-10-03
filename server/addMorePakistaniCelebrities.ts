import { storage } from './storage';

export async function addMorePakistaniCelebritiesToDB() {
  try {
    // Check if these celebrities already exist
    const celebritiesArray = await storage.getCelebrities();
    
    // Add Imran Khan
    const imranExists = celebritiesArray.some(celeb => celeb.name === "Imran Khan");
    if (!imranExists) {
      console.log("Adding Imran Khan to the database...");
      
      const stylingDetails = [
        {
          occasion: "Political Leadership",
          outfit: {
            designer: "Bonanza Satrangi, Charcoal",
            price: "$1,200-$3,000",
            details: "Sophisticated business suits in navy and charcoal, perfectly tailored for diplomatic meetings and political engagements"
          },
          image: "/assets/imran-khan/political.jpg"
        },
        {
          occasion: "Cricket Commentary",
          outfit: {
            designer: "Armani, Hugo Boss",
            price: "$800-$2,000",
            details: "Smart blazers and premium casual wear for cricket analysis and sports commentary appearances"
          },
          image: "/assets/imran-khan/cricket.jpg"
        },
        {
          occasion: "Traditional Events",
          outfit: {
            designer: "Junaid Jamshed",
            price: "$200-$600",
            details: "Elegant kurta and shalwar kameez sets in cream and white, representing Pakistani cultural heritage"
          },
          image: "/assets/imran-khan/traditional.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Imran Khan",
        profession: "Former Prime Minister, Cricket Legend",
        imageUrl: "/assets/imran-khan/profile.jpg",
        description: "Former cricket captain who led Pakistan to World Cup victory in 1992, later becoming Prime Minister of Pakistan. Known for his charismatic leadership and impeccable style both on and off the field.",
        category: "Politics",
        managerInfo: {
          name: "PTI Media Office",
          agency: "Pakistan Tehreek-e-Insaf",
          email: "media@pti.org.pk",
          phone: "+92 51 9261888",
          bookingInquiries: "For official inquiries and media requests, please contact PTI Media Office."
        },
        stylingDetails: stylingDetails
      });
      
      console.log("Imran Khan successfully added to the database!");
    }

    // Add Shan
    const shanExists = celebritiesArray.some(celeb => celeb.name === "Shan");
    if (!shanExists) {
      console.log("Adding Shan to the database...");
      
      const shanStylingDetails = [
        {
          occasion: "Film Premieres",
          outfit: {
            designer: "HSY, Republic",
            price: "$800-$2,500",
            details: "Elegant formal suits and traditional wear for red carpet events and film premieres"
          },
          image: "/assets/shan/premiere.jpg"
        },
        {
          occasion: "Award Shows",
          outfit: {
            designer: "Deepak Perwani, Amir Adnan",
            price: "$600-$1,800",
            details: "Sophisticated sherwanis and contemporary formal wear for award ceremonies"
          },
          image: "/assets/shan/awards.jpg"
        },
        {
          occasion: "Cultural Events",
          outfit: {
            designer: "Munib Nawaz",
            price: "$400-$1,200",
            details: "Traditional Pakistani formal wear and cultural outfits for heritage events"
          },
          image: "/assets/shan/cultural.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Shan",
        profession: "Actor, Producer, Director",
        imageUrl: "/assets/shan/profile.jpg",
        description: "Renowned Pakistani actor, producer, and director known for his versatile performances in Urdu and Punjabi cinema. One of the most successful actors in Pakistani film industry.",
        category: "Fashion",
        managerInfo: {
          name: "Shan Productions",
          agency: "SP Entertainment",
          email: "info@shanproductions.com",
          phone: "+92 42 35770001",
          bookingInquiries: "For film projects and endorsements, contact Shan Productions."
        },
        stylingDetails: shanStylingDetails
      });
      
      console.log("Shan successfully added to the database!");
    }

    // Add Nauman Ejaz
    const naumanExists = celebritiesArray.some(celeb => celeb.name === "Nauman Ejaz");
    if (!naumanExists) {
      console.log("Adding Nauman Ejaz to the database...");
      
      const naumanStylingDetails = [
        {
          occasion: "Drama Serials",
          outfit: {
            designer: "Ismail Farid, Charcoal",
            price: "$500-$1,500",
            details: "Character-appropriate formal and traditional wear for television dramas"
          },
          image: "/assets/nauman-ejaz/drama.jpg"
        },
        {
          occasion: "Award Functions",
          outfit: {
            designer: "Republic, Amir Adnan",
            price: "$700-$2,000",
            details: "Elegant formal suits and traditional sherwanis for industry award events"
          },
          image: "/assets/nauman-ejaz/awards.jpg"
        },
        {
          occasion: "Media Appearances",
          outfit: {
            designer: "Munib Nawaz, HSY",
            price: "$400-$1,200",
            details: "Smart casual and formal wear for interviews and media interactions"
          },
          image: "/assets/nauman-ejaz/media.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Nauman Ejaz",
        profession: "Actor, Television Personality",
        imageUrl: "/assets/nauman-ejaz/profile.jpg",
        description: "Veteran Pakistani actor known for his powerful performances in television dramas and films. Acclaimed for his versatile acting skills and strong screen presence.",
        category: "Fashion",
        managerInfo: {
          name: "Nauman Ejaz Management",
          agency: "NE Productions",
          email: "info@naumanejaz.com",
          phone: "+92 42 35667788",
          bookingInquiries: "For drama projects and endorsements, please contact management."
        },
        stylingDetails: naumanStylingDetails
      });
      
      console.log("Nauman Ejaz successfully added to the database!");
    }

    // Add Feroz Khan
    const ferozExists = celebritiesArray.some(celeb => celeb.name === "Feroz Khan");
    if (!ferozExists) {
      console.log("Adding Feroz Khan to the database...");
      
      const ferozStylingDetails = [
        {
          occasion: "Film Industry Events",
          outfit: {
            designer: "Republic, Amir Adnan",
            price: "$600-$1,800",
            details: "Classic formal suits and contemporary wear for film industry gatherings"
          },
          image: "/assets/feroz-khan/film-events.jpg"
        },
        {
          occasion: "Award Ceremonies",
          outfit: {
            designer: "HSY, Deepak Perwani",
            price: "$800-$2,200",
            details: "Sophisticated formal wear and traditional outfits for award shows"
          },
          image: "/assets/feroz-khan/awards.jpg"
        },
        {
          occasion: "Cultural Functions",
          outfit: {
            designer: "Munib Nawaz, Ismail Farid",
            price: "$400-$1,000",
            details: "Traditional Pakistani formal wear for cultural and heritage events"
          },
          image: "/assets/feroz-khan/cultural.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Feroz Khan",
        profession: "Actor, Producer",
        imageUrl: "/assets/feroz-khan/profile.jpg",
        description: "Accomplished Pakistani actor and producer known for his impactful performances in both television and film. A respected figure in the Pakistani entertainment industry.",
        category: "Fashion",
        managerInfo: {
          name: "Feroz Khan Productions",
          agency: "FK Entertainment",
          email: "info@ferozkhan.com",
          phone: "+92 21 34567890",
          bookingInquiries: "For acting projects and collaborations, contact FK Entertainment."
        },
        stylingDetails: ferozStylingDetails
      });
      
      console.log("Feroz Khan successfully added to the database!");
    }

    // Add Yashma Gill
    const yashmaExists = celebritiesArray.some(celeb => celeb.name === "Yashma Gill");
    if (!yashmaExists) {
      console.log("Adding Yashma Gill to the database...");
      
      const yashmaStylingDetails = [
        {
          occasion: "Drama Serial Fashion",
          outfit: {
            designer: "Sana Safinaz, Maria B",
            price: "$300-$1,200",
            details: "Contemporary and traditional Pakistani outfits for television drama appearances"
          },
          image: "/assets/yashma-gill/drama.jpg"
        },
        {
          occasion: "Award Shows",
          outfit: {
            designer: "HSY, Faraz Manan",
            price: "$800-$2,500",
            details: "Glamorous gowns and elegant formal wear for entertainment industry events"
          },
          image: "/assets/yashma-gill/awards.jpg"
        },
        {
          occasion: "Fashion Events",
          outfit: {
            designer: "Zara Shahjahan, Elan",
            price: "$500-$1,800",
            details: "Designer wear and contemporary fashion for fashion week and style events"
          },
          image: "/assets/yashma-gill/fashion.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Yashma Gill",
        profession: "Actress, Model",
        imageUrl: "/assets/yashma-gill/profile.jpg",
        description: "Rising Pakistani actress and model known for her versatile performances in television dramas. Recognized for her fashion sense and screen presence.",
        category: "Fashion",
        managerInfo: {
          name: "Yashma Gill Management",
          agency: "YG Productions",
          email: "info@yashmag.com",
          phone: "+92 21 35567891",
          bookingInquiries: "For acting and modeling projects, please contact management."
        },
        stylingDetails: yashmaStylingDetails
      });
      
      console.log("Yashma Gill successfully added to the database!");
    }

    // Add Mawra Hocane
    const mawraExists = celebritiesArray.some(celeb => celeb.name === "Mawra Hocane");
    if (!mawraExists) {
      console.log("Adding Mawra Hocane to the database...");
      
      const mawraStylingDetails = [
        {
          occasion: "Red Carpet Events",
          outfit: {
            designer: "Faraz Manan, HSY",
            price: "$1,000-$3,500",
            details: "Elegant gowns and sophisticated formal wear for high-profile entertainment events"
          },
          image: "/assets/mawra-hocane/red-carpet.jpg"
        },
        {
          occasion: "Fashion Shoots",
          outfit: {
            designer: "Sana Safinaz, Elan",
            price: "$600-$2,200",
            details: "High-fashion outfits and contemporary designs for magazine shoots and campaigns"
          },
          image: "/assets/mawra-hocane/fashion-shoot.jpg"
        },
        {
          occasion: "Cultural Events",
          outfit: {
            designer: "Maria B, Zara Shahjahan",
            price: "$400-$1,500",
            details: "Traditional Pakistani formal wear and cultural outfits for heritage events"
          },
          image: "/assets/mawra-hocane/cultural.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Mawra Hocane",
        profession: "Actress, Model, Fashion Icon",
        imageUrl: "/assets/mawra-hocane/profile.jpg",
        description: "Prominent Pakistani actress and model known for her work in television dramas and films. Recognized as a fashion icon with a significant social media following.",
        category: "Fashion",
        managerInfo: {
          name: "Mawra Hocane Management",
          agency: "MH Productions",
          email: "info@mawrahocane.com",
          phone: "+92 21 35667892",
          bookingInquiries: "For film, drama, and endorsement opportunities, contact MH Productions."
        },
        stylingDetails: mawraStylingDetails
      });
      
      console.log("Mawra Hocane successfully added to the database!");
    }

    // Add HSY (Hassan Sheheryar Yasin)
    const hsyExists = celebritiesArray.some(celeb => celeb.name === "HSY");
    if (!hsyExists) {
      console.log("Adding HSY to the database...");
      
      const hsyStylingDetails = [
        {
          occasion: "Fashion Week Shows",
          outfit: {
            designer: "HSY Couture",
            price: "$2,000-$8,000",
            details: "Signature haute couture pieces featuring intricate embellishments and contemporary Pakistani fashion design"
          },
          image: "/assets/hsy/fashion-week.jpg"
        },
        {
          occasion: "Celebrity Styling",
          outfit: {
            designer: "HSY Custom",
            price: "$1,500-$5,000",
            details: "Bespoke outfits created for celebrities and high-profile clients with unique design elements"
          },
          image: "/assets/hsy/celebrity-styling.jpg"
        },
        {
          occasion: "Personal Style",
          outfit: {
            designer: "International Brands, HSY",
            price: "$500-$3,000",
            details: "Eclectic mix of international fashion and personal HSY designs showcasing bold fashion choices"
          },
          image: "/assets/hsy/personal.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "HSY",
        profession: "Fashion Designer, TV Personality, Style Icon",
        imageUrl: "/assets/hsy/profile.jpg",
        description: "Hassan Sheheryar Yasin, known as HSY, is Pakistan's leading fashion designer and television personality. Renowned for his avant-garde designs, celebrity styling, and contributions to Pakistani haute couture.",
        category: "Fashion",
        managerInfo: {
          name: "HSY Design House",
          agency: "HSY Fashion Studio",
          email: "info@hsy.com.pk",
          phone: "+92 42 35711234",
          bookingInquiries: "For fashion collaborations, celebrity styling, and couture orders, contact HSY Design House."
        },
        stylingDetails: hsyStylingDetails
      });
      
      console.log("HSY successfully added to the database!");
    }

    // Add Humayun Saeed
    const humayunExists = celebritiesArray.some(celeb => celeb.name === "Humayun Saeed");
    if (!humayunExists) {
      console.log("Adding Humayun Saeed to the database...");
      
      const humayunStylingDetails = [
        {
          occasion: "Film Premieres",
          outfit: {
            designer: "HSY, Republic",
            price: "$800-$2,500",
            details: "Sophisticated formal suits and traditional sherwanis for red carpet events and film premieres"
          },
          image: "/assets/humayun-saeed/premiere.jpg"
        },
        {
          occasion: "Award Shows",
          outfit: {
            designer: "Amir Adnan, Deepak Perwani",
            price: "$600-$2,000",
            details: "Elegant formal wear and contemporary suits for entertainment industry awards"
          },
          image: "/assets/humayun-saeed/awards.jpg"
        },
        {
          occasion: "Media Appearances",
          outfit: {
            designer: "Charcoal, Munib Nawaz",
            price: "$400-$1,200",
            details: "Smart casual and business formal wear for interviews and media events"
          },
          image: "/assets/humayun-saeed/media.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Humayun Saeed",
        profession: "Actor, Producer, Television Personality",
        imageUrl: "/assets/humayun-saeed/profile.jpg",
        description: "One of Pakistan's most successful actors and producers, known for his leading roles in television dramas and films. A prominent figure in the Pakistani entertainment industry with multiple hit productions.",
        category: "Fashion",
        managerInfo: {
          name: "Six Sigma Plus Productions",
          agency: "HS Entertainment",
          email: "info@humayunsaeed.com",
          phone: "+92 21 35667893",
          bookingInquiries: "For film, drama, and production opportunities, contact Six Sigma Plus Productions."
        },
        stylingDetails: humayunStylingDetails
      });
      
      console.log("Humayun Saeed successfully added to the database!");
    }

    // Add Wasim Akram
    const wasimExists = celebritiesArray.some(celeb => celeb.name === "Wasim Akram");
    if (!wasimExists) {
      console.log("Adding Wasim Akram to the database...");
      
      const wasimStylingDetails = [
        {
          occasion: "Cricket Commentary",
          outfit: {
            designer: "Ermenegildo Zegna, Hugo Boss",
            price: "$1,500-$3,000",
            details: "Sharp tailored suits and sophisticated formal wear for cricket commentary and analysis"
          },
          image: "/assets/wasim-akram/commentary.jpg"
        },
        {
          occasion: "Sports Events",
          outfit: {
            designer: "Armani, Ralph Lauren",
            price: "$800-$2,200",
            details: "Smart casual blazers and premium sportswear for cricket-related events and ceremonies"
          },
          image: "/assets/wasim-akram/sports-events.jpg"
        },
        {
          occasion: "Awards & Recognition",
          outfit: {
            designer: "Tom Ford, Brioni",
            price: "$2,000-$4,000",
            details: "Luxury formal wear and tuxedos for prestigious award ceremonies and hall of fame events"
          },
          image: "/assets/wasim-akram/awards.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Wasim Akram",
        profession: "Cricket Legend, Sports Commentator",
        imageUrl: "/assets/wasim-akram/profile.jpg",
        description: "Legendary Pakistani fast bowler known as the 'Sultan of Swing'. One of the greatest left-arm fast bowlers in cricket history, now a respected cricket commentator and analyst. Known for his sophisticated style and sportsmanship.",
        category: "Sports",
        managerInfo: {
          name: "Wasim Akram Sports Management",
          agency: "WA Sports Consulting",
          email: "info@wasimakram.com",
          phone: "+92 21 35667894",
          bookingInquiries: "For cricket commentary, endorsements, and sports consulting, contact WA Sports Consulting."
        },
        stylingDetails: wasimStylingDetails
      });
      
      console.log("Wasim Akram successfully added to the database!");
    }

    // Add Ayeza Khan
    const ayezaExists = celebritiesArray.some(celeb => celeb.name === "Ayeza Khan");
    if (!ayezaExists) {
      console.log("Adding Ayeza Khan to the database...");
      
      const ayezaStylingDetails = [
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
      ];

      await storage.createCelebrity({
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
        stylingDetails: ayezaStylingDetails
      });
      
      console.log("Ayeza Khan successfully added to the database!");
    }

    // Add Atif Aslam with specific ID 115 (to replace Iqra Aziz for VIP section)
    const atifExists = celebritiesArray.some(celeb => celeb.name === "Atif Aslam");
    if (!atifExists) {
      console.log("Adding Atif Aslam to the database with ID 115...");
      
      // Check if ID 115 is already taken and reassign if necessary
      const existingCeleb115 = celebritiesArray.find(celeb => celeb.id === 115);
      if (existingCeleb115) {
        console.log(`ID 115 is taken by ${existingCeleb115.name}, reassigning them to a new ID...`);
        
        // Save the existing celebrity's data
        const savedCelebData = {
          name: existingCeleb115.name,
          profession: existingCeleb115.profession,
          imageUrl: existingCeleb115.imageUrl,
          description: existingCeleb115.description,
          category: existingCeleb115.category,
          managerInfo: existingCeleb115.managerInfo,
          stylingDetails: existingCeleb115.stylingDetails
        };
        
        // Delete the existing celebrity from ID 115
        await storage.deleteCelebrity(115);
        console.log(`Deleted ${existingCeleb115.name} from ID 115`);
        
        // Recreate them with a new auto-assigned ID
        await storage.createCelebrity(savedCelebData);
        console.log(`Recreated ${existingCeleb115.name} with new auto-assigned ID`);
      }
      
      const atifStylingDetails = [
        {
          occasion: "Concert Performances",
          outfit: {
            designer: "Contemporary Stage Wear",
            price: "$800-$2,500",
            details: "Modern fitted shirts, branded jackets, and comfortable stage attire suitable for live music performances and international concerts"
          },
          image: "/assets/atif-aslam/concerts.jpg"
        },
        {
          occasion: "Award Shows & Red Carpet",
          outfit: {
            designer: "HSY, Amir Adnan",
            price: "$1,200-$3,500",
            details: "Elegant sherwanis, tailored suits, and traditional Pakistani formal wear for prestigious music award ceremonies and red carpet events"
          },
          image: "/assets/atif-aslam/awards.jpg"
        },
        {
          occasion: "Music Video Shoots",
          outfit: {
            designer: "International Brands, Republic",
            price: "$600-$2,000",
            details: "High-fashion outfits and contemporary designs for music video productions and artistic collaborations"
          },
          image: "/assets/atif-aslam/music-videos.jpg"
        }
      ];

      // Use the new createCelebrityWithId method to assign ID 115 specifically
      await storage.createCelebrityWithId({
        name: "Atif Aslam",
        profession: "Singer, Songwriter, Actor",
        imageUrl: "/assets/image_1754012564135.png",
        description: "Pakistan's most celebrated playback singer and pop icon with a distinctive voice that has captivated audiences across South Asia. Known for his romantic ballads, Sufi music, and Bollywood soundtracks, Atif has won numerous awards and has a massive international following.",
        category: "Entertainment",
        managerInfo: {
          name: "Tariq Ahmed Productions",
          agency: "Atif Aslam Music Management",
          email: "management@atifahslamusic.com",
          phone: "+92 21 35667897",
          bookingInquiries: "For concert bookings, music collaborations, and entertainment projects, contact Tariq Ahmed Productions."
        },
        stylingDetails: atifStylingDetails
      }, 115);
      
      console.log("Atif Aslam successfully added to the database with ID 115!");
    }

    // Add Mehwish Hayat
    const mehwishExists = celebritiesArray.some(celeb => celeb.name === "Mehwish Hayat");
    if (!mehwishExists) {
      console.log("Adding Mehwish Hayat to the database...");
      
      const mehwishStylingDetails = [
        {
          occasion: "Film Premieres",
          outfit: {
            designer: "HSY, Faraz Manan",
            price: "$1,000-$3,500",
            details: "Glamorous gowns and sophisticated formal wear for film premieres and red carpet events"
          },
          image: "/assets/mehwish-hayat/premiere.jpg"
        },
        {
          occasion: "International Events",
          outfit: {
            designer: "International Designers, Elan",
            price: "$1,200-$4,000",
            details: "High-fashion outfits and designer wear for international film festivals and cultural events"
          },
          image: "/assets/mehwish-hayat/international.jpg"
        },
        {
          occasion: "Award Ceremonies",
          outfit: {
            designer: "Zara Shahjahan, Republic",
            price: "$800-$2,500",
            details: "Elegant formal wear and traditional outfits for entertainment industry award shows"
          },
          image: "/assets/mehwish-hayat/awards.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Mehwish Hayat",
        profession: "Actress, Singer, Model",
        imageUrl: "/assets/mehwish-hayat/profile.jpg",
        description: "Acclaimed Pakistani actress, singer, and model known for her work in films and television. Recipient of Pakistan's highest civilian honor, Tamgha-e-Imtiaz, for her contributions to the arts.",
        category: "Fashion",
        managerInfo: {
          name: "Mehwish Hayat Productions",
          agency: "MH Entertainment",
          email: "info@mehwishhayat.com",
          phone: "+92 21 35667897",
          bookingInquiries: "For film projects, music collaborations, and endorsements, contact MH Entertainment."
        },
        stylingDetails: mehwishStylingDetails
      });
      
      console.log("Mehwish Hayat successfully added to the database!");
    }

    // Add Imran Abbas
    const imranAbbasExists = celebritiesArray.some(celeb => celeb.name === "Imran Abbas");
    if (!imranAbbasExists) {
      console.log("Adding Imran Abbas to the database...");
      
      const imranAbbasStylingDetails = [
        {
          occasion: "Drama Serial Fashion",
          outfit: {
            designer: "Amir Adnan, Republic",
            price: "$600-$2,000",
            details: "Sophisticated formal and casual wear for television drama appearances"
          },
          image: "/assets/imran-abbas/drama.jpg"
        },
        {
          occasion: "Fashion Events",
          outfit: {
            designer: "HSY, Deepak Perwani",
            price: "$800-$2,500",
            details: "Contemporary formal wear and designer suits for fashion week and style events"
          },
          image: "/assets/imran-abbas/fashion.jpg"
        },
        {
          occasion: "Award Shows",
          outfit: {
            designer: "Charcoal, Munib Nawaz",
            price: "$700-$2,200",
            details: "Elegant formal suits and traditional sherwanis for entertainment industry awards"
          },
          image: "/assets/imran-abbas/awards.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Imran Abbas",
        profession: "Actor, Model, Singer",
        imageUrl: "/assets/imran-abbas/profile.jpg",
        description: "Versatile Pakistani actor, model, and singer known for his work in television dramas and films. Recognized for his good looks and acting versatility across different genres.",
        category: "Fashion",
        managerInfo: {
          name: "Imran Abbas Management",
          agency: "IAM Entertainment",
          email: "info@imranabbas.com",
          phone: "+92 21 35667898",
          bookingInquiries: "For acting, modeling, and music projects, contact IAM Entertainment."
        },
        stylingDetails: imranAbbasStylingDetails
      });
      
      console.log("Imran Abbas successfully added to the database!");
    }

    // Add Danish Taimoor
    const danishExists = celebritiesArray.some(celeb => celeb.name === "Danish Taimoor");
    if (!danishExists) {
      console.log("Adding Danish Taimoor to the database...");
      
      const danishStylingDetails = [
        {
          occasion: "Television Dramas",
          outfit: {
            designer: "Republic, Amir Adnan",
            price: "$500-$1,800",
            details: "Contemporary formal and casual wear for drama serial appearances"
          },
          image: "/assets/danish-taimoor/drama.jpg"
        },
        {
          occasion: "Award Functions",
          outfit: {
            designer: "HSY, Deepak Perwani",
            price: "$700-$2,200",
            details: "Sophisticated formal suits and traditional wear for entertainment industry events"
          },
          image: "/assets/danish-taimoor/awards.jpg"
        },
        {
          occasion: "Media Appearances",
          outfit: {
            designer: "Charcoal, Munib Nawaz",
            price: "$400-$1,200",
            details: "Smart casual and business formal wear for interviews and media interactions"
          },
          image: "/assets/danish-taimoor/media.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Danish Taimoor",
        profession: "Actor, Television Personality",
        imageUrl: "/assets/danish-taimoor/profile.jpg",
        description: "Popular Pakistani actor and television personality known for his versatile performances in drama serials and films. Recognized for his natural acting style and screen presence.",
        category: "Fashion",
        managerInfo: {
          name: "Danish Taimoor Productions",
          agency: "DT Entertainment",
          email: "info@danishtaimoor.com",
          phone: "+92 21 35667899",
          bookingInquiries: "For drama projects and television appearances, contact DT Entertainment."
        },
        stylingDetails: danishStylingDetails
      });
      
      console.log("Danish Taimoor successfully added to the database!");
    }

  } catch (error) {
    console.error("Error adding more Pakistani celebrities to database:", error);
  }
}

// Function will be called from server/index.ts during startup