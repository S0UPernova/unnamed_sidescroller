import { checkBoundsCollision, checkObjectCollisions } from "./collisions"

export function calcGravity(velocity: { x: number, y: number, }, delta: number) {
  const gravity = 0.01
  const terminalVelocity = 1
  const speed = velocity.y + (gravity * delta)
  velocity.y = speed > terminalVelocity ? terminalVelocity : speed
}

export function calcMovement(obj: gameObject, delta: number) {
  // set initial values
  let newPos = {
    x: obj.x + (obj.velocity.x * delta),
    y: obj.y + (obj.velocity.y * delta)
  }
  obj.x = newPos.x
  obj.y = newPos.y
}

