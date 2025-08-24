import { db } from './index';
import { products } from './schema';

const sampleProducts = [
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers unrivaled, all-day comfort. The shoe\'s design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
    price: '150.00',
    category: 'Sneakers',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red'],
    inStock: true,
    rating: '4.5',
    reviewCount: 128
  },
  {
    name: 'Nike Dri-FIT Training Shorts',
    description: 'The Nike Dri-FIT Training Shorts are made with sweat-wicking fabric that helps you stay dry and comfortable during your workout.',
    price: '45.00',
    category: 'Athletic Wear',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy'],
    inStock: true,
    rating: '4.3',
    reviewCount: 89
  },
  {
    name: 'Nike Zoom Pegasus 38',
    description: 'The Nike Zoom Pegasus 38 offers a smooth, responsive ride for your everyday runs. The breathable mesh upper provides a secure, comfortable fit.',
    price: '120.00',
    category: 'Running',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Blue', 'Green', 'Orange'],
    inStock: true,
    rating: '4.7',
    reviewCount: 156
  },
  {
    name: 'Nike Pro Combat Compression Shirt',
    description: 'The Nike Pro Combat Compression Shirt provides a second-skin fit that helps reduce muscle fatigue and improve performance.',
    price: '35.00',
    category: 'Athletic Wear',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    inStock: true,
    rating: '4.4',
    reviewCount: 67
  },
  {
    name: 'Nike Air Jordan 1 Retro High',
    description: 'The Air Jordan 1 Retro High features a classic design with premium materials and the iconic Jumpman logo.',
    price: '170.00',
    category: 'Basketball',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961b28f?w=500',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Red', 'Black', 'White'],
    inStock: true,
    rating: '4.8',
    reviewCount: 203
  }
];

export async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    await db.delete(products);
    
    // Insert sample products
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    
    console.log(`✅ Seeded ${insertedProducts.length} products`);
    return insertedProducts;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
