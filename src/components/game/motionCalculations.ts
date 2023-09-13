import { checkBoundsCollision, checkObjectCollisions } from "./collisions"

export function calcGravity(player: CharacterObject, delta: number) {
  if (player.gravityMultiplier === undefined) return
  const gravity = 0.01
  const terminalVelocity = 1
  const speed = player.velocity.y + (gravity * delta)
  player.velocity.y = speed > terminalVelocity ? terminalVelocity : speed
}

export function calcMovement(obj: gameObject, delta: number) {
  // set initial values
  if (delta === 0) return
  let newPos = {
    x: obj.x + (obj.velocity.x * delta),
    y: obj.y + (obj.velocity.y * delta)
  }
  obj.x = newPos.x
  obj.y = newPos.y
}

