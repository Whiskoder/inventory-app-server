export enum OrderStatus {
  // When the manager creates a draft of the order
  OPEN = 0,
  // When the order has been sent to the warehouse but not confirmed
  SENT = 1,
  // When the order has been read by the warehouse
  PENDING = 2,
  // When the order has been confirmed and is being prepared by the warehouse
  PROCESSING = 3,
  // When the order has been sent to the dining area
  DELIVERED = 4,
  // When the order has been received and confirmed by the dining area
  COMPLETED = 5,
  // When the manager has requested the cancellation of the order
  CANCEL_REQUESTED = 6,
  // When the order has been canceled for any reason
  CANCELLED = 7,
  // When the order has been refunded after being canceled
  REFUNDED = 8,
  // When there is a conflic in the order (e.g., wrong item sent, damaged product, etc.)
  DISCREPANCY = 9,
}
