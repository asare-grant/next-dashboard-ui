// export type PaymentMethod = "momo" | "cash" | "card";
// export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
// export type OrderStatus =
//   | "pending"
//   | "paid"
//   | "preparing"
//   | "on_the_way"
//   | "ready_for_pickup"
//   | "delivered"
//   | "picked_up"
//   | "cancelled";

// export type PackagingType = "leaf" | "pack" | "pack_leaf";

// export interface OrderItem {
//   image?: string;
//   id: string;
//   name: string;
//   quantity: number;
//   unitPrice: number;
//   pack?: string;
//   packaging: PackagingType; // ✅ ADD THIS
//   drinks?: string[];
//   customizations?: string[];
//   fulfillmentType?: String,
// }

// export interface Order {
//   id: string; // reference e.g FD-XXXX
//   customerName: string;
//   customerPhone?: string;
//   items: OrderItem[];
//   total: number;
//   deliveryFee: number;
//   fulfillmentType?: String;

//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;

//    /** 🔐 Hubtel fields (read-only from admin) */
//   paymentReference?: string | null;
//   hubtelTransactionId?: string | null;

//   orderStatus: OrderStatus;
//   createdAt: string; // ISO
// }




export type PaymentMethod = "momo" | "cash" | "card" | "hubtel";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type OrderTimingType = "asap" | "scheduled";

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "on_the_way"
  | "ready_for_pickup"
  | "delivered"
  | "picked_up"
  | "cancelled";

export type PackagingType = "leaf" | "pack" | "pack_and_leaf";

export interface OrderItem {
  image?: string;
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  pack?: string;
  packaging: PackagingType;
  drinks?: string[];
  customizations?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  fulfillmentType?: "delivery" | "pickup";

  timingType?: OrderTimingType;
  isPreorder?: boolean;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  scheduledAt?: string | null;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  paymentReference?: string | null;
  hubtelTransactionId?: string | null;

  orderStatus: OrderStatus;
  createdAt: string;
}