import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import PopularMenu from "@/components/PopularMenu";
import BookingForm from "@/components/BookingForm";
import ReviewSection from "@/components/ReviewSection";
import PublicNavbar from "@/components/PublicNavbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--dark)' }}>
      <PublicNavbar />
      <HeroSlider />
      
      <AboutSection />
      <PopularMenu />
      <ExperienceSection />
      <ReviewSection />
      <BookingForm />

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
