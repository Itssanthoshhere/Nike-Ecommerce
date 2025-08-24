import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Nike Store
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest Nike products with unbeatable quality and style. 
            From running shoes to athletic wear, find everything you need to perform at your best.
          </p>
        </div>
        
        <ProductGrid />
      </div>
    </main>
  );
}
