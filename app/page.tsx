import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

export default function HomePage() {
  return <main>
    <section className="hero-wrap"><div className="container hero-grid">
      <div className="hero-main"><div className="hero-content"><span className="hero-kicker">VIOLET 9.9 · MEMBER PREVIEW</span><h1>Mua sắm nhiều hơn.<br/><em>Nhiễu ít hơn.</em></h1><p>Deal tốt, thương hiệu tin cậy và trải nghiệm mua sắm được thiết kế để bạn quyết định nhanh hơn.</p><div className="hero-actions"><Link className="button primary" href="/search?q=deals">Khám phá deal 9.9</Link><a className="button ghost" href="#mall">Xem Violet Mall</a></div></div><div className="hero-orb"><span>09</span><small>SEP</small></div></div>
      <div className="hero-side"><div className="side-card soft"><span>FIRST ORDER</span><strong>-15%</strong><p>Cho đơn đầu tiên đến 300K</p><a href="#voucher">Lưu voucher →</a></div><div className="side-card dark"><span>VIOLET+</span><strong>Free delivery</strong><p>Giao nhanh cho thành viên</p><a href="#membership">Khám phá →</a></div></div>
    </div></section>

    <section className="container quick-actions" aria-label="Tiện ích"><a href="#voucher"><b>％</b><span><strong>Voucher Center</strong><small>Lưu deal trước khi mua</small></span></a><a href="#shipping"><b>↗</b><span><strong>Free Shipping</strong><small>Đơn đủ điều kiện</small></span></a><a href="#mall"><b>✦</b><span><strong>Violet Mall</strong><small>Gian hàng chính hãng</small></span></a><a href="#deals"><b>◴</b><span><strong>Flash Deals</strong><small>Deal có thời hạn</small></span></a></section>

    <section className="section container" id="categories"><div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>Mua theo danh mục</h2></div><Link href="/search">Xem tất cả →</Link></div><div className="category-grid">{categories.map(item => <Link href={`/search?category=${encodeURIComponent(item.name)}`} className="category-card" key={item.name}><span>{item.icon}</span><strong>{item.name}</strong><small>Khám phá</small></Link>)}</div></section>

    <section className="section section-tint" id="deals"><div className="container"><div className="section-head"><div><span className="eyebrow sale">ENDS IN 06:21:42</span><h2>Flash Deals</h2></div><Link href="/search?q=deals">Xem tất cả →</Link></div><div className="product-grid">{products.slice(0,4).map(product => <ProductCard key={product.id} product={product}/>)}</div></div></section>

    <section className="section container mall-section" id="mall"><div className="mall-copy"><span className="eyebrow">VIOLET MALL</span><h2>Official brands.<br/>Less second guessing.</h2><p>Gian hàng xác minh, chính sách rõ ràng và quyền lợi mua hàng được hiển thị ngay trước khi quyết định.</p><div className="trust-list"><span>✓ Chính hãng</span><span>✓ Đổi trả minh bạch</span><span>✓ Seller đã xác minh</span></div><Link className="button light" href="/search?q=official">Vào Violet Mall</Link></div><div className="mall-showcase">{products.filter(product => product.official).slice(0,3).map(product => <ProductCard key={product.id} product={product} compact/>)}</div></section>

    <section className="section container"><div className="section-head"><div><span className="eyebrow">PICKED FOR YOU</span><h2>Có thể bạn sẽ thích</h2><div className="chips"><button className="active">Dành cho bạn</button><button>Trending</button><button>Mới</button><button>Dưới 2 triệu</button><button>Giao nhanh</button></div></div></div><div className="product-grid four">{products.slice(4).concat(products.slice(0,4)).map(product => <ProductCard key={`feed-${product.id}`} product={product}/>)}</div></section>

    <section className="container trust-strip" id="protect"><article><b>01</b><div><strong>Bảo vệ người mua</strong><p>Quy trình khiếu nại và hoàn tiền rõ ràng.</p></div></article><article><b>02</b><div><strong>Thanh toán an toàn</strong><p>Chỉ xác nhận khi bạn chủ động đặt hàng.</p></div></article><article><b>03</b><div><strong>Seller minh bạch</strong><p>Rating, phản hồi và trạng thái xác minh hiển thị trước khi mua.</p></div></article></section>
  </main>;
}
