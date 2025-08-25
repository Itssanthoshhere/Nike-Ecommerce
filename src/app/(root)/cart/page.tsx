import { getCart, removeCartItem, updateCartItem } from "@/lib/actions/cart";
import CartClient from "@/components/cart/CartClient";

export default async function CartPage() {
  const cart = await getCart();
  return <CartClient initialCart={cart} onCheckout={proceedToCheckout} onRemove={removeCartItem} onUpdate={updateCartItem} />;
}


