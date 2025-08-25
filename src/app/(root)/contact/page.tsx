import { Suspense } from "react";
import ContactPage from "@/components/ContactPage";

export default function Contact() {
    return (
        <Suspense fallback={<div>Loading contact page...</div>}>
            <ContactPage />
        </Suspense>
    );
}
