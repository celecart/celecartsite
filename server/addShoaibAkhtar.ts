import { storage } from './storage';

async function addShoaibAkhtar() {
  console.log('Adding Shoaib Akhtar to the database...');
  
  // Define styling details for Shoaib Akhtar
  const stylingDetails = [
    {
      occasion: 'Commentary Box',
      outfit: {
        designer: 'Ermenegildo Zegna',
        price: '$2,500',
        details: 'Sharp tailored suits and sophisticated formal wear for cricket commentary and analysis work',
        purchaseLink: 'https://www.zegna.com'
      },
      image: '/assets/shoaib-akhtar/commentary.jpg'
    },
    {
      occasion: 'Cricket Events',
      outfit: {
        designer: 'Hugo Boss',
        price: '$1,800',
        details: 'Smart casual blazers and premium sportswear for cricket-related events and award ceremonies',
        purchaseLink: 'https://www.hugoboss.com'
      },
      image: '/assets/shoaib-akhtar/cricket-events.jpg'
    },
    {
      occasion: 'Media Appearances',
      outfit: {
        designer: 'Armani',
        price: '$3,200',
        details: 'Bold fashion choices and statement pieces that reflect his confident personality',
        purchaseLink: 'https://www.armani.com'
      },
      image: '/assets/shoaib-akhtar/media.jpg'
    }
  ];

  // Add Shoaib Akhtar with styling details
  const shoaibAkhtar = await storage.createCelebrity({
    name: 'Shoaib Akhtar',
    profession: 'Former Cricket Legend',
    description: 'The fastest bowler in cricket history, known as the "Rawalpindi Express." Shoaib Akhtar holds the record for bowling the fastest delivery in cricket at 161.3 km/h (100.23 mph). A Pakistani cricket icon who represented his country in 46 Tests and 163 ODIs, taking 178 Test wickets and 247 ODI wickets. Beyond cricket, he\'s become a prominent sports commentator and style icon known for his bold fashion choices and charismatic personality.',
    imageUrl: '/assets/shoaib-akhtar/profile.jpg',
    category: 'Sports',
    stylingDetails: stylingDetails
  });

  // Add brand associations
  const brands = await storage.getBrands();
  
  // Associate with luxury brands
  const luxuryBrands = ['Rolex', 'Armani', 'Hugo Boss'];
  for (const brandName of luxuryBrands) {
    const brand = brands.find(b => b.name === brandName);
    if (brand) {
      await storage.createCelebrityBrand({
        celebrityId: shoaibAkhtar.id,
        brandId: brand.id,
        description: `Premium ${brandName.toLowerCase()} pieces worn by cricket legend Shoaib Akhtar`,
        itemType: brandName === 'Rolex' ? 'Watch' : 'Clothing',
        imagePosition: { top: '50%', left: '50%' },
        equipmentSpecs: {
          price: brandName === 'Rolex' ? '$15,000' : brandName === 'Armani' ? '$2,500' : '$1,800',
          purchaseLink: `https://www.${brandName.toLowerCase().replace(' ', '')}.com`,
          color: 'Various',
          stockStatus: 'Available'
        },
        relationshipStartYear: 2010
      });
    }
  }

  console.log('Shoaib Akhtar successfully added to the database!');
}

export { addShoaibAkhtar };