import { useEffect, useState } from "react";
import type { AdminRole } from "@/lib/auth/resolveRole";

export function useAdminRole() {
  const [role, setRole] = useState<AdminRole>("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/check-role")
      .then((res) => res.json())
      .then((data) => setRole(data.role))
      .finally(() => setLoading(false));
  }, []);

  return { role, loading };
}
