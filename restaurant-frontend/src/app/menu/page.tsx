"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import { apiFetch } from "@/lib/api";

type MenuItem = {
  id: number;
  name: string;
  cat: string;
  desc: string;
  price: string;
  badge: string | null;
  gradient: string;
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await apiFetch<{ data: any[] }>("/menu?all=1");
        if (res && res.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error("Failed to load backend menu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const tabs = ["All", "Starters", "Mains", "Desserts", "Drinks"];

  const currentItems: MenuItem[] = items.map(item => ({
    id: item.id,
    name: item.name,
    cat: item.sub_category || item.category?.name || "",
    desc: item.description || "",
    price: `₹${Math.round(item.price)}`,
    badge: item.badge,
    gradient: item.gradient || "linear-gradient(135deg,#3D1F08 0%,#8B4513 50%,#5D2E0C 100%)",
    rawCat: item.category?.name || ""
  })).filter(item => {
    if (activeTab === "All") return true;
    return item.rawCat === activeTab;
  });

  const handleTabClick = (tab: string) => {
    if (tab === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 150);
  };

  const getEmoji = (cat: string) => {
    const map: Record<string, string> = {
      'Signature': '🫙', 'Continental': '🥗', 'Seafood': '🦐',
      'Heritage': '🍚', 'Vegetarian': '🌿', 'Indian Classic': '🍮',
      'French': '🍮', 'Traditional': '🍩', 'Crafted': '🍹',
      'Loved': '🍡', 'Premium': '🥩'
    };
    return map[cat] || '🍽️';
  };

  const handleAddToCart = async (item: MenuItem) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const toast = document.createElement('div');
      toast.textContent = `Please Login to Add to Cart`;
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#B02020;color:#FFF;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
        window.location.href = "/login";
      }, 1500);
      return;
    }

    try {
      await apiFetch("/cart", "POST", {
        menu_item_id: item.id,
        quantity: 1
      }, token);

      const toast = document.createElement('div');
      toast.textContent = `${item.name} added to cart`;
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#C9A96E;color:#0F0D0A;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);

      // Dispatch standard window event to sync Cart badge in Navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      console.error(err);
      if (err?.message === "Unauthenticated.") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        const toast = document.createElement('div');
        toast.textContent = `Your session has expired. Please login again.`;
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#B02020;color:#FFF;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.remove();
          window.location.href = "/login";
        }, 1500);
        return;
      }
      const toast = document.createElement('div');
      toast.textContent = `Error adding item to cart`;
      toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#B02020;color:#FFF;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
      <PublicNavbar />
      
      <section className="section" style={{ flex: 1 }}>
        <div className="section-header">
          <span className="section-tag">Gourmet Selection</span>
          <h2 className="section-title">The Complete <em>Culinary</em> Menu</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="menu-tabs">
          {tabs.map(cat => (
            <button 
              key={cat} 
              className={`tab ${activeTab === cat ? 'active' : ''}`}
              onClick={() => handleTabClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold)' }}>
            Loading gourmet catalog...
          </div>
        ) : currentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
            No gourmet items found in this category.
          </div>
        ) : (
          <div 
            className="menu-grid" 
            style={{ 
              transition: 'all 0.4s ease', 
              opacity: animating ? 0 : 1, 
              transform: animating ? 'translateY(10px)' : 'translateY(0)' 
            }}
          >
            {currentItems.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-img">
                  <div 
                    className="menu-img-bg" 
                    style={{ 
                      background: item.gradient, 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '56px' 
                    }}
                  >
                    {getEmoji(item.cat)}
                  </div>
                  {item.badge && <div className="menu-badge">{item.badge}</div>}
                </div>
                <div className="menu-body">
                  <div className="menu-cat">{item.cat}</div>
                  <div className="menu-name">{item.name}</div>
                  <div className="menu-desc">{item.desc}</div>
                  <div className="menu-footer">
                    <div className="menu-price">{item.price}</div>
                    <button className="add-btn" onClick={() => handleAddToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
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
  );
}
