// frontend/utils/formatters.js
// Các hàm format dữ liệu cho hệ thống

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

// Format ngày giờ theo định dạng Việt Nam (dd/mm/yyyy sáng/chiều/tối)
export function formatDateTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  // Xác định buổi trong ngày
  let period = ''
  if (hours >= 5 && hours < 12) {
    period = 'sáng'
  } else if (hours >= 12 && hours < 18) {
    period = 'chiều'
  } else {
    period = 'tối'
  }
  
  // Format giờ 12h
  const hours12 = hours % 12 || 12
  
  return `${hours12}:${minutes} ${period} ${day}/${month}/${year}`
}

// Format ngày đơn giản (chỉ dd/mm/yyyy)
export function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Format date cho input type="date" (yyyy-mm-dd)
export function formatDateForInput(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}