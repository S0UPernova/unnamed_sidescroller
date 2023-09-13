import { draw } from './draw'
import { characterObjectFactory, gameObjectFactory } from './factories'
import { handleControls } from './inputHandlers'
import * as level1 from './levels/level1.json'
import { calcGravity, calcMovement } from "./motionCalculations"
import { checkBoundsCollision, checkObjectCollisions } from './collisions'
import { cycleThroughPositions } from './gameActions'
import { tileset } from './sprites'

export interface LevelInitReturn {
  staticObjects: gameObject[]
  player: CharacterObject
  bounds: LevelBounds
  camera: Camera
  dynamicObjects: gameObject[]
}
export function levelInit(levelNumber: number, canvasHeight: number, canvasWidth: number): LevelInitReturn {

  let currentLevel: LevelJson



  switch (levelNumber) {
    case 1:
      currentLevel = { ...level1 }
      break
    default:
      currentLevel = { ...level1 }
      break
  }

  const objects: gameObject[] = buildObjects(currentLevel)
  const bounds = { x1: 0, y1: 0, x2: currentLevel.width * currentLevel.tilewidth, y2: currentLevel.height * currentLevel.tileheight }
  const camera: Camera = {
    x: 0,
    y: 0,
    height: canvasHeight,
    width: canvasWidth,
  }
  const levelWidth = currentLevel.width * currentLevel.tilewidth
  const levelHeight = currentLevel.height * currentLevel.tileheight

  const block = gameObjectFactory({ x: levelWidth - 400, y: levelHeight - (currentLevel.tileheight * 6), height: 50, width: 200, color: "#500", shape: "rectangle", })
  const platform = gameObjectFactory({
    x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 4), height: 50, width: 100, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1,
    positions: [
      { x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 4) },
      { x: (bounds.x2 / 8) + 300, y: bounds.y2 - (bounds.y2 / 4) },
      { x: (bounds.x2 / 8) + 300, y: bounds.y2 - (bounds.y2 / 2) },
    ]
  })
  const platform2 = gameObjectFactory({
    x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 8), height: 50, width: 200, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1,
    positions: [
      { x: (bounds.x2 / 8) + 600, y: bounds.y2 - currentLevel.tileheight * 9 },
      { x: (bounds.x2 / 8) + 1000, y: bounds.y2 - currentLevel.tileheight * 6 },
      { x: (bounds.x2 / 8) + 600, y: bounds.y2 - currentLevel.tileheight * 3 },
    ],
    cycleType: "reversing"
  })
  const wall = gameObjectFactory({ x: bounds.x2 / 8, y: bounds.y2 / 2, height: bounds.x2 / 6, width: 50, color: "#500", shape: "rectangle", collisions: { left: false } })


  const player = characterObjectFactory({ x: (bounds.x2 / 2) - 50, y: bounds.y1 + 50, height: 64, width: 64, shape: "sprite", sprite: "sprite", moveSpeed: 1, jumpForce: 3, weight: 0.5 })
  const dynamicObjects: gameObject[] = []

  dynamicObjects.push(platform)
  dynamicObjects.push(platform2)
  objects.push(block)
  objects.push(wall)
  return {
    staticObjects: objects,
    dynamicObjects: dynamicObjects,
    player: player,
    bounds: { x1: 0, y1: 0, x2: currentLevel.width * currentLevel.tilewidth, y2: currentLevel.height * currentLevel.tileheight },
    camera: camera
  }
}

export function levelRender(context: CanvasRenderingContext2D, delta: number, levelData: LevelInitReturn, cameraHeight: number, cameraWidth: number) {
  context.clearRect(levelData.bounds.x1, levelData.bounds.y1, levelData.bounds.x2 + 10, levelData.bounds.y2 + 10)

  handleControls(levelData.player)
  makeThingsMove(levelData.player, [...levelData.staticObjects, ...levelData.dynamicObjects], delta, levelData.bounds)
  // todo handle camera
  handleCamera(context, levelData.camera, levelData.player, levelData.bounds, delta) // todo fix stickyness

  levelData.staticObjects.forEach(object => {
    draw(context, object)
  })
  levelData.dynamicObjects.forEach(object => {
    draw(context, object)
  })
  if (levelData.player.gravityMultiplier === undefined) {
    context.scale(2, 2)
    context.fillText("press space to start", (levelData.bounds.x2 / 4) - 50, levelData.bounds.y2 / 10)
    context.scale(.5, .5)
  }
  draw(context, levelData.player)
}

function buildObjects(level: LevelJson) {
  const objects: gameObject[] = []
  for (let row = 0; row < level.height; row++) {
    for (let col
      = 0; col < level.width; col++) {
      const pos = (row * level.width) + col
      const arr = level.layers[0].data
      if (arr[pos] > 0) {
        const object = gameObjectFactory({
          x: col * level.tilewidth,
          y: row * level.tileheight,
          height: level.tileheight,
          width: level.tilewidth,
          collisions: true, // add prop in editor
          shape: "sprite",
          sprite: level.tilesets[0].name as "tileset", // todo make this more dynamic
          tileNum: arr[pos],
          tilesetData: level.tilesets[0]
        })
        objects.push(object)
      }
    }
  }
  return objects
}




// prabably should rename the file
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
  const camFractionsY = (camera.height / 4)
  const playerRight = player.x + player.width
  const playerBottom = player.y + player.height
  const cameraBottom = camera.y + camera.height
  const changeInX = (player.velocity.x * delta)
  const changeInY = (player.velocity.y * delta)

  // camera move right
  if (playerRight > cameraRight - camFractionsX && player.velocity.x > 0) {
    if (cameraRight + changeInX - 10 > bounds.x2) {
      camera.x = bounds.x2 - camera.width
    }
    else {
      camera.x = camera.x + changeInX// - gapLeft
      ctx.translate(-changeInX, 0)
    }
  }

  // camera move left
  if (player.x < camera.x + camFractionsX && player.velocity.x < 0) {

    if (camera.x + changeInX + 10 < bounds.x1) {
      camera.x = bounds.x1
    }
    else {
      camera.x = camera.x + changeInX
      ctx.translate(-changeInX, 0)
    }

  }

  // camera move up
  if (player.y < camera.y + camFractionsY && player.velocity.y < 0) {

    if (camera.y + changeInY + 10 < bounds.y1) {
      camera.y = bounds.y1
    }
    else {
      camera.y = camera.y + changeInY
      ctx.translate(0, -changeInY)
    }
  }

  // camera move down
  if (playerBottom > cameraBottom - camFractionsY && player.velocity.y > 0) {

    if (cameraBottom + changeInY - 10 > bounds.y2) {
      camera.y = bounds.y2 - camera.height
    }
    else {
      camera.y = camera.y + changeInY
      ctx.translate(0, -changeInY)
    }
  }

}
