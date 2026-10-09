import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Compass, RotateCcw } from 'lucide-react';

interface MasterPlanNavOverlayProps {
  onResetCamera?: () => void;
  selectedBuildingName?: string | null;
}

export const MasterPlanNavOverlay: React.FC<MasterPlanNavOverlayProps> = ({
  onResetCamera,
  selectedBuildingName,
}) => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      {/* Subtle top atmospheric shadow vignette */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/25 via-black/5 to-transparent pointer-events-none" />

      {/* Main floating top bar */}
      <header className="relative flex items-center justify-between px-6 py-4">
        {/* Left: Back to Home link */}
        <div className="pointer-events-auto">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 text-xs md:text-sm font-semibold shadow-md border border-black/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Center: Tanjung Lesung dropdown title (Matching Reference Visual) */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md shadow-md border border-black/10 text-gray-900 select-none">
          <span className="text-base md:text-lg font-bold tracking-tight text-gray-900">
            Tanjung Lesung
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>

        {/* Right: Camera reset & interaction badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          {onResetCamera && (
            <button
              onClick={onResetCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold shadow-md border border-black/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Reset Sudut Kamera"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Reset View</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-black/10 text-[11px] font-medium text-gray-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>3D Master Plan</span>
          </div>
        </div>
      </header>

      {/* Subtle bottom-left interaction hint when no building is selected */}
      {!selectedBuildingName && (
        <div className="absolute left-6 top-20 pointer-events-none hidden md:block">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-sm border border-black/10 text-xs text-gray-600 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Klik bangunan di peta untuk melihat detail arsitektur</span>
          </div>
        </div>
      )}
    </div>
  );
};
