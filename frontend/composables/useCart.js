import { ref, computed } from 'vue'

const cart = ref([])
const loading = ref(false)

export function useCart() {
  const cartCount = computed(() => cart.value.length)
  
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.price * item.quantity * item.days
    }, 0)
  })

  const addToCart = (product) => {
    loading.value = true
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
    loading.value = false
  }

  const removeFromCart = (index) => {
    loading.value = true
    cart.value.splice(index, 1)
    loading.value = false
  }

  const increaseQuantity = (index) => {
    cart.value[index].quantity += 1
  }

  const decreaseQuantity = (index) => {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity -= 1
    }
  }

  const updateDays = (index, days) => {
    const newDays = Math.max(1, parseInt(days) || 1)
    cart.value[index].days = newDays
  }

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
    clearCart,
    loading
  }
}