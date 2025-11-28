// frontend/utils/formatters.js
// Các hàm format dữ liệu - thêm formatDateTime

// Format rating thành ngôi sao
export function formatStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  while (stars.length < 5) stars += '☆'
  return stars
}

// Format giá tiền
export function formatPrice(price) {
  return price.toLocaleString() + 'đ'
}

// Format ngày giờ đầy đủ (giờ:phút:giây ngày/tháng/năm)
export function formatDateTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

// Format ngày (chỉ ngày/tháng/năm)
export function formatDate(date) {
  return new Date(date).toLocaleString('vi-VN')
}