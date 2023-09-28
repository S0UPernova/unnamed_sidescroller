import { Bounds, CharacterObject, dynamicObject, gameObject, MeleeAttackInfo, RangedAttackInfo, staticObject, vec2d } from "../../types"
import { checkForAnObjectCollision, isColliding } from "./collisions"

export function moveRight(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.x >= 0) {
    obj.velocity.x = obj.moveSpeed
    obj.lastDirRight = true
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "run"
    }
  }
  else if (keyDown) {
    obj.velocity.x = 0
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }
  }
  if (!keyDown && obj.velocity.x > 0) {
    obj.velocity.x = 0
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }

  }
  else if (!keyDown) {
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }
  }
}

export function moveLeft(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.x <= 0) {
    obj.velocity.x = -obj.moveSpeed
    obj.lastDirRight = false
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "run"
    }
  }
  else if (keyDown) {
    obj.velocity.x = 0
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }

  }
  if (!keyDown && obj.velocity.x < 0) {
    obj.velocity.x = 0
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }
  }
  else if (!keyDown) {
    if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
      obj.currentAnimation = "idle"
    }
  }
}

export function jump(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.y === 0) {
    obj.velocity.y = obj.jumpForce !== undefined ? -obj.jumpForce : -3
    obj.currentAnimation = "jump"
    if (obj.animations)
      obj.animations.jump.currentFrame = 0
  }
  if (!keyDown && obj.velocity.y < 0) {
    obj.velocity.y = 0.00001
  }
}

export function attack(obj: CharacterObject, attack: MeleeAttackInfo | RangedAttackInfo, keyDown: boolean) {
  // todo att check if current animation is interruptible and add a flag for it on the object

  // todo add init values here for  position of ranged attacks


  if (obj.currentAnimation === undefined) return//obj.currentAnimation = "idle"
  if (obj.attacking === true) return
  if (obj.currentAnimation === undefined || obj.animations === undefined) return
  if (keyDown && obj.currentAnimation === "idle") {
    // reset frame of old animation
    obj.animations[obj.currentAnimation].currentFrame = 0
    // start new animation
    obj.currentAnimation = "attack1"
    
    if (!obj?.animations?.[obj.currentAnimation]) return
    obj.attacking = true
    const currentAnimation = obj.animations[obj.currentAnimation]
    setTimeout(() => {
      if (obj.currentAnimation === undefined || obj.animations === undefined) return
      console.log("attacked")
      obj.attacking = false
      obj.animations[obj.currentAnimation].currentFrame = 0
      obj.currentAnimation = currentAnimation.nextAnimation ? currentAnimation.nextAnimation : "idle"
    }, currentAnimation.frames / currentAnimation.framesPerSecond * 1000)
  }
}

export function crouch(obj: CharacterObject, keyDown: boolean) {
  // todo add export functionality
}
function checkForHit(attack: RangedAttackInfo & MeleeAttackInfo, obj: CharacterObject, objArr: staticObject[], fn?: (obj: RangedAttackInfo | MeleeAttackInfo, target: staticObject) => void) {
  const bounds = getAttackBounds(attack)
  objArr.forEach(target => {
    if (isColliding(bounds, target.collisionBox)) {
      // handle the hit
      if (fn !== undefined) {
        fn(attack, target)
      }
    }
  })
}

function getAttackBounds(attack: MeleeAttackInfo | RangedAttackInfo): Bounds {
  if (attack.attackType === "melee") {
    return {
      x1: attack.launchedBy.x + attack.offset.x,
      x2: attack.launchedBy.x + attack.offset.x + attack.size.x,
      y1: attack.launchedBy.y + attack.offset.y,
      y2: attack.launchedBy.y + attack.offset.y + attack.size.y,
    }
  }
  else
    return {
      x1: attack.currentPos.x,
      x2: attack.currentPos.x + attack.size.x,
      y1: attack.currentPos.y,
      y2: attack.currentPos.y + attack.size.y,
    }
}

export function stopX(obj: gameObject) {
  // not sure if this is needed, bud I want a export function for when both buttons are pressed
  obj.velocity.x = 0
  if (obj.currentAnimation !== "jump" || obj.velocity.y === 0) {
    obj.currentAnimation = "idle"
  }
}

export function stopY(obj: gameObject) {
  // not sure is this is needed
  obj.velocity.y = 0
}

export function moveTo(obj: dynamicObject, target: vec2d, margin: number): boolean {
  const tx = target.x - obj.x
  const ty = target.y - obj.y
  if (Math.abs(tx) <= margin && Math.abs(ty) <= margin) return true
  const dist = Math.sqrt((tx * tx) + (ty * ty))

  // maybe figure a way to use the angle later
  // const rad = Math.atan2(ty, tx)
  // const angle = rad / Math.PI * 180
  const thrust = obj.moveSpeed > 0 ? obj.moveSpeed : 1
  obj.velocity.x = (tx / dist) * thrust
  obj.velocity.y = (ty / dist) * thrust
  return false
}
export function enableGravity(obj: CharacterObject, keyDown: boolean) {
  obj.gravityMultiplier = 1 // maybe have a default and current
}
/**
 * 
 * @param {gameObject} obj 
 * @returns {number} the current step in the cycle
 */
export function cycleThroughPositions(obj: dynamicObject): void {
  if (!obj.positions) return
  if (obj.positionInCycle === undefined) return
  const posList = obj.positions
  const currentPos = obj.positionInCycle //obj.positionInCycle !== undefined ? obj.positionInCycle : 0


  let nextPos: number
  if (obj.cycleType === "circular") {
    nextPos = currentPos + 1 < posList.length ? currentPos + 1 : 0
  }
  else if (obj.cycleType === "reversing") {
    if (obj.cycleDirForward === undefined) obj.cycleDirForward = true
    if (obj.cycleDirForward) {

      if (currentPos + 1 > posList.length - 1) {
        obj.cycleDirForward = false
        nextPos = currentPos - 1 >= 0 ? currentPos - 1 : 0
      }
      else {
        nextPos = currentPos + 1
      }

    }
    else if (!obj.cycleDirForward) {
      if (currentPos - 1 < 0) {
        obj.cycleDirForward = true
        nextPos = currentPos + 1 > posList.length ? currentPos + 1 : 0
      }
      else {
        nextPos = currentPos - 1
      }
    }
    else {
      nextPos = currentPos
    }

    // nextPos = currentPos + 1 < posList.length ? currentPos + 1 : 0
  }
  else {
    nextPos = 0
  }


  const inPosition: boolean = moveTo(obj, posList[nextPos], 5)

  if (inPosition) {
    obj.positionInCycle = nextPos
  }
  // return inPosition ? nextPos : currentPos
}

export const CharacterActionMap = {
  moveLeft,
  moveRight,
  jump,
  crouch,
  enableGravity,
  attack1: attack,
  attack2: attack,
  attack3: attack
}

export const GameObjectActionMap = {
  moveTo,
  stopX,
  stopY
}
