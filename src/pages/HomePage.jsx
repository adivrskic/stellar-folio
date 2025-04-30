import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Features from '../components/home/Features';
import TemplatesPreview from '../components/home/TemplatesPreview';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import CTA from '../components/home/CTA';
import { scrollToTop } from '../utils/scrollUtils';

const HomePage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    scrollToTop(false);
  }, []);

  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <TemplatesPreview />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
};

export default HomePage;