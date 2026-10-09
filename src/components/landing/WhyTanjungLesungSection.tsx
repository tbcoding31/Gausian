import React from 'react';
import { landingData } from '../../data/landingData';

export const WhyTanjungLesungSection: React.FC = () => {
  const { whyTanjungLesung } = landingData;

  return (
    <section
      id="why-tanjung-lesung"
      className="relative min-h-screen w-full bg-[#fcfbf9] px-6 md:px-12 lg:px-20 py-28"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Editorial Header Column */}
        <div className="lg:w-1/3 lg:sticky lg:top-28">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111318] leading-[1.08] tracking-tight whitespace-pre-line mb-8">
            {whyTanjungLesung.title}
          </h2>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-sm">
            {whyTanjungLesung.subtitle}
          </p>
        </div>

        {/* Right Cards Editorial Grid */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyTanjungLesung.items.map((item, idx) => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col ${
                idx === 0 || idx === 1 ? 'sm:col-span-1' : ''
              }`}
            >
              <div className="h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111318] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
