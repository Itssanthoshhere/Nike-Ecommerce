"use client";

import { Suspense } from "react";
import ContactPage from "./ContactPage"; // move your JSX into ContactPage.tsx

export default function ContactWrapper() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ContactPage />
        </Suspense>
    );
}
