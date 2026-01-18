export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];
export type PaymentStatus = typeof PAYMENT_STATUSES[number];
