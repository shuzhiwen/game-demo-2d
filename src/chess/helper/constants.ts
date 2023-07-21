export const boardId = 'board'

export const readyBoardId = 'ready_board'

export const focusBoardId = 'focus_board'

export const boardSize = 12

export enum Role {
  BLACK = 1,
  WHITE = 2,
  EMPTY = 3,
}

export const RoleDict: Record<Role, string> = {
  [Role.BLACK]: '黑',
  [Role.WHITE]: '白',
  [Role.EMPTY]: '',
}

export const ChessRouteDict = {
  go_base: '/go',
  go_login: '/go/login',
  go_prepare: '/go/prepare',
  go_stage: '/go/stage',
  gobang_base: '/gobang',
  gobang_login: '/gobang/login',
  gobang_prepare: '/gobang/prepare',
  gobang_stage: '/gobang/stage',
}
