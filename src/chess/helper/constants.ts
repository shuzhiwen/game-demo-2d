export const boardId = 'board'

export const boardSize = 12

export enum Role {
  BLACK = 1,
  WHITE = 2,
  EMPTY = 3,
  RED = 4,
}

export const RoleDict: Record<Role, string> = {
  [Role.RED]: '红',
  [Role.BLACK]: '黑',
  [Role.WHITE]: '白',
  [Role.EMPTY]: '',
}

export const RoleColorDict: Record<Role, string> = {
  [Role.RED]: '#c4473d',
  [Role.BLACK]: '#161823',
  [Role.WHITE]: '#fffbf0',
  [Role.EMPTY]: '#00000000',
}

export const RoleBgColorDict: Record<Role, string> = {
  [Role.RED]: '#fffbf0',
  [Role.BLACK]: '#fffbf0',
  [Role.WHITE]: '#161823',
  [Role.EMPTY]: '#00000000',
}

export enum ChineseChess {
  /** 将帅 */
  KING,
  /** 士仕 */
  MANDARIN,
  /** 象相 */
  ELEPHANT,
  /** 馬 */
  KNIGHT,
  /** 車 */
  ROOK,
  /** 炮 */
  CANNON,
  /** 兵卒 */
  PAWN,
}

export const ChineseChessDict: Record<ChineseChess, Partial<Record<Role, string>>> = {
  [ChineseChess.KING]: {[Role.BLACK]: '将', [Role.RED]: '帅'},
  [ChineseChess.MANDARIN]: {[Role.BLACK]: '士', [Role.RED]: '仕'},
  [ChineseChess.ELEPHANT]: {[Role.BLACK]: '象', [Role.RED]: '相'},
  [ChineseChess.KNIGHT]: {[Role.BLACK]: '馬', [Role.RED]: '馬'},
  [ChineseChess.ROOK]: {[Role.BLACK]: '車', [Role.RED]: '車'},
  [ChineseChess.CANNON]: {[Role.BLACK]: '炮', [Role.RED]: '炮'},
  [ChineseChess.PAWN]: {[Role.BLACK]: '卒', [Role.RED]: '兵'},
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
  chinese_base: '/chinese',
  chinese_login: '/chinese/login',
  chinese_prepare: '/chinese/prepare',
  chinese_stage: '/chinese/stage',
}
