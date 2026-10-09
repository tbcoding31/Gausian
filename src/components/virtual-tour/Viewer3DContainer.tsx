import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize2, RotateCcw, AlertCircle } from 'lucide-react';
import { Building } from '../../types';

interface Viewer3DContainerProps {
  building: Building;
  onBack?: () => void;
}

export const Viewer3DContainer: React.FC<Viewer3DContainerProps> = ({
  building,
  onBack,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/virtual-tour/map');
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    const iframe = document.getElementById('supersplat-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.src = building.viewerPath;
    }
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('supersplat-iframe');
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col select-none">
      {/* Top Header / Control Bar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 md:px-6 py-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors text-xs md:text-sm font-medium border border-white/10 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Map</span>
          </button>

          <div className="hidden sm:block text-white">
            <h1 className="text-sm md:text-base font-bold leading-tight drop-shadow-md">
              {building.name}
            </h1>
            <p className="text-xs text-white/70">
              {building.subtitle || '3D Gaussian Splatting Virtual Experience'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Reload 3D Experience"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Loading Indicator Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0f12] text-white">
          <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold tracking-wide text-white/90">
            Loading 3D Gaussian Splat Model
          </p>
          <p className="text-xs text-white/50 mt-1">
            Initializing PlayCanvas SuperSplat Engine...
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0f12] text-white p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <h2 className="text-lg font-bold">Failed to load 3D Experience</h2>
          <p className="text-xs text-white/60 max-w-sm mt-1 mb-4">
            Could not initialize the viewer from path: {building.viewerPath}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-200"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Standalone SuperSplat IFrame */}
      <iframe
        id="supersplat-iframe"
        src={building.viewerPath}
        title={`${building.name} 3D Experience`}
        className="w-full h-full border-0 bg-transparent flex-1"
        allow="accelerometer; camera; encrypted-media; gyroscope; xr-spatial-tracking; fullscreen"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
