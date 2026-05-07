"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiFetch<{ token: string; user: { role: { name: string } } }>("/auth/login", "POST", { email, password });
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role.name);
      router.push(result.user.role.name === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 space-y-3"><h1 className="text-xl font-bold">Login</h1><input className="w-full border p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />{error && <p className="text-red-600">{error}</p>}<button className="bg-black text-white px-4 py-2 rounded" type="submit">Login</button></form>;
}
