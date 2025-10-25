import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { blogs, users, celebrities, type InsertBlog, type InsertUser } from '../../shared/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

export async function seedBlogs() {
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

  const existing = await db.select().from(blogs).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Blogs table already has data, skipping seed');
    return;
  }

  // Ensure author user exists or create one
  const [author] = await db.select().from(users).where(eq(users.username, 'writer1')).limit(1);
  let authorId: number;
  if (!author) {
    const newUser: InsertUser = {
      username: 'writer1',
      password: null,
      email: 'writer1@example.com',
      googleId: null,
      displayName: 'Writer One',
      profilePicture: '',
      firstName: 'Writer',
      lastName: 'One',
      phone: '',
      accountStatus: 'Active',
      source: 'local',
      resetToken: null,
      resetTokenExpires: null,
    };
    const [inserted] = await db.insert(users).values(newUser).returning();
    authorId = inserted.id;
    console.log('✅ Created author user writer1');
  } else {
    authorId = author.id;
  }

  // Find celebrities by name to optionally link blogs
  const [emma] = await db.select().from(celebrities).where(eq(celebrities.name, 'Emma Stone')).limit(1);
  const [messi] = await db.select().from(celebrities).where(eq(celebrities.name, 'Lionel Messi')).limit(1);

  const rows: InsertBlog[] = [
    {
      title: 'Emma Stone Owns the Red Carpet',
      content: 'Emma Stone dazzled in Louis Vuitton, setting trends for the season.',
      excerpt: 'Emma Stone dazzled in Louis Vuitton',
      imageUrl: 'https://cdn.celecart.example/images/blogs/emma-red-carpet.jpg',
      authorId,
      celebrityId: emma?.id ?? null,
      category: 'fashion',
      tags: ['red-carpet', 'louis-vuitton'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likes: 0,
    },
    {
      title: 'Messi Street Style Essentials',
      content: 'Lionel Messi shows effortless style with streetwear staples.',
      excerpt: 'Messi shows effortless street style',
      imageUrl: 'https://cdn.celecart.example/images/blogs/messi-street.jpg',
      authorId,
      celebrityId: messi?.id ?? null,
      category: 'lifestyle',
      tags: ['street-style', 'sneakers'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likes: 0,
    },
    {
      title: 'Concert Looks That Shine',
      content: 'Top performance outfits that inspire fans and fashionistas.',
      excerpt: 'Top performance outfits',
      imageUrl: 'https://cdn.celecart.example/images/blogs/concert-looks.jpg',
      authorId,
      celebrityId: null,
      category: 'fashion',
      tags: ['concert', 'performance'],
      isPublished: false,
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likes: 0,
    }
  ];

  await db.insert(blogs).values(rows);
  console.log('✅ Seeded blogs (3 records)');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedBlogs().catch(err => {
    console.error('❌ Error seeding blogs:', err);
    process.exitCode = 1;
  });
}