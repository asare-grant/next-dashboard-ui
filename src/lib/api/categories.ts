const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// e.g. http://localhost:4000/api/admin

export type CategoryPayload = {
  name: string;
  description: string;
  image?: string;
};

export type CategoryResponse = {
  $id: string;
  name: string;
  description: string;
  image?: string;
};

/* ---------------- GET ALL ---------------- */
export async function getCategories(): Promise<CategoryResponse[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();
  return data.categories;
}

/* ---------------- CREATE ---------------- */
export async function createCategory(payload: CategoryPayload) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create category");
  }

  return res.json();
}

/* ---------------- UPDATE ---------------- */
export async function updateCategory(
  id: string,
  payload: CategoryPayload
) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update category");
  }

  return res.json();
}

/* ---------------- DELETE ---------------- */
export async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }

  return res.json();
}
