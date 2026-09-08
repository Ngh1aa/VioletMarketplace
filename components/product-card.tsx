"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { discountOf, formatVND } from "@/lib/data";
import { useCart } from "./cart-store";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const discount = discountOf(product);
  return <article className={`product-card ${compact ? "compact" : ""}`}>
    <Link className="product-media" href={`/product/${product.id}`}><img src={product.image} alt={product.name}/>{discount > 0 && <span className="discount-badge">-{discount}%</span>}<button className="wish" type="button" aria-label="Lưu sản phẩm">♡</button></Link>
    <div className="product-copy">
      <div className="product-meta">{product.official ? <span className="official">Violet Mall</span> : <span>{product.brand}</span>}{product.fastDelivery && <span className="fast">Giao nhanh</span>}</div>
      <h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
      <div className="rating"><span>★ {product.rating}</span><span>Đã bán {product.sold.toLocaleString("vi-VN")}</span></div>
      <div className="price-row"><strong>{formatVND(product.price)}</strong>{product.originalPrice && <del>{formatVND(product.originalPrice)}</del>}</div>
      <button className="add-mini" onClick={() => add(product)}>+ Thêm vào giỏ</button>
    </div>
  </article>;
}
