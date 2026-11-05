import { useEffect, useRef, type PointerEvent as RPointerEvent } from 'react'
import { interactables, runInteraction } from '../data/interactions'
import { desks, furniture as F, OFFICE, walls } from '../data/office'
import { keys } from '../input'
import { playerPos } from '../scene/Player'
import { getState, setState, useStore } from '../store'

export function Hud() {
  const zone = useStore((s) => s.zone)
  const nearby = useStore((s) => s.nearby)
  const night = useStore((s) => s.night)
  const mode = useStore((s) => s.cameraMode)
  const showHelp = useStore((s) => s.showHelp)
  const coffees = useStore((s) => s.coffees)
  const label = useStore((s) => {
    const it = interactables.find((i) => i.id === s.nearby)
    return it ? it.label(s) : null
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'KeyE') runInteraction(getState().nearby)
      if (e.code === 'KeyN') setState({ night: !getState().night })
      if (e.code === 'KeyC') setState({ cameraMode: getState().cameraMode === 'follow' ? 'overview' : 'follow' })
      if (e.code === 'KeyH') setState({ showHelp: !getState().showHelp })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="hud">
      <div className="top-left panel">
        <div className="zone-label">Vị trí</div>
        <div className="zone">{zone}</div>
        <div className="stats">☕ {coffees} tách cà phê</div>
      </div>

      <div className="top-right">
        <button onClick={() => setState({ night: !night })}>{night ? 'Ban ngày (N)' : 'Ban đêm (N)'}</button>
        <button onClick={() => setState({ cameraMode: mode === 'follow' ? 'overview' : 'follow' })}>
          {mode === 'follow' ? 'Nhìn toàn cảnh (C)' : 'Theo nhân vật (C)'}
        </button>
        <button onClick={() => setState({ showHelp: !showHelp })}>Hướng dẫn (H)</button>
      </div>

      {showHelp && (
        <div className="help panel">
          <h4>Điều khiển</h4>
          <ul>
            <li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / phím mũi tên: di chuyển</li>
            <li><kbd>Shift</kbd>: chạy nhanh</li>
            <li>Kéo chuột: xoay camera, cuộn chuột: phóng to/thu nhỏ</li>
            <li><kbd>E</kbd>: tương tác khi đứng gần đồ vật</li>
            <li><kbd>N</kbd>: ngày/đêm, <kbd>C</kbd>: đổi camera, <kbd>H</kbd>: ẩn hướng dẫn</li>
          </ul>
          <h4>Thử khám phá</h4>
          <ul>
            <li>Bật máy tính tại bàn của bạn (khu làm việc)</li>
            <li>Bật màn hình trong phòng họp</li>
            <li>Pha cà phê ở pantry, hỏi lễ tân, đọc sách phòng giám đốc</li>
            <li>Công tắc đèn vàng cạnh quầy lễ tân</li>
          </ul>
        </div>
      )}

      {nearby && label && (
        <button className="prompt" onClick={() => runInteraction(nearby)}>
          <kbd>E</kbd> {label}
        </button>
      )}

      <Toast />
      <MiniMap />
      <TouchPad />
    </div>
  )
}

function Toast() {
  const toast = useStore((s) => s.toast)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setState({ toast: null }), 3500)
    return () => clearTimeout(t)
  }, [toast])
  if (!toast) return null
  return (
    <div key={toast.id} className="toast panel">
      {toast.text}
    </div>
  )
}

const MAP_SCALE = 6 // px / mét

function MiniMap() {
  const dot = useRef<SVGCircleElement>(null)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      dot.current?.setAttribute('cx', String(playerPos.x * MAP_SCALE))
      dot.current?.setAttribute('cy', String(playerPos.z * MAP_SCALE))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  const W = OFFICE.w * MAP_SCALE
  const D = OFFICE.d * MAP_SCALE
  const s = MAP_SCALE
  const rect = (b: { x: number; z: number; w: number; d: number }, fill: string, key: string) => (
    <rect key={key} x={(b.x - b.w / 2) * s} y={(b.z - b.d / 2) * s} width={b.w * s} height={b.d * s} fill={fill} />
  )

  return (
    <div className="minimap panel">
      <svg width={W} height={D} viewBox={`${-W / 2} ${-D / 2} ${W} ${D}`}>
        <rect x={-W / 2} y={-D / 2} width={W} height={D} fill="#e2e8f0" />
        {desks.map((d) => rect({ x: d.x, z: d.z, w: 2, d: 0.8 }, '#d6b38a', d.id))}
        {rect(F.meetingTable, '#7c4a2d', 'mt')}
        {rect(F.managerDesk, '#5b3a24', 'md')}
        {rect(F.sofa, '#0e7490', 'sofa')}
        {rect(F.pantry, '#78716c', 'pantry')}
        {rect(F.reception, '#0f766e', 'rec')}
        {walls.map((w, i) => (
          <line
            key={i}
            x1={w.x1 * s}
            y1={w.z1 * s}
            x2={w.x2 * s}
            y2={w.z2 * s}
            stroke={w.glass ? '#60a5fa' : '#334155'}
            strokeWidth={w.glass ? 2 : 3}
          />
        ))}
        <circle ref={dot} r={4} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
      </svg>
    </div>
  )
}

/** Nút di chuyển cho màn hình cảm ứng */
function TouchPad() {
  const bind = (code: string) => ({
    onPointerDown: (e: RPointerEvent) => {
      e.preventDefault()
      keys.add(code)
    },
    onPointerUp: () => keys.delete(code),
    onPointerLeave: () => keys.delete(code),
    onPointerCancel: () => keys.delete(code),
  })
  return (
    <div className="touchpad">
      <button className="up" {...bind('KeyW')}>▲</button>
      <button className="left" {...bind('KeyA')}>◀</button>
      <button className="down" {...bind('KeyS')}>▼</button>
      <button className="right" {...bind('KeyD')}>▶</button>
    </div>
  )
}
