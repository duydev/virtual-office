import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Experience } from './scene/Experience'
import { Office } from './scene/Office'
import { Coworkers } from './scene/Coworkers'
import { Hud } from './ui/Hud'
import { JoinScreen } from './ui/JoinScreen'
import { useStore } from './store'

export default function App() {
  const joined = useStore((s) => s.joined)
  return (
    <>
      <Canvas shadows camera={{ position: [0, 26, 18], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>{joined ? <Experience /> : <Preview />}</Suspense>
      </Canvas>
      {joined ? <Hud /> : <JoinScreen />}
    </>
  )
}

/** Cảnh xem trước tự xoay phía sau màn hình đăng nhập */
function Preview() {
  return (
    <>
      <color attach="background" args={['#dbeafe']} />
      <hemisphereLight args={['#ffffff', '#94a3b8', 1.1]} />
      <directionalLight position={[10, 18, 8]} intensity={1.6} />
      <Office />
      <Coworkers />
      <OrbitControls autoRotate autoRotateSpeed={0.6} enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  )
}
