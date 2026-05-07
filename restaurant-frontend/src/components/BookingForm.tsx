"use client";

import { useState } from "react";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className="reservation fade-in" id="booking">
      <div className="res-content">
        <span className="section-tag" style={{ display: 'block', marginBottom: '12px' }}>Make a Reservation</span>
        <h2>Book Your<br/><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Table Tonight</em></h2>
        <p style={{ marginTop: '16px' }}>Secure your experience at La Maison. Private dining rooms available for special occasions. We recommend booking 48 hours in advance.</p>
        <div style={{ marginTop: '28px', display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>Hours</div>
            <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Lunch: 12:00 – 15:00<br/>Dinner: 19:00 – 23:30</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(201,169,110,0.15)' }}></div>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>Location</div>
            <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Civil Lines, Prayagraj<br/>Uttar Pradesh</div>
          </div>
        </div>
      </div>
      <form className="res-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Full Name</label>
            <input required type="text" placeholder="Your name" />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input required type="tel" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Date</label>
            <input required type="date" />
          </div>
          <div className="form-field">
            <label>Time</label>
            <select required>
              <option>12:00 PM</option><option>12:30 PM</option>
              <option>7:00 PM</option><option>7:30 PM</option>
              <option>8:00 PM</option><option>8:30 PM</option>
              <option>9:00 PM</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label>Guests</label>
          <select required>
            <option>1 Guest</option><option>2 Guests</option>
            <option>3 Guests</option><option>4 Guests</option>
            <option>5-6 Guests</option><option>Private Event (7+)</option>
          </select>
        </div>
        <button type="submit" className="res-btn" style={success ? { background: '#4A7A4A', color: 'white' } : {}} disabled={loading}>
          {success ? '✓ Reservation Confirmed!' : (loading ? 'Booking...' : 'Confirm Reservation')}
        </button>
      </form>
    </section>
  );
}
