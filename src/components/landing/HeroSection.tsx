import React from 'react';
import { ChevronRight } from 'lucide-react';
import { landingData } from '../../data/landingData';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  const { hero } = landingData;

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-end px-6 md:px-16 lg:px-24 py-24 overflow-hidden"
    >
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.backgroundImage}
          alt="Tanjung Lesung Coastline"
          className="w-full h-full object-cover object-center filter brightness-[0.92]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/30" />
      </div>

      {/* Floating Content Card (Right-aligned as in Reference 1) */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-white/50 text-left my-auto mt-16 md:mt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12141a] leading-[1.18] tracking-tight mb-6">
          {hero.headline}
        </h1>

        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal mb-8">
          {hero.subheadline}
        </p>

        <Button
          size="lg"
          icon={<ChevronRight className="w-4 h-4 ml-1" />}
          className="shadow-lg hover:shadow-xl transition-all"
          onClick={() => {
            const el = document.getElementById('direction-maps');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {hero.ctaText}
        </Button>
      </div>
    </section>
  );
};
