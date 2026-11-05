import { Html } from '@react-three/drei'
import { desks, furniture as F, MY_DESK_ID, OFFICE, plants, wallBox, walls } from '../data/office'
import { useStore } from '../store'
import { Block, Chair, Group, Plant, WorkDesk } from './Furniture'

const H = OFFICE.wallH

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[OFFICE.w, OFFICE.d]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      {/* Thảm phân vùng */}
      <Rug x={-9.5} z={-4.25} w={10.5} d={10.5} color="#94a3b8" />
      <Rug x={9.5} z={-6.5} w={10.8} d={6.8} color="#a5b4fc" />
      <Rug x={12} z={6.5} w={5.8} d={6.8} color="#d6c7b0" />
      <Rug x={-10.5} z={6.5} w={8.8} d={6.8} color="#fcd9b6" />
      <Rug x={2} z={7.5} w={7} d={4.8} color="#e2e8f0" />
    </group>
  )
}

function Rug({ x, z, w, d, color }: { x: number; z: number; w: number; d: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Walls() {
  return (
    <group>
      {walls.map((w, i) => {
        const b = wallBox(w)
        if (w.glass) {
          return (
            <group key={i}>
              <mesh position={[b.x, H / 2, b.z]}>
                <boxGeometry args={[b.w, H, b.d]} />
                <meshPhysicalMaterial color="#bfdbfe" transparent opacity={0.22} roughness={0.05} depthWrite={false} />
              </mesh>
              <Block pos={[b.x, 0.05, b.z]} size={[b.w, 0.1, b.d + 0.04]} color="#475569" shadow={false} />
              <Block pos={[b.x, H - 0.04, b.z]} size={[b.w, 0.08, b.d + 0.04]} color="#475569" shadow={false} />
            </group>
          )
        }
        return <Block key={i} pos={[b.x, H / 2, b.z]} size={[b.w, H, b.d]} color="#f1f5f9" />
      })}
      {/* Cửa sổ tường phía bắc */}
      {[-11, -7, -3, 1, 6.5, 12].map((x) => (
        <Window key={x} x={x} />
      ))}
    </group>
  )
}

function Window({ x }: { x: number }) {
  const night = useStore((s) => s.night)
  return (
    <group position={[x, 1.6, -9.88]}>
      <Block pos={[0, 0, 0]} size={[2.6, 1.5, 0.04]} color="#64748b" shadow={false} />
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[2.4, 1.3]} />
        <meshStandardMaterial
          color={night ? '#0f172a' : '#bae6fd'}
          emissive={night ? '#1e293b' : '#7dd3fc'}
          emissiveIntensity={night ? 0.3 : 0.8}
        />
      </mesh>
    </group>
  )
}

function Workspace() {
  const myPcOn = useStore((s) => s.myPcOn)
  const name = useStore((s) => s.playerName)
  return (
    <group>
      {desks.map((d) => {
        const mine = d.id === MY_DESK_ID
        return (
          <group key={d.id}>
            <WorkDesk pos={[d.x, 0, d.z]} rotY={d.rot} screenOn={mine ? myPcOn : !!d.owner} />
            {(mine || d.owner) && (
              <Html position={[d.x, 0.9, d.z]} center distanceFactor={12} zIndexRange={[5, 0]}>
                <div className={`desk-tag${mine ? ' me' : ''}`}>{mine ? `Bàn của ${name}` : `Bàn của ${d.owner}`}</div>
              </Html>
            )}
          </group>
        )
      })}
      {/* Bảng trắng */}
      <Group pos={[-9.2, 0, -9.85]}>
        <Block pos={[0, 1.5, 0]} size={[3, 1.2, 0.05]} color="#ffffff" />
        <Block pos={[0, 0.88, 0.06]} size={[3, 0.04, 0.1]} color="#94a3b8" />
      </Group>
    </group>
  )
}

function MeetingRoom() {
  const tvOn = useStore((s) => s.tvOn)
  const t = F.meetingTable
  return (
    <group>
      <Block pos={[t.x, 0.74, t.z]} size={[t.w, 0.06, t.d]} color="#7c4a2d" />
      <Block pos={[t.x, 0.37, t.z]} size={[t.w - 1, 0.7, 0.3]} color="#4b2e1c" />
      {[-1.3, 0, 1.3].map((dx) => (
        <group key={dx}>
          <Chair pos={[t.x + dx, 0, t.z - 1.25]} rotY={Math.PI} color="#334155" />
          <Chair pos={[t.x + dx, 0, t.z + 1.25]} color="#334155" />
        </group>
      ))}
      <Chair pos={[t.x - 2.5, 0, t.z]} rotY={-Math.PI / 2} color="#334155" />
      <Chair pos={[t.x + 2.5, 0, t.z]} rotY={Math.PI / 2} color="#334155" />
      {/* Màn hình TV */}
      <group position={[F.tv.x, 1.6, F.tv.z]}>
        <Block pos={[0, 0, 0]} size={[3.2, 1.8, 0.08]} color="#111827" />
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3, 1.65]} />
          <meshStandardMaterial
            color={tvOn ? '#1d4ed8' : '#030712'}
            emissive={tvOn ? '#2563eb' : '#000000'}
            emissiveIntensity={tvOn ? 1 : 0}
          />
        </mesh>
        {tvOn && (
          <Html transform position={[0, 0, 0.06]} distanceFactor={2} zIndexRange={[4, 0]}>
            <div className="tv-content">
              <h3>Họp giao ban tuần</h3>
              <p>1. Tiến độ dự án</p>
              <p>2. Kế hoạch sprint tới</p>
              <p>3. Q&amp;A</p>
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

function ManagerOffice() {
  const d = F.managerDesk
  const b = F.bookshelf
  const bookColors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#8b5cf6', '#f97316']
  return (
    <group>
      <Block pos={[d.x, 0.75, d.z]} size={[d.w, 0.06, d.d]} color="#5b3a24" />
      <Block pos={[d.x, 0.37, d.z - 0.3]} size={[d.w, 0.72, 0.06]} color="#4b2e1c" />
      <WorkDeskMonitor x={d.x} z={d.z + 0.2} />
      <Chair pos={[d.x, 0, d.z + 0.85]} color="#111827" />
      <Chair pos={[d.x - 0.6, 0, d.z - 1.2]} rotY={Math.PI} color="#64748b" />
      <Chair pos={[d.x + 0.6, 0, d.z - 1.2]} rotY={Math.PI} color="#64748b" />
      {/* Kệ sách */}
      <Block pos={[b.x, 1, b.z]} size={[b.w, 2, b.d]} color="#78350f" />
      {[0.45, 1.05, 1.65].map((y) =>
        bookColors.map((c, i) => (
          <Block
            key={`${y}-${i}`}
            pos={[b.x - 0.31, y, b.z - 0.9 + i * 0.33]}
            size={[0.04, 0.4, 0.22]}
            color={c}
            shadow={false}
          />
        )),
      )}
    </group>
  )
}

function WorkDeskMonitor({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Block pos={[0, 0.95, 0]} size={[0.05, 0.35, 0.05]} color="#374151" />
      <Block pos={[0, 1.18, 0]} size={[0.8, 0.45, 0.04]} color="#111827" />
      <mesh position={[0, 1.18, 0.022]}>
        <planeGeometry args={[0.75, 0.4]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function Lounge() {
  const s = F.sofa
  const c = F.coffeeTable
  const p = F.pantry
  return (
    <group>
      {/* Sofa */}
      <Block pos={[s.x, 0.25, s.z]} size={[s.w, 0.5, s.d]} color="#0e7490" />
      <Block pos={[s.x, 0.7, s.z + 0.38]} size={[s.w, 0.6, 0.25]} color="#0e7490" />
      <Block pos={[s.x - s.w / 2 + 0.12, 0.6, s.z]} size={[0.25, 0.4, s.d]} color="#155e75" />
      <Block pos={[s.x + s.w / 2 - 0.12, 0.6, s.z]} size={[0.25, 0.4, s.d]} color="#155e75" />
      {/* Bàn trà */}
      <Block pos={[c.x, 0.4, c.z]} size={[c.w, 0.06, c.d]} color="#fef3c7" />
      <Block pos={[c.x, 0.2, c.z]} size={[0.15, 0.4, 0.15]} color="#a16207" />
      {/* Pantry */}
      <Block pos={[p.x, 0.5, p.z]} size={[p.w, 1, p.d]} color="#e7e5e4" />
      <Block pos={[p.x, 1.02, p.z]} size={[p.w + 0.05, 0.05, p.d + 0.05]} color="#57534e" />
      {/* Máy pha cà phê */}
      <group position={[p.x + 0.05, 1.05, p.z]}>
        <Block pos={[0, 0.25, 0]} size={[0.4, 0.5, 0.35]} color="#1c1917" />
        <Block pos={[0.18, 0.3, 0]} size={[0.05, 0.08, 0.2]} color="#ef4444" emissive="#ef4444" />
      </group>
      {/* Tủ lạnh */}
      <Block pos={[-14.5, 0.9, 7.7]} size={[0.8, 1.8, 0.8]} color="#f8fafc" />
      <Block pos={[-14.08, 1.1, 7.45]} size={[0.04, 0.5, 0.05]} color="#94a3b8" />
    </group>
  )
}

function Reception() {
  const r = F.reception
  return (
    <group>
      <Block pos={[r.x, 0.55, r.z]} size={[r.w, 1.1, r.d]} color="#f8fafc" />
      <Block pos={[r.x, 1.12, r.z]} size={[r.w + 0.1, 0.05, r.d + 0.1]} color="#0f766e" />
      <Chair pos={[r.x, 0, r.z + 0.85]} color="#0f766e" />
      {/* Logo công ty trên tường phía nam */}
      <Html transform position={[r.x, 2, 9.88]} rotation={[0, Math.PI, 0]} distanceFactor={3} zIndexRange={[3, 0]}>
        <div className="logo-wall">VIRTUAL OFFICE</div>
      </Html>
      {/* Công tắc đèn */}
      <Block pos={[F.lightSwitch.x, 1.3, F.lightSwitch.z]} size={[0.15, 0.22, 0.04]} color="#fbbf24" emissive="#f59e0b" />
    </group>
  )
}

export function Office() {
  return (
    <group>
      <Floor />
      <Walls />
      <Workspace />
      <MeetingRoom />
      <ManagerOffice />
      <Lounge />
      <Reception />
      {plants.map((p) => (
        <Plant key={`${p.x}-${p.z}`} x={p.x} z={p.z} />
      ))}
    </group>
  )
}
