export type PaymentMethod = "momo" | "cash" | "card";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export type PackagingType = "leaf" | "pack" | "pack_leaf";

export interface OrderItem {
  image?: string;
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  pack?: string;
  packaging: PackagingType; // ✅ ADD THIS
  drinks?: string[];
  customizations?: string[];
}

export interface Order {
  id: string; // reference e.g FD-XXXX
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string; // ISO
}
