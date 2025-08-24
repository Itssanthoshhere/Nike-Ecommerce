import { create } from 'zustand';
import { Product } from '@/db/schema';

interface StoreState {
  products: Product[];
  cart: Product[];
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  cart: [],
  isLoading: false,
  setProducts: (products) => set({ products }),
  addToCart: (product) => set((state) => ({ 
    cart: [...state.cart, product] 
  })),
  removeFromCart: (productId) => set((state) => ({ 
    cart: state.cart.filter(item => item.id !== productId) 
  })),
  setLoading: (isLoading) => set({ isLoading }),
  clearCart: () => set({ cart: [] }),
}));
