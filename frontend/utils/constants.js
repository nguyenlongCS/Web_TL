export const ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: 'Chờ duyệt',
  [ORDER_STATUS.APPROVED]: 'Đã chấp nhận',
  [ORDER_STATUS.REJECTED]: 'Bị từ chối'
}

export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING]: '#f59e0b',
  [ORDER_STATUS.APPROVED]: '#10b981',
  [ORDER_STATUS.REJECTED]: '#ef4444'
}

export const PRODUCT_CATEGORIES = {
  ALL: 'all',
  LOA: 'loa',
  AMPLY: 'amply',
  PHU_KIEN: 'phu-kien',
  KHAC: 'khac'
}

export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.ALL]: 'Tất cả',
  [PRODUCT_CATEGORIES.LOA]: 'Loa',
  [PRODUCT_CATEGORIES.AMPLY]: 'Amply',
  [PRODUCT_CATEGORIES.PHU_KIEN]: 'Phụ kiện âm thanh',
  [PRODUCT_CATEGORIES.KHAC]: 'Khác'
}

export const SORT_OPTIONS = {
  NONE: 'none',
  PRICE_ASC: 'asc',
  PRICE_DESC: 'desc',
  RATING_HIGH: 'high',
  RATING_LOW: 'low'
}