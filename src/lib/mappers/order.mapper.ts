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
    fulfillmentType: order.fulfillmentType ?? "delivery",

    paymentMethod: order.paymentMethod ?? "momo",
    paymentStatus: order.paymentStatus ?? "pending",

    paymentReference: order.paymentReference ?? null,
    hubtelTransactionId: order.hubtelTransactionId ?? null,

    orderStatus: order.orderStatus ?? "pending",
    createdAt: order.$createdAt,
  };
};
