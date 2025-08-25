import React from "react";
import {Card} from "@/components";
import {getAllProducts} from "@/lib/actions/product";

const Home = async () => {
    const {products, totalCount} = await getAllProducts({limit: 6});

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <section aria-labelledby="latest" className="pb-12">
                <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
                    Latest shoes
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => {
                        const price =
                            p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                                ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
                                : p.minPrice !== null
                                    ? p.minPrice
                                    : undefined;
                        return (
                            <Card
                                key={p.id}
                                title={p.name}
                                subtitle={p.subtitle ?? undefined}
                                imageSrc={p.imageUrl ?? "/shoes/shoe-1.jpg"}
                                price={price}
                                href={`/products/${p.id}`}
                            />
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

export default Home;