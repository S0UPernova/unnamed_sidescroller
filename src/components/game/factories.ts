// import imgUrl from "../../assets/sprite.svg"
import * as sprites from "./sprites"

interface factoryInput {
  x: number
  y: number
  height: number
  width: number,
  jumpForce?: number
  moveSpeed?: number
  shape?: Shape
  sprite?: sprites.Sprite
  color?: hexString
  collisions?: Collisions | boolean
}
export function gameObjectFactory(obj: factoryInput): gameObject {
  const image: HTMLImageElement = new Image(obj.width, obj.width);
  if (obj.sprite) {
    image.src = sprites[obj.sprite]
  }
  let collisions: Collisions

  if (obj.collisions === true || obj.collisions === undefined) {
    collisions = {
      top: true,
      bottom: true,
      left: true,
      right: true
    }
  }
  else if (obj.collisions === false) {
    collisions = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }
  }
  else {
    collisions = {
      top: obj.collisions?.top === undefined ? true : obj.collisions.top,
      bottom: obj.collisions?.bottom === undefined ? true : obj.collisions.bottom,
      left: obj.collisions?.left === undefined ? true : obj.collisions.left,
      right: obj.collisions?.right === undefined ? true : obj.collisions.right
    }
  }


  return {
    x: obj.x,
    y: obj.y,
    height: obj.height,
    width: obj.width,
    moveSpeed: obj.moveSpeed ? obj.moveSpeed : 0,
    jumpForce: obj.jumpForce ? obj.jumpForce : undefined,
    color: obj?.color ? obj.color : undefined,
    velocity: { x: 0, y: 0 },
    shape: obj.shape ? obj.shape : "rectangle",
    sprite: image.src ? image : undefined,
    collisions: collisions
  }
}