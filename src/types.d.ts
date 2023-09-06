type gameObject = {
  x: number,
  y: number,
  width: number,
  height: number,
  color?: hexString
  velocity: { x: number, y: number },
  shape: Shape
  sprite: HTMLImageElement | undefined
}
type hexString = `#${string}`
type Shape =  "ellipse" | "rectangle" | "sprite"