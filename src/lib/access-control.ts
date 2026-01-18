// /lib/access-control.ts
export const ROUTE_ACCESS_MAP: Record<string, Array<"admin" | "manager" | "staff">> = {
  "/admin": ["admin"],

  "/admin/categories": ["admin", "manager"],
  "/admin/menu": ["admin", "manager"],
  "/admin/orders": ["admin", "manager", "staff"],
  "/admin/staff": ["admin", "manager"],
};
