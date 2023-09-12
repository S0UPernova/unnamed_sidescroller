// todo make separate dynamic gameObject
type gameObject = {
  x: number,
  y: number,
  width: number,
  height: number,
  weight?: number
  moveSpeed: number
  color?: hexString
  velocity: { x: number, y: number },
  shape: Shape
  sprite: HTMLImageElement | undefined
  collisions: Collisions
  positionInCycle?: number
  positions?: vec2d[]
  cycleDirForward?: boolean
  cycleType?: CycleType
}
type CycleType = "circular" | "reversing"

type Camera = {
  x: number
  y: number
  height: number
  width: number
}

type LevelBounds = {
  x1: number
  y1: number
  x2: number
  y2: number
}

type CharacterObject = gameObject & {
  jumpForce?: number
  gravityMultiplier?: number

}

type Collisions = {
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}
type Controls = {
  [key: string]: keyof CharacterActions
}

type vec2d = {
  x: number, y: number
}
type CharacterActions = { 
  jump: CharacterAction
  crouch: CharacterAction
  moveRight: CharacterAction
  moveLeft: CharacterAction
} & gameObjectAction

type CharacterAction = (obj: gameObject, keyDown: boolean) => void
type gameObjectAction = (obj: gameObject) => void

type gameObjectActions = {
  stopX: gameObjectAction
  stopY: gameObjectAction
}

type hexString = `#${string}`
type Shape = "ellipse" | "rectangle" | "sprite"