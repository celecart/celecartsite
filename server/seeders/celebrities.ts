import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { celebrities, type InsertCelebrity } from '../../shared/schema';

// Load environment variables
dotenv.config();

export async function seedCelebrities() {
  const initialized = initDbFromEnv();
  if (!initialized || !db) {
    console.log('❌ Database not initialized');
    return;
  }
  const connected = await verifyDbConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    return;
  }

  // Check if already seeded
  const existing = await db.select().from(celebrities).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Celebrities table already has data, skipping seed');
    return;
  }

  const rows: InsertCelebrity[] = [
    {
      userId: null,
      name: 'Emma Stone',
      profession: 'Actor',
      imageUrl: 'https://cdn.celecart.example/images/emma-stone.jpg',
      description: 'Academy Award-winning actress known for versatile roles.',
      category: 'Red Carpet',
      isActive: true,
      isElite: true,
      managerInfo: null,
      stylingDetails: [
        {
          occasion: 'Oscars',
          outfit: {
            designer: 'Louis Vuitton',
            price: '$4500',
            details: 'Embellished corset gown',
            purchaseLink: 'https://example.com/purchase/emma-oscars-gown'
          },
          image: 'https://cdn.celecart.example/images/emma-oscars.jpg'
        }
      ]
    },
    {
      userId: null,
      name: 'Lionel Messi',
      profession: 'Athlete',
      imageUrl: 'https://cdn.celecart.example/images/lionel-messi.jpg',
      description: 'Football legend with global influence.',
      category: 'Street Style',
      isActive: true,
      isElite: false,
      managerInfo: null,
      stylingDetails: null
    },
    {
      userId: null,
      name: 'Taylor Swift',
      profession: 'Singer',
      imageUrl: 'https://cdn.celecart.example/images/taylor-swift.jpg',
      description: 'Pop icon and record-breaking performer.',
      category: 'Concert',
      isActive: true,
      isElite: true,
      managerInfo: null,
      stylingDetails: [
        {
          occasion: 'Eras Tour',
          outfit: {
            designer: 'Versace',
            price: '$5200',
            details: 'Sequined bodysuit with fringes'
          },
          image: 'https://cdn.celecart.example/images/ts-eras.jpg'
        }
      ]
    }
  ];

  await db.insert(celebrities).values(rows);
  console.log('✅ Seeded celebrities (3 records)');
}

// Allow running standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCelebrities().catch(err => {
    console.error('❌ Error seeding celebrities:', err);
    process.exitCode = 1;
  });
}