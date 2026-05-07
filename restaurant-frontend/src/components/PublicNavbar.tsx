"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";

export default function PublicNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      if (role === "admin") setIsAdmin(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { apiFetch } = await import("@/lib/api");
      await apiFetch("/auth/logout", "POST", undefined, localStorage.getItem("token") || undefined);
    } catch (e) {} finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.location.reload();
    }
  };

  if (!mounted) return null;

  return (
    <nav>
      <div className="logo">LA <span>Maison</span></div>
      <ul className="nav-links">
        <li><Link href="/menu">Menu</Link></li>
        <li><Link href="/#about">Story</Link></li>
        <li><Link href="/#experience">Experience</Link></li>
      </ul>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <ul className="nav-links">
        {!isLoggedIn ? (
          <>
            <li><Link href="/login"><LogIn className="h-4 w-4" /> Login</Link></li>
            <li><Link href="/register"><UserPlus className="h-4 w-4" /> Register</Link></li>
          </>
        ) : (
          <>
            {isAdmin && <li><Link href="/admin/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></li>}
            <li><button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}><LogOut className="h-4 w-4" /> Logout</button></li>
          </>
        )}
        </ul>
        <Link href="/booking" className="nav-cta" style={{textDecoration:'none'}}>Reserve a Table</Link>
      </div>
    </nav>
  );
}
