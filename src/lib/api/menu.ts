const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// e.g. http://localhost:4000/api/admin

/* ---------------- TYPES ---------------- */

export type MenuPack = {
  type: string;
  price: number;
};

export type MenuDrink = {
  name: string;
  price: number;
};

export type MenuPayload = {
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  packs?: MenuPack[];
  drinks?: MenuDrink[];
  allowedCustomizations?: string[];
};

export type MenuResponse = {
  $id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  packs: MenuPack[];
  drinks: MenuDrink[];
  allowedCustomizations: string[];
  $createdAt: string;
  $updatedAt: string;
};

/* ---------------- GET ALL ---------------- */
export async function getMenus(): Promise<MenuResponse[]> {
  const res = await fetch(`${API_BASE_URL}/menu`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }

  const data = await res.json();
  return data.menus ?? [];
}

/* ---------------- CREATE ---------------- */
export async function createMenu(payload: MenuPayload) {
  const res = await fetch(`${API_BASE_URL}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create menu item");
  }

  return res.json();
}

/* ---------------- UPDATE ---------------- */
export async function updateMenu(id: string, payload: MenuPayload) {
  const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update menu item");
  }

  return res.json();
}

/* ---------------- DELETE ---------------- */
export async function deleteMenu(id: string) {
  const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete menu item");
  }

  return res.json();
}
