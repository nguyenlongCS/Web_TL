// frontend/composables/useProducts.js
// Quản lý danh sách sản phẩm và lọc/sắp xếp

import { ref, computed } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Loa JBL SRX815P',
    category: 'loa',
    price: 1200000,
    priceText: '1.200.000đ/ngày',
    rating: 4.8,
    stock: 12,
    imgSrc: '/frontend/assets/img/product1.jpg'
  },
  {
    id: 2,
    name: 'Amply Yamaha MG16XU',
    category: 'amply',
    price: 950000,
    priceText: '950.000đ/ngày',
    rating: 4.5,
    stock: 8,
    imgSrc: '/frontend/assets/img/product2.jpg'
  },
  {
    id: 3,
    name: 'Micro Shure SM58',
    category: 'phu-kien',
    price: 250000,
    priceText: '250.000đ/ngày',
    rating: 5.0,
    stock: 20,
    imgSrc: '/frontend/assets/img/product3.jpg'
  },
  {
    id: 4,
    name: 'Loa Bose F1 Model 812',
    category: 'loa',
    price: 1500000,
    priceText: '1.500.000đ/ngày',
    rating: 4.6,
    stock: 5,
    imgSrc: '/frontend/assets/img/product4.jpg'
  },
  {
    id: 5,
    name: 'Mixer Behringer X32',
    category: 'khac',
    price: 1800000,
    priceText: '1.800.000đ/ngày',
    rating: 4.9,
    stock: 3,
    imgSrc: '/frontend/assets/img/product5.jpg'
  },
  {
    id: 6,
    name: 'Micro không dây Shure BLX24',
    category: 'phu-kien',
    price: 600000,
    priceText: '600.000đ/ngày',
    rating: 5.0,
    stock: 9,
    imgSrc: '/frontend/assets/img/product6.jpg'
  },
  {
    id: 7,
    name: 'Amply Crown XTi 4002',
    category: 'amply',
    price: 1100000,
    priceText: '1.100.000đ/ngày',
    rating: 4.7,
    stock: 7,
    imgSrc: '/frontend/assets/img/product7.jpg'
  },
  {
    id: 8,
    name: 'Loa Electro-Voice ELX200',
    category: 'loa',
    price: 1250000,
    priceText: '1.250.000đ/ngày',
    rating: 4.9,
    stock: 10,
    imgSrc: '/frontend/assets/img/product8.jpg'
  },
  {
    id: 9,
    name: 'Equalizer DBX 231s',
    category: 'khac',
    price: 500000,
    priceText: '500.000đ/ngày',
    rating: 4.4,
    stock: 6,
    imgSrc: '/frontend/assets/img/product9.jpg'
  },
  {
    id: 10,
    name: 'Tai nghe Sony MDR-7506',
    category: 'phu-kien',
    price: 300000,
    priceText: '300.000đ/ngày',
    rating: 5.0,
    stock: 15,
    imgSrc: '/frontend/assets/img/product10.jpg'
  },
  {
    id: 11,
    name: 'Subwoofer JBL PRX818XLF',
    category: 'loa',
    price: 1700000,
    priceText: '1.700.000đ/ngày',
    rating: 4.6,
    stock: 4,
    imgSrc: '/frontend/assets/img/product11.jpg'
  },
  {
    id: 12,
    name: 'Processor DBX DriveRack PA2',
    category: 'khac',
    price: 850000,
    priceText: '850.000đ/ngày',
    rating: 4.9,
    stock: 11,
    imgSrc: '/frontend/assets/img/product12.jpg'
  }
])

export function useProducts() {
  const categoryFilter = ref('all')
  const priceSort = ref('none')
  const ratingSort = ref('none')

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = computed(() => {
    let result = [...products.value]

    // Lọc theo category
    if (categoryFilter.value !== 'all') {
      result = result.filter(p => p.category === categoryFilter.value)
    }

    // Sắp xếp theo giá
    if (priceSort.value === 'asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (priceSort.value === 'desc') {
      result.sort((a, b) => b.price - a.price)
    }

    // Sắp xếp theo rating
    if (ratingSort.value === 'high') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (ratingSort.value === 'low') {
      result.sort((a, b) => a.rating - b.rating)
    }

    return result
  })

  return {
    products,
    categoryFilter,
    priceSort,
    ratingSort,
    filteredProducts
  }
}