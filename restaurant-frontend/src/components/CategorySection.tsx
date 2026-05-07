"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Pizza, Coffee, Dessert, Fish, Beef, Soup } from "lucide-react";

const categories = [
  { id: 1, name: "Pizza", icon: Pizza, color: "bg-red-100 text-red-600" },
  { id: 2, name: "Burger", icon: Beef, color: "bg-orange-100 text-orange-600" },
  { id: 3, name: "Drinks", icon: Coffee, color: "bg-blue-100 text-blue-600" },
  { id: 4, name: "Desserts", icon: Dessert, color: "bg-pink-100 text-pink-600" },
  { id: 5, name: "Seafood", icon: Fish, color: "bg-teal-100 text-teal-600" },
  { id: 6, name: "Asian", icon: Soup, color: "bg-amber-100 text-amber-600" },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Explore by Category</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/menu?category=${category.name.toLowerCase()}`}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 p-6 text-center transition-all hover:border-amber-200 hover:bg-amber-50 hover:shadow-lg"
              >
                <div className={`rounded-full p-4 transition-transform group-hover:scale-110 ${category.color}`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
