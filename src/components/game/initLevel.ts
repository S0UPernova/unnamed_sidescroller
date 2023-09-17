import { Camera, CharacterObject, Collisions, CycleType, gameObject, hexString, LayerObject, LayerProps, LevelBounds, LevelJson, LevelLayer, TileSet, vec2d, WhereIs } from '../../types'
import { characterObjectFactory, gameObjectFactory } from './factories'
import * as level1 from './levels/level1.json'
import { Sprite, tileset } from './sprites'

export interface LevelInitReturn {
  staticObjects: gameObject[]
  player: CharacterObject
  bounds: LevelBounds
  camera: Camera
  dynamicObjects: gameObject[] // todo remove
}
export function levelInit(levelNumber: number, canvasHeight: number, canvasWidth: number): LevelInitReturn {
  let currentLevel: LevelJson

  switch (levelNumber) {
    case 1:
      currentLevel = level1
      break
    default:
      currentLevel = level1
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


  // todo remove these, and get moving platforms to come from tiled as well
  // const block = gameObjectFactory({ x: levelWidth - (currentLevel.tilewidth * 8), y: levelHeight - (currentLevel.tileheight * 6), height: currentLevel.tileheight, width: currentLevel.tilewidth * 4, color: "#500", shape: "rectangle", })
  // const platform = gameObjectFactory({ x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 4), height: 50, width: 100, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1, positions: [{ x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 4) }, { x: (bounds.x2 / 8) + 300, y: bounds.y2 - (bounds.y2 / 4) }, { x: (bounds.x2 / 8) + 300, y: bounds.y2 - (bounds.y2 / 2) },] })
  // const platform2 = gameObjectFactory({ x: (bounds.x2 / 8) + 600, y: bounds.y2 - (bounds.y2 / 8), height: 50, width: 200, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1, positions: [{ x: (bounds.x2 / 8) + 600, y: bounds.y2 - currentLevel.tileheight * 9 }, { x: (bounds.x2 / 8) + 1000, y: bounds.y2 - currentLevel.tileheight * 6 }, { x: (bounds.x2 / 8) + 600, y: bounds.y2 - currentLevel.tileheight * 3 },], cycleType: "reversing" })
  // const movingBlock = gameObjectFactory({ x: currentLevel.tilewidth * 16, y: bounds.y2 - (currentLevel.tileheight * 4), height: currentLevel.tileheight * 2, width: currentLevel.tilewidth * 4, color: "#005", shape: "rectangle", moveSpeed: 0.1, weight: .25 })
  // const wall = gameObjectFactory({ x: bounds.x2 / 8, y: bounds.y2 / 2, height: bounds.x2 / 6, width: currentLevel.tilewidth, color: "#500", shape: "rectangle", collisions: { left: false } })


  const player = characterObjectFactory({ x: (bounds.x2 / 2) - 50, y: bounds.y1 + 50, height: 60, width: 60, shape: "sprite", sprite: "sprite", moveSpeed: 1, jumpForce: 3, weight: 0.5 })
  const dynamicObjects: gameObject[] = []

  // dynamicObjects.push(platform)
  // dynamicObjects.push(platform2)
  // dynamicObjects.push(movingBlock)
  // objects.push(block)
  // objects.push(wall)
  return {
    staticObjects: objects,
    dynamicObjects: dynamicObjects,
    player: player,
    bounds: { x1: 0, y1: 0, x2: currentLevel.width * currentLevel.tilewidth, y2: currentLevel.height * currentLevel.tileheight },
    camera: camera
  }
}

function buildObjects(level: LevelJson) {
  const objects: gameObject[] = []
  level.layers.forEach((layer: LevelLayer, layerNum: number) => {
    // if (!layer.properties) return
    // todo finish implementing this (thinking of using tile numbers as positions in the path with their number relating to the sequence)
    // width sould be in tiles
    const isPlatform = layer.class === "platform"
    const platformArr: vec2d[] = []
    const layerSprite = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "tileset")?.value as Sprite | undefined : undefined
    const hasCollisions = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "collisions")?.value as boolean | undefined : undefined
    const collideTop = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "collisionTop")?.value as boolean | undefined : undefined
    const collideBottom = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "collisionBottom")?.value as boolean | undefined : undefined
    const collideLeft = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "collisionLeft")?.value as boolean | undefined : undefined
    const collideRight = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "collisionRight")?.value as boolean | undefined : undefined
    const collisions = hasCollisions !== undefined ? hasCollisions : {
      top: collideTop, // true by default
      bottom: collideBottom, // true by default
      left: collideLeft, // true by default
      right: collideRight, // true by default
    }
    const whereIs = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "where")?.value as WhereIs | undefined : undefined // todo use this for draw order
    // todo factor out these for loops to separate functions
    if (!isPlatform) { // add specific check for certain things
      for (let row = 0; row < level.height; row++) {
        for (let col = 0; col < level.width; col++) {
          const pos = (row * level.width) + col
          const numberAtTile = layer.data[pos]
          if (numberAtTile === 0) continue
          const object = gameObjectFactory({
            x: col * level.tilewidth,
            y: row * level.tileheight,
            height: level.tileheight,
            width: level.tilewidth,
            collisions: collisions, // add prop in editor
            shape: "sprite",
            tileRow: whereIs === 'foreground' ? row : undefined,
            sprite: layerSprite, // todo make this more dynamic
            tileNum: numberAtTile,
            tilesetData: level.tilesets.find(tileset => layerSprite !== undefined ? layerSprite : undefined) as TileSet | undefined
          })
          objects.push(object)
        }
      }
    }
    if (isPlatform) {
      if (layer.objects === undefined) return objects
      // const width = layer.properties.find(tileset => tileset.name === "width")?.value as unknown
      // const height = layer.properties.find(tileset => tileset.name === "height")?.value as unknown
      const color = layer.properties !== undefined ? layer.properties.find(tileset => tileset.name === "color")?.value as hexString | undefined : undefined// maybe add a regex check
      const moveSpeed = layer.properties !== undefined ? layer.properties.find(tileset => tileset.name === "moveSpeed")?.value as unknown : undefined
      layer.objects?.forEach((obj: LayerObject, i: number) => {
        platformArr.push({ x: obj.x, y: obj.y })
      })

      const object = gameObjectFactory({
        x: platformArr[0].x,
        y: platformArr[0].y,
        height: layer.objects[0].height,
        width: layer.objects[0].width,
        collisions: { bottom: false }, // add prop in editor
        shape: "rectangle",
        color: color !== undefined ? color : "#00a",
        positions: platformArr,
        moveSpeed: moveSpeed !== undefined && typeof moveSpeed === 'number' ? moveSpeed : .25
      })
      objects.push(object)
    }
  })
  return objects
}