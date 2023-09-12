import { calcGravity, calcMovement } from "./motionCalculations"
import { checkBoundsCollision, checkObjectCollisions } from './collisions'
import { cycleThroughPositions } from './gameActions'

export function draw(ctx: CanvasRenderingContext2D, obj: gameObject): void {
  switch (obj.shape) {
    case "ellipse": {
      ctx.beginPath()
      ctx.ellipse(obj.x, obj.y, obj.width, obj.height, 0, 0, 2 * Math.PI)
      // ctx.arc(obj.x, obj.y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = obj?.color ? obj.color : '#eee'
      ctx.fill()
    }
      break
    case "rectangle":
      ctx.fillStyle = obj?.color ? obj.color : '#eee'
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
      break
    case "sprite":
      if (obj.sprite !== undefined) {
        ctx.drawImage(obj.sprite, obj.x, obj.y, obj.width, obj.width);
      }
      break
  }
}

// prabably should rename the file
export function makeThingsMove(arr: (gameObject & CharacterObject)[], delta: number, bounds: LevelBounds) {
  arr.forEach(obj => {
    const restOfArr = arr.filter(el => el !== obj)
    
    if (obj.gravityMultiplier && obj.gravityMultiplier > 0) {
      calcGravity(obj.velocity, delta) // add multiplier to this
    }
    
    
    calcMovement(obj, delta) 
    
    if (obj.jumpForce !== undefined) {
      checkBoundsCollision(obj, bounds)
      checkObjectCollisions(obj, restOfArr, delta)
    }

    if (obj.positions && obj.positions.length > 0) cycleThroughPositions(obj)
  })
}

// todo get this working just right
export function handleCamera(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  player: CharacterObject,
  bounds: LevelBounds,
  delta: number
) {
  const cameraRight = camera.x + camera.width
  const camFractionsX = (camera.width / 4)
  const playerRight = player.x + player.width
  const gapLeft = player.x - camera.x
  const changeInX = (player.velocity.x * delta)

  // camera move right
  if (playerRight > cameraRight - camFractionsX && player.velocity.x > 0 ) {
    if (cameraRight + changeInX > bounds.x2) {
      camera.x = bounds.x2 - camera.width
    }
    else {
      camera.x = player.x + changeInX - gapLeft
      ctx.translate(-(player.velocity.x * delta), camera.y)
    }
  }

  // camera move left
  if (player.x < camera.x + camFractionsX && player.velocity.x < 0) {

    if (camera.x + changeInX < bounds.x1) {
      camera.x = bounds.x1
    }
    else {
      camera.x = camera.x + changeInX
      ctx.translate(-(player.velocity.x * delta), camera.y)
    }

  }
}