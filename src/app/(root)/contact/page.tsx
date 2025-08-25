export default function ContactPage() {
  return (
    <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <h1 className="text-heading-2 text-dark-900">Contact</h1>
      <p className="mt-2 text-body text-dark-700">Have questions? Send us a message and we’ll get back to you.</p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-caption text-dark-700">Name</label>
          <input className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="name" required />
        </div>
        <div>
          <label className="block text-caption text-dark-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="email" required />
        </div>
        <div>
          <label className="block text-caption text-dark-700">Message</label>
          <textarea className="mt-1 w-full rounded-lg border border-light-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]" name="message" rows={6} required />
        </div>
        <button type="submit" className="px-6 py-3 rounded-full bg-dark-900 text-light-100">Send</button>
      </form>
    </main>
  );
}


