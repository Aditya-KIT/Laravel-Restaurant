"use client";

import React, { useEffect } from "react";

export default function AboutSection() {
  return (
    <div className="stats">
      <div className="stat"><div className="stat-num">38+</div><div className="stat-lbl">Years of Excellence</div></div>
      <div className="stat"><div className="stat-num">120</div><div className="stat-lbl">Signature Dishes</div></div>
      <div className="stat"><div className="stat-num">50K+</div><div className="stat-lbl">Happy Guests</div></div>
      <div className="stat"><div className="stat-num">5★</div><div className="stat-lbl">Avg. Rating</div></div>
    </div>
  );
}
