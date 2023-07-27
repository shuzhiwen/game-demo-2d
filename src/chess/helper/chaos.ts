import {ElSource} from 'awesome-chart/dist/types'

export function encodeInviteUrl(inviteCode: string) {
  const pathname = window.location.pathname.split('/').find(Boolean)
  return `${window.location.origin}/${pathname}/login?code=${btoa(inviteCode!)}`
}

export function decodeInviteUrl(inviteCode: string) {
  try {
    return atob(inviteCode!)
  } catch {
    return null
  }
}

export function decodeSource(source: ElSource[]) {
  return {
    category: source.find((item) => item.category === 'category')?.value,
    position: [
      source.find((item) => item.category === 'x')?.value,
      source.find((item) => item.category === 'y')?.value,
    ] as Vec2,
  }
}
