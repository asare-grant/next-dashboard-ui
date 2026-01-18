"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite-client";
import { ID } from "appwrite";
import { toast } from "react-toastify";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    console.clear();
    console.log("🆕 Signup attempt:", email);

    try {
      setLoading(true);

      const user = await account.create(
        ID.unique(),
        email,
        password
      );

      console.log("✅ User created:", user);

      toast.success("Account created successfully");
    } catch (err) {
      console.error("🔥 SIGNUP ERROR:", err);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[380px] bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4">Create Admin User</h1>

        <input
          className="w-full mb-3 border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";

// export default function AdminSignupPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("admin");
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async () => {
//     console.clear();
//     console.log("🔐 Signup attempt started", { email, role });

//     try {
//       setLoading(true);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, role }),
//       });

//       const data = await res.json();
//       console.log("⬅ Backend response:", data);

//       if (!res.ok) throw new Error(data.message || "Signup failed");

//       toast.success("Admin user created successfully!");
//     } catch (err: any) {
//       console.error("🔥 SIGNUP ERROR:", err);
//       toast.error(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//       <div className="w-[400px] rounded-2xl bg-white shadow-lg p-6">
//         <h1 className="text-xl font-semibold mb-1">Admin Signup</h1>
//         <p className="text-sm text-gray-500 mb-6">Create a new admin or manager account</p>

//         <input
//           className="w-full mb-3 border rounded-lg px-3 py-2"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full mb-3 border rounded-lg px-3 py-2"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <select
//           className="w-full mb-4 border rounded-lg px-3 py-2"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="admin">Admin</option>
//           <option value="manager">Manager</option>
//         </select>

//         <button
//           onClick={handleSignup}
//           disabled={loading}
//           className="w-full rounded-lg bg-black text-white py-2"
//         >
//           {loading ? "Creating..." : "Sign Up"}
//         </button>
//       </div>
//     </div>
//   );
// }

