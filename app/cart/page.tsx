"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-store";
import { formatVND } from "@/lib/data";

export default function CartPage() {
  const { items, subtotal, remove, setQuantity } = useCart();
  const sellers = [...new Set(items.map(line => line.product.seller))];
  const shipping = items.length ? 30000 : 0;
  const shippingDiscount = subtotal >= 1000000 ? shipping : 0;
  if (!items.length) return <main className="page-shell"><div className="container"><div className="empty-state"><h1>Giỏ hàng đang trống</h1><p>Khám phá các sản phẩm được chọn lọc trên Violet.</p><Link className="button primary" href="/">Tiếp tục mua sắm</Link></div></div></main>;
  return <main className="page-shell"><div className="container"><div className="page-title"><div><span className="eyebrow">YOUR CART</span><h1>Giỏ hàng</h1><p>{items.length} sản phẩm từ {sellers.length} cửa hàng</p></div></div><div className="cart-layout"><section>{sellers.map(seller => <div className="cart-group" key={seller}><div className="cart-group-head">{seller} · <span style={{color:"#15803d"}}>Seller đã xác minh</span></div>{items.filter(line => line.product.seller === seller).map(line => <article className="cart-line" key={line.product.id}><img src={line.product.image} alt={line.product.name}/><div><h3>{line.product.name}</h3><small>{line.product.fastDelivery ? "Giao nhanh khả dụng" : "Giao tiêu chuẩn"}</small><div className="qty-control"><button onClick={() => setQuantity(line.product.id, line.quantity - 1)}>−</button><span>{line.quantity}</span><button onClick={() => setQuantity(line.product.id, line.quantity + 1)}>+</button></div></div><div className="line-price"><strong>{formatVND(line.product.price * line.quantity)}</strong><button className="remove-link" onClick={() => remove(line.product.id)}>Xóa</button></div></article>)}</div>)}</section><aside className="summary-card"><h2>Tóm tắt đơn hàng</h2><div className="summary-row"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div><div className="summary-row"><span>Phí giao hàng dự kiến</span><span>{formatVND(shipping)}</span></div><div className="summary-row"><span>Ưu đãi vận chuyển</span><span>-{formatVND(shippingDiscount)}</span></div><div className="summary-row total"><strong>Tổng</strong><strong>{formatVND(subtotal + shipping - shippingDiscount)}</strong></div><Link className="button primary" href="/checkout">Tiến hành thanh toán</Link><p className="summary-note">Giá cuối cùng được xác nhận lại ở checkout theo địa chỉ, voucher và phương thức giao hàng.</p></aside></div></div></main>;
}
