type gameObject = {
  x: number,
  y: number,
  width: number,
  height: number,
  color?: hexString
  velocity: { x: number, y: number },
  shape: Shape
  sprite: HTMLImageElement | undefined
  collisions: Collisions
}

type Collisions = {
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}
type vec2d = {
  x: number, y: number
}
type hexString = `#${string}`
type Shape =  "ellipse" | "rectangle" | "sprite"