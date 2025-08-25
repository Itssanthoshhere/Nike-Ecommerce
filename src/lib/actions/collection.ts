"use server";

import { db } from "@/lib/db";
import { desc, eq, sql } from "drizzle-orm";
import {
    collections,
    productCollections,
    products,
    productImages,
    productVariants,
    genders,
} from "@/lib/db/schema";

export type CollectionListItem = {
    id: string;
    name: string;
    slug: string;
    productCount: number;
};

export async function getCollections(): Promise<CollectionListItem[]> {
    const rows = await db
        .select({
            id: collections.id,
            name: collections.name,
            slug: collections.slug,
            productCount: sql<number>`count(${productCollections.productId})`.as("cnt"),
        })
        .from(collections)
        .leftJoin(productCollections, eq(productCollections.collectionId, collections.id))
        .groupBy(collections.id, collections.name, collections.slug)
        .orderBy(desc(collections.createdAt));
    return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, productCount: Number(r.productCount) }));
}

export type CollectionProductItem = {
    id: string;
    title: string;
    imageUrl: string | null;
    price: number | null;
    subtitle?: string | null;
};

export async function getCollectionProducts(slug: string): Promise<{ name: string; products: CollectionProductItem[] } | null> {
    const col = await db.select().from(collections).where(eq(collections.slug, slug)).limit(1);
    if (!col.length) return null;
    const c = col[0]!;

    const v = db
        .select({ productId: productVariants.productId, price: sql<number>`${productVariants.price}::numeric`.as("price") })
        .from(productVariants)
        .as("v");
    const pi = db
        .select({ productId: productImages.productId, url: productImages.url })
        .from(productImages)
        .as("pi");

    const rows = await db
        .select({
            id: products.id,
            title: products.name,
            minPrice: sql<number | null>`min(${v.price})`,
            imageUrl: sql<string | null>`max(${pi.url})`,
            subtitle: genders.label,
        })
        .from(products)
        .innerJoin(productCollections, eq(productCollections.productId, products.id))
        .leftJoin(v, eq(v.productId, products.id))
        .leftJoin(pi, eq(pi.productId, products.id))
        .leftJoin(genders, eq(genders.id, products.genderId))
        .where(eq(productCollections.collectionId, c.id))
        .groupBy(products.id, products.name, genders.label)
        .orderBy(desc(products.createdAt));

    const out: CollectionProductItem[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl,
        price: r.minPrice === null ? null : Number(r.minPrice),
        subtitle: r.subtitle ? `${r.subtitle} Shoes` : null,
    }));
    return { name: c.name, products: out };
}