import api from "../lib/api/adminStaff"; // your axios instance

export const fetchStaff = async () => {
  const res = await api.get("/api/admin/staff");
  return res.data.staff;
};

export const createStaff = async (data) => {
  const res = await api.post("/api/admin/staff", data);
  return res.data.staff;
};

export const updateStaff = async (id, data) => {
  const res = await api.patch(`/api/admin/staff/${id}`, data);
  return res.data.staff;
};

export const deleteStaff = async (id) => {
  await api.delete(`/api/admin/staff/${id}`);
};
