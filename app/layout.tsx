import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/cart-store";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Violet Marketplace — Mua sắm tinh gọn hơn",
  description: "Modern multi-category ecommerce marketplace prototype."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><CartProvider><Header/>{children}<footer className="site-footer"><div className="container footer-grid"><div><Link className="brand footer-brand" href="/"><span className="brand-mark">V</span><span>VIOLET</span></Link><p>Một marketplace hiện đại, thân thiện và minh bạch hơn ở mọi điểm quyết định.</p></div><div><strong>Mua sắm</strong><a href="#mall">Violet Mall</a><a href="#deals">Flash Deals</a><a href="#categories">Danh mục</a></div><div><strong>Hỗ trợ</strong><a href="#help">Trung tâm trợ giúp</a><a href="#returns">Đổi trả</a><a href="#protect">Bảo vệ người mua</a></div><div><strong>Kinh doanh</strong><Link href="/seller">Seller Center</Link><Link href="/admin">Marketplace Admin</Link></div></div><div className="container footer-bottom">© 2026 Violet Marketplace · Prototype</div></footer></CartProvider></body></html>;
}
