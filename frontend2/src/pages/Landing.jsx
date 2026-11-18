import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";


import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import MarketplaceSection from "../components/MarketplaceSection.jsx";
import Footer from "../components/Footer";

function Landing() {
  return (
    <>
      <Navbar publicPage/>
      <Hero />
      <Features />
     <MarketplaceSection/>
     
      <WhyChoose />
      <Testimonials />
      <FAQ />
     
      <Footer />
    </>
  );
}

export default Landing;