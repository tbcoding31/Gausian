import React from 'react';
import { landingData } from '../../data/landingData';
import { InteractiveDirectionMap } from './InteractiveDirectionMap';

export const DirectionMapSection: React.FC = () => {
  const { directionMap } = landingData;

  return (
    <section
      id="direction-maps"
      className="relative w-full bg-white text-[#111318] pt-16 pb-20 md:pt-20 md:pb-24 select-none overflow-x-hidden"
    >
      {/* 
        Main Editorial Content Column:
        Positioned independently at x ≈ 22% (matching target screenshot x ≈ 217px in 976px canvas).
        Floating nav sits to the left at x ≈ 32px (146px wide), leaving a clean gap.
      */}
      <div className="w-full pl-6 md:pl-[22.2vw]">
        {/* Section Heading & Subtitle (Target Reference) */}
        <div className="mb-6 md:mb-7 text-left pr-6">
          <h2 className="text-3xl sm:text-4xl md:text-[38px] lg:text-[42px] font-extrabold text-[#111318] tracking-tight leading-[1.12]">
            {directionMap.title}
          </h2>
          <p className="text-xs sm:text-sm md:text-[14px] text-[#6B7280] font-normal mt-2 leading-relaxed">
            {directionMap.subtitle}
          </p>
        </div>

        {/* Real Interactive WebGL Mapbox Map */}
        <div className="relative w-full overflow-visible">
          <InteractiveDirectionMap />
        </div>

        {/* 
          Total Travel Time Summary:
          Left-aligned with the map and heading.
        */}
        <div className="mt-3.5 text-left pr-6">
          <p className="text-xs sm:text-sm font-normal italic text-[#4B5563] tracking-normal">
            {directionMap.totalDuration}
          </p>
        </div>
      </div>
    </section>
  );
};
