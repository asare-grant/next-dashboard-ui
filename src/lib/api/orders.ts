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
/* ===============================
   UPDATE ORDER (ORDER STATUS ONLY)
================================ */
export const updateOrder = async (
  id: string,
  data: { orderStatus: string }
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
// export const updateOrder = async (
//   id: string,
//   data: { orderStatus?: string; paymentStatus?: string }
// ) => {
//   const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to update order");
//   }
//   console.log(process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID);

//   return res.json();
// };

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
