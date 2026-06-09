import { useCallback, lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './landing.css';

import LandingNav from './components/LandingNav';
import Hero from './components/Hero';

const Features     = lazy(() => import('./components/Features'));
const HowItWorks   = lazy(() => import('./components/HowItWorks'));
const Pricing      = lazy(() => import('./components/Pricing'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CTABanner    = lazy(() => import('./components/CTABanner'));
const Contact      = lazy(() => import('./components/Contact'));
const LandingFooter= lazy(() => import('./components/LandingFooter'));

const LandingPage = () => {
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="landing-page">
      <ToastContainer position="top-right" />

      <LandingNav scrollTo={scrollTo} />
      <Hero scrollTo={scrollTo} />

      <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTABanner />
        <Contact />
        <LandingFooter scrollTo={scrollTo} />
      </Suspense>
    </div>
  );
};

export default LandingPage;