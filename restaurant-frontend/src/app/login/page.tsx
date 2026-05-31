"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

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

  return (
    <>
      <style>{`
        .login-body {
          min-height: 100vh;
          background: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .login-body::before {
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
          padding: 2.5rem 2rem;
          border: 6px solid var(--dark3);
          z-index: 1;
        }

        .card-title {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .heart {
          color: var(--gold-light);
          font-size: 1.1rem;
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
          margin-bottom: 1rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"] {
          width: 100%;
          height: 44px;
          background: transparent;
          border: 1.5px solid rgba(201,169,110,0.2);
          border-radius: 8px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
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

        .btn-signin {
          width: 100%;
          height: 44px;
          margin-top: 0.5rem;
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

        .btn-signin::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }

        .btn-signin:hover::after {
          transform: translateX(100%);
        }

        .btn-signin:hover {
          box-shadow: 0 0 20px rgba(201,169,110,0.5), 0 0 40px rgba(201,169,110,0.2);
          transform: translateY(-1px);
        }

        .btn-signin:active {
          transform: translateY(0);
        }

        .card-footer {
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.78rem;
        }

        .card-footer a {
          color: rgba(240,230,206,0.45);
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 300;
        }

        .card-footer a:hover {
          color: rgba(240,230,206,0.9);
        }

        .card-footer .signup-link {
          color: var(--gold);
          font-weight: 500;
        }

        .card-footer .signup-link:hover {
          color: var(--gold-light);
          text-shadow: 0 0 8px rgba(201,169,110,0.5);
        }

        .card-footer .sep {
          color: rgba(240,230,206,0.15);
          font-size: 0.65rem;
        }
      `}</style>

      <div className="login-body">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="card-wrapper">
          <form className="card" onSubmit={onSubmit}>
            <h1 className="card-title">
              <span className="heart">♥</span>
              LOGIN
              <span className="heart">♥</span>
            </h1>

            <div className="field">
              <input type="email" placeholder="Email Address" autoComplete="username" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>

            <div className="field">
              <input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>

            {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="btn-signin">Sign in</button>

            <div className="card-footer">
              <Link href="/register">Forgot Password</Link>
              <span className="sep">|</span>
              <Link href="/register" className="signup-link">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
