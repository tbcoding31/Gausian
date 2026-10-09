import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading 3D Experience...',
  subMessage = 'Preparing Gaussian splat textures and spatial shaders',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-[#f7f5ef] ${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[400px]'
      }`}
    >
      <div className="relative mb-6">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-[#12141a] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-500">
          3D
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 tracking-tight">{message}</h3>
      {subMessage && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm text-center font-normal">
          {subMessage}
        </p>
      )}
    </div>
  );
};
