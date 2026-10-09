import React from 'react';
import { ArrowLeft, X, ExternalLink, Box, MapPin } from 'lucide-react';
import { Building } from '../../types';

interface BuildingDetailPanelProps {
  building: Building | null;
  isOpen: boolean;
  onClose: () => void;
  onView3D: (buildingId: string) => void;
}

export const BuildingDetailPanel: React.FC<BuildingDetailPanelProps> = ({
  building,
  isOpen,
  onClose,
  onView3D,
}) => {
  if (!building) return null;

  return (
    <aside
      className={`fixed top-5 right-5 bottom-5 md:top-7 md:right-7 md:bottom-7 z-30 w-full sm:w-[420px] md:w-[440px] lg:w-[450px] max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-56px)] max-h-[calc(100vh-40px)] md:max-h-[calc(100vh-56px)] bg-[#FCFBF8] text-[#111628] rounded-[22px] border border-black/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden ${
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-[0.96] translate-y-3 pointer-events-none'
      }`}
      aria-label="Floating Architectural Detail Card"
    >
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-7 pt-5 sm:pt-6 pb-4 select-text scrollbar-thin">
        {/* Top Header Row: Editorial link + compact close button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#2736C2] transition-colors cursor-pointer"
            title="Tutup dan kembali ke Master Plan"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2736C2] group-hover:-translate-x-0.5 transition-all" />
            <span className="tracking-tight">Back to Explore</span>
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Tutup kartu detail"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Location / Zone Metadata Label */}
        {building.zone && (
          <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] text-[#2736C2] mb-1">
            <MapPin className="w-3 h-3 text-[#2736C2]" />
            <span>{building.zone}</span>
          </div>
        )}

        {/* Building Title (Architectural Display Typography) */}
        <div className="mb-4">
          <h2 className="text-2xl md:text-[28px] font-extrabold text-[#111628] tracking-tight leading-tight">
            {building.name}
          </h2>

          {/* Short hand-drawn cobalt blue underline stroke matching 3D selected building */}
          <svg
            className="w-20 md:w-24 h-2 mt-1.5 text-[#2736C2]"
            viewBox="0 0 100 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 4.5 C 25 2.5, 60 5.5, 98 3.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Property Specifications Row (Compact Editorial Metadata Row — No Box/Card) */}
        <div className="grid grid-cols-4 gap-2 pt-2.5 pb-3 mb-4 border-b border-black/[0.06] items-center">
          <div className="pr-1.5 border-r border-black/[0.06]">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Building area
            </div>
            <div className="text-xs md:text-sm font-extrabold text-gray-900 mt-0.5">
              {building.buildingArea}
            </div>
          </div>

          <div className="px-1.5 border-r border-black/[0.06]">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Land area
            </div>
            <div className="text-xs md:text-sm font-extrabold text-gray-900 mt-0.5">
              {building.landArea}
            </div>
          </div>

          <div className="px-1.5 border-r border-black/[0.06]">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Floor
            </div>
            <div className="text-xs md:text-sm font-extrabold text-gray-900 mt-0.5">
              {building.floor}
            </div>
          </div>

          <div className="pl-1.5 text-right">
            <button
              onClick={() => onView3D(building.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2736C2] hover:text-[#1926A0] transition-colors cursor-pointer group"
              title="Buka 3D View"
            >
              <span className="underline decoration-[#2736C2]/40 group-hover:decoration-current">View 3D</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Hero Architectural Image (Aspect 16:9, rounded-2xl, subtle border) */}
        {building.heroImage && (
          <div className="w-full aspect-[16/9] rounded-[16px] overflow-hidden shadow-xs border border-black/[0.06] mb-4 relative group">
            <img
              src={building.heroImage}
              alt={building.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-tight">
              Architectural Visualization
            </div>
          </div>
        )}

        {/* Editorial Description Text (Short, balanced paragraphs) */}
        <div className="mb-4">
          <p className="text-xs md:text-[13px] leading-relaxed text-gray-600 font-normal">
            {building.description}
          </p>
        </div>

        {/* Secondary Gallery Thumbnails (Compact 2-column strip) */}
        {building.gallery && building.gallery.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Interior & Perspectives
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {building.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="h-20 md:h-22 rounded-[10px] overflow-hidden shadow-xs border border-black/[0.06] relative group"
                >
                  <img
                    src={imgUrl}
                    alt={`${building.name} detail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Card Base Action: Refined Cobalt 3D CTA */}
      <div className="p-3.5 px-6 bg-[#F8F6F2] border-t border-black/[0.06] rounded-b-[22px]">
        <button
          onClick={() => onView3D(building.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[12px] bg-[#2736C2] hover:bg-[#1E2CAE] active:bg-[#182390] text-white font-bold text-xs md:text-sm tracking-tight shadow-md shadow-blue-900/15 hover:shadow-lg transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-blue-200" />
          <span>View 3D Experience</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
        <p className="text-[9px] text-center text-gray-400 mt-1.5 font-medium">
          Interactive PlayCanvas SuperSplat Gaussian experience
        </p>
      </div>
    </aside>
  );
};
