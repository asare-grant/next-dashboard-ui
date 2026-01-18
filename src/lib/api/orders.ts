// import { getCurrentAdminToken } from "@/lib/auth/adminAuth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const authHeaders = async () => ({
//   "Content-Type": "application/json",
//   "x-appwrite-jwt": await getCurrentAdminToken(),
// });

// // GET ALL ORDERS
// export const getAllOrdersAdmin = async () => {
//   const res = await fetch(`${API_URL}/admin/orders`, {
//     headers: await authHeaders(),
//   });

//   if (!res.ok) throw new Error("Failed to fetch orders");
//   return res.json();
// };

// // UPDATE ORDER STATUS
// export const updateOrderStatusAdmin = async (
//   id: string,
//   data: { orderStatus: string; paymentStatus: string }
// ) => {
//   const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
//     method: "PATCH",
//     headers: await authHeaders(),
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Failed to update order");
//   return res.json();
// };

// // UPDATE PAYMENT STATUS
// export const updatePaymentStatusAdmin = async (
//   id: string,
//   paymentStatus: string
// ) => {
//   const res = await fetch(`${API_URL}/admin/orders/${id}/payment`, {
//     method: "PATCH",
//     headers: await authHeaders(),
//     body: JSON.stringify({ paymentStatus }),
//   });

//   if (!res.ok) throw new Error("Failed to update payment status");
//   return res.json();
// };

// // DELETE ORDER
// export const deleteOrderAdmin = async (id: string) => {
//   const res = await fetch(`${API_URL}/admin/orders/${id}`, {
//     method: "DELETE",
//     headers: await authHeaders(),
//   });

//   if (!res.ok) throw new Error("Failed to delete order");
//   return res.json();
// };




const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ===============================
   GET ALL ORDERS
================================ */
export const getOrders = async () => {
  const res = await fetch(`${API_URL}/api/admin/orders`);

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};

/* ===============================
   UPDATE ORDER (status / payment)
================================ */
export const updateOrder = async (
  id: string,
  data: { orderStatus?: string; paymentStatus?: string }
) => {
  const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update order");
  }
  console.log(process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID);

  return res.json();
};

/* ===============================
   DELETE ORDER
================================ */
export const deleteOrder = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete order");
  }

  return res.json();
};
