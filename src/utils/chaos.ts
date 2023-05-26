export function isMobile() {
  const {userAgent} = navigator
  const agents = ['Android', 'iPhone', 'Windows Phone', 'iPod']
  const isMobile = agents.find((agent) => userAgent.includes(agent))
  return Boolean(isMobile)
}
