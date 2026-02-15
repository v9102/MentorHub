import HeroSection from '@/modules/landing/components/HeroSection';
import HowItWorksSection from '@/modules/landing/components/HowItWorksSection';
import FeaturedMentorsSection from '@/modules/landing/components/FeaturedMentorsSection';
import WhyChooseUsSection from '@/modules/landing/components/WhyChooseUsSection';
import TestimonialsSection from '@/modules/landing/components/TestimonialsSection';
import FAQSection from '@/modules/landing/components/FAQSection';
import FinalCTASection from '@/modules/landing/components/FinalCTASection';
import MobileStickyCTA from '@/modules/landing/components/MobileStickyCTA';
import Footer from '@/shared/ui/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 pb-20 sm:pb-0">
      <HeroSection />
      <FeaturedMentorsSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}

