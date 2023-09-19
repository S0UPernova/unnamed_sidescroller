import sprite from "../../assets/sprite.svg"
import tileset from "../game/levels/tileset.png"
import wareIdle from "../../assets/warewolf/Idle.png"
import wareRun from "../../assets/warewolf/Run.png"
import { ActionToAnimationMap, AnimatedSprite, CharacterAction, CharacterActions, CharacterAnimationMap } from "../../types"
import { CharacterActionMap, moveLeft } from "./gameActions"

// todo refactor animated ones from here
export type Sprite = (
  "sprite" | "tileset" | "wareIdle"
)
export function returnImage(src: string): HTMLImageElement {
  const img = new Image()
  img.src = src
  return img
}


export const WarewolfSprites: CharacterAnimationMap = {
  idle: {
    image: returnImage(wareIdle),
    frames: 8,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0
  },
  run: {
    image: returnImage(wareRun),
    frames: 9,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0
  }
}

export const warewolf  = {
  animationMap: WarewolfSprites,
  actionMap: CharacterActionMap,
  actionToAnimationMap: {
    moveRight: "run",
    moveLeft: "run",
    jump: "idle"
  }
}
export const Characters = { warewolf: warewolf }
// WarewolfSprites.idle
// todo have this export AnimatedSprite type
export {
  sprite,
  tileset,
  wareIdle,
}
