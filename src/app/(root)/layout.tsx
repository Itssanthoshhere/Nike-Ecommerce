import { Suspense } from "react";
import { Navbar, Footer } from "@/components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-light-100">
            <Suspense fallback={<div className="h-16 bg-light-100" />}>
                <Navbar />
            </Suspense>
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}