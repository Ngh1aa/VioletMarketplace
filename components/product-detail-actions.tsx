"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data";
import { useCart } from "./cart-store";

export function ProductDetailActions({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  return <div className="detail-actions"><button className="secondary" onClick={() => add(product)}>Thêm vào giỏ</button><button className="primary" onClick={() => { add(product); router.push("/cart"); }}>Mua ngay</button></div>;
}
