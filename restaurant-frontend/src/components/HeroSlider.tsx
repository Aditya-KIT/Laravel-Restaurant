"use client";

import React, { useEffect, useRef, useState } from "react";
import "./HeroSlider.css";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animatingRef = useRef(false);

  const DURATION = 5000;

  const goTo = (next: number, dir: number) => {
    if (animatingRef.current || next === current) return;
    animatingRef.current = true;
    
    if (timerRef.current) clearTimeout(timerRef.current);

    const from = slidesRef.current[current];
    const to = slidesRef.current[next];

    if (from && to) {
      from.classList.remove('active');
      from.classList.add('exiting');

      to.style.transform = `translateX(${dir > 0 ? '100%' : '-100%'})`;
      to.style.transition = 'none';
      // force reflow
      void to.offsetHeight;
      to.style.transition = 'transform 1.1s cubic-bezier(0.77,0,0.175,1)';
      to.style.transform = 'translateX(0)';
      to.classList.add('active');
    }

    if (navItemsRef.current[current]) navItemsRef.current[current]?.classList.remove('active-nav');
    if (navItemsRef.current[next]) navItemsRef.current[next]?.classList.add('active-nav');

    setCurrent(next);

    setTimeout(() => {
      if (from) {
        from.classList.remove('exiting');
        from.style.transform = '';
        from.style.transition = '';
      }
      if (to) {
        to.style.transform = '';
        to.style.transition = '';
      }
      animatingRef.current = false;
      startProgress();
      startTimer(next);
    }, 1100);
  };

  const startProgress = () => {
    const pb = progressBarRef.current;
    if (pb) {
      pb.style.transition = 'none';
      pb.style.width = '0%';
      void pb.offsetHeight;
      pb.style.transition = `width ${DURATION}ms linear`;
      pb.style.width = '100%';
    }
  };

  const startTimer = (currIdx: number) => {
    timerRef.current = setTimeout(() => {
      goTo((currIdx + 1) % 4, 1);
    }, DURATION);
  };

  useEffect(() => {
    // Initial setup
    startProgress();
    startTimer(current);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // Run once on mount

  const handleNext = () => goTo((current + 1) % 4, 1);
  const handlePrev = () => goTo((current - 1 + 4) % 4, -1);
  const handleNavClick = (index: number) => {
    if (index !== current) {
      goTo(index, index > current ? 1 : -1);
    }
  };

  return (
    <div className="slider-wrap">
      <div className="progress-bar" ref={progressBarRef} id="progressBar"></div>
      <div className="slides" id="slidesTrack">
        
        {/* Slide 0 */}
        <div className="slide active" ref={el => { slidesRef.current[0] = el; }}>
          <div className="slide-bg bg1"></div>
          <div className="slide-num">01</div>
          <div className="slide-content">
            <div className="s-tag">Chef's Signature</div>
            <h2 className="s-title">Gilawat<br/><em>Kebab</em></h2>
            <p className="s-desc">The legendary Lucknowi melt-in-mouth kebab crafted with 160 aromatic spices — a recipe passed through generations since 1987.</p>
            <div className="s-price"><span className="price-val">₹480</span><span className="price-label">Per Serving</span></div>
            <div className="s-btns">
              <button className="btn-g">Order Now</button>
              <button className="btn-o">See Details</button>
            </div>
          </div>
          <div className="slide-visual">
            <div className="visual-card" style={{ background: "radial-gradient(135deg,#3D1F08,#8B3A0A,#1A0A04)" }}>
              <div className="visual-inner" style={{ background: "radial-gradient(ellipse at center,#5D2E0C 0%,#1A0C04 100%)" }}>
                <div className="badge">Bestseller</div>
                <div className="dish-plate">
                  <div className="steam"><div className="steam-line"></div><div className="steam-line"></div><div className="steam-line"></div></div>
                  <svg viewBox="0 0 200 180" width="190" height="170">
                    <ellipse cx="100" cy="155" rx="75" ry="10" fill="rgba(0,0,0,0.5)"/>
                    <ellipse cx="100" cy="148" rx="70" ry="12" fill="#1A0A04"/>
                    <ellipse cx="100" cy="143" rx="66" ry="10" fill="#2A1008"/>
                    <ellipse cx="100" cy="110" rx="60" ry="42" fill="#8B3A0A"/>
                    <ellipse cx="100" cy="106" rx="55" ry="38" fill="#A04010"/>
                    <ellipse cx="100" cy="102" rx="50" ry="34" fill="#C05018"/>
                    <ellipse cx="82" cy="95" rx="14" ry="8" fill="#8B2500" transform="rotate(-20,82,95)"/>
                    <ellipse cx="100" cy="90" rx="14" ry="8" fill="#8B2500"/>
                    <ellipse cx="118" cy="95" rx="14" ry="8" fill="#8B2500" transform="rotate(20,118,95)"/>
                    <ellipse cx="82" cy="95" rx="11" ry="6" fill="#A83000" transform="rotate(-20,82,95)"/>
                    <ellipse cx="100" cy="90" rx="11" ry="6" fill="#A83000"/>
                    <ellipse cx="118" cy="95" rx="11" ry="6" fill="#A83000" transform="rotate(20,118,95)"/>
                    <circle cx="72" cy="108" r="3.5" fill="#E8B040" opacity="0.9"/>
                    <circle cx="128" cy="112" r="3" fill="#E8B040" opacity="0.9"/>
                    <circle cx="100" cy="118" r="3" fill="#E8B040" opacity="0.9"/>
                    <circle cx="86" cy="85" r="2.5" fill="#50C050" opacity="0.8"/>
                    <circle cx="114" cy="88" r="2.5" fill="#50C050" opacity="0.8"/>
                    <path d="M65 100 Q80 115 100 118 Q120 115 135 100" stroke="#FF7030" strokeWidth="1.5" fill="none" opacity="0.5"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slide 1 */}
        <div className="slide" ref={el => { slidesRef.current[1] = el; }}>
          <div className="slide-bg bg2"></div>
          <div className="slide-num">02</div>
          <div className="slide-content">
            <div className="s-tag">Heritage Recipe</div>
            <h2 className="s-title">Dum<br/><em>Biryani</em></h2>
            <p className="s-desc">Slow-cooked for 4 hours in sealed dum — aged basmati, saffron, tender mutton and 22 whole spices in perfect harmony.</p>
            <div className="s-price"><span className="price-val">₹850</span><span className="price-label">Per Serving</span></div>
            <div className="s-btns">
              <button className="btn-g">Order Now</button>
              <button className="btn-o">See Details</button>
            </div>
          </div>
          <div className="slide-visual">
            <div className="visual-card" style={{ background: "radial-gradient(135deg,#1A2E18,#0A1A08)" }}>
              <div className="visual-inner" style={{ background: "radial-gradient(ellipse at center,#1E3A18 0%,#080E06 100%)" }}>
                <div className="badge">Heritage</div>
                <div className="dish-plate">
                  <div className="steam"><div className="steam-line"></div><div className="steam-line"></div><div className="steam-line"></div></div>
                  <svg viewBox="0 0 200 200" width="190" height="190">
                    <ellipse cx="100" cy="170" rx="78" ry="12" fill="rgba(0,0,0,0.5)"/>
                    <ellipse cx="100" cy="160" rx="76" ry="14" fill="#1A0E04"/>
                    <path d="M28 130 Q30 100 100 95 Q170 100 172 130 Q170 155 100 160 Q30 155 28 130Z" fill="#2A1A06"/>
                    <path d="M30 128 Q32 100 100 93 Q168 100 170 128 Q168 152 100 158 Q32 152 30 128Z" fill="#C8801A"/>
                    <path d="M35 125 Q38 98 100 90 Q162 98 165 125 Q162 148 100 155 Q38 148 35 125Z" fill="#D89020"/>
                    <circle cx="70" cy="115" r="8" fill="#E8B040" opacity="0.8"/>
                    <circle cx="100" cy="108" r="10" fill="#E8B040" opacity="0.8"/>
                    <circle cx="130" cy="115" r="8" fill="#E8B040" opacity="0.8"/>
                    <circle cx="55" cy="128" r="6" fill="#E8B040" opacity="0.6"/>
                    <circle cx="145" cy="128" r="6" fill="#E8B040" opacity="0.6"/>
                    <circle cx="85" cy="125" r="5" fill="#8B3A0A" opacity="0.9"/>
                    <circle cx="115" cy="125" r="5" fill="#8B3A0A" opacity="0.9"/>
                    <circle cx="60" cy="118" r="3" fill="#40A050" opacity="0.8"/>
                    <circle cx="140" cy="120" r="3" fill="#40A050" opacity="0.8"/>
                    <circle cx="100" cy="100" r="3.5" fill="#E84020" opacity="0.9"/>
                    <path d="M60 108 Q100 90 140 108" stroke="#FF8040" strokeWidth="1" fill="none" opacity="0.4"/>
                    <ellipse cx="100" cy="90" rx="30" ry="6" fill="rgba(232,176,64,0.15)"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="slide" ref={el => { slidesRef.current[2] = el; }}>
          <div className="slide-bg bg3"></div>
          <div className="slide-num">03</div>
          <div className="slide-content">
            <div className="s-tag">Dessert</div>
            <h2 className="s-title">Shahi<br/><em>Tukda</em></h2>
            <p className="s-desc">Royal bread pudding soaked in cardamom-saffron milk, crowned with silver leaf and pistachio — a Mughal-era indulgence.</p>
            <div className="s-price"><span className="price-val">₹280</span><span className="price-label">Per Serving</span></div>
            <div className="s-btns">
              <button className="btn-g">Order Now</button>
              <button className="btn-o">See Details</button>
            </div>
          </div>
          <div className="slide-visual">
            <div className="visual-card" style={{ background: "radial-gradient(135deg,#2A1040,#120820)" }}>
              <div className="visual-inner" style={{ background: "radial-gradient(ellipse at center,#3A1858 0%,#0E0618 100%)" }}>
                <div className="badge">Royal</div>
                <div className="dish-plate">
                  <div className="steam"><div className="steam-line"></div><div className="steam-line"></div><div className="steam-line"></div></div>
                  <svg viewBox="0 0 200 180" width="190" height="170">
                    <ellipse cx="100" cy="158" rx="72" ry="10" fill="rgba(0,0,0,0.5)"/>
                    <ellipse cx="100" cy="150" rx="70" ry="13" fill="#1A0820"/>
                    <rect x="42" y="95" width="116" height="58" rx="6" fill="#4A2008"/>
                    <rect x="44" y="97" width="112" height="54" rx="5" fill="#6A3010"/>
                    <rect x="46" y="99" width="108" height="50" rx="4" fill="#C8801A"/>
                    <rect x="48" y="101" width="104" height="46" rx="3" fill="#E8A030"/>
                    <rect x="50" y="103" width="100" height="42" rx="2" fill="#F0B840"/>
                    <path d="M50 120 Q100 110 150 120 Q100 130 50 120Z" fill="rgba(255,255,255,0.1)"/>
                    <ellipse cx="100" cy="96" rx="52" ry="8" fill="#D4A020"/>
                    <ellipse cx="100" cy="93" rx="50" ry="7" fill="#E8C060"/>
                    <circle cx="78" cy="90" r="4" fill="#50A050" opacity="0.9"/>
                    <circle cx="100" cy="88" r="4" fill="#50A050" opacity="0.9"/>
                    <circle cx="122" cy="90" r="4" fill="#50A050" opacity="0.9"/>
                    <rect x="70" y="84" width="60" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
                    <rect x="75" y="80" width="50" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
                    <circle cx="60" cy="115" r="3" fill="#E840A0" opacity="0.7"/>
                    <circle cx="140" cy="118" r="3" fill="#E840A0" opacity="0.7"/>
                    <circle cx="100" cy="108" r="2.5" fill="#FF8040" opacity="0.8"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="slide" ref={el => { slidesRef.current[3] = el; }}>
          <div className="slide-bg bg4"></div>
          <div className="slide-num">04</div>
          <div className="slide-content">
            <div className="s-tag">Signature Drink</div>
            <h2 className="s-title">Saffron<br/><em>Lassi</em></h2>
            <p className="s-desc">Thick churned yogurt with Kashmiri saffron threads, rose water and green cardamom — chilled and poured to perfection.</p>
            <div className="s-price"><span className="price-val">₹180</span><span className="price-label">Per Glass</span></div>
            <div className="s-btns">
              <button className="btn-g">Order Now</button>
              <button className="btn-o">See Details</button>
            </div>
          </div>
          <div className="slide-visual">
            <div className="visual-card" style={{ background: "radial-gradient(135deg,#3D2208,#1A0E04)" }}>
              <div className="visual-inner" style={{ background: "radial-gradient(ellipse at center,#4A2A08 0%,#100804 100%)" }}>
                <div className="badge">Refreshing</div>
                <div className="dish-plate">
                  <div className="steam"><div className="steam-line"></div><div className="steam-line"></div><div className="steam-line"></div></div>
                  <svg viewBox="0 0 200 210" width="180" height="200">
                    <ellipse cx="100" cy="190" rx="50" ry="8" fill="rgba(0,0,0,0.5)"/>
                    <path d="M68 80 L58 182 Q60 192 100 192 Q140 192 142 182 L132 80Z" fill="#2A1004"/>
                    <path d="M70 80 L61 178 Q63 188 100 188 Q137 188 139 178 L130 80Z" fill="#E8901A"/>
                    <path d="M72 80 L63 174 Q65 184 100 184 Q135 184 137 174 L128 80Z" fill="#F0A030"/>
                    <path d="M74 80 L65 170 Q67 180 100 180 Q133 180 135 170 L126 80Z" fill="#F8C060"/>
                    <path d="M76 100 Q100 95 124 100 Q100 105 76 100Z" fill="rgba(255,200,80,0.4)"/>
                    <path d="M72 80 L128 80" stroke="#D4A020" strokeWidth="3" strokeLinecap="round"/>
                    <ellipse cx="100" cy="78" rx="29" ry="7" fill="#E0A020"/>
                    <ellipse cx="100" cy="75" rx="27" ry="6" fill="#F5D060"/>
                    <path d="M78 75 Q100 65 122 75" stroke="#FF9030" strokeWidth="2" fill="none" opacity="0.6"/>
                    <line x1="96" y1="75" x2="90" y2="40" stroke="#C9A96E" strokeWidth="1.5"/>
                    <ellipse cx="88" cy="38" rx="7" ry="5" fill="#50A050" transform="rotate(-20,88,38)"/>
                    <circle cx="78" cy="72" r="2.5" fill="#E04080" opacity="0.8"/>
                    <circle cx="122" cy="72" r="2.5" fill="#E04080" opacity="0.8"/>
                    <circle cx="100" cy="70" r="2" fill="#E04080" opacity="0.7"/>
                    <path d="M80 110 Q100 106 120 110 Q100 130 80 110Z" fill="rgba(255,255,200,0.15)"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="arrow-btns">
        <button className="arr-btn" onClick={handlePrev} aria-label="Previous">&#8593;</button>
        <button className="arr-btn" onClick={handleNext} aria-label="Next">&#8595;</button>
      </div>

      <div className="nav-strip">
        <div className={`nav-item ${current === 0 ? 'active-nav' : ''}`} onClick={() => handleNavClick(0)} ref={el => { navItemsRef.current[0] = el; }}>
          <div className="nav-dot">&#127859;</div>
          <div className="nav-label"><span className="nav-name">Gilawat Kebab</span><span className="nav-sub">Starter</span></div>
        </div>
        <div className={`nav-item ${current === 1 ? 'active-nav' : ''}`} onClick={() => handleNavClick(1)} ref={el => { navItemsRef.current[1] = el; }}>
          <div className="nav-dot">&#127860;</div>
          <div className="nav-label"><span className="nav-name">Dum Biryani</span><span className="nav-sub">Main Course</span></div>
        </div>
        <div className={`nav-item ${current === 2 ? 'active-nav' : ''}`} onClick={() => handleNavClick(2)} ref={el => { navItemsRef.current[2] = el; }}>
          <div className="nav-dot">&#127874;</div>
          <div className="nav-label"><span className="nav-name">Shahi Tukda</span><span className="nav-sub">Dessert</span></div>
        </div>
        <div className={`nav-item ${current === 3 ? 'active-nav' : ''}`} onClick={() => handleNavClick(3)} ref={el => { navItemsRef.current[3] = el; }}>
          <div className="nav-dot">&#127864;</div>
          <div className="nav-label"><span className="nav-name">Saffron Lassi</span><span className="nav-sub">Drink</span></div>
        </div>
      </div>
    </div>
  );
}
