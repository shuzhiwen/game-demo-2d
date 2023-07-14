export function encodeInviteUrl(inviteCode: string) {
  return `${window.location.origin}/gobang?code=${btoa(inviteCode!)}`
}

export function decodeInviteUrl(inviteCode: string) {
  try {
    return atob(inviteCode!)
  } catch {
    return null
  }
}
