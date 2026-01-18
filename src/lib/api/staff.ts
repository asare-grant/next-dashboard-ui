// import { getCurrentAdminToken } from "@/lib/auth/adminAuth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // 🔑 Auth headers using the Appwrite JWT
// const authHeaders = async () => ({
//   "Content-Type": "application/json",
//   "x-appwrite-jwt": await getCurrentAdminToken(),
// });

// // ========================= STAFF API ========================= //

// // GET ALL STAFF
// export const getAllStaffAdmin = async () => {
//   const res = await fetch(`${API_URL}/api/admin/staff`, {
//     headers: await authHeaders(),
//   });

//   if (!res.ok) throw new Error("Failed to fetch staff");
//   return res.json(); // { success, staff }
// };

// // CREATE NEW STAFF
// export const createStaffAdmin = async (data: {
//   fullName: string;
//   email: string;
//   role: string;
//   phone?: string;
//   branch?: string;
//   shift?: string;
//   status?: string;
// }) => {
//   const res = await fetch(`${API_URL}/api/admin/staff`, {
//     method: "POST",
//     headers: await authHeaders(),
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to create staff");
//   }

//   return res.json(); // { success, staff }
// };

// // UPDATE STAFF
// export const updateStaffAdmin = async (
//   id: string,
//   data: {
//     fullName?: string;
//     email?: string;
//     role?: string;
//     phone?: string;
//     branch?: string;
//     shift?: string;
//     status?: string;
//   }
// ) => {
//   const res = await fetch(`${API_URL}/api/admin/staff/${id}`, {
//     method: "PATCH",
//     headers: await authHeaders(),
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to update staff");
//   }

//   return res.json(); // { success, staff }
// };

// // DELETE STAFF
// export const deleteStaffAdmin = async (id: string) => {
//   const res = await fetch(`${API_URL}/api/admin/staff/${id}`, {
//     method: "DELETE",
//     headers: await authHeaders(),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to delete staff");
//   }

//   return res.json(); // { success }
// };




const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ========================= STAFF API ========================= */

// GET ALL STAFF
export const getAllStaffAdmin = async () => {
  const res = await fetch(`${API_URL}/api/admin/staff`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch staff");
  }

  return res.json(); // { success, staff }
};

// CREATE STAFF
export const createStaffAdmin = async (data: {
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  branch?: string;
  shift?: string;
  status?: string;
}) => {
  const res = await fetch(`${API_URL}/api/admin/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create staff");
  }

  return result; // { success, staff }
};

// UPDATE STAFF
export const updateStaffAdmin = async (
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    role: string;
    phone: string;
    branch: string;
    shift: string;
    status: string;
  }>
) => {
  const res = await fetch(`${API_URL}/api/admin/staff/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update staff");
  }

  return result; // { success, staff }
};

// DELETE STAFF
export const deleteStaffAdmin = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin/staff/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete staff");
  }

  return result; // { success }
};
