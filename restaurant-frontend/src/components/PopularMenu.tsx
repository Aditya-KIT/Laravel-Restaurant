"use client";

import { useState } from "react";

type MenuItem = {
  name: string;
  cat: string;
  desc: string;
  price: string;
  badge: string | null;
  gradient: string;
};

export default function PopularMenu() {
  const [activeTab, setActiveTab] = useState<string>("Starters");
  const [animating, setAnimating] = useState(false);

  const menuData: Record<string, MenuItem[]> = {
    Starters: [
      { name: "Gilawat Kebab", cat: "Signature", desc: "Melt-in-mouth mutton kebabs with 160 spices, a Lucknowi legacy since 1987.", price: "₹480", badge: "Chef's Pick", gradient: "linear-gradient(135deg,#3D1F08 0%,#8B4513 50%,#5D2E0C 100%)" },
      { name: "Burrata Caprese", cat: "Continental", desc: "Creamy burrata with heirloom tomatoes, micro-basil, and aged balsamic.", price: "₹620", badge: null, gradient: "linear-gradient(135deg,#1A2E1A 0%,#2D5A27 50%,#1A3D1A 100%)" },
      { name: "Tandoori Jhinga", cat: "Seafood", desc: "Tiger prawns marinated in saffron yogurt, finished in our clay tandoor.", price: "₹780", badge: "Bestseller", gradient: "linear-gradient(135deg,#3D1A0A 0%,#B84A1A 50%,#7A2A08 100%)" },
    ],
    Mains: [
      { name: "Dum Biryani", cat: "Heritage", desc: "Slow-cooked for 4 hours with aged basmati, saffron strands and tender mutton.", price: "₹850", badge: "Heritage", gradient: "linear-gradient(135deg,#2A1A08 0%,#C8651A 50%,#5D2E0C 100%)" },
      { name: "Filet Mignon", cat: "Continental", desc: "200g grass-fed tenderloin, truffle butter, asparagus and red wine reduction.", price: "₹1,450", badge: "Premium", gradient: "linear-gradient(135deg,#2A0808 0%,#8B1A1A 50%,#3D0808 100%)" },
      { name: "Dal Makhani", cat: "Vegetarian", desc: "Black lentils slow-simmered overnight with butter and cream. Pure comfort.", price: "₹380", badge: null, gradient: "linear-gradient(135deg,#1A0A20 0%,#4A1A7A 50%,#2A0A3D 100%)" },
    ],
    Desserts: [
      { name: "Shahi Tukda", cat: "Indian Classic", desc: "Double ka meetha soaked in reduced milk, cardamom and silver leaf.", price: "₹280", badge: "Signature", gradient: "linear-gradient(135deg,#2A1A00 0%,#D4A000 50%,#7A5A00 100%)" },
      { name: "Crème Brûlée", cat: "French", desc: "Classic vanilla custard with a caramelised sugar crust, served warm.", price: "₹380", badge: null, gradient: "linear-gradient(135deg,#2A2010 0%,#A07030 50%,#5A3A10 100%)" },
      { name: "Gulab Jamun", cat: "Traditional", desc: "Soft khoya dumplings in rose saffron syrup, served with vanilla ice cream.", price: "₹220", badge: "Loved", gradient: "linear-gradient(135deg,#300A0A 0%,#B02020 50%,#5A0A0A 100%)" },
    ],
    Drinks: [
      { name: "Saffron Lassi", cat: "Signature", desc: "Thick yogurt blended with Kashmiri saffron, rose water and cardamom.", price: "₹180", badge: null, gradient: "linear-gradient(135deg,#2A1A00 0%,#E8A030 50%,#8A5000 100%)" },
      { name: "Thandai", cat: "Traditional", desc: "Chilled milk with almonds, fennel, peppercorn and a touch of rose.", price: "₹160", badge: "Classic", gradient: "linear-gradient(135deg,#0A1A2A 0%,#2060A0 50%,#0A2A4A 100%)" },
      { name: "Mocktail Royale", cat: "Crafted", desc: "Passion fruit, lychee and mint with a sparkling elderflower finish.", price: "₹240", badge: "New", gradient: "linear-gradient(135deg,#0A2A0A 0%,#1A8A1A 50%,#0A4A0A 100%)" },
    ]
  };

  const tabs = ["Starters", "Mains", "Desserts", "Drinks"];
  const currentItems = menuData[activeTab] || [];

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

  const handleAddToCart = (name: string) => {
    const toast = document.createElement('div');
    toast.textContent = `${name} added to your order`;
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#C9A96E;color:#0F0D0A;padding:12px 28px;border-radius:2px;font-size:13px;font-weight:500;letter-spacing:1px;z-index:9999;animation:fadeUp 0.3s ease';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  return (
    <section className="section" id="menu">
      <div className="section-header">
        <span className="section-tag">Curated Selection</span>
        <h2 className="section-title">Tonight's <em>Featured</em> Menu</h2>
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
      
      <div 
        className="menu-grid" 
        id="menuGrid" 
        style={{ 
          transition: 'all 0.4s ease', 
          opacity: animating ? 0 : 1, 
          transform: animating ? 'translateY(10px)' : 'translateY(0)' 
        }}
      >
        {currentItems.map((item, idx) => (
          <div className="menu-card" key={idx}>
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
                <button className="add-btn" onClick={() => handleAddToCart(item.name)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
