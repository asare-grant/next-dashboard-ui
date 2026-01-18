"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite-client";

export default function AdminLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(() => setLoading(false))
      .catch(() => {
        router.replace("/admin-login");
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
