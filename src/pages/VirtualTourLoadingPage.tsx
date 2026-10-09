import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mouse, ZoomIn } from 'lucide-react';

export const VirtualTourLoadingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2-second splash screen transition
    const timer = setTimeout(() => {
      navigate('/virtual-tour/map');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6 bg-[#FAF6ED] text-[#2c2720] select-none">
      {/* Top spacer */}
      <div className="w-full flex justify-end max-w-4xl">
        <button
          onClick={() => navigate('/virtual-tour/map')}
          className="text-xs uppercase tracking-widest text-[#7c7365] hover:text-[#1c1813] transition-colors"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Branding (Reference Screen 4) */}
      <div className="flex flex-col items-center text-center my-auto">
        {/* Stylized Jababeka Palm Logo */}
        <div className="w-24 h-16 rounded-full bg-[#1e4d2b] flex items-center justify-center p-2 shadow-md border-2 border-[#c6a258] mb-4">
          <div className="w-full h-full flex items-center justify-center text-[#d4af37] font-serif text-2xl font-bold tracking-widest">
            🌿
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-extrabold tracking-widest uppercase text-[#1a1714]">
          JABABEK A &amp; CO.
        </h1>
        <p className="font-serif italic text-base md:text-lg text-[#997736] mt-1 tracking-wide">
          Creating New Cities
        </p>
      </div>

      {/* Bottom Interaction Guide (Reference Screen 4) */}
      <div className="w-full max-w-md flex items-center justify-center gap-10 border-t border-[#ded5c5] pt-8">
        <div className="flex flex-col items-center text-center">
          <Mouse className="w-6 h-6 text-[#9e763b] stroke-[1.5] mb-2 animate-bounce" />
          <span className="font-serif italic text-sm md:text-base text-[#574d3f]">
            Click &amp; Drag to Explore
          </span>
        </div>

        <div className="h-10 w-px bg-[#c9bfae]" />

        <div className="flex flex-col items-center text-center">
          <ZoomIn className="w-6 h-6 text-[#9e763b] stroke-[1.5] mb-2 animate-pulse" />
          <span className="font-serif italic text-sm md:text-base text-[#574d3f]">
            Zoom in &amp; Out
          </span>
        </div>
      </div>
    </div>
  );
};
