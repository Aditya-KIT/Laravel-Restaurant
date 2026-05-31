"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import PublicNavbar from "@/components/PublicNavbar";
import { apiFetch } from "@/lib/api";
import { Calendar, Clock, Users, Phone, User, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    booking_date: "",
    booking_time: "",
    guests: "2",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await apiFetch("/bookings", "POST", {
        ...formData,
        guests: parseInt(formData.guests, 10)
      }, localStorage.getItem("token") || undefined);
      
      setSuccess(true);

      const toast = document.createElement('div');
      toast.textContent = "Reservation Submitted Successfully!";
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#C9A96E;color:#0F0D0A;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);

    } catch (err: any) {
      if (err?.message === "Unauthenticated.") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }
      setError(err.message || "Failed to submit reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      name: "",
      phone: "",
      booking_date: "",
      booking_time: "",
      guests: "2",
      message: ""
    });
  };

  return (
    <AuthGuard role="customer">
      <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
        <PublicNavbar />
        
        <section className="section" style={{ flex: 1, padding: '60px 20px' }}>
          <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <span className="section-tag">Guarantee Your Table</span>
              <h2 className="section-title">Table <em>Reservations</em></h2>
              <div className="section-line"></div>
            </div>

            <div style={{
              background: 'var(--dark2)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              {success ? (
                <div style={{
                  padding: '60px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px'
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--dark)'
                  }}>
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                      Grand Seating
                    </span>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', margin: '8px 0', color: 'var(--text)' }}>
                      Reservation Confirmed!
                    </h3>
                    <p style={{ color: 'var(--text2)', fontSize: '15px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                      Thank you, <strong style={{ color: 'var(--text)' }}>{formData.name}</strong>. Your exquisite dining experience for <strong style={{ color: 'var(--gold)' }}>{formData.guests} guests</strong> on <strong style={{ color: 'var(--gold)' }}>{new Date(formData.booking_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> at <strong style={{ color: 'var(--gold)' }}>{formData.booking_time}</strong> has been successfully reserved.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button
                      onClick={resetForm}
                      className="res-btn"
                      style={{ padding: '12px 24px', margin: 0 }}
                    >
                      Book Another Table
                    </button>
                    <Link href="/orders" style={{ textDecoration: 'none' }}>
                      <button
                        className="res-btn"
                        style={{
                          padding: '12px 24px',
                          margin: 0,
                          background: 'transparent',
                          color: 'var(--gold)',
                          border: '1px solid rgba(201,169,110,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        View My Bookings <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                  {error && (
                    <div style={{
                      background: 'rgba(176,32,32,0.1)',
                      border: '1px solid #B02020',
                      color: '#FF8A8A',
                      padding: '12px 16px',
                      borderRadius: '2px',
                      fontSize: '13px',
                      width: '100%',
                      maxWidth: '500px',
                      textAlign: 'center'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '500px'
                  }}>
                    
                    {/* Name Field */}
                    <div className="form-field" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                        <User className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        style={{ textAlign: 'center', width: '100%' }}
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="form-field" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                        <Phone className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="e.g. +91 98765 43210"
                        style={{ textAlign: 'center', width: '100%' }}
                      />
                    </div>

                    {/* Date Field */}
                    <div className="form-field" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                        <Calendar className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Booking Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.booking_date}
                        onChange={e => setFormData({...formData, booking_date: e.target.value})}
                        style={{ textAlign: 'center', width: '100%' }}
                      />
                    </div>

                    {/* Time & Guests Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                      <div className="form-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                          <Clock className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Seating Time
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.booking_time}
                          onChange={e => setFormData({...formData, booking_time: e.target.value})}
                          style={{ textAlign: 'center', width: '100%' }}
                        />
                      </div>
                      <div className="form-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                          <Users className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Guests Count
                        </label>
                        <select
                          required
                          value={formData.guests}
                          onChange={e => setFormData({...formData, guests: e.target.value})}
                          style={{ textAlignLast: 'center', width: '100%' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "10+"].map(num => (
                            <option key={num} value={num === "10+" ? 11 : num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="form-field" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                        <MessageSquare className="h-3 w-3" style={{ color: 'var(--gold)' }} /> Special Seating / Dietary Requests (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Any requirements or celebrations?"
                        style={{
                          background: 'rgba(201,169,110,0.05)',
                          border: '1px solid rgba(201,169,110,0.15)',
                          borderRadius: '2px',
                          padding: '12px 16px',
                          color: 'var(--text)',
                          fontFamily: 'inherit',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'none',
                          transition: 'border-color 0.3s',
                          width: '100%',
                          textAlign: 'center'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.15)'}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', width: '100%', maxWidth: '500px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="res-btn"
                      style={{ width: '100%', margin: 0 }}
                    >
                      {loading ? "Processing Seating..." : "Confirm Seating"}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text2)', marginTop: '12px' }}>
                      By confirming, you agree to our table reservation terms & conditions.
                    </p>
                  </div>
                </form>
              )}
            </div>
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
