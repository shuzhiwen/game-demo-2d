import {ElSource} from 'awesome-chart/dist/types'

export type Source = ElSource & {
  meta: {category: Meta; x: number; y: number}
}

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

export function decodeSource(source: Source) {
  return {
    category: source.meta?.category,
    position: [source.meta.x, source.meta.y] as Vec2,
  }
}
