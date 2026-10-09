import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getBuildingById } from '../data/buildingsData';
import { Viewer3DContainer } from '../components/virtual-tour/Viewer3DContainer';

export const Building3DPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <NotFoundView onBack={() => navigate('/virtual-tour/map')} message="No building ID specified." />;
  }

  const building = getBuildingById(id);

  if (!building) {
    return (
      <NotFoundView
        onBack={() => navigate('/virtual-tour/map')}
        message={`Building with identifier "${id}" could not be found.`}
      />
    );
  }

  return (
    <Viewer3DContainer
      building={building}
      onBack={() => navigate(`/virtual-tour/map?building=${building.id}`)}
    />
  );
};

const NotFoundView: React.FC<{ message: string; onBack: () => void }> = ({
  message,
  onBack,
}) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0e1117] text-white p-6">
    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
      <AlertTriangle className="w-8 h-8 text-amber-400" />
    </div>
    <h1 className="text-2xl font-bold mb-2">Building Not Found</h1>
    <p className="text-sm text-gray-400 max-w-md text-center mb-6">{message}</p>
    <button
      onClick={onBack}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Return to Virtual Tour Map</span>
    </button>
  </div>
);
