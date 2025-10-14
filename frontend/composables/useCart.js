// frontend/composables/useCart.js
// Quản lý logic giỏ hàng

import { ref, computed } from 'vue'

const cart = ref([])

export function useCart() {
  // Tính tổng số lượng sản phẩm trong giỏ
  const cartCount = computed(() => cart.value.length)
  
  // Tính tổng tiền
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.price * item.quantity * item.days
    }, 0)
  })

  // Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    const existing = cart.value.find(p => p.name === product.name)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({
        ...product,
        quantity: 1,
        days: 1
      })
    }
  }

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (index) => {
    cart.value.splice(index, 1)
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

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    cart.value = []
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
    clearCart
  }
}