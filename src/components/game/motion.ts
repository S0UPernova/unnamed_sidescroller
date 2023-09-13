import { checkBoundsCollision, checkObjectCollisions } from './collisions'
import { cycleThroughPositions } from './gameActions'

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

export function makeThingsMove(player: CharacterObject, arr: (gameObject)[], delta: number, bounds: LevelBounds) {
  arr.forEach(obj => {
    // const restOfArr = arr.filter(el => el !== obj)

    calcMovement(obj, delta)

    if (obj.positions && obj.positions.length > 0) cycleThroughPositions(obj)
  })

  if (player.gravityMultiplier && player.gravityMultiplier > 0) {
    calcGravity(player, delta) // add multiplier to this
  }
  calcMovement(player, delta)

  if (player.jumpForce !== undefined) {
    checkBoundsCollision(player, bounds)
    checkObjectCollisions(player, arr, delta)
  }
}


export function handleCamera(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  player: CharacterObject,
  bounds: LevelBounds,
  delta: number
) {
  const cameraRight = camera.x + camera.width
  const camFractionsX = (camera.width / 4)
  const camFractionsY = (camera.height / 4)
  const playerRight = player.x + player.width
  const playerBottom = player.y + player.height
  const cameraBottom = camera.y + camera.height
  const changeInX = (player.velocity.x * delta)
  const changeInY = (player.velocity.y * delta)

  // camera move right
  if (playerRight > cameraRight - camFractionsX && player.velocity.x > 0) {
    if (cameraRight + changeInX > bounds.x2) {
      ctx.translate(-(bounds.x2 - cameraRight), 0)
      camera.x = bounds.x2 - camera.width
    }
    else {
      camera.x = camera.x + changeInX// - gapLeft
      ctx.translate(-changeInX, 0)
    }
  }

  // camera move left
  if (player.x < camera.x + camFractionsX && player.velocity.x < 0) {

    if (camera.x + changeInX < bounds.x1) {
      ctx.translate((camera.x - bounds.x1), 0)
      camera.x = bounds.x1

    }
    else {
      camera.x = camera.x + changeInX
      ctx.translate(-changeInX, 0)
    }

  }

  // camera move up
  if (player.y < camera.y + camFractionsY && player.velocity.y < 0) {

    if (camera.y + changeInY < bounds.y1) {
      ctx.translate(0,(camera.y - bounds.y1))
      camera.y = bounds.y1
    }
    else {
      camera.y = camera.y + changeInY
      ctx.translate(0, -changeInY)
    }
  }

  // camera move down
  if (playerBottom > cameraBottom - camFractionsY && player.velocity.y > 0) {

    if (cameraBottom + changeInY> bounds.y2) {
      ctx.translate(0, -(bounds.y2 - cameraBottom))
      camera.y = bounds.y2 - camera.height
    }
    else {
      camera.y = camera.y + changeInY
      ctx.translate(0, -changeInY)
    }
  }

}