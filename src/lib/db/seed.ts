import { db } from '@/lib/db';
import {
  genders, colors, sizes, brands, categories, collections, productCollections,
  products, productVariants, productImages,
  insertGenderSchema, insertColorSchema, insertSizeSchema, insertBrandSchema,
  insertCategorySchema, insertCollectionSchema, insertProductSchema, insertVariantSchema, insertProductImageSchema,
  type InsertProduct, type InsertVariant, type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mkdirSync, existsSync, cpSync } from 'fs';
import { join, basename } from 'path';
type ProductRow = typeof products.$inferSelect;
type VariantRow = typeof productVariants.$inferSelect;

type RGBHex = `#${string}`;

const log = (...args: unknown[]) => console.log('[seed]', ...args);
const err = (...args: unknown[]) => console.error('[seed:error]', ...args);

function pick<T>(arr: T[], n: number) {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && a.length; i++) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    log('Seeding filters: genders, colors, sizes');

    const genderRows = [
      insertGenderSchema.parse({ label: 'Men', slug: 'men' }),
      insertGenderSchema.parse({ label: 'Women', slug: 'women' }),
      insertGenderSchema.parse({ label: 'Unisex', slug: 'unisex' }),
    ];
    for (const row of genderRows) {
      const exists = await db.select().from(genders).where(eq(genders.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(genders).values(row);
    }

    const colorRows = [
      { name: 'Black', slug: 'black', hexCode: '#000000' as RGBHex },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' as RGBHex },
      { name: 'Red', slug: 'red', hexCode: '#FF0000' as RGBHex },
      { name: 'Blue', slug: 'blue', hexCode: '#1E3A8A' as RGBHex },
      { name: 'Green', slug: 'green', hexCode: '#10B981' as RGBHex },
      { name: 'Gray', slug: 'gray', hexCode: '#6B7280' as RGBHex },
    ].map((c) => insertColorSchema.parse(c));
    for (const row of colorRows) {
      const exists = await db.select().from(colors).where(eq(colors.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(colors).values(row);
    }

    const sizeRows = [
      { name: '7', slug: '7', sortOrder: 0 },
      { name: '8', slug: '8', sortOrder: 1 },
      { name: '9', slug: '9', sortOrder: 2 },
      { name: '10', slug: '10', sortOrder: 3 },
      { name: '11', slug: '11', sortOrder: 4 },
      { name: '12', slug: '12', sortOrder: 5 },
    ].map((s) => insertSizeSchema.parse(s));
    for (const row of sizeRows) {
      const exists = await db.select().from(sizes).where(eq(sizes.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(sizes).values(row);
    }

    log('Seeding brand: Nike');
    const brand = insertBrandSchema.parse({ name: 'Nike', slug: 'nike', logoUrl: undefined });
    {
      const exists = await db.select().from(brands).where(eq(brands.slug, brand.slug)).limit(1);
      if (!exists.length) await db.insert(brands).values(brand);
    }

    log('Seeding categories');
    const catRows = [
      { name: 'Shoes', slug: 'shoes', parentId: null },
      { name: 'Running Shoes', slug: 'running-shoes', parentId: null },
      { name: 'Lifestyle', slug: 'lifestyle', parentId: null },
    ].map((c) => insertCategorySchema.parse(c));
    for (const row of catRows) {
      const exists = await db.select().from(categories).where(eq(categories.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(categories).values(row);
    }

    log('Seeding collections');
    const collectionRows = [
      insertCollectionSchema.parse({ name: "Summer '25", slug: 'summer-25' }),
      insertCollectionSchema.parse({ name: 'New Arrivals', slug: 'new-arrivals' }),
    ];
    for (const row of collectionRows) {
      const exists = await db.select().from(collections).where(eq(collections.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(collections).values(row);
    }

    const allGenders = await db.select().from(genders);
    const allColors = await db.select().from(colors);
    const allSizes = await db.select().from(sizes);
    const nike = (await db.select().from(brands).where(eq(brands.slug, 'nike')))[0];
    const shoesCat = (await db.select().from(categories).where(eq(categories.slug, 'shoes')))[0];
    const runningCat = (await db.select().from(categories).where(eq(categories.slug, 'running-shoes')))[0];
    const lifestyleCat = (await db.select().from(categories).where(eq(categories.slug, 'lifestyle')))[0];
    const summer = (await db.select().from(collections).where(eq(collections.slug, 'summer-25')))[0];
    const newArrivals = (await db.select().from(collections).where(eq(collections.slug, 'new-arrivals')))[0];

    const uploadsRoot = join(process.cwd(), 'static', 'uploads', 'shoes');
    if (!existsSync(uploadsRoot)) {
      mkdirSync(uploadsRoot, { recursive: true });
    }

    const sourceDir = join(process.cwd(), 'public', 'shoes');
    const productNames = Array.from({ length: 15 }, (_, i) => `Nike Air Max ${i + 1}`);

    const sourceImages = [
      'shoe-1.jpg','shoe-2.webp','shoe-3.webp','shoe-4.webp','shoe-5.avif',
      'shoe-6.avif','shoe-7.avif','shoe-8.avif','shoe-9.avif','shoe-10.avif',
      'shoe-11.avif','shoe-12.avif','shoe-13.avif','shoe-14.avif','shoe-15.avif',
    ];

    log('Creating products with variants and images');
    for (let i = 0; i < productNames.length; i++) {
      const name = productNames[i];
      const gender = allGenders[randInt(0, allGenders.length - 1)];
      const catPick = [shoesCat, runningCat, lifestyleCat][randInt(0, 2)];
      const desc = `Experience comfort and performance with ${name}.`;

      const product = insertProductSchema.parse({
        name,
        description: desc,
        categoryId: catPick?.id ?? null,
        genderId: gender?.id ?? null,
        brandId: nike?.id ?? null,
        isPublished: true,
      });

      const retP = await db.insert(products).values(product as InsertProduct).returning();
      const insertedProduct = (retP as ProductRow[])[0];
      const colorChoices = pick(allColors, randInt(2, Math.min(4, allColors.length)));
      const sizeChoices = pick(allSizes, randInt(3, Math.min(6, allSizes.length)));

      const variantIds: string[] = [];
      let defaultVariantId: string | null = null;

      for (const color of colorChoices) {
        for (const size of sizeChoices) {
          const priceNum = Number((randInt(80, 200) + 0.99).toFixed(2));
          const discountedNum = Math.random() < 0.3 ? Number((priceNum - randInt(5, 25)).toFixed(2)) : null;
          const sku = `NIKE-${insertedProduct.id.slice(0, 8)}-${color.slug.toUpperCase()}-${size.slug.toUpperCase()}`;
          const variant = insertVariantSchema.parse({
            productId: insertedProduct.id,
            sku,
            price: priceNum.toFixed(2),
            salePrice: discountedNum !== null ? discountedNum.toFixed(2) : undefined,
            colorId: color.id,
            sizeId: size.id,
            inStock: randInt(5, 50),
            weight: Number((Math.random() * 1 + 0.5).toFixed(2)),
            dimensions: { length: 30, width: 20, height: 12 },
          });
          const retV = await db.insert(productVariants).values(variant as InsertVariant).returning();
          const created = (retV as VariantRow[])[0];
          variantIds.push(created.id);
          if (!defaultVariantId) defaultVariantId = created.id;

        }
      }

      if (defaultVariantId) {
        await db.update(products).set({ defaultVariantId }).where(eq(products.id, insertedProduct.id));
      }

      const pickName = sourceImages[i % sourceImages.length];
      const src = join(sourceDir, pickName);
      const destName = `${insertedProduct.id}-${basename(pickName)}`;
      const dest = join(uploadsRoot, destName);
      try {
        cpSync(src, dest);
        const img: InsertProductImage = insertProductImageSchema.parse({
          productId: insertedProduct.id,
          url: `/static/uploads/shoes/${destName}`,
          sortOrder: 0,
          isPrimary: true,
        });
        await db.insert(productImages).values(img);
      } catch (e) {
        err('Failed to copy product image', { src, dest, e });
      }

      const collectionsForProduct: { id: string }[] = Math.random() < 0.5 ? [summer] : ([newArrivals, summer].filter(Boolean) as { id: string }[]);
      for (const col of collectionsForProduct) {
        await db.insert(productCollections).values({
          productId: insertedProduct.id,
          collectionId: col.id,
        });
      }

      log(`Seeded product ${name} with ${variantIds.length} variants`);
    }

    log('Seeding complete');
  } catch (e) {
    err(e);
    process.exitCode = 1;
  }
}

seed();
