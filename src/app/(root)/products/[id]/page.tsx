import Link from "next/link";
import {Suspense} from "react";
import {Card, CollapsibleSection, ProductGallery, SizePicker, AddToCartButton} from "@/components";
import {Heart, Star} from "lucide-react";
import ColorSwatches from "@/components/ColorSwatches";
import {
    getProduct,
    getProductReviews,
    getRecommendedProducts,
    type Review,
    type RecommendedProduct
} from "@/lib/actions/product";

type GalleryVariant = { color: string; images: string[] };

function formatPrice(price: number | null | undefined) {
    if (price === null || price === undefined) return undefined;
    return `$${price.toFixed(2)}`;
}

function NotFoundBlock() {
    return (
        <section className="mx-auto max-w-3xl rounded-xl border border-light-300 bg-light-100 p-8 text-center">
            <h1 className="text-heading-3 text-dark-900">Product not found</h1>
            <p className="mt-2 text-body text-dark-700">The product you’re looking for doesn’t exist or may have been
                removed.</p>
            <div className="mt-6">
                <Link
                    href="/products"
                    className="inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                >
                    Browse Products
                </Link>
            </div>
        </section>
    );
}

async function ReviewsSection({productId}: { productId: string }) {
    const reviews: Review[] = await getProductReviews(productId);
    const count = reviews.length;
    const avg =
        count > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / count) : 0;

    return (
        <CollapsibleSection
            title={`Reviews (${count})`}
            rightMeta={
                <span className="flex items-center gap-1 text-dark-900">
          {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-[--color-dark-900]" : ""}`}/>
          ))}
        </span>
            }
        >
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.slice(0, 10).map((r) => (
                        <li key={r.id} className="rounded-lg border border-light-300 p-4">
                            <div className="mb-1 flex items-center justify-between">
                                <p className="text-body-medium text-dark-900">{r.author}</p>
                                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "fill-[--color-dark-900]" : ""}`}/>
                  ))}
                </span>
                            </div>
                            {r.title && <p className="text-body-medium text-dark-900">{r.title}</p>}
                            {r.content && <p className="mt-1 line-clamp-[8] text-body text-dark-700">{r.content}</p>}
                            <p className="mt-2 text-caption text-dark-700">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </CollapsibleSection>
    );
}

async function AlsoLikeSection({productId}: { productId: string }) {
    const recs: RecommendedProduct[] = await getRecommendedProducts(productId);
    if (!recs.length) return null;
    return (
        <section className="mt-16">
            <h2 className="mb-6 text-heading-3 text-dark-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recs.map((p) => (
                    <Card
                        key={p.id}
                        title={p.title}
                        imageSrc={p.imageUrl}
                        price={p.price ?? undefined}
                        href={`/products/${p.id}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default async function ProductDetailPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const data = await getProduct(id);

    if (!data) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="py-4 text-caption text-dark-700">
                    <Link href="/" className="hover:underline">Home</Link> / <Link href="/products"
                                                                                   className="hover:underline">Products</Link> /{" "}
                    <span className="text-dark-900">Not found</span>
                </nav>
                <NotFoundBlock/>
            </main>
        );
    }

    const {product, variants, images} = data;

    const galleryVariants: GalleryVariant[] = variants.map((v) => {
        const imgs = images
            .filter((img) => img.variantId === v.id)
            .map((img) => img.url);

        const fallback = images
            .filter((img) => img.variantId === null)
            .sort((a, b) => {
                if (a.isPrimary && !b.isPrimary) return -1;
                if (!a.isPrimary && b.isPrimary) return 1;
                return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
            })
            .map((img) => img.url);

        return {
            color: v.color?.name || "Default",
            images: imgs.length ? imgs : fallback,
        };
    }).filter((gv) => gv.images.length > 0);

    const defaultVariant =
        variants.find((v) => v.id === product.defaultVariantId) || variants[0];

    const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
    const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;

    const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;
    const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;

    const discount =
        compareAt && displayPrice && compareAt > displayPrice
            ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
            : null;

    const subtitle =
        product.gender?.label ? `${product.gender.label} Shoes` : undefined;

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="py-4 text-caption text-dark-700">
                <Link href="/" className="hover:underline">Home</Link> / <Link href="/products"
                                                                               className="hover:underline">Products</Link> /{" "}
                <span className="text-dark-900">{product.name}</span>
            </nav>

            <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
                {galleryVariants.length > 0 && (
                    <ProductGallery productId={product.id} variants={galleryVariants} className="lg:sticky lg:top-6"/>
                )}

                <div className="flex flex-col gap-6">
                    <header className="flex flex-col gap-2">
                        <h1 className="text-heading-2 text-dark-900">{product.name}</h1>
                        {subtitle && <p className="text-body text-dark-700">{subtitle}</p>}
                    </header>

                    <div className="flex items-center gap-3">
                        <p className="text-lead text-dark-900">{formatPrice(displayPrice)}</p>
                        {compareAt && (
                            <>
                                <span className="text-body text-dark-700 line-through">{formatPrice(compareAt)}</span>
                                {discount !== null && (
                                    <span
                                        className="rounded-full border border-light-300 px-2 py-1 text-caption text-[--color-green]">
                    {discount}% off
                  </span>
                                )}
                            </>
                        )}
                    </div>

                    <ColorSwatches productId={product.id} variants={galleryVariants}/>
                    <SizePicker/>

                    <div className="flex flex-col gap-3">
                        <AddToCartButton
                          productId={product.id}
                          variantIdsByColorIndex={variants.map(v => v.id)}
                        />
                        <button
                            className="flex items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4 text-body-medium text-dark-900 transition hover:border-dark-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
                            <Heart className="h-5 w-5"/>
                            Favorite
                        </button>
                    </div>

                    <CollapsibleSection title="Product Details" defaultOpen>
                        <p>{product.description}</p>
                    </CollapsibleSection>

                    <CollapsibleSection title="Shipping & Returns">
                        <p>Free standard shipping and free 30-day returns for Nike Members.</p>
                    </CollapsibleSection>

                    <Suspense
                        fallback={
                            <CollapsibleSection title="Reviews">
                                <p className="text-body text-dark-700">Loading reviews…</p>
                            </CollapsibleSection>
                        }
                    >
                        <ReviewsSection productId={product.id}/>
                    </Suspense>
                </div>
            </section>

            <Suspense
                fallback={
                    <section className="mt-16">
                        <h2 className="mb-6 text-heading-3 text-dark-900">You Might Also Like</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="h-64 animate-pulse rounded-xl bg-light-200"/>
                            ))}
                        </div>
                    </section>
                }
            >
                <AlsoLikeSection productId={product.id}/>
            </Suspense>
        </main>
    );
}