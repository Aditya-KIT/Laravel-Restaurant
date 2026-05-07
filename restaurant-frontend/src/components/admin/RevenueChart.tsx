"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiFetch } from "@/lib/api";

type ChartData = {
  date: string;
  total: number;
};

export default function RevenueChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiFetch<ChartData[]>("/admin/dashboard/revenue-chart", "GET", undefined, localStorage.getItem("token") || undefined);
        
        // Format dates for display
        const formattedData = result.map(item => ({
          ...item,
          total: parseFloat(item.total.toString()),
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="h-72 flex items-center justify-center text-gray-500">Loading chart...</div>;
  if (data.length === 0) return <div className="h-72 flex items-center justify-center text-gray-500">No revenue data available for the last 7 days.</div>;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
      <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">Revenue Over Time (Last 7 Days)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => {
                const numValue = typeof value === 'number' ? value : Number(value || 0);
                return [`$${numValue.toFixed(2)}`, 'Revenue'];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
