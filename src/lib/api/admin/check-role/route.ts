import { NextResponse } from "next/server";
import { resolveAdminRole } from "@/lib/auth/resolveRole";

export async function GET() {
  const role = await resolveAdminRole();

  return NextResponse.json({
    role,
    isAdmin: role === "admin",
    isManager: role === "manager",
    isStaff: role === "staff",
  });
}
