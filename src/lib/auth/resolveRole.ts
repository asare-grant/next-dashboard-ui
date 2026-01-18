import { cookies } from "next/headers";
import { teams } from "@/lib/appwrite-server";

export type AdminRole = "admin" | "manager" | "staff" | "none";

export async function resolveAdminRole(): Promise<AdminRole> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("a_session");

    if (!sessionCookie) return "none";

    // Extract userId from Appwrite session cookie
    const userId = JSON.parse(sessionCookie.value)?.userId;
    if (!userId) return "none";

    const checkTeam = async (teamId: string) => {
      const team = await teams.listMemberships(teamId);
      return team.memberships.some((m) => m.userId === userId);
    };

    if (await checkTeam(process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID!)) return "admin";
    if (await checkTeam(process.env.NEXT_PUBLIC_APPWRITE_MANAGER_TEAM_ID!)) return "manager";
    if (await checkTeam(process.env.NEXT_PUBLIC_APPWRITE_STAFF_TEAM_ID!)) return "staff";

    return "none";
  } catch (err) {
    console.error("resolveAdminRole error:", err);
    return "none";
  }
}
