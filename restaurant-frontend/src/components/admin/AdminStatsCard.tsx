"use client";

import { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function AdminStatsCard({ title, value, icon: Icon, trend, trendUp }: AdminStatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
      <dt>
        <div className="absolute rounded-xl bg-amber-50 p-3">
          <Icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </p>
        )}
      </dd>
    </div>
  );
}
