import { HeroGeometric } from "../Components/Landing/Hero";
import Features from "../Components/Landing/Features";
import HowItWorks from "../Components/Landing/HowItWorks";
import Testimonials from "../Components/Landing/Testimonials";
import NewsletterSection from "../Components/Landing/Newsletter";
import CTA from "../Components/Landing/CTA";
import Navbar from "../Components/Landing/Navbar";

const LandingPage = () => {
  return (
    <div className="bg-[#030303]">
      <Navbar />
      {/* Hero Section */}
      <HeroGeometric />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Final CTA Section */}
      <CTA />
    </div>
  );
};

export default LandingPage;
