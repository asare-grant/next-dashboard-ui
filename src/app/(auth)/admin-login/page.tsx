"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite-client";
import { toast } from "react-toastify";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async () => {
    if (loading) return; // ⛔ Prevent double clicks

    console.clear();
    console.log("🔐 Login attempt started:", email);

    try {
      setLoading(true);

      /* =========================
         1️⃣ CLEAR ANY OLD SESSION
      ========================= */
      try {
        await account.deleteSession("current");
      } catch {
        // Ignore if no session
      }

      /* =========================
         2️⃣ CREATE APPWRITE SESSION
      ========================= */
      await account.createEmailPasswordSession(email, password);

      /* =========================
         3️⃣ CREATE JWT
      ========================= */
      const jwtResponse = await account.createJWT();
      const jwt = jwtResponse.jwt;

      localStorage.setItem("admin_jwt", jwt);

      /* =========================
         4️⃣ VERIFY USER & ROLE
      ========================= */
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-appwrite-jwt": jwt,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Not authorized");
      }

      /* =========================
         5️⃣ STORE USER (UI)
      ========================= */
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          name: data.name,
          role: data.role,
          avatar: data.avatar || null,
        })
      );

      /* =========================
         6️⃣ STORE ROLE (MIDDLEWARE)
      ========================= */
      document.cookie = `admin_role=${data.role}; path=/`;
      document.cookie = `admin_name=${encodeURIComponent(data.name)}; path=/`;

      toast.success(`Welcome back (${data.role})`);

      /* =========================
         7️⃣ REDIRECT (SAFE PAGE)
      ========================= */
      router.push("/admin/orders");
    } catch (err: any) {
      console.error("🔥 LOGIN ERROR:", err);

      /* =========================
         FULL CLEANUP ON FAILURE
      ========================= */
      localStorage.removeItem("admin_jwt");
      localStorage.removeItem("admin_user");

      document.cookie =
        "admin_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "admin_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      try {
        await account.deleteSession("current");
      } catch {}

      toast.error(err.message || "Invalid credentials or not authorized");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AUTO REDIRECT IF LOGGED IN
  ========================= */
  useEffect(() => {
    const jwt = localStorage.getItem("admin_jwt");

    if (!jwt) return;

    account
      .get()
      .then(() => router.push("/admin/orders"))
      .catch(() => {
        localStorage.removeItem("admin_jwt");
      });
  }, [router]);

  return (
    // <div className="min-h-screen flex items-center justify-center">
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-[380px] rounded-2xl bg-white shadow-lg p-6">
        <h1 className="text-xl text-gray-700 font-semibold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to manage your platform
        </p>

        <input
          disabled={loading}
          className="w-full mb-3 border rounded-lg px-3 py-2 disabled:opacity-60"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          disabled={loading}
          type="password"
          className="w-full mb-4 border rounded-lg px-3 py-2 disabled:opacity-60"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            w-full rounded-lg py-2 flex items-center justify-center gap-2
            bg-black text-white
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <>
              {/* Spinner */}
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing In</span>
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
