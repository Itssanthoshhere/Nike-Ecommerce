'use client';

import { useStore } from '@/store/useStore';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { cart } = useStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">Nike Store</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Men
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Women
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Kids
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Sale
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black transition-colors">
              Search
            </button>
            <button className="text-gray-700 hover:text-black transition-colors">
              Sign In
            </button>
            <div className="relative">
              <button className="text-gray-700 hover:text-black transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
