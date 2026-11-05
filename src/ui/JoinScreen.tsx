import { useState, type FormEvent } from 'react'
import { setState } from '../store'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export function JoinScreen() {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const trimmed = name.trim()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!trimmed) return
    setState({ joined: true, playerName: trimmed.slice(0, 20), playerColor: color })
  }

  return (
    <div className="join-overlay">
      <form className="join-card" onSubmit={submit}>
        <h1>Văn phòng ảo 3D</h1>
        <p>Nhập tên và chọn màu áo để vào văn phòng.</p>
        <label htmlFor="name">Tên của bạn</label>
        <input
          id="name"
          autoFocus
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Duy"
        />
        <label>Màu áo</label>
        <div className="colors">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              aria-label={`Chọn màu ${c}`}
              className={c === color ? 'selected' : ''}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <button type="submit" className="primary" disabled={!trimmed}>
          Vào văn phòng
        </button>
      </form>
    </div>
  )
}
