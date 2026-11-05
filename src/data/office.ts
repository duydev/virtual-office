// Bố cục văn phòng (đơn vị: mét). Trục x: trái → phải, trục z: trên (bắc) → dưới (nam).
// Văn phòng rộng 30m x 20m, tâm tại (0, 0).

export type Box = { x: number; z: number; w: number; d: number }
export type Wall = { x1: number; z1: number; x2: number; z2: number; glass?: boolean }
export type Zone = { name: string; x1: number; z1: number; x2: number; z2: number }

export const OFFICE = { w: 30, d: 20, wallH: 2.8 }
export const WALL_T = 0.2

export const walls: Wall[] = [
  // Tường bao
  { x1: -15, z1: -10, x2: 15, z2: -10 },
  { x1: -15, z1: 10, x2: 15, z2: 10 },
  { x1: -15, z1: -10, x2: -15, z2: 10 },
  { x1: 15, z1: -10, x2: 15, z2: 10 },
  // Phòng họp (x 4..15, z -10..-3), cửa ở x 8..10
  { x1: 4, z1: -10, x2: 4, z2: -3, glass: true },
  { x1: 4, z1: -3, x2: 8, z2: -3, glass: true },
  { x1: 10, z1: -3, x2: 15, z2: -3, glass: true },
  // Phòng giám đốc (x 9..15, z 3..10), cửa ở x 11..12.5
  { x1: 9, z1: 3, x2: 9, z2: 10, glass: true },
  { x1: 9, z1: 3, x2: 11, z2: 3, glass: true },
  { x1: 12.5, z1: 3, x2: 15, z2: 3, glass: true },
]

export function wallBox(w: Wall): Box {
  return {
    x: (w.x1 + w.x2) / 2,
    z: (w.z1 + w.z2) / 2,
    w: Math.abs(w.x2 - w.x1) + WALL_T,
    d: Math.abs(w.z2 - w.z1) + WALL_T,
  }
}

// Bàn làm việc: rot = 0 → ghế ở phía z+, rot = PI → ghế ở phía z-
export type Desk = { id: string; x: number; z: number; rot: number; owner?: string }
export const DESK_W = 2
export const DESK_D = 0.8

const deskCols = [-12.5, -10.3, -8.1, -5.9]
const owners: Record<string, string> = {
  'd-0-0': 'Lan',
  'd-0-2': 'Minh',
  'd-1-1': 'Quân',
  'd-2-3': 'Hoa',
  'd-3-0': 'Phúc',
}
export const MY_DESK_ID = 'd-2-1'

export const desks: Desk[] = []
;[
  { z: -6.0, rot: 0 },
  { z: -6.9, rot: Math.PI },
  { z: -1.6, rot: 0 },
  { z: -2.5, rot: Math.PI },
].forEach((row, r) =>
  deskCols.forEach((x, c) => {
    const id = `d-${r}-${c}`
    desks.push({ id, x, z: row.z, rot: row.rot, owner: owners[id] })
  }),
)

/** Vị trí ghế + hướng ngồi (rotation y) của một bàn */
export function seatOf(d: Desk) {
  const s = d.rot === 0 ? 1 : -1
  return { x: d.x, z: d.z + 0.75 * s, rotY: d.rot + Math.PI }
}

// Đồ nội thất có va chạm (ngoài bàn làm việc và tường)
export const furniture = {
  meetingTable: { x: 9.5, z: -6.5, w: 4, d: 1.6 },
  tv: { x: 9.5, z: -9.85 },
  managerDesk: { x: 12, z: 7.2, w: 2.2, d: 1 },
  bookshelf: { x: 14.6, z: 5.5, w: 0.6, d: 2.4 },
  sofa: { x: -11, z: 9.2, w: 3.2, d: 1 },
  coffeeTable: { x: -11, z: 7.4, w: 1.6, d: 0.8 },
  pantry: { x: -14.5, z: 5.5, w: 0.8, d: 3 },
  reception: { x: 1.5, z: 8, w: 3, d: 0.8 },
  fridge: { x: -14.5, z: 7.7, w: 0.8, d: 0.8 },
  lightSwitch: { x: 4.5, z: 9.88 },
}

export const plants: { x: number; z: number }[] = [
  { x: -14.4, z: -9.4 },
  { x: -3.5, z: -9.4 },
  { x: 3.4, z: -9.4 },
  { x: -14.4, z: 1.8 },
  { x: 8.4, z: 9.4 },
  { x: -1.4, z: 9.4 },
  { x: 14.4, z: -2.4 },
]

export const colliders: Box[] = [
  ...walls.map(wallBox),
  ...desks.map((d) => ({ x: d.x, z: d.z, w: DESK_W, d: DESK_D })),
  furniture.meetingTable,
  furniture.managerDesk,
  furniture.bookshelf,
  furniture.sofa,
  furniture.coffeeTable,
  furniture.pantry,
  furniture.reception,
  furniture.fridge,
  ...plants.map((p) => ({ x: p.x, z: p.z, w: 0.7, d: 0.7 })),
]

export const zones: Zone[] = [
  { name: 'Phòng họp', x1: 4, z1: -10, x2: 15, z2: -3 },
  { name: 'Phòng giám đốc', x1: 9, z1: 3, x2: 15, z2: 10 },
  { name: 'Khu làm việc', x1: -15, z1: -10, x2: -4, z2: 0.5 },
  { name: 'Khu thư giãn & Pantry', x1: -15, z1: 3, x2: -6, z2: 10 },
  { name: 'Quầy lễ tân', x1: -2, z1: 5, x2: 6, z2: 10 },
]

export function zoneAt(x: number, z: number): string {
  const z0 = zones.find((a) => x >= a.x1 && x <= a.x2 && z >= a.z1 && z <= a.z2)
  return z0 ? z0.name : 'Hành lang'
}

export const SPAWN = { x: 1.5, z: 6 }
export const PLAYER_RADIUS = 0.35

export function collides(x: number, z: number, r = PLAYER_RADIUS): boolean {
  for (const b of colliders) {
    if (Math.abs(x - b.x) < b.w / 2 + r && Math.abs(z - b.z) < b.d / 2 + r) return true
  }
  return false
}
