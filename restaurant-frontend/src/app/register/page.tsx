"use client";

import { apiFetch } from "@/lib/api";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);

  const checkStrength = (val: string) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setScore(s);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, password: val }));
    checkStrength(val);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiFetch("/auth/register", "POST", form);
      setMessage("Registered successfully. Please login.");
      setForm({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
      setScore(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      <style>{`
        .register-body {
          min-height: 100vh;
          background: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .register-body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.18;
        }
        .blob-1 {
          width: 400px; height: 400px;
          background: var(--gold);
          top: -100px; left: -100px;
          animation: drift1 8s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 350px; height: 350px;
          background: var(--gold-light);
          bottom: -100px; right: -80px;
          animation: drift2 10s ease-in-out infinite alternate;
        }

        @keyframes drift1 { to { transform: translate(60px, 80px); } }
        @keyframes drift2 { to { transform: translate(-60px, -60px); } }

        .card-wrapper {
          position: relative;
          width: 340px;
          padding: 3px;
          border-radius: 20px;
          z-index: 10;
        }

        .card-wrapper::before,
        .card-wrapper::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: conic-gradient(
            from 0deg,
            var(--gold) 0%,
            var(--gold) 15%,
            transparent 30%,
            transparent 50%,
            var(--gold-light) 65%,
            var(--gold-light) 80%,
            transparent 95%,
            var(--gold) 100%
          );
          animation: rotating 4s linear infinite;
        }

        .card-wrapper::after {
          filter: blur(12px);
          opacity: 0.6;
          animation-delay: -1s;
        }

        @keyframes rotating {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .card {
          position: relative;
          background: var(--dark2);
          border-radius: 18px;
          padding: 2.25rem 2rem;
          border: 6px solid var(--dark3);
          z-index: 1;
        }

        .card-title {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .heart {
          color: var(--gold-light);
          font-size: 1rem;
          animation: heartbeat 1.4s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.2); }
          56% { transform: scale(1); }
        }

        .field {
          margin-bottom: 0.85rem;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="tel"] {
          width: 100%;
          height: 42px;
          background: transparent;
          border: 1.5px solid rgba(201,169,110,0.2);
          border-radius: 8px;
          padding: 0 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: var(--text);
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          letter-spacing: 0.04em;
        }

        input::placeholder {
          color: rgba(240,230,206,0.35);
        }

        input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 2px rgba(201,169,110,0.12), inset 0 0 10px rgba(201,169,110,0.05);
        }

        .strength-label {
          font-size: 0.68rem;
          color: rgba(240,230,206,0.35);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 5px;
          margin-bottom: 4px;
          padding-left: 2px;
        }

        .strength-bar {
          display: flex;
          gap: 4px;
          margin-bottom: 0.85rem;
        }

        .seg {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(201,169,110,0.1);
          transition: background 0.3s;
        }
        .seg.weak  { background: #ff4d4d; }
        .seg.fair  { background: #ffaa00; }
        .seg.good  { background: var(--gold); }
        .seg.great { background: var(--gold-light); }

        .btn-register {
          width: 100%;
          height: 44px;
          margin-top: 0.25rem;
          border: none;
          border-radius: 8px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          color: var(--dark);
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }

        .btn-register::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }

        .btn-register:hover::after {
          transform: translateX(100%);
        }

        .btn-register:hover {
          box-shadow: 0 0 20px rgba(201,169,110,0.5), 0 0 40px rgba(201,169,110,0.2);
          transform: translateY(-1px);
        }

        .btn-register:active {
          transform: translateY(0);
        }

        .card-footer {
          margin-top: 1.1rem;
          text-align: center;
          font-size: 0.78rem;
          color: rgba(240,230,206,0.35);
          font-weight: 300;
        }

        .card-footer a {
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s, text-shadow 0.2s;
        }

        .card-footer a:hover {
          color: var(--gold-light);
          text-shadow: 0 0 8px rgba(201,169,110,0.5);
        }
      `}</style>

      <div className="register-body">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="card-wrapper">
          <form className="card" onSubmit={onSubmit}>
            <h1 className="card-title">
              <span className="heart">♥</span>
              REGISTER
              <span className="heart">♥</span>
            </h1>

            <div className="field">
              <input type="text" placeholder="Full Name" autoComplete="name" value={form.name} onChange={(e)=>setForm((p)=>({ ...p, name: e.target.value }))} required />
            </div>

            <div className="field">
              <input type="email" placeholder="Email Address" autoComplete="email" value={form.email} onChange={(e)=>setForm((p)=>({ ...p, email: e.target.value }))} required />
            </div>

            <div className="field">
              <input type="tel" placeholder="Phone Number" autoComplete="tel" value={form.phone} onChange={(e)=>setForm((p)=>({ ...p, phone: e.target.value }))} />
            </div>

            <div className="field">
              <input type="password" placeholder="Password" autoComplete="new-password" value={form.password} onChange={onPasswordChange} required />
            </div>

            <div className="strength-label">Password strength</div>
            <div className="strength-bar">
              <div className={`seg ${score >= 1 ? 'weak' : ''}`}></div>
              <div className={`seg ${score >= 2 ? 'fair' : ''}`}></div>
              <div className={`seg ${score >= 3 ? 'good' : ''}`}></div>
              <div className={`seg ${score >= 4 ? 'great' : ''}`}></div>
            </div>

            <div className="field">
              <input type="password" placeholder="Confirm Password" autoComplete="new-password" value={form.password_confirmation} onChange={(e)=>setForm((p)=>({ ...p, password_confirmation: e.target.value }))} required />
            </div>

            {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
            {message && <p style={{ color: '#00c8a0', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

            <button type="submit" className="btn-register">Create Account</button>

            <div className="card-footer">
              Already have an account? <Link href="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
