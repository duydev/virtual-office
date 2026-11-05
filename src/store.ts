import { useSyncExternalStore } from 'react'

export type CameraMode = 'follow' | 'overview'

export type State = {
  joined: boolean
  playerName: string
  playerColor: string
  zone: string
  nearby: string | null
  night: boolean
  cameraMode: CameraMode
  tvOn: boolean
  myPcOn: boolean
  coffees: number
  showHelp: boolean
  toast: { text: string; id: number } | null
}

let state: State = {
  joined: false,
  playerName: '',
  playerColor: '#3b82f6',
  zone: 'Hành lang',
  nearby: null,
  night: false,
  cameraMode: 'follow',
  tvOn: false,
  myPcOn: false,
  coffees: 0,
  showHelp: true,
  toast: null,
}

const listeners = new Set<() => void>()

export const getState = () => state

export function setState(patch: Partial<State>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state))
}

export function showToast(text: string) {
  setState({ toast: { text, id: Date.now() } })
}
