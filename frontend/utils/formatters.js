export function formatStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  while (stars.length < 5) stars += '☆'
  return stars
}

export function formatPrice(price) {
  return price.toLocaleString() + 'đ'
}

export function formatDate(date) {
  return new Date(date).toLocaleString('vi-VN')
}