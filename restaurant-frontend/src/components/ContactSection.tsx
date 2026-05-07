"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500">Contact Us</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get In Touch</h3>
            <p className="mt-4 text-lg text-gray-600 mb-10">
              We'd love to hear from you. Whether it's a reservation, feedback, or a special request, our team is always ready to assist.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Location</h4>
                  <p className="text-gray-600 mt-1">123 Culinary Avenue<br/>Food District, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone</h4>
                  <p className="text-gray-600 mt-1">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600 mt-1">info@restaurant.com<br/>reservations@restaurant.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Opening Hours</h4>
                  <p className="text-gray-600 mt-1">Mon - Fri: 11:00 AM - 10:00 PM<br/>Sat - Sun: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[500px] w-full rounded-3xl overflow-hidden bg-gray-200"
          >
            {/* Embedded Google Map iframe could go here. Using an image for demo purposes */}
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
              alt="Map location" 
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
