"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

export type CartLine = { product: Product; quantity: number };
type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("violet-cart");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore corrupted demo state */ }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("violet-cart", JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: items.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    add: (product) => setItems(current => {
      const found = current.find(line => line.product.id === product.id);
      return found ? current.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }];
    }),
    remove: (id) => setItems(current => current.filter(line => line.product.id !== id)),
    setQuantity: (id, quantity) => setItems(current => current.map(line => line.product.id === id ? { ...line, quantity: Math.max(1, quantity) } : line)),
    clear: () => setItems([])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
