import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useStore } from '../store'
import { cameraYaw } from '../input'
import { Office } from './Office'
import { Player, cameraDistance } from './Player'
import { Coworkers } from './Coworkers'

function Lights() {
  const night = useStore((s) => s.night)
  return (
    <>
      <color attach="background" args={[night ? '#0b1120' : '#dbeafe']} />
      <hemisphereLight args={[night ? '#334155' : '#ffffff', night ? '#0f172a' : '#94a3b8', night ? 0.35 : 1.1]} />
      <directionalLight
        position={[10, 18, 8]}
        intensity={night ? 0.15 : 1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0005}
      />
      {night &&
        [
          [-9.5, -4],
          [9.5, -6.5],
          [12, 6.5],
          [-10.5, 6.5],
          [1.5, 6],
          [0, 0],
        ].map(([x, z]) => (
          <pointLight key={`${x}-${z}`} position={[x, 2.6, z]} intensity={18} distance={10} color="#fde68a" />
        ))}
    </>
  )
}

/** Kéo chuột trái để xoay camera, cuộn chuột để zoom (chế độ theo nhân vật) */
function FollowCameraInput() {
  const gl = useThree((s) => s.gl)
  const drag = useRef<{ x: number } | null>(null)

  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX }
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      cameraYaw.current -= (e.clientX - drag.current.x) * 0.006
      drag.current.x = e.clientX
    }
    const up = () => {
      drag.current = null
    }
    const wheel = (e: WheelEvent) => {
      cameraDistance.current = Math.min(14, Math.max(3.5, cameraDistance.current + e.deltaY * 0.01))
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [gl])
  return null
}

function OverviewCamera() {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(0, 26, 18)
    camera.lookAt(0, 0, 0)
  }, [camera])
  return <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={45} />
}

export function Experience() {
  const mode = useStore((s) => s.cameraMode)
  return (
    <>
      <Lights />
      <Office />
      <Coworkers />
      <Player />
      {mode === 'follow' ? <FollowCameraInput /> : <OverviewCamera />}
    </>
  )
}
