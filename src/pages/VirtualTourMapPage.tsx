import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MasterPlanScene } from '../components/virtual-tour/MasterPlanScene';
import { BuildingDetailPanel } from '../components/virtual-tour/BuildingDetailPanel';
import { MasterPlanNavOverlay } from '../components/virtual-tour/MasterPlanNavOverlay';
import { Building } from '../types';

export const VirtualTourMapPage: React.FC = () => {
  const navigate = useNavigate();

  // DEFAULT STATE: Strictly null on initial load (Full-Screen Master Plan, No Side Panel)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const handleSelectBuilding = useCallback((building: Building) => {
    setSelectedBuilding(building);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedBuilding(null);
  }, []);

  const handleView3D = useCallback((buildingId: string) => {
    navigate(`/virtual-tour/view3d/${buildingId}`);
  }, [navigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F3F1EC] select-none">
      {/* 1. Minimal Top Navigation Overlay (Floating above Master Plan) */}
      <MasterPlanNavOverlay
        onResetCamera={handleClosePanel}
        selectedBuildingName={selectedBuilding?.name}
      />

      {/* 2. Full-Screen Interactive 3D Master Plan Canvas */}
      <main className="w-full h-full">
        <MasterPlanScene
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
          onDeselectBuilding={handleClosePanel}
        />
      </main>

      {/* 3. Architectural Right-Side Detail Panel (Visible ONLY after building selection) */}
      <BuildingDetailPanel
        building={selectedBuilding}
        isOpen={Boolean(selectedBuilding)}
        onClose={handleClosePanel}
        onView3D={handleView3D}
      />
    </div>
  );
};

export default VirtualTourMapPage;
