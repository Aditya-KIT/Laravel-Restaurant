"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import PublicNavbar from "@/components/PublicNavbar";
import { apiFetch } from "@/lib/api";
import { Check, ShieldCheck, MapPin, Phone, MessageSquare, CreditCard } from "lucide-react";

type CartItem = {
  id: number;
  quantity: number;
  menu_item: {
    name: string;
    price: string;
  };
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Form Fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await apiFetch<CartItem[]>("/cart", "GET", undefined, token);
        if (Array.isArray(res)) {
          setCartItems(res);
          if (res.length === 0) {
            // Redirect if empty
            window.location.href = "/menu";
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone.trim()) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter a complete delivery address.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    try {
      const payload = {
        phone,
        address,
        notes: notes.trim() || null,
        payment_method: paymentMethod
      };

      const res = await apiFetch<any>("/checkout", "POST", payload, token);
      
      setPlacedOrder(res?.order);
      setOrderSuccess(true);

      // Reset cart badge count
      window.dispatchEvent(new Event("cartUpdated"));

      const toast = document.createElement('div');
      toast.textContent = "Order Placed Successfully!";
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#C9A96E;color:#0F0D0A;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);

      // Redirect to orders after 3 seconds
      setTimeout(() => {
        window.location.href = "/orders";
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to place order. Please check details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.menu_item?.price || "0");
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.05;
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 80;
  const grandTotal = subtotal + tax + deliveryCharge;

  if (orderSuccess) {
    return (
      <AuthGuard role="customer">
        <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
          <PublicNavbar />
          <section className="section" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              background: 'var(--dark2)',
              border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: '4px',
              padding: '60px 40px',
              maxWidth: '550px',
              width: '100%',
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
                <Check className="h-10 w-10" style={{ strokeWidth: 3 }} />
              </div>
              
              <div>
                <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                  Bon Appétit
                </span>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', margin: '8px 0', color: 'var(--text)' }}>
                  Order Confirmed
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: '1.6' }}>
                  Your order has been received by our kitchen. We will begin crafting your gourmet meal immediately.
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(201,169,110,0.15)',
                borderBottom: '1px solid rgba(201,169,110,0.15)',
                padding: '16px 0',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: 'var(--text2)'
              }}>
                <span>Order Reference:</span>
                <strong style={{ color: 'var(--gold)' }}>#LM-{placedOrder?.id || 'XYZ'}</strong>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--gold)', fontStyle: 'italic' }}>
                Redirecting you to your Order History...
              </p>
            </div>
          </section>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="customer">
      <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
        <PublicNavbar />
        
        <section className="section" style={{ flex: 1, padding: '60px 40px' }}>
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="section-tag">Grand Finale</span>
            <h2 className="section-title">Gourmet <em>Checkout</em></h2>
            <div className="section-line"></div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold)' }}>
              Loading checkout details...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1.2fr',
              gap: '40px',
              maxWidth: '1200px',
              margin: '0 auto',
              alignItems: 'start'
            }} className="checkout-layout-grid">
              
              {/* Left Column: Delivery Form */}
              <form onSubmit={handlePlaceOrder} style={{
                background: 'var(--dark2)',
                border: '1px solid rgba(201,169,110,0.15)',
                borderRadius: '4px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '22px',
                  borderBottom: '1px solid rgba(201,169,110,0.15)',
                  paddingBottom: '14px',
                  fontWeight: '400'
                }}>
                  Delivery & Details
                </h3>

                {errorMsg && (
                  <div style={{
                    background: 'rgba(176,32,32,0.1)',
                    border: '1px solid #B02020',
                    color: '#FF8A8A',
                    padding: '12px 16px',
                    borderRadius: '2px',
                    fontSize: '13px'
                  }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin className="h-3 w-3" /> Delivery Address
                  </label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Complete apartment, building, block and street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.15)'}
                  />
                </div>

                <div className="form-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare className="h-3 w-3" /> Cooking / Delivery Instructions
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Make it extra spicy, Leave at the gate, Call when arrived"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(201,169,110,0.15)'}
                  />
                </div>

                {/* Payment Methods */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard className="h-3 w-3" /> Payment Method
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div 
                      onClick={() => setPaymentMethod("cod")}
                      style={{
                        border: `1px solid ${paymentMethod === 'cod' ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
                        background: paymentMethod === 'cod' ? 'rgba(201,169,110,0.05)' : 'transparent',
                        padding: '16px',
                        borderRadius: '2px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      <h4 style={{ fontSize: '14px', fontWeight: '500', color: paymentMethod === 'cod' ? 'var(--gold)' : 'var(--text2)' }}>
                        Cash On Delivery
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px' }}>Pay in cash or UPI upon delivery</p>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("online")}
                      style={{
                        border: `1px solid ${paymentMethod === 'online' ? 'var(--gold)' : 'rgba(201,169,110,0.15)'}`,
                        background: paymentMethod === 'online' ? 'rgba(201,169,110,0.05)' : 'transparent',
                        padding: '16px',
                        borderRadius: '2px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      <h4 style={{ fontSize: '14px', fontWeight: '500', color: paymentMethod === 'online' ? 'var(--gold)' : 'var(--text2)' }}>
                        Online Payment
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px' }}>Credit/Debit Card Simulator</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="res-btn" 
                  style={{ width: '100%', margin: '10px 0 0 0' }}
                >
                  {submitting ? "Placing Your Order..." : `Place Order (₹${Math.round(grandTotal)})`}
                </button>
              </form>

              {/* Right Column: Order Overview */}
              <div style={{
                background: 'var(--dark2)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '4px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '22px',
                  borderBottom: '1px solid rgba(201,169,110,0.15)',
                  paddingBottom: '14px',
                  fontWeight: '400'
                }}>
                  Order Overview
                </h3>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '200px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text2)' }}>
                        {item.menu_item?.name} <strong style={{ color: 'var(--gold)' }}>x{item.quantity}</strong>
                      </span>
                      <span>₹{Math.round(parseFloat(item.menu_item?.price || "0") * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '1px solid rgba(201,169,110,0.15)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text2)' }}>
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text2)' }}>
                    <span>Taxes & GST (5%)</span>
                    <span>₹{Math.round(tax)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text2)' }}>
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? <span style={{ color: 'var(--gold)' }}>FREE</span> : `₹${deliveryCharge}`}</span>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(201,169,110,0.15)',
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '15px' }}>Grand Total</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: 'var(--gold)' }}>
                    ₹{Math.round(grandTotal)}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(201,169,110,0.05)',
                  border: '1px dashed rgba(201,169,110,0.25)',
                  borderRadius: '2px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <ShieldCheck className="h-5 w-5" style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: '1.4' }}>
                    Your purchase is protected. High culinary standards and contact-free delivery guaranteed.
                  </span>
                </div>
              </div>

            </div>
          )}
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
