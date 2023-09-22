// import imgUrl from "../../assets/sprite.svg"
import { AnimatedSprite, CharacterObject, Collisions, CycleType, gameObject, hexString, Shape, TileSet, vec2d } from "../../types"
import * as sprites from "./sprites"

interface factoryInput {
  // todo make this the base
  x: number
  y: number
  height: number
  width: number,
  shape?: Shape,
  sprite?: sprites.Sprite,
  color?: hexString
  jumpForce?: number // todo refactor this out
  weight?: number
  character?: keyof typeof sprites.Characters
  positions?: vec2d[]

  cycleType?: CycleType

  // make these part of a different Object type
  moveSpeed?: number
  collisions?: Collisions | boolean

  tileRow?: number
  tileArr?: number[]
  tilesetData?: TileSet
}
export function gameObjectFactory(obj: factoryInput): gameObject {
  const image: HTMLImageElement = new Image();
  if (obj?.sprite) {
    image.src = sprites[obj.sprite]
  } 
  // let image: HTMLImageElement | undefined
  // if (obj.sprite !== undefined) {
  //   image = sprites.returnImage(obj.sprite)
  // }
  // else {
  //   image = undefined
  // }

  let animatedSprite: AnimatedSprite | undefined
  if (image !== undefined) {
    animatedSprite = {
      currentFrame: 0,
      frames: 1,//obj.sprite?.frames !== undefined ? obj.sprite.frames : 1,
      framesPerSecond: 1,//obj.sprite?.framesPerSecond !== undefined ? obj.sprite.framesPerSecond : 1,
      image: image,
      timeSinceLastFrameUpdate: 0,
      loopAnimation: false
    }
  }
  // }
  let collisions: Collisions;

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
    sprite: image?.src ? animatedSprite : undefined,
    currentAnimation: obj.character !== undefined ? "idle" : undefined,
    // idleAnimation: obj.character !== undefined ? {...sprites.Characters[obj.character].animationMap.idle} : undefined,
    animations: obj.character !== undefined ? sprites.Characters[obj.character].animationMap : undefined,
    actionToAnimationMap: obj.character !== undefined ? sprites.Characters[obj.character].actionToAnimationMap : undefined,
    collisions: collisions,
    tileArr: obj.tileArr !== undefined ? obj.tileArr : undefined,
    tilesetData: obj.tilesetData !== undefined ? obj.tilesetData : undefined,
    velocity: { x: 0, y: 0 },
    tileRow: obj.tileRow !== undefined ? obj.tileRow : undefined,
    moveSpeed: obj.moveSpeed ? obj.moveSpeed : 0,
    weight: obj.weight ? obj.weight : 1,
    positions: obj.positions ? [...obj.positions] : undefined,
    positionInCycle: 0,
    lastDirRight: true,
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