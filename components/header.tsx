"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-store";

export function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { count } = useCart();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return <>
    <div className="utility-bar"><div className="container utility-inner"><span>Violet — mua sắm tinh gọn hơn</span><nav><Link href="/seller">Kênh người bán</Link><a href="#help">Trợ giúp</a><a href="#orders">Theo dõi đơn</a></nav></div></div>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" href="/" aria-label="Violet home"><span className="brand-mark">V</span><span>VIOLET</span></Link>
      <form className="search-box" onSubmit={submit}><span aria-hidden="true">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm sản phẩm, thương hiệu hoặc cửa hàng" aria-label="Tìm kiếm"/><button>Tìm kiếm</button></form>
      <div className="header-actions"><a href="#account" aria-label="Tài khoản">Tài khoản</a><Link className="cart-link" href="/cart">Giỏ hàng <b>{count}</b></Link></div>
    </div>
    <div className="container quick-keywords"><span>Đang nổi:</span><Link href="/search?q=tai nghe">Tai nghe</Link><Link href="/search?q=giay">Giày chạy</Link><Link href="/search?q=home">Home decor</Link><Link href="/search?q=premium">Premium picks</Link></div>
    </header>
  </>;
}
