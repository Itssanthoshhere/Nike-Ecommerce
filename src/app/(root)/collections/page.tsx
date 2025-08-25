import Link from "next/link";
import { getCollections } from "@/lib/actions/collection";

export default async function CollectionsPage() {
  const cols = await getCollections();
  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="mb-6 text-heading-2 text-dark-900">Collections</h1>
      {cols.length === 0 ? (
        <p className="text-body text-dark-700">No collections yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((c) => (
            <li key={c.id} className="p-6 border rounded-xl border-light-300">
              <h2 className="text-body-large text-dark-900">{c.name}</h2>
              <p className="mt-1 text-caption text-dark-700">{c.productCount} products</p>
              <Link href={`/collections/${c.slug}`} className="inline-block mt-4 underline text-body text-dark-900">
                View collection
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


