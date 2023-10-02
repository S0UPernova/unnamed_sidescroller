import sprite from "../../assets/sprite.svg"
import tileset from "../game/levels/tileset.png"
import wereIdle from "../../assets/werewolf/Idle.png"
import wereRun from "../../assets/werewolf/Run.png"
import wereJump from "../../assets/werewolf/Jump.png"
import wereRunAttack from "../../assets/werewolf/Run+Attack.png"
import wereAttackOne from "../../assets/werewolf/Attack_1.png"
import wereAttackTwo from "../../assets/werewolf/Attack_2.png"
import wereAttackThree from "../../assets/werewolf/Attack_3.png"
import wereDead from "../../assets/werewolf/Dead.png"
import { ActionToAnimationMap, AnimatedSprite, CharacterAction, CharacterActions, CharacterAnimationMap, CharacterObject, MeleeAttackInfo, RangedAttackInfo } from "../../types"
import { CharacterActionMap, jump, moveLeft } from "./gameActions"

// todo refactor animated ones from here
export type Sprite = (
  "sprite" | "tileset" | "wereIdle"
)
export function returnImage(src: string): HTMLImageElement {
  const img = new Image()
  img.src = src
  return img
}


export const WerewolfSprites: CharacterAnimationMap = {
  idle: {
    image: returnImage(wereIdle),
    frames: 8,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: true,
    nextAnimation: undefined
  },
  run: {
    image: returnImage(wereRun),
    frames: 9,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: true,
    nextAnimation: undefined
  },
  jump: {
    image: returnImage(wereJump),
    frames: 11,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: undefined
  },
  attack1: {
    image: returnImage(wereAttackOne),
    frames: 6,
    framesPerSecond: 12,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: "idle"
  },
  attack2: {
    image: returnImage(wereAttackTwo),
    frames: 4,
    framesPerSecond: 12,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: "idle",
  },
  attack3: {
    image: returnImage(wereAttackThree),
    frames: 5,
    framesPerSecond: 12,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: "idle"
  },
  runAttack: {
    image: returnImage(wereRunAttack),
    frames: 7,
    framesPerSecond: 15,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: "idle"
  },
  dead: {
    image: returnImage(wereDead),
    frames: 11,
    framesPerSecond: 24,
    currentFrame: 0,
    timeSinceLastFrameUpdate: 0,
    loopAnimation: false,
    nextAnimation: "idle"
  },
}

export type CharacterAttacks = {
  attack1: RangedAttackInfo | MeleeAttackInfo
  attack2: RangedAttackInfo | MeleeAttackInfo
  attack3: RangedAttackInfo | MeleeAttackInfo
  runAttack: RangedAttackInfo | MeleeAttackInfo
}

const wereAttacks: CharacterAttacks = {
  attack1: {
    attackAnimation: "attack1",
    attackType: "melee",
    damage: 3,
    launchedBy: {} as CharacterObject, // must be set on init
    offset: {x: 0, y: 0},
    size: {x: 0, y: 0},
  },
  attack2: {
    attackType: "melee",
    attackAnimation: "attack2",
    damage: 3,
    launchedBy: {} as CharacterObject, // must be set on init
    offset: {x: 0, y: 0},
    size: {x: 0, y: 0},
  },
  attack3: {
    attackAnimation: "attack3",
    attackType: "melee",
    damage: 3,
    launchedBy: {} as CharacterObject, // must be set on init
    offset: {x: 0, y: 0},
    size: {x: 0, y: 0},
  },
  runAttack: {
    attackAnimation: "runAttack",
    attackType: "melee",
    damage: 3,
    launchedBy: {} as CharacterObject, // must be set on init
    offset: {x: 0, y: 0},
    size: {x: 0, y: 0},
  }
}

export const werewolf  = {
  animationMap: WerewolfSprites,
  actionMap: CharacterActionMap,
  actionToAnimationMap: {
    moveRight: "run",
    moveLeft: "run",
    jump: "idle",
  },
  attacks: wereAttacks
  
}
export const Characters = { warewolf: werewolf }
// WarewolfSprites.idle
// todo have this export AnimatedSprite type
export {
  sprite,
  tileset,
  wereIdle,
}
