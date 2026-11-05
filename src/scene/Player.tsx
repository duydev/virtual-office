import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, type Group } from 'three'
import { collides, SPAWN, zoneAt } from '../data/office'
import { nearestInteractable } from '../data/interactions'
import { cameraYaw, isDown } from '../input'
import { getState, setState, useStore } from '../store'
import { Avatar } from './Avatar'

const WALK = 3.2
const RUN = 5.5
const camTarget = new Vector3()
const camPos = new Vector3()

export const playerPos = { x: SPAWN.x, z: SPAWN.z }
export const cameraDistance = { current: 7 }

export function Player() {
  const ref = useRef<Group>(null)
  const speed = useRef(0)
  const heading = useRef(Math.PI)
  const name = useStore((s) => s.playerName)
  const color = useStore((s) => s.playerColor)
  const camera = useThree((s) => s.camera)

  useFrame((_, rawDt) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    const st = getState()

    // Hướng di chuyển theo góc nhìn camera
    let fx = 0
    let fz = 0
    if (isDown('KeyW', 'ArrowUp')) fz -= 1
    if (isDown('KeyS', 'ArrowDown')) fz += 1
    if (isDown('KeyA', 'ArrowLeft')) fx -= 1
    if (isDown('KeyD', 'ArrowRight')) fx += 1

    const moving = fx !== 0 || fz !== 0
    let target = 0
    if (moving) {
      const len = Math.hypot(fx, fz)
      fx /= len
      fz /= len
      const yaw = st.cameraMode === 'follow' ? cameraYaw.current : 0
      const cos = Math.cos(yaw)
      const sin = Math.sin(yaw)
      const dx = fx * cos + fz * sin
      const dz = -fx * sin + fz * cos
      target = isDown('ShiftLeft', 'ShiftRight') ? RUN : WALK
      const step = target * dt
      const nx = g.position.x + dx * step
      const nz = g.position.z + dz * step
      // Trượt dọc theo vật cản: thử từng trục riêng
      if (!collides(nx, g.position.z)) g.position.x = nx
      if (!collides(g.position.x, nz)) g.position.z = nz

      const want = Math.atan2(dx, dz)
      let diff = want - heading.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      heading.current += diff * Math.min(1, dt * 12)
      g.rotation.y = heading.current
    }
    speed.current += (target - speed.current) * Math.min(1, dt * 10)

    playerPos.x = g.position.x
    playerPos.z = g.position.z

    // Cập nhật store chỉ khi có thay đổi
    const zone = zoneAt(g.position.x, g.position.z)
    const nearby = nearestInteractable(g.position.x, g.position.z)
    if (zone !== st.zone || nearby !== st.nearby) setState({ zone, nearby })

    // Camera góc thứ ba
    if (st.cameraMode === 'follow') {
      const dist = cameraDistance.current
      const yaw = cameraYaw.current
      camPos.set(
        g.position.x + Math.sin(yaw) * dist,
        1.5 + dist * 0.65,
        g.position.z + Math.cos(yaw) * dist,
      )
      camera.position.lerp(camPos, Math.min(1, dt * 6))
      camTarget.set(g.position.x, 1.2, g.position.z)
      camera.lookAt(camTarget)
    }
  })

  return (
    <group ref={ref} position={[SPAWN.x, 0, SPAWN.z]} rotation={[0, Math.PI, 0]}>
      <Avatar color={color} name={`${name} (Bạn)`} speed={speed} highlight />
      {/* Vòng chỉ báo dưới chân */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}
