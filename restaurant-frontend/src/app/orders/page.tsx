"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import PublicNavbar from "@/components/PublicNavbar";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { Calendar, MapPin, Phone, MessageSquare, Clipboard, CreditCard, Users, Clock, Compass, BookOpen } from "lucide-react";

type Order = {
  id: number;
  total_amount: string;
  status: string;
  address: string;
  phone: string;
  notes: string | null;
  created_at: string;
  items: {
    id: number;
    menu_item_id: number;
    quantity: number;
    price: string;
    menu_item: {
      name: string;
    };
  }[];
  payment: {
    method: string;
    status: string;
  } | null;
};

type Booking = {
  id: number;
  name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  message: string | null;
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "bookings">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await apiFetch<Order[]>("/orders", "GET", undefined, token);
        if (Array.isArray(res)) {
          setOrders(res);
        }
      } catch (err) {
        console.error("Orders fetch failed:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    async function loadBookings() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await apiFetch<Booking[]>("/bookings", "GET", undefined, token);
        if (Array.isArray(res)) {
          setBookings(res);
        }
      } catch (err) {
        console.error("Bookings fetch failed:", err);
      } finally {
        setLoadingBookings(false);
      }
    }

    loadOrders();
    loadBookings();
  }, []);

  const getOrderStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") {
      return { border: "1px solid rgba(201,169,110,0.4)", color: "var(--gold)", background: "rgba(201,169,110,0.05)" };
    }
    if (s === "preparing") {
      return { border: "1px solid rgba(32,96,160,0.4)", color: "#60A5FA", background: "rgba(32,96,160,0.05)" };
    }
    if (s === "completed" || s === "delivered" || s === "confirmed") {
      return { border: "1px solid rgba(34,197,94,0.4)", color: "#4ADE80", background: "rgba(34,197,94,0.05)" };
    }
    if (s === "cancelled" || s === "failed") {
      return { border: "1px solid rgba(176,32,32,0.4)", color: "#F87171", background: "rgba(176,32,32,0.05)" };
    }
    return { border: "1px solid rgba(255,255,255,0.2)", color: "var(--text2)", background: "transparent" };
  };

  const formatPaymentMethod = (method: string) => {
    const m = method.toLowerCase();
    if (m === "cod") return "Cash on Delivery (COD)";
    if (m === "online") return "Online Payment";
    return method.toUpperCase();
  };

  return (
    <AuthGuard role="customer">
      <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
        <PublicNavbar />
        
        <section className="section" style={{ flex: 1, padding: '60px 40px' }}>
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="section-tag">Your Activity</span>
            <h2 className="section-title">My <em>Reservations & Orders</em></h2>
            <div className="section-line"></div>
          </div>

          {/* Toggle Tabs */}
          <div className="menu-tabs" style={{ marginBottom: '40px' }}>
            <button 
              className={`tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Gourmet Orders ({orders.length})
            </button>
            <button 
              className={`tab ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              Table Bookings ({bookings.length})
            </button>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {activeTab === "orders" ? (
              /* Gourmet Orders Tab */
              loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gold)' }}>
                  Loading gourmet order logs...
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'var(--dark2)',
                  border: '1px solid rgba(201,169,110,0.15)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <Clipboard style={{ width: '48px', height: '48px', color: 'var(--gold)', opacity: 0.8 }} />
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '6px' }}>No Orders Found</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '13px' }}>It looks like you haven't placed any gourmet orders yet.</p>
                  </div>
                  <Link href="/menu" className="nav-cta" style={{ textDecoration: 'none', padding: '10px 24px' }}>
                    View Gourmet Menu
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {orders.map((order) => {
                    const dateObj = new Date(order.created_at);
                    const formattedDate = dateObj.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <div 
                        key={order.id}
                        style={{
                          background: 'var(--dark2)',
                          border: '1px solid rgba(201,169,110,0.15)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          background: 'rgba(201,169,110,0.03)',
                          borderBottom: '1px solid rgba(201,169,110,0.1)',
                          padding: '16px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px' }}>
                              ORDER REFERENCE
                            </span>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '400' }}>
                              #LM-ORD{order.id}
                            </h3>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text2)' }}>
                              <Calendar className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                              {formattedDate}
                            </div>

                            <span style={{
                              fontSize: '10px',
                              letterSpacing: '1.5px',
                              textTransform: 'uppercase',
                              padding: '5px 12px',
                              borderRadius: '2px',
                              fontWeight: '500',
                              ...getOrderStatusStyle(order.status)
                            }}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }} className="order-details-grid">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                              Items Ordered
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {order.items.map((item) => (
                                <div 
                                  key={item.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '13px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    paddingBottom: '8px'
                                  }}
                                >
                                  <span style={{ color: 'var(--text2)' }}>
                                    {item.menu_item?.name} <strong style={{ color: 'var(--gold)' }}>x{item.quantity}</strong>
                                  </span>
                                  <span>
                                    ₹{Math.round(parseFloat(item.price) * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                              Delivery Log
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text2)' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Phone className="h-4 w-4" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{order.phone}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <MapPin className="h-4 w-4" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ lineHeight: '1.4' }}>{order.address}</span>
                              </div>
                              {order.notes && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                  <MessageSquare className="h-4 w-4" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                                  <span style={{ fontStyle: 'italic', lineHeight: '1.4' }}>"{order.notes}"</span>
                                </div>
                              )}
                              <div style={{
                                borderTop: '1px solid rgba(201,169,110,0.1)',
                                paddingTop: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}>
                                <CreditCard className="h-4 w-4" style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                <span>
                                  {order.payment ? formatPaymentMethod(order.payment.method) : "COD"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(255,255,255,0.02)',
                          borderTop: '1px solid rgba(201,169,110,0.1)',
                          padding: '16px 24px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline'
                        }}>
                          <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Grand Total Paid</span>
                          <strong style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'var(--gold)' }}>
                            ₹{Math.round(parseFloat(order.total_amount))}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Table Bookings Tab */
              loadingBookings ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gold)' }}>
                  Loading table reservations...
                </div>
              ) : bookings.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'var(--dark2)',
                  border: '1px solid rgba(201,169,110,0.15)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <BookOpen style={{ width: '48px', height: '48px', color: 'var(--gold)', opacity: 0.8 }} />
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '6px' }}>No Bookings Found</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '13px' }}>It looks like you haven't reserved any tables yet.</p>
                  </div>
                  <Link href="/booking" className="nav-cta" style={{ textDecoration: 'none', padding: '10px 24px' }}>
                    Reserve a Table
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {bookings.map((booking) => {
                    const bookingDateObj = new Date(booking.booking_date);
                    const formattedBookingDate = bookingDateObj.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    });

                    return (
                      <div 
                        key={booking.id}
                        style={{
                          background: 'var(--dark2)',
                          border: '1px solid rgba(201,169,110,0.15)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          background: 'rgba(201,169,110,0.03)',
                          borderBottom: '1px solid rgba(201,169,110,0.1)',
                          padding: '16px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px' }}>
                              RESERVATION REFERENCE
                            </span>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '400' }}>
                              #LM-TR{booking.id}
                            </h3>
                          </div>

                          <span style={{
                            fontSize: '10px',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            padding: '5px 12px',
                            borderRadius: '2px',
                            fontWeight: '500',
                            ...getOrderStatusStyle(booking.status || "pending")
                          }}>
                            {booking.status || "pending"}
                          </span>
                        </div>

                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="order-details-grid">
                          {/* Left: Reservation Details */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                              Reservation Info
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text2)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                                <span>{formattedBookingDate}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                                <span>At {booking.booking_time}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'} Reserved</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Guest & Notes */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                              Guest Details
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text2)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clipboard className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                                <span>Name: <strong style={{ color: 'var(--text)' }}>{booking.name}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Phone className="h-4 w-4" style={{ color: 'var(--gold)' }} />
                                <span>Phone: {booking.phone}</span>
                              </div>
                              {booking.message && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                  <MessageSquare className="h-4 w-4" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                                  <span style={{ fontStyle: 'italic', lineHeight: '1.4' }}>"{booking.message}"</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(255,255,255,0.02)',
                          borderTop: '1px solid rgba(201,169,110,0.1)',
                          padding: '14px 24px',
                          textAlign: 'center',
                          fontSize: '11px',
                          color: 'var(--gold)',
                          fontStyle: 'italic'
                        }}>
                          Please arrive 10 minutes prior to your seating. Call us for updates or cancellation.
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </section>

        <footer>
          <div className="footer-logo">LA MAISON</div>
          <div className="footer-text">© {new Date().getFullYear()} La Maison. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">WhatsApp</a>
            <a href="#">Reviews</a>
          </div>
        </footer>
      </main>
    </AuthGuard>
  );
}
