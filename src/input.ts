// Trạng thái bàn phím / nút cảm ứng dùng chung cho vòng lặp game.
export const keys = new Set<string>()

/** Góc xoay camera quanh nhân vật (radian), thay đổi khi kéo chuột */
export const cameraYaw = { current: 0 }

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')
}

window.addEventListener('keydown', (e) => {
  if (isTyping(e)) return
  keys.add(e.code)
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault()
})
window.addEventListener('keyup', (e) => keys.delete(e.code))
window.addEventListener('blur', () => keys.clear())

export const isDown = (...codes: string[]) => codes.some((c) => keys.has(c))
