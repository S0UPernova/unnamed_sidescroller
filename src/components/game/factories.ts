// import imgUrl from "../../assets/sprite.svg"
import * as sprites from "./sprites"

interface factoryInput {
  x: number
  y: number
  height: number
  width: number,
  shape?: Shape
  sprite?: sprites.Sprite
  color?: hexString
}
export function gameObjectFactory(obj: factoryInput): gameObject {

  const image: HTMLImageElement = new Image(obj.width, obj.width);
  if (obj.sprite) {
    image.src = sprites[obj.sprite]
  }
  return {
    x: obj.x,
    y: obj.y,
    height: obj.height,
    width: obj.width,
    color: obj?.color ? obj.color : undefined,
    velocity: { x: 0, y: 0 },
    shape: obj.shape ? obj.shape : "rectangle",
    sprite: image.src ? image : undefined
  }
}