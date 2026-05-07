"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  role?: "admin" | "customer";
};

export default function AuthGuard({ children, role }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role && userRole !== role) {
      router.push("/");
    }
  }, [role, router]);

  return <>{children}</>;
}
