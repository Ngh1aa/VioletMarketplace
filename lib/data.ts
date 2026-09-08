export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
  image: string;
  seller: string;
  official?: boolean;
  fastDelivery?: boolean;
};

export const categories = [
  { name: "Điện tử", icon: "⌁" },
  { name: "Thời trang", icon: "◫" },
  { name: "Làm đẹp", icon: "✦" },
  { name: "Nhà cửa", icon: "⌂" },
  { name: "Thể thao", icon: "◒" },
  { name: "Phụ kiện", icon: "◇" },
  { name: "Mẹ & Bé", icon: "◡" },
  { name: "Sách", icon: "▤" },
  { name: "Đời sống", icon: "◎" },
  { name: "Premium", icon: "✧" }
];

export const products: Product[] = [
  { id: "aurora-headphones", name: "Aurora Studio Headphones", brand: "Auralab", category: "Điện tử", price: 2890000, originalPrice: 3490000, rating: 4.9, sold: 2100, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", seller: "Auralab Official", official: true, fastDelivery: true },
  { id: "violet-runner", name: "Violet Runner 02", brand: "Motion", category: "Thời trang", price: 1690000, originalPrice: 2190000, rating: 4.8, sold: 984, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", seller: "Motion Flagship", official: true, fastDelivery: true },
  { id: "frame-camera", name: "Frame Compact Camera", brand: "Frame", category: "Điện tử", price: 8990000, originalPrice: 9490000, rating: 4.9, sold: 438, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85", seller: "Frame Studio", official: true },
  { id: "mono-watch", name: "Mono Watch S", brand: "Mono", category: "Phụ kiện", price: 3290000, originalPrice: 3890000, rating: 4.7, sold: 1250, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", seller: "Mono Vietnam", fastDelivery: true },
  { id: "linen-chair", name: "Linen Lounge Chair", brand: "Maison 21", category: "Nhà cửa", price: 4590000, originalPrice: 5200000, rating: 4.8, sold: 317, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85", seller: "Maison 21", official: true },
  { id: "daily-bag", name: "Daily Structure Bag", brand: "NOVA", category: "Thời trang", price: 1390000, originalPrice: 1790000, rating: 4.8, sold: 1420, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", seller: "NOVA Select", fastDelivery: true },
  { id: "coffee-set", name: "Slow Morning Coffee Set", brand: "Still", category: "Đời sống", price: 790000, originalPrice: 990000, rating: 4.9, sold: 760, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85", seller: "Still Objects" },
  { id: "phone-pro", name: "V-One Pro 256GB", brand: "V-One", category: "Điện tử", price: 21990000, originalPrice: 23990000, rating: 4.9, sold: 3120, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85", seller: "V-One Official", official: true, fastDelivery: true }
];

export const formatVND = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
export const discountOf = (product: Product) => product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
