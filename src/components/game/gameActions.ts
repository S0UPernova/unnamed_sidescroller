import { CharacterObject, gameObject, vec2d } from "../../types"

export function moveRight(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.x >= 0) {
    obj.velocity.x = obj.moveSpeed
    obj.lastDirRight = true
    obj.currentAnimation = "run"
  }
  else if (keyDown) {
    obj.velocity.x = 0
    obj.currentAnimation = "idle"
  }
  if (!keyDown && obj.velocity.x > 0) {
    obj.velocity.x = 0
    obj.currentAnimation = "idle"

  }
  else if (!keyDown){
    obj.currentAnimation = "idle"
  }
}

export function moveLeft(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.x <= 0) {
    obj.velocity.x = -obj.moveSpeed
    obj.lastDirRight = false
    obj.currentAnimation = "run"
  }
  else if (keyDown) {
    obj.velocity.x = 0
    obj.currentAnimation = "idle"

  }
  if (!keyDown && obj.velocity.x < 0) {
    obj.velocity.x = 0
    obj.currentAnimation = "idle"
  }
  else if (!keyDown){
    obj.currentAnimation = "idle"
  }
}

export function jump(obj: CharacterObject, keyDown: boolean) {
  if (keyDown && obj.velocity.y === 0) {
    obj.velocity.y = obj.jumpForce !== undefined ? -obj.jumpForce : -3
  }
  if (!keyDown && obj.velocity.y < 0) {
    obj.velocity.y = 0.00001
  }
}

export function crouch(obj: CharacterObject, keyDown: boolean) {
  // todo add export functionality
}

export function stopX(obj: gameObject) {
  // not sure if this is needed, bud I want a export function for when both buttons are pressed
  obj.velocity.x = 0
  obj.currentAnimation = "idle"
}

export function stopY(obj: gameObject) {
  // not sure is this is needed
  obj.velocity.y = 0
}

export function moveTo(obj: gameObject, target: vec2d, margin: number): boolean {
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
 * @param {vec2d} posList 
 * @param {number} currentPos 
 * @returns {number} the current step in the cycle
 */
export function cycleThroughPositions(obj: gameObject): void {
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
      if (currentPos -1 < 0) {
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
  enableGravity
}

export const GameObjectActionMap = {
  moveTo,
  stopX,
  stopY
}
