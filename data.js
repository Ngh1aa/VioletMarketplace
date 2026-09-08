window.VIOLET_DATA = {
  categories: [
    { id: 'electronics', name: 'Điện tử', icon: '⌁' },
    { id: 'fashion', name: 'Thời trang', icon: '◫' },
    { id: 'beauty', name: 'Làm đẹp', icon: '✦' },
    { id: 'home', name: 'Nhà cửa', icon: '⌂' },
    { id: 'sports', name: 'Thể thao', icon: '◌' },
    { id: 'lifestyle', name: 'Đời sống', icon: '◇' },
    { id: 'books', name: 'Sách', icon: '▤' },
    { id: 'premium', name: 'Premium', icon: '◆' }
  ],
  products: [
    {
      id: 'aurora-headphones', name: 'Aurora Pro ANC Headphones', category: 'electronics', brand: 'Auralis', seller: 'Auralis Official', official: true,
      price: 3290000, oldPrice: 3990000, rating: 4.9, sold: 2180, stock: 42, fast: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
      description: 'Tai nghe chống ồn chủ động với thiết kế tối giản, âm thanh chi tiết và thời lượng pin đến 40 giờ.',
      specs: ['Chống ồn chủ động Adaptive ANC', 'Bluetooth 5.4', 'Pin tối đa 40 giờ', 'Bảo hành chính hãng 24 tháng']
    },
    {
      id: 'luna-phone', name: 'Luna X1 5G 256GB', category: 'electronics', brand: 'Luna', seller: 'Luna Official Store', official: true,
      price: 14990000, oldPrice: 16990000, rating: 4.8, sold: 964, stock: 18, fast: true,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
      description: 'Smartphone 5G cao cấp với màn hình OLED, camera AI và bộ nhớ 256GB.',
      specs: ['OLED 120Hz', 'Camera AI 50MP', '256GB storage', 'Sạc nhanh 65W']
    },
    {
      id: 'atelier-bag', name: 'Atelier Soft Leather Bag', category: 'fashion', brand: 'Atelier', seller: 'Atelier Flagship', official: true,
      price: 2490000, oldPrice: 2990000, rating: 4.9, sold: 741, stock: 30, fast: false,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
      description: 'Túi da mềm phom tối giản, phù hợp đi làm và sử dụng hằng ngày.',
      specs: ['Da mềm cao cấp', 'Khoá nam châm', 'Ngăn laptop 13 inch', 'Dây đeo có thể điều chỉnh']
    },
    {
      id: 'silk-shirt', name: 'Silk Blend Relaxed Shirt', category: 'fashion', brand: 'Mori', seller: 'Mori Studio', official: false,
      price: 890000, oldPrice: 1190000, rating: 4.7, sold: 1380, stock: 65, fast: true,
      image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=85',
      description: 'Áo sơ mi silk-blend phom relaxed, bề mặt mịn và dễ phối cho nhiều ngữ cảnh.',
      specs: ['Silk blend', 'Relaxed fit', '4 màu', 'Size XS–XL']
    },
    {
      id: 'serum-violet', name: 'Violet Repair Serum 30ml', category: 'beauty', brand: 'Nuvé', seller: 'Nuvé Official', official: true,
      price: 620000, oldPrice: 760000, rating: 4.9, sold: 4321, stock: 110, fast: true,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
      description: 'Serum phục hồi tập trung cấp ẩm, làm dịu và củng cố hàng rào bảo vệ da.',
      specs: ['30ml', 'Niacinamide', 'Ceramide complex', 'Không hương liệu']
    },
    {
      id: 'lamp-orbit', name: 'Orbit Ambient Table Lamp', category: 'home', brand: 'Formhaus', seller: 'Formhaus Living', official: false,
      price: 1290000, oldPrice: 1590000, rating: 4.8, sold: 687, stock: 24, fast: false,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
      description: 'Đèn bàn ánh sáng dịu với thiết kế điêu khắc, phù hợp phòng ngủ và góc làm việc.',
      specs: ['3 mức ánh sáng', 'LED ấm', 'Thân nhôm', 'Bảo hành 12 tháng']
    },
    {
      id: 'runner-one', name: 'Runner One Everyday Sneakers', category: 'sports', brand: 'Noma', seller: 'Noma Sports', official: true,
      price: 1790000, oldPrice: 2190000, rating: 4.8, sold: 1524, stock: 57, fast: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
      description: 'Sneaker nhẹ, đệm êm và thoáng khí cho di chuyển hằng ngày.',
      specs: ['Foam midsole', 'Mesh upper', 'Size 36–45', 'Trọng lượng 265g']
    },
    {
      id: 'camera-mini', name: 'Mini Creator Camera 4K', category: 'electronics', brand: 'Nova', seller: 'Nova Camera', official: false,
      price: 5890000, oldPrice: 6490000, rating: 4.7, sold: 352, stock: 12, fast: false,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=85',
      description: 'Camera nhỏ gọn quay 4K dành cho creator, du lịch và vlog hằng ngày.',
      specs: ['4K 60fps', 'Chống rung điện tử', 'Màn hình xoay', 'USB-C']
    }
  ]
};
