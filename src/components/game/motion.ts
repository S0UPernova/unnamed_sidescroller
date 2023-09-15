import { Camera, CharacterObject, gameObject, LevelBounds } from '../../types'
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

  // todo use logic from left and right in up and down
  // camera move right
  if (playerRight > cameraRight - camFractionsX) {
    let moveBy = playerRight - (cameraRight - camFractionsX)
    if (cameraRight + moveBy > bounds.x2) {
      moveBy = bounds.x2 - cameraRight
    }
    camera.x += moveBy
    ctx.translate(-moveBy, 0)
  }

  // camera move left
  if (player.x < camera.x + camFractionsX) {
    let moveBy = player.x - (camera.x + camFractionsX)
    if (camera.x + moveBy < bounds.x1) {
      moveBy = bounds.x1 - camera.x
    }
    camera.x += moveBy
    ctx.translate(-moveBy, 0)
  }

  // camera move up
  if (player.y < camera.y + camFractionsY) {
    let moveBy = player.y - (camera.y + camFractionsY)
    if (camera.y + moveBy < bounds.y1) {
      moveBy = bounds.y1 - camera.y
    }
    camera.y += moveBy
    ctx.translate(0, -moveBy)
  }

  // camera move down
  if (playerBottom > cameraBottom - camFractionsY) {
    let moveBy = playerBottom - (cameraBottom - camFractionsY)
    if (cameraBottom + moveBy > bounds.y2) {
      moveBy = bounds.y2 - cameraBottom
    }
    camera.y += moveBy
    ctx.translate(0, -moveBy)
  }
}