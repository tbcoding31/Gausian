import React from 'react';
import { LandingNavigation } from '../components/landing/LandingNavigation';
import { HeroSection } from '../components/landing/HeroSection';
import { WhyTanjungLesungSection } from '../components/landing/WhyTanjungLesungSection';
import { DirectionMapSection } from '../components/landing/DirectionMapSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#fcfbf9] text-[#111318]">
      {/* Floating navigation card on the left */}
      <LandingNavigation />

      {/* Main landing content sections */}
      <main>
        <HeroSection />
        <WhyTanjungLesungSection />
        <DirectionMapSection />
      </main>

      {/* Footer minimal branding */}
      <footer className="py-8 px-6 text-center text-xs text-gray-500 border-t border-black/[0.05] bg-white">
        <p>© 2026 KEK Tanjung Lesung. Managed by Jababeka & Co. All rights reserved.</p>
      </footer>
    </div>
  );
};
