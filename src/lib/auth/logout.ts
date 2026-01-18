import { account } from "@/lib/appwrite-client";

export async function logout(router?: any) {
  try {
    console.log("🚪 Logging out...");

    /* =========================
       1️⃣ CLEAR LOCAL STORAGE
    ========================= */
    localStorage.removeItem("admin_jwt");
    localStorage.removeItem("admin_user");

    /* =========================
       2️⃣ CLEAR COOKIES (RBAC)
    ========================= */
    document.cookie =
      "admin_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "admin_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    /* =========================
       3️⃣ DESTROY APPWRITE SESSION
    ========================= */
    try {
      await account.deleteSession("current");
    } catch {
      // Ignore session errors
    }

    console.log("✅ Logged out successfully");

    /* =========================
       4️⃣ REDIRECT
    ========================= */
    if (router) {
      router.push("/admin-login");
    } else {
      window.location.href = "/admin-login";
    }
  } catch (err) {
    console.error("❌ Logout failed:", err);

    /* =========================
       FORCE LOGOUT
    ========================= */
    localStorage.clear();
    window.location.href = "/admin-login";
  }
}
