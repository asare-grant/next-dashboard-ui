export type StaffRole =
  | "admin"
  | "manager"
  | "chef"
  | "rider"
  | "cashier";

export type StaffStatus = "active" | "suspended";

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  shift: "morning" | "evening" | "night";
  branch: string;
  joinedAt: string;
}
