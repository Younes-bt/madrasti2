import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { getAllModelUrls } from '@/constants/anatomyModels';

const Model = ({ modelPath, onPartClick }) => {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        onPartClick?.(e.object.name);
      }}
    />
  );
};

const Loader = () => {
  return (
    <Html center>
      <div className="text-white text-sm">Loading 3D model...</div>
    </Html>
  );
};

const AnatomyModel3D = ({ modelPath, systemName, onPartClick }) => {
  const [selectedPart, setSelectedPart] = useState(null);

  const handlePartClick = (partName) => {
    setSelectedPart(partName);
    onPartClick?.(partName);
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-muted bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
          <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />

          {/* Environment for better lighting */}
          <Environment preset="studio" />

          {/* The 3D Model */}
          <Model modelPath={modelPath} onPartClick={handlePartClick} />

          {/* Camera Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
        <p className="font-semibold mb-1">{systemName}</p>
        <p className="text-xs opacity-80">🖱️ Drag to rotate • Scroll to zoom</p>
      </div>

      {/* Selected Part Info */}
      {selectedPart && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">Selected: {selectedPart}</p>
          <p className="text-xs text-muted-foreground mt-1">Click organs to learn more</p>
        </div>
      )}
    </div>
  );
};

export default AnatomyModel3D;

// Preload all anatomy models from GitHub
// Commented out until all models are uploaded to GitHub release
// getAllModelUrls().forEach(modelUrl => {
//   useGLTF.preload(modelUrl);
// });
