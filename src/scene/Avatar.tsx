import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'

type Props = {
  color: string
  name: string
  sitting?: boolean
  /** Tốc độ di chuyển hiện tại (m/s), dùng để tạo hoạt ảnh bước đi */
  speed?: RefObject<number>
  highlight?: boolean
}

const SKIN = '#f1c7a1'

export function Avatar({ color, name, sitting = false, speed, highlight = false }: Props) {
  const body = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)
  const phase = useRef(Math.random() * 10)

  useFrame((_, dt) => {
    const v = speed?.current ?? 0
    if (sitting || !legL.current || !legR.current || !armL.current || !armR.current || !body.current) return
    phase.current += dt * (v > 0.1 ? 3 + v * 2 : 0)
    const swing = v > 0.1 ? Math.sin(phase.current) * 0.6 : 0
    legL.current.rotation.x = swing
    legR.current.rotation.x = -swing
    armL.current.rotation.x = -swing * 0.8
    armR.current.rotation.x = swing * 0.8
    body.current.position.y = v > 0.1 ? Math.abs(Math.sin(phase.current)) * 0.05 : 0
  })

  const y0 = sitting ? -0.33 : 0
  const legRot = sitting ? -Math.PI / 2 : 0

  return (
    <group position={[0, y0, 0]}>
      <group ref={body}>
        {/* Chân */}
        {[-0.12, 0.12].map((x, i) => (
          <group key={x} ref={i === 0 ? legL : legR} position={[x, 0.8, 0]} rotation={[legRot, 0, 0]}>
            <mesh position={[0, -0.4, 0]} castShadow>
              <boxGeometry args={[0.16, 0.8, 0.18]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </group>
        ))}
        {/* Thân */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Tay */}
        {[-0.33, 0.33].map((x, i) => (
          <group key={x} ref={i === 0 ? armL : armR} position={[x, 1.45, 0]} rotation={[sitting ? -0.9 : 0, 0, 0]}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <boxGeometry args={[0.13, 0.6, 0.15]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        ))}
        {/* Đầu */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        {/* Mắt (hướng +z là phía trước) */}
        {[-0.08, 0.08].map((x) => (
          <mesh key={x} position={[x, 1.76, 0.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
        ))}
        {/* Tóc */}
        <mesh position={[0, 1.82, -0.02]}>
          <sphereGeometry args={[0.225, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3f2a1d" />
        </mesh>
      </group>
      <Html position={[0, 2.25, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
        <div className={`name-tag${highlight ? ' me' : ''}`}>{name}</div>
      </Html>
    </group>
  )
}
