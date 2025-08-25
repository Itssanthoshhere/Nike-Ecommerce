import Link from "next/link";
import { getCollectionProducts } from "@/lib/actions/collection";
import { Card } from "@/components";

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getCollectionProducts(slug);
  if (!data) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="py-2 text-caption text-dark-700"><Link href="/">Home</Link> / <Link href="/collections">Collections</Link> / Not found</nav>
        <p className="text-body">Collection not found.</p>
      </main>
    );
  }
  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <nav className="py-2 text-caption text-dark-700"><Link href="/">Home</Link> / <Link href="/collections">Collections</Link> / <span className="text-dark-900">{data.name}</span></nav>
      <h1 className="mb-6 text-heading-2 text-dark-900">{data.name}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.products.map((p) => (
          <Card key={p.id} title={p.title} imageSrc={p.imageUrl ?? "/feature.png"} price={p.price ?? undefined} href={`/products/${p.id}`} />
        ))}
      </div>
    </main>
  );
}


