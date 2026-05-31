"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import PublicNavbar from "@/components/PublicNavbar";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

type CartItem = {
  id: number;
  user_id: number;
  menu_item_id: number;
  quantity: number;
  menu_item: {
    id: number;
    name: string;
    price: string;
    description: string | null;
    sub_category: string | null;
    gradient: string | null;
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await apiFetch<CartItem[]>("/cart", "GET", undefined, token);
      if (Array.isArray(res)) {
        setCartItems(res);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, currentQty: number, change: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const newQty = currentQty + change;
    if (newQty < 1) return;

    setUpdatingId(itemId);
    try {
      await apiFetch(`/cart/${itemId}`, "PUT", { quantity: newQty }, token);
      
      // Update local state instantly
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
      
      // Trigger Navbar count update
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      await apiFetch(`/cart/${itemId}`, "DELETE", undefined, token);
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Trigger Navbar count update
      window.dispatchEvent(new Event("cartUpdated"));
      
      const toast = document.createElement('div');
      toast.textContent = "Item removed from cart";
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#C9A96E;color:#0F0D0A;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const getEmoji = (cat: string | null) => {
    const map: Record<string, string> = {
      'Signature': '🫙', 'Continental': '🥗', 'Seafood': '🦐',
      'Heritage': '🍚', 'Vegetarian': '🌿', 'Indian Classic': '🍮',
      'French': '🍮', 'Traditional': '🍩', 'Crafted': '🍹',
      'Loved': '🍡', 'Premium': '🥩'
    };
    return map[cat || ""] || '🍽️';
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.menu_item?.price || "0");
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.05; // 5% CGST + SGST (roughly)
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 80;
  const grandTotal = subtotal + tax + deliveryCharge;

  return (
    <AuthGuard role="customer">
      <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
        <PublicNavbar />
        
        <section className="section" style={{ flex: 1, padding: '60px 40px' }}>
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="section-tag">Your Selection</span>
            <h2 className="section-title">Gourmet <em>Shopping</em> Cart</h2>
            <div className="section-line"></div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold)' }}>
              Loading your selection...
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'var(--dark2)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: '4px',
              maxWidth: '600px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <ShoppingBag style={{ width: '64px', height: '64px', color: 'var(--gold)', opacity: 0.8 }} />
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', marginBottom: '8px' }}>Your Cart is Empty</h3>
                <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Add some gourmet dishes from tonight's featured menu to get started.</p>
              </div>
              <Link href="/menu" className="nav-cta" style={{ textDecoration: 'none', padding: '12px 30px' }}>
                Explore Our Menu
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '40px',
              maxWidth: '1200px',
              margin: '0 auto',
              alignItems: 'start'
            }} className="cart-layout-grid">
              
              {/* Left Column: Cart List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      background: 'var(--dark2)',
                      border: '1px solid rgba(201,169,110,0.15)',
                      borderRadius: '4px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    {/* Item Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                      <div 
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '4px',
                          background: item.menu_item?.gradient || 'linear-gradient(135deg,#3D1F08,#8B4513)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          flexShrink: 0
                        }}
                      >
                        {getEmoji(item.menu_item?.sub_category)}
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                          {item.menu_item?.sub_category || "Gourmet"}
                        </span>
                        <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '400', margin: '4px 0' }}>
                          {item.menu_item?.name}
                        </h4>
                        <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                          ₹{Math.round(parseFloat(item.menu_item?.price || "0"))} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(201,169,110,0.3)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <button 
                          disabled={item.quantity <= 1 || updatingId === item.id}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: item.quantity <= 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold)',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text)' }}>
                          {item.quantity}
                        </span>
                        <button 
                          disabled={updatingId === item.id}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--gold)',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '18px',
                        color: 'var(--gold)',
                        minWidth: '70px',
                        textAlign: 'right'
                      }}>
                        ₹{Math.round(parseFloat(item.menu_item?.price || "0") * item.quantity)}
                      </div>

                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B02020',
                          cursor: 'pointer',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary */}
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
                  fontWeight: '400',
                  borderBottom: '1px solid rgba(201,169,110,0.15)',
                  paddingBottom: '16px'
                }}>
                  Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text2)' }}>
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text2)' }}>
                    <span>Taxes & Service GST (5%)</span>
                    <span>₹{Math.round(tax)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text2)' }}>
                    <span>Delivery Charges</span>
                    <span>{deliveryCharge === 0 ? <span style={{ color: 'var(--gold)' }}>FREE</span> : `₹${deliveryCharge}`}</span>
                  </div>
                  
                  {deliveryCharge > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--gold)', fontStyle: 'italic', marginTop: '-4px' }}>
                      Add ₹{1000 - subtotal} more for free delivery
                    </div>
                  )}
                </div>

                <div style={{
                  borderTop: '1px solid rgba(201,169,110,0.15)',
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Grand Total</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: 'var(--gold)' }}>
                    ₹{Math.round(grandTotal)}
                  </span>
                </div>

                <Link href="/checkout" style={{ textDecoration: 'none' }}>
                  <button 
                    className="res-btn" 
                    style={{
                      width: '100%',
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
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
