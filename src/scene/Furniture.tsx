import type { ReactNode } from 'react'

type V3 = [number, number, number]

export function Block({
  pos,
  size,
  color,
  rot,
  emissive,
  shadow = true,
}: {
  pos: V3
  size: V3
  color: string
  rot?: V3
  emissive?: string
  shadow?: boolean
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={emissive ? 1.2 : 0}
      />
    </mesh>
  )
}

export function Group({ pos, rotY = 0, children }: { pos: V3; rotY?: number; children: ReactNode }) {
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {children}
    </group>
  )
}

/** Ghế văn phòng: người ngồi quay mặt về -z, lưng ghế ở +z */
export function Chair({ pos, rotY = 0, color = '#1f2937' }: { pos: V3; rotY?: number; color?: string }) {
  return (
    <Group pos={pos} rotY={rotY}>
      <Block pos={[0, 0.45, 0]} size={[0.5, 0.08, 0.5]} color={color} />
      <Block pos={[0, 0.8, 0.23]} size={[0.5, 0.6, 0.06]} color={color} />
      <Block pos={[0, 0.22, 0]} size={[0.06, 0.44, 0.06]} color="#6b7280" />
      <Block pos={[0, 0.03, 0]} size={[0.45, 0.04, 0.45]} color="#6b7280" />
    </Group>
  )
}

/** Bàn làm việc có màn hình, ghế ở phía +z (cục bộ) */
export function WorkDesk({ screenOn, rotY, pos }: { pos: V3; rotY: number; screenOn: boolean }) {
  return (
    <Group pos={pos} rotY={rotY}>
      <Block pos={[0, 0.74, 0]} size={[2, 0.05, 0.8]} color="#d6b38a" />
      {[-0.95, 0.95].map((x) => (
        <Block key={x} pos={[x, 0.36, 0]} size={[0.05, 0.72, 0.75]} color="#e5e7eb" />
      ))}
      {/* Màn hình */}
      <Block pos={[0, 0.8, -0.25]} size={[0.3, 0.04, 0.2]} color="#374151" />
      <Block pos={[0, 0.95, -0.27]} size={[0.05, 0.3, 0.05]} color="#374151" />
      <Block pos={[0, 1.15, -0.25]} size={[0.75, 0.45, 0.04]} color="#111827" />
      <mesh position={[0, 1.15, -0.228]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial
          color={screenOn ? '#60a5fa' : '#0b0f19'}
          emissive={screenOn ? '#3b82f6' : '#000000'}
          emissiveIntensity={screenOn ? 1.4 : 0}
        />
      </mesh>
      {/* Bàn phím + chuột + cốc */}
      <Block pos={[0, 0.775, 0.1]} size={[0.5, 0.02, 0.16]} color="#4b5563" />
      <Block pos={[0.4, 0.775, 0.12]} size={[0.07, 0.02, 0.1]} color="#4b5563" />
      <mesh position={[-0.7, 0.82, 0.05]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <Chair pos={[0, 0, 0.75]} />
    </Group>
  )
}

export function Plant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0.15, 1.25, 0.05]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}
