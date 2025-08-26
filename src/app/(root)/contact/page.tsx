// export default function ContactPage() {
//     return (
//         <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
//             <h1 className="text-heading-2 text-dark-900">Contact</h1>
//             <p className="mt-2 text-body text-dark-700">Have questions? Send us a message and we’ll get back to you.</p>
//             <form className="mt-6 space-y-4">
//                 <div>
//                     <label className="block text-caption text-dark-700">Name</label>
//                     <input className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="name" required />
//                 </div>
//                 <div>
//                     <label className="block text-caption text-dark-700">Email</label>
//                     <input type="email" className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="email" required />
//                 </div>
//                 <div>
//                     <label className="block text-caption text-dark-700">Message</label>
//                     <textarea className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="message" rows={6} required />
//                 </div>
//                 <button type="submit" className="px-6 py-3 rounded-full bg-dark-900 text-light-100">Send</button>
//             </form>
//         </main>
//     );
// }

// "use client";
//
// import {useState} from "react";
//
// export default function ContactPage() {
//     const [formData, setFormData] = useState({name: "", email: "", message: ""});
//     const [status, setStatus] = useState<null | string>(null);
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setFormData({...formData, [e.target.name]: e.target.value});
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setStatus("Sending...");
//
//         try {
//             const res = await fetch("/.netlify/functions/contact", {
//                 method: "POST",
//                 headers: {"Content-Type": "application/json"},
//                 body: JSON.stringify(formData),
//             });
//
//             const data = await res.json();
//             if (res.ok) {
//                 setStatus("Message sent successfully!");
//                 setFormData({name: "", email: "", message: ""});
//             } else {
//                 setStatus(data.error || "Failed to send message.");
//             }
//         } catch (err) {
//             setStatus("Failed to send message.");
//         }
//     };
//
//     return (
//         <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
//             <h1 className="text-heading-2 text-dark-900">Contact</h1>
//             <p className="mt-2 text-body text-dark-700">
//                 Have questions? Send us a message and we’ll get back to you.
//             </p>
//
//             <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//                 <div>
//                     <label className="block text-caption text-dark-700">Name</label>
//                     <input
//                         name="name"
//                         required
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
//                     />
//                 </div>
//
//                 <div>
//                     <label className="block text-caption text-dark-700">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         required
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
//                     />
//                 </div>
//
//                 <div>
//                     <label className="block text-caption text-dark-700">Message</label>
//                     <textarea
//                         name="message"
//                         rows={6}
//                         required
//                         value={formData.message}
//                         onChange={handleChange}
//                         className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
//                     />
//                 </div>
//
//                 <button
//                     type="submit"
//                     className="px-6 py-3 rounded-full bg-dark-900 text-light-100"
//                 >
//                     Send
//                 </button>
//             </form>
//
//             {status && <p className="mt-4 text-body text-dark-700">{status}</p>}
//         </main>
//     );
// }


"use client";

import {useState} from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({name: "", email: "", message: ""});
    };

    return (
        <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
            <h1 className="text-heading-2 text-dark-900">Contact</h1>
            <p className="mt-2 text-body text-dark-700">
                Have questions? Send us a message and we’ll get back to you.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-caption text-dark-700">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                    />
                </div>

                <div>
                    <label className="block text-caption text-dark-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                    />
                </div>

                <div>
                    <label className="block text-caption text-dark-700">Message</label>
                    <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-dark-900 text-light-100"
                >
                    Send
                </button>
            </form>

            {submitted && (
                <p className="mt-4 text-body text-dark-700">Form submitted successfully!</p>
            )}
        </main>
    );
}
