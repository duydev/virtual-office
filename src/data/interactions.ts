import { desks, furniture, MY_DESK_ID } from './office'
import { getState, setState, showToast, type State } from '../store'

export type Interactable = {
  id: string
  x: number
  z: number
  radius: number
  label: (s: State) => string
  run: () => void
}

const myDesk = desks.find((d) => d.id === MY_DESK_ID)!

export const interactables: Interactable[] = [
  {
    id: 'coffee',
    x: -13.8,
    z: 5.5,
    radius: 1.4,
    label: () => 'Pha cà phê',
    run: () => {
      const coffees = getState().coffees + 1
      setState({ coffees })
      showToast(`Bạn vừa pha một tách cà phê nóng (tách thứ ${coffees} hôm nay).`)
    },
  },
  {
    id: 'tv',
    x: furniture.meetingTable.x,
    z: furniture.meetingTable.z,
    radius: 2.8,
    label: (s) => (s.tvOn ? 'Tắt màn hình họp' : 'Bật màn hình họp'),
    run: () => {
      const tvOn = !getState().tvOn
      setState({ tvOn })
      showToast(tvOn ? 'Màn hình phòng họp đã bật. Cuộc họp bắt đầu!' : 'Đã tắt màn hình phòng họp.')
    },
  },
  {
    id: 'my-desk',
    x: myDesk.x,
    z: myDesk.z + 0.9,
    radius: 1.2,
    label: (s) => (s.myPcOn ? 'Tắt máy tính của bạn' : 'Bật máy tính của bạn'),
    run: () => {
      const myPcOn = !getState().myPcOn
      setState({ myPcOn })
      showToast(myPcOn ? 'Máy tính đã bật. Chúc bạn làm việc hiệu quả!' : 'Đã tắt máy tính.')
    },
  },
  {
    id: 'reception',
    x: furniture.reception.x,
    z: furniture.reception.z - 0.9,
    radius: 1.3,
    label: () => 'Hỏi lễ tân',
    run: () =>
      showToast('Lễ tân: "Chào mừng bạn! Phòng họp ở góc trên bên phải, pantry ở góc dưới bên trái."'),
  },
  {
    id: 'bookshelf',
    x: furniture.bookshelf.x - 0.9,
    z: furniture.bookshelf.z,
    radius: 1.3,
    label: () => 'Đọc sách',
    run: () => showToast('Bạn lấy cuốn "Clean Code" từ kệ sách của giám đốc.'),
  },
  {
    id: 'light-switch',
    x: furniture.lightSwitch.x,
    z: furniture.lightSwitch.z - 0.6,
    radius: 1.1,
    label: (s) => (s.night ? 'Chuyển sang ban ngày' : 'Chuyển sang ban đêm'),
    run: () => setState({ night: !getState().night }),
  },
]

export function nearestInteractable(x: number, z: number): string | null {
  let best: string | null = null
  let bestDist = Infinity
  for (const it of interactables) {
    const d = Math.hypot(x - it.x, z - it.z)
    if (d <= it.radius && d < bestDist) {
      best = it.id
      bestDist = d
    }
  }
  return best
}

export function runInteraction(id: string | null) {
  interactables.find((i) => i.id === id)?.run()
}
