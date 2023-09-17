// import imgUrl from "../../assets/sprite.svg"
import { CharacterObject, Collisions, CycleType, gameObject, hexString, Shape, TileSet, vec2d } from "../../types"
import * as sprites from "./sprites"

interface factoryInput {
  // todo make this the base
  x: number
  y: number
  height: number
  width: number,
  shape?: Shape
  sprite?: sprites.Sprite
  color?: hexString
  jumpForce?: number // todo refactor this out
  weight?: number
  
  positions?: vec2d[]

  cycleType?: CycleType
  
  // make these part of a different Object type
  moveSpeed?: number
  collisions?: Collisions | boolean

  tileRow?: number
  tileNum?: number
  tilesetData?: TileSet
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
    color: obj?.color ? obj.color : undefined,
    shape: obj.shape ? obj.shape : "rectangle",
    sprite: image.src ? image : undefined,
    collisions: collisions,
    tileNum: obj.tileNum !== undefined ? obj.tileNum : undefined,
    tilesetData: obj.tilesetData !== undefined ? obj.tilesetData : undefined,
    velocity: { x: 0, y: 0 },
    tileRow: obj.tileRow !== undefined ? obj.tileRow : undefined,
    moveSpeed: obj.moveSpeed ? obj.moveSpeed : 0,
    weight: obj.weight ? obj.weight : 1,
    positions: obj.positions ? [...obj.positions] : undefined,
    positionInCycle: 0,
    cycleType: obj.cycleType ? obj.cycleType : "circular"
  }
}

// todo make this more useful
export function characterObjectFactory(obj: factoryInput): CharacterObject {
  const character: CharacterObject = {
    ...gameObjectFactory(obj),
  gravityMultiplier: undefined,
  weight: obj.weight ? obj.weight : .25,
  jumpForce: obj.jumpForce ? obj.jumpForce : 3
}

  return character
}