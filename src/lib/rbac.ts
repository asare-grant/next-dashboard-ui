export type Role = "admin" | "manager";

export const PERMISSIONS = {
  STAFF_CREATE: "staff:create",
  STAFF_UPDATE: "staff:update",
  STAFF_DELETE: "staff:delete",
  STAFF_VIEW: "staff:view",
} as const;

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    PERMISSIONS.STAFF_CREATE,
    PERMISSIONS.STAFF_UPDATE,
    PERMISSIONS.STAFF_DELETE,
    PERMISSIONS.STAFF_VIEW,
  ],
  manager: [
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.STAFF_UPDATE, // managers can edit but not delete/create
  ],
};

export function hasPermission(
  role: Role,
  permission: Permission
) {
  return ROLE_PERMISSIONS[role]?.includes(permission);
}
