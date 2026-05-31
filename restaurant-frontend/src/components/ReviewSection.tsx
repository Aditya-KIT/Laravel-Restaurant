"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
};

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await apiFetch<Review[] | { data?: Review[] }>("/reviews");
        const items = Array.isArray(response) ? response : response.data || [];
        setReviews(items.filter(r => r.rating >= 4).slice(0, 4));
      } catch (error) {
        console.warn("Could not connect to the review API. Using fallback reviews instead. Details:", error);
        setReviews(fallbackReviews.filter(r => r.rating >= 4).slice(0, 4));
      }

    }
    fetchReviews();
  }, []);

  const fallbackReviews: Review[] = [
    { id: 1, user_name: "Anjali Rao", rating: 5, comment: "An extraordinary evening from start to finish. The Rogan Josh was unlike anything I've tasted — deeply complex and utterly unforgettable." },
    { id: 2, user_name: "Sameer & Kavya", rating: 5, comment: "We celebrated our anniversary here and it was magical. The ambience, the service, the food — every detail was perfection." },
    { id: 3, user_name: "Priya Gupta", rating: 5, comment: "The chef's tasting menu took me on a journey I'll talk about for years. Each course told a story of heritage and innovation." },
    { id: 4, user_name: "Rahul Verma", rating: 5, comment: "La Maison redefines what dining means. The sommelier's wine pairing was spot-on and the desserts were works of art." },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % displayReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  return (
    <section className="testimonials fade-in" id="reviews">
      <div className="section-header">
        <span className="section-tag">Guest Stories</span>
        <h2 className="section-title">Voices of Our <em>Guests</em></h2>
        <div className="section-line"></div>
      </div>
      <div className="testimonial-slider">
        <div 
          className="testimonial-track" 
          style={{ transform: `translateX(calc(-${currentSlide * 50}% - ${currentSlide * 12}px))` }}
        >
          {displayReviews.map((review) => (
            <div className="testimonial" key={review.id}>
              <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <div className="quote-mark">"</div>
              <p className="quote-text">{review.comment}</p>
              <div className="quote-author">
                <div className="author-avatar">{getInitials(review.user_name)}</div>
                <div className="author-info">
                  <strong>{review.user_name}</strong>
                  <span>Guest</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="slider-dots">
        {displayReviews.map((_, i) => (
          <div 
            key={i} 
            className={`dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}
