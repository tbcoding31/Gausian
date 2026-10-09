import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { VirtualTourLoadingPage } from './pages/VirtualTourLoadingPage';
import { VirtualTourMapPage } from './pages/VirtualTourMapPage';
import { Building3DPage } from './pages/Building3DPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Virtual Tour Flow */}
        <Route path="/virtual-tour" element={<Navigate to="/virtual-tour/loading" replace />} />
        <Route path="/virtual-tour/loading" element={<VirtualTourLoadingPage />} />
        <Route path="/virtual-tour/map" element={<VirtualTourMapPage />} />
        <Route path="/virtual-tour/view3d/:id" element={<Building3DPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
