'use client';

import { Product } from '@/db/schema';
import { useStore } from '@/store/useStore';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">
            Brand: {product.brand}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Sizes:</span>
            <div className="flex space-x-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
