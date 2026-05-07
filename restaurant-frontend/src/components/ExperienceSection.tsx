"use client";

import React from "react";

export default function ExperienceSection() {
  return (
    <section className="experience fade-in" id="experience">
      <div className="exp-visual">
        <div className="exp-circles">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <svg viewBox="0 0 300 300" width="260" height="260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
          <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="1"/>
          <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="1"/>
          <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(201,169,110,0.3)" strokeWidth="1"/>
          <path d="M110 170 Q130 130 150 120 Q170 130 190 170 Q170 185 150 188 Q130 185 110 170Z" fill="#C9A96E" opacity="0.15"/>
          <path d="M110 170 Q130 130 150 120 Q170 130 190 170 Q170 185 150 188 Q130 185 110 170Z" fill="none" stroke="#C9A96E" strokeWidth="1.5"/>
          <circle cx="150" cy="150" r="25" fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth="1"/>
          <text x="150" y="155" textAnchor="middle" fill="#C9A96E" fontSize="12" fontFamily="'Playfair Display',serif" letterSpacing="2">SINCE</text>
          <text x="150" y="172" textAnchor="middle" fill="#E8D5A3" fontSize="18" fontFamily="'Playfair Display',serif" fontWeight="700">1987</text>
          <line x1="30" y1="150" x2="270" y2="150" stroke="rgba(201,169,110,0.1)" strokeWidth="0.5"/>
          <line x1="150" y1="30" x2="150" y2="270" stroke="rgba(201,169,110,0.1)" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="exp-content">
        <span className="section-tag">The Experience</span>
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '36px' }}>More Than<br/><em>A Meal</em></h2>
        <div className="exp-items">
          <div className="exp-item">
            <div className="exp-icon">🍽️</div>
            <div className="exp-text">
              <h4>Chef's Tasting Menu</h4>
              <p>A 7-course journey through seasonal ingredients, paired with curated wines from our sommelier.</p>
            </div>
          </div>
          <div className="exp-item">
            <div className="exp-icon">🌿</div>
            <div className="exp-text">
              <h4>Farm-to-Table Philosophy</h4>
              <p>Every ingredient sourced within 100km, from local farms we personally visit each season.</p>
            </div>
          </div>
          <div className="exp-item">
            <div className="exp-icon">🎶</div>
            <div className="exp-text">
              <h4>Live Music Evenings</h4>
              <p>Every Friday and Saturday, live classical music transforms dinner into a complete sensory event.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
