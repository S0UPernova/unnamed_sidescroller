import { checkBoundsCollision, checkObjectCollisions } from "./collisions"

export function calcGravity(velocity: { x: number, y: number, }, delta: number) {
  const gravity = 0.01
  const terminalVelocity = 1
  const speed = velocity.y + (gravity * delta)
  velocity.y = speed > terminalVelocity ? terminalVelocity : speed
}

export function calcMovement(obj: gameObject, bounds: { x: number, y: number }, delta: number, objects: gameObject[]) {
  // set initial values
  let newPos = {
    x: obj.x + (obj.velocity.x * delta),
    y: obj.y + (obj.velocity.y * delta)
  }
  checkBoundsCollision(newPos, obj, bounds)
  checkObjectCollisions(newPos, obj, objects)
  obj.x = newPos.x
  obj.y = newPos.y
}

