<template>
  <div class="filter-bar">
    <div class="filter-group">
      <label for="filter-category">Loại sản phẩm:</label>
      <select id="filter-category" :value="categoryFilter" @change="$emit('update:categoryFilter', $event.target.value)">
        <option v-for="(label, value) in categoryLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-price">Sắp xếp theo giá:</label>
      <select id="sort-price" :value="priceSort" @change="$emit('update:priceSort', $event.target.value)">
        <option value="none">Mặc định</option>
        <option value="asc">Giá tăng dần</option>
        <option value="desc">Giá giảm dần</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-rating">Sắp xếp theo đánh giá:</label>
      <select id="sort-rating" :value="ratingSort" @change="$emit('update:ratingSort', $event.target.value)">
        <option value="none">Mặc định</option>
        <option value="high">Cao đến thấp</option>
        <option value="low">Thấp đến cao</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { CATEGORY_LABELS } from '../../utils/constants'

defineProps({
  categoryFilter: String,
  priceSort: String,
  ratingSort: String
})

defineEmits(['update:categoryFilter', 'update:priceSort', 'update:ratingSort'])

const categoryLabels = CATEGORY_LABELS
</script>
