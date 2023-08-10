import {ElSource} from 'awesome-chart/dist/types'
import {Role} from './constants'

export type Source = ElSource & {
  meta: Partial<{category: Meta; x: number; y: number}>
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
    category: source.meta.category as Role,
    position: [source.meta.x, source.meta.y] as Vec2,
  }
}
