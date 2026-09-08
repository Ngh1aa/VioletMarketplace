import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const q = (params.q || "").toLowerCase();
  const category = params.category || "";
  const filtered = products.filter(product => {
    const matchesQuery = !q || [product.name, product.brand, product.category, product.seller].join(" ").toLowerCase().includes(q);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });
  return <main className="page-shell"><div className="container"><div className="breadcrumbs"><Link href="/">Trang chủ</Link> / Kết quả tìm kiếm</div><div className="page-title"><div><h1>{category || (q ? `Kết quả cho “${params.q}”` : "Tất cả sản phẩm")}</h1><p>{filtered.length} sản phẩm phù hợp</p></div></div><div className="plp-layout"><aside className="filters"><div className="filter-group"><strong>Danh mục</strong>{categories.slice(0,7).map(item => <label key={item.name}><input type="checkbox" defaultChecked={category === item.name}/><span>{item.name}</span></label>)}</div><div className="filter-group"><strong>Dịch vụ</strong><label><input type="checkbox"/>Violet Mall</label><label><input type="checkbox"/>Giao nhanh</label><label><input type="checkbox"/>Free Shipping</label></div><div className="filter-group"><strong>Đánh giá</strong><label><input type="radio" name="rating"/>4.5 ★ trở lên</label><label><input type="radio" name="rating"/>4.0 ★ trở lên</label></div></aside><section><div className="result-toolbar"><span>{filtered.length} kết quả</span><select aria-label="Sắp xếp"><option>Phù hợp nhất</option><option>Mới nhất</option><option>Giá thấp đến cao</option><option>Bán chạy</option></select></div>{filtered.length ? <div className="result-grid">{filtered.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><h2>Chưa tìm thấy sản phẩm phù hợp</h2><p>Thử từ khóa ngắn hơn hoặc quay lại danh mục chính.</p><Link className="button primary" href="/">Về trang chủ</Link></div>}</section></div></div></main>;
}
