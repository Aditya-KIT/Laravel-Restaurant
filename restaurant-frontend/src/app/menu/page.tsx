import { apiFetch } from "@/lib/api";

export default async function MenuPage() {
  const data = await apiFetch<{ data: { id: number; name: string; price: string }[] }>("/menu").catch(() => ({ data: [] }));
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Food Menu</h1>
      <div className="grid gap-3 md:grid-cols-3">
        {data.data.map((item) => (
          <div key={item.id} className="rounded border p-4 bg-white">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Rs {item.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
