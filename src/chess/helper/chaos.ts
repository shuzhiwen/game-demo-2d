import {ElSource} from 'awesome-chart/dist/types'

export function encodeInviteUrl(inviteCode: string) {
  const pathname = window.location.pathname.split('/').find(Boolean)
  const base64 = btoa(encodeURI(inviteCode))
  return `${window.location.origin}/${pathname}/login?code=${base64}`
}

export function decodeInviteUrl(inviteCode: string) {
  try {
    return decodeURI(atob(inviteCode))
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
