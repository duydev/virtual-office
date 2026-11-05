import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { desks, furniture as F, seatOf } from '../data/office'
import { Avatar } from './Avatar'

const COLORS: Record<string, string> = {
  Lan: '#ec4899',
  Minh: '#f59e0b',
  Quân: '#10b981',
  Hoa: '#8b5cf6',
  Phúc: '#ef4444',
}

type Walker = { name: string; color: string; path: [number, number][]; speed: number }

const walkers: Walker[] = [
  {
    name: 'Tuấn',
    color: '#06b6d4',
    speed: 1.4,
    path: [
      [-12, 1.2],
      [6, 1.2],
      [6, 4.5],
      [-3, 4.5],
      [-3, 1.2],
    ],
  },
  {
    name: 'Mai',
    color: '#f97316',
    speed: 1.2,
    path: [
      [-3, -8],
      [-3, -0.5],
      [9, -0.5],
      [9, -4.5],
      [9, -0.5],
      [-3, -0.5],
    ],
  },
]

function WalkingNpc({ w }: { w: Walker }) {
  const ref = useRef<Group>(null)
  const idx = useRef(1)
  const speed = useRef(w.speed)
  const pause = useRef(0)

  useFrame((_, rawDt) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    if (pause.current > 0) {
      pause.current -= dt
      speed.current = 0
      return
    }
    const [tx, tz] = w.path[idx.current]
    const dx = tx - g.position.x
    const dz = tz - g.position.z
    const dist = Math.hypot(dx, dz)
    if (dist < 0.05) {
      idx.current = (idx.current + 1) % w.path.length
      pause.current = Math.random() < 0.4 ? 1.5 : 0
      return
    }
    const step = Math.min(dist, w.speed * dt)
    g.position.x += (dx / dist) * step
    g.position.z += (dz / dist) * step
    g.rotation.y = Math.atan2(dx, dz)
    speed.current = w.speed
  })

  const [x, z] = w.path[0]
  return (
    <group ref={ref} position={[x, 0, z]}>
      <Avatar color={w.color} name={w.name} speed={speed} />
    </group>
  )
}

export function Coworkers() {
  return (
    <group>
      {desks
        .filter((d) => d.owner)
        .map((d) => {
          const s = seatOf(d)
          return (
            <group key={d.id} position={[s.x, 0, s.z]} rotation={[0, s.rotY, 0]}>
              <Avatar color={COLORS[d.owner!]} name={d.owner!} sitting />
            </group>
          )
        })}
      {/* Giám đốc và lễ tân */}
      <group position={[F.managerDesk.x, 0, F.managerDesk.z + 0.85]} rotation={[0, Math.PI, 0]}>
        <Avatar color="#1e293b" name="Giám đốc Hùng" sitting />
      </group>
      <group position={[F.reception.x, 0, F.reception.z + 0.85]} rotation={[0, Math.PI, 0]}>
        <Avatar color="#0f766e" name="Lễ tân Thảo" sitting />
      </group>
      {walkers.map((w) => (
        <WalkingNpc key={w.name} w={w} />
      ))}
    </group>
  )
}
