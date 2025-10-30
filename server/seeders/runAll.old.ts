import dotenv from 'dotenv';
import { seedCelebrities } from './celebrities';
import { seedBrands } from './brands';
import { seedCategories } from './categories';
import { seedCelebrityProducts } from './celebrity_products';
import { seedBlogs } from './blogs';

dotenv.config();

async function runAll() {
  console.log('🌱 Running module seeders...');
  await seedCategories();
  await seedCelebrities();
  await seedBrands();
  await seedCelebrityProducts();
  await seedBlogs();
  console.log('🎉 Module seeders completed');
}

runAll().catch(err => {
  console.error('❌ Error running seeders:', err);
  process.exitCode = 1;
});