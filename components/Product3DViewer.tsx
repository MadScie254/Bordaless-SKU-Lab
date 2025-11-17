import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, Loader } from '@react-three/drei';

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  // FIX: Using React.createElement to bypass a TypeScript error where the JSX intrinsic element
  // 'primitive' is not recognized. This is likely due to a project configuration issue.
  return React.createElement('primitive', { object: scene, scale: 0.01 });
}

interface Product3DViewerProps {
  modelUrl: string;
}

const Product3DViewer: React.FC<Product3DViewerProps> = ({ modelUrl }) => {
  return (
    <>
      <Canvas 
        dpr={[1, 2]}
        camera={{ fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        className="cursor-grab active:cursor-grabbing"
        shadows
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
            <Model url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <Loader 
        containerStyles={{
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
        }}
        innerStyles={{
            width: '100px',
            height: '8px',
            backgroundColor: 'var(--color-surface-2)',
        }}
        barStyles={{
            height: '8px',
            backgroundColor: 'var(--color-primary)',
        }}
        dataStyles={{
            color: 'var(--color-text-muted)',
            fontSize: '12px',
        }}
      />
    </>
  );
};

export default Product3DViewer;
