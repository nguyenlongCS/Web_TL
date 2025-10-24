import { ref, computed } from 'vue'
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../utils/constants'

export function useProductFilters(products) {
  const categoryFilter = ref(PRODUCT_CATEGORIES.ALL)
  const priceSort = ref(SORT_OPTIONS.NONE)
  const ratingSort = ref(SORT_OPTIONS.NONE)

  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (categoryFilter.value !== PRODUCT_CATEGORIES.ALL) {
      result = result.filter(p => p.category === categoryFilter.value)
    }

    if (priceSort.value === SORT_OPTIONS.PRICE_ASC) {
      result.sort((a, b) => a.price - b.price)
    } else if (priceSort.value === SORT_OPTIONS.PRICE_DESC) {
      result.sort((a, b) => b.price - a.price)
    }

    if (ratingSort.value === SORT_OPTIONS.RATING_HIGH) {
      result.sort((a, b) => b.rating - a.rating)
    } else if (ratingSort.value === SORT_OPTIONS.RATING_LOW) {
      result.sort((a, b) => a.rating - b.rating)
    }

    return result
  })

  return {
    categoryFilter,
    priceSort,
    ratingSort,
    filteredProducts
  }
}