import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";


import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

import Footer from "../components/Footer";

function Landing() {
  return (
    <>
      <Navbar publicPage/>
      <Hero />
      <Features />
    
     
      <WhyChoose />
      <Testimonials />
      <FAQ />
     
      <Footer />
    </>
  );
}

export default Landing;