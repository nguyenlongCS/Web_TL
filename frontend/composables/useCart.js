// frontend/composables/useCart.js
// Composable quản lý giỏ hàng - thêm xử lý thời gian thuê
import { ref, computed, watch } from 'vue'

// Lấy user ID từ localStorage
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      return userData._id || 'guest'
    }
  } catch (e) {
    console.error('Lỗi khi lấy user ID:', e)
  }
  return 'guest'
}

// Tạo key cho giỏ hàng theo user
const getCartKey = () => {
  const userId = getCurrentUserId()
  return `cart_${userId}`
}

// Khởi tạo giỏ hàng từ localStorage theo user
const loadCartFromStorage = () => {
  try {
    const cartKey = getCartKey()
    const saved = localStorage.getItem(cartKey)
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Lỗi khi load cart:', e)
    return []
  }
}

// Lưu giỏ hàng vào localStorage theo user
const saveCartToStorage = (cartData) => {
  try {
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(cartData))
  } catch (e) {
    console.error('Lỗi khi lưu cart:', e)
  }
}

const cart = ref(loadCartFromStorage())
const loading = ref(false)

export function useCart() {
  const cartCount = computed(() => cart.value.length)
  
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.price * item.quantity * item.days
    }, 0)
  })

  // Watch cart và tự động lưu vào localStorage khi có thay đổi
  watch(cart, (newCart) => {
    saveCartToStorage(newCart)
  }, { deep: true })

  // Reload giỏ hàng khi đổi user (đăng nhập/đăng xuất)
  const reloadCart = () => {
    cart.value = loadCartFromStorage()
  }

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    loading.value = true
    const existing = cart.value.find(p => p._id === product._id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({
        ...product,
        quantity: 1,
        days: 1,
        rentalStartDate: '',
        rentalStartTime: '07:00' // Mặc định 7:00 sáng
      })
    }
    loading.value = false
  }

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (index) => {
    loading.value = true
    cart.value.splice(index, 1)
    loading.value = false
  }

  // Tăng số lượng
  const increaseQuantity = (index) => {
    cart.value[index].quantity += 1
  }

  // Giảm số lượng
  const decreaseQuantity = (index) => {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity -= 1
    }
  }

  // Cập nhật số ngày thuê
  const updateDays = (index, days) => {
    const newDays = Math.max(1, parseInt(days) || 1)
    cart.value[index].days = newDays
  }

  // Cập nhật ngày bắt đầu thuê
  const updateRentalStart = (index, rentalStartDate) => {
    cart.value[index].rentalStartDate = rentalStartDate
  }

  // Cập nhật giờ bắt đầu thuê
  const updateRentalTime = (index, rentalStartTime) => {
    cart.value[index].rentalStartTime = rentalStartTime
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    loading.value = true
    cart.value = []
    loading.value = false
  }

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateDays,
    updateRentalStart,
    updateRentalTime,
    clearCart,
    reloadCart,
    loading
  }
}