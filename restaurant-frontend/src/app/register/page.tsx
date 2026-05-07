"use client";

import { apiFetch } from "@/lib/api";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await apiFetch("/auth/register", "POST", form);
    setMessage("Registered successfully. Please login.");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-xl font-bold">Register</h1>
      {Object.keys(form).map((key) => (
        <input key={key} className="w-full border p-2" placeholder={key} type={key.includes("password") ? "password" : "text"} value={form[key as keyof typeof form]} onChange={(e)=>setForm((p)=>({ ...p, [key]: e.target.value }))} />
      ))}
      {message && <p className="text-green-600">{message}</p>}
      <button className="bg-black text-white px-4 py-2 rounded" type="submit">Register</button>
    </form>
  );
}
