import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components";
import { getAllProducts } from "@/lib/actions/product";

const Home = async () => {
    const { products } = await getAllProducts({ limit: 6 });

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="relative h-[650px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/assets/bg-running.png" // <-- blurred running people image
                    alt="Background"
                    fill
                    className="object-cover"
                />

                {/* Overlay Gradient (optional to make text pop) */}
                {/*<div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>*/}

                <div className="relative flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
                    <div className="max-w-xl">
                        <p className="px-11 mt-32 text-sm font-semibold text-red-500">Bold & Sporty</p>
                        <h1 className="px-11 mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Style That Moves <br /> With You.
                        </h1>
                        <p className="px-11 mt-4 text-lg text-gray-600">
                            Not just style. Not just comfort. Footwear that effortlessly moves
                            with your every step.
                        </p>
                        <Link
                            href="/products"
                            className="ml-11 mt-6 inline-block rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800"
                        >
                            Find Your Shoe
                        </Link>
                    </div>
                </div>
            </section>


            {/* Best of Air Max */}
            <section className="py-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Best of Air Max</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.slice(0, 3).map((p, i) => {
                        const price =
                            p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                                ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
                                : p.minPrice !== null
                                    ? `$${p.minPrice.toFixed(2)}`
                                    : undefined;

                        const badges = ["Best Seller", "Extra 20% off", "Extra 10% off"];

                        return (
                            <div key={p.id} className="relative">
                                <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                                    {badges[i]}
                                </span>
                                <Card
                                    title={p.name}
                                    subtitle={p.subtitle ?? ""}
                                    imageSrc={p.imageUrl ?? "/shoes/shoe-1.jpg"}
                                    price={price}
                                    href={`/products/${p.id}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>


            {/* Trending Now */}
            <section className="py-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Trending Now</h2>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    {/* Hero Card */}
                    <div className="relative col-span-7 h-80 rounded-lg overflow-hidden">
                        <Image
                            src="/assets/trending-1.png"
                            alt="React Presto"
                            fill
                            className="object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-8">
                            <h3 className="text-3xl font-bold text-white">REACT PRESTO</h3>
                            <p className="mt-2 text-white/90">
                                With React foam for the most comfortable Presto ever.
                            </p>
                            <Link
                                href="/products"
                                className="mt-3 w-fit inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Two Cards */}
                    <div className="col-span-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Card 2 */}
                        <div className="relative h-80 rounded-lg overflow-hidden">
                            <Image
                                src="/assets/trending-2.png"
                                alt="Air Max Dia"
                                fill
                                className="object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                <h3 className="text-white text-lg font-semibold">
                                    Summer Must-Haves: Air Max Dia
                                </h3>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative h-80 rounded-lg overflow-hidden">
                            <Image
                                src="/assets/trending-3.png"
                                alt="Air Jordan Retro"
                                fill
                                className="object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                <h3 className="text-white text-lg font-semibold">
                                    Air Jordan 11 Retro Low LE
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="relative flex flex-col items-center justify-between gap-12 py-20 md:flex-row">
                {/* Left Content */}
                <div className="max-w-xl">
                    <p className="text-sm font-semibold text-red-500">Bold & Sporty</p>
                    <h2 className="mt-2 text-5xl font-extrabold text-gray-900 leading-tight">
                        NIKE REACT <br /> PRESTO BY YOU
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Take advantage of brand new, proprietary cushioning technology with a
                        fresh pair of Nike react shoes.
                    </p>
                    <Link
                        href="/products"
                        className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800"
                    >
                        Shop Now
                    </Link>
                </div>

                {/* Right Content (Shoe + BG Stripe) */}
                <div className="relative w-full max-w-2xl flex justify-center">
                    {/* Shoe Image */}
                    <Image
                        src="/assets/promo-shoe.png"
                        alt="Promo Shoe"
                        width={700}
                        height={500}
                        className="relative z-10 object-contain drop-shadow-2xl"
                    />
                </div>
            </section>


        </main>
    );
};

export default Home;
