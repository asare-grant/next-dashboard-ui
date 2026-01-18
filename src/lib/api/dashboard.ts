const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const getAdminDashboard = async () => {
  const res = await fetch(`${API_URL}/api/admin/dashboard`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Dashboard API error:", text);
    throw new Error("Failed to load dashboard");
  }

  return res.json();
};
