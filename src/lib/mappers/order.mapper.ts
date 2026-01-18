import { Order } from "@/types/order";

export const mapOrderFromBackend = (order: any): Order => {
  if (!order || !order.$id) {
    throw new Error("Invalid order payload from backend");
  }

  return {
    id: order.$id,
    customerName: order.customerName ?? "Customer",
    items: Array.isArray(order.items) ? order.items : [],
    total: order.total ?? 0,
    deliveryFee: order.deliveryFee ?? 0,
    paymentMethod: order.paymentMethod ?? "cash",
    paymentStatus: order.paymentStatus ?? "pending",
    orderStatus: order.orderStatus ?? "pending",
    createdAt: order.$createdAt,
  };
};
