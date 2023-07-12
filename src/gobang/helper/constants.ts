import {Role} from '@gobang/render'

export const RoleDict: Record<Role, string> = {
  [Role.BLACK]: '黑',
  [Role.WHITE]: '白',
  [Role.EMPTY]: '',
}

export const GobangRouteDict = {
  login: '/gobang',
  prepare: '/gobang/prepare',
  stage: '/gobang/stage',
}
