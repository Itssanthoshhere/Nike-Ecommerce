
"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useCartStore} from "@/store/cart.store";
import {getCart} from "@/lib/actions/cart";
import {useRouter, useSearchParams} from "next/navigation";
import {withUpdatedParams} from "@/lib/utils/query";
import {Menu, X} from "lucide-react"; // 👈 icons for hamburger

const NAV_LINKS = [
    {label: "Men", href: "/products?gender=men"},
    {label: "Women", href: "/products?gender=women"},
    {label: "Kids", href: "/products?gender=unisex"},
    {label: "Collections", href: "/collections"},
    {label: "Contact", href: "/contact"},
] as const;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const {count, setCart} = useCartStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCart().then(setCart).catch(() => {
        });
    }, [setCart]);

    useEffect(() => {
        const q = searchParams?.get("search") || "";
        setSearch(q);
    }, [searchParams]);

    function submitSearch(e: React.FormEvent) {
        e.preventDefault();
        const next = withUpdatedParams("/products", "", {
            search: search.trim() || undefined,
        });
        router.push(next);
        setOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 bg-light-100">
            <nav
                className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
                aria-label="Primary"
            >
                {/* Logo */}
                <Link href="/" aria-label="Nike Home" className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="Nike"
                        width={28}
                        height={28}
                        priority
                        className="invert"
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="items-center hidden gap-8 md:flex">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className="transition-colors text-body text-dark-900 hover:text-dark-700"
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop Search + Cart */}
                <div className="items-center hidden gap-6 md:flex">
                    <form onSubmit={submitSearch} className="hidden gap-2 md:flex">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                            className="h-9 w-56 rounded-full border border-light-300 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                        />
                    </form>
                    <Link
                        href="/cart"
                        className="transition-colors text-body text-dark-900 hover:text-dark-700"
                    >
                        My Cart ({count})
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md md:hidden focus:outline-none"
                    aria-controls="mobile-menu"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? <X size={28} className="text-dark-900"/> : <Menu size={28} className="text-dark-900"/>}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`md:hidden transition-all duration-300 ${
                    open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <ul className="px-4 py-3 space-y-2">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className="block py-2 text-body text-dark-900 hover:text-dark-700"
                                onClick={() => setOpen(false)}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                    <li className="flex items-center justify-between pt-2">
                        <form onSubmit={submitSearch} className="flex-1">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products"
                                className="w-full rounded-full border border-light-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                            />
                        </form>
                        <Link href="/cart" className="ml-3 text-body">
                            My Cart ({count})
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
