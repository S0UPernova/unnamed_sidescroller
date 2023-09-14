import { Camera, CharacterObject, Collisions, gameObject, LayerProps, LevelBounds, LevelJson, LevelLayer, TileSet, WhereIs } from '../../types'
import { characterObjectFactory, gameObjectFactory } from './factories'
import * as level1 from './levels/level1.json'
import { Sprite } from './sprites'

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


  // console.log(movingBlock)
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
    if (!layer.properties) return
    const layerSprite = layer.properties.find(tileset => tileset.name === "tileset")?.value as Sprite | undefined
    const collisions = layer.properties.find(tileset => tileset.name === "collisions")?.value as Collisions | undefined
    // const whereIs = layer.properties.find(tileset => tileset.name === "where")?.value as WhereIs | undefined  // todo use this for draw order
    for (let row = 0; row < level.height; row++) {
      for (let col = 0; col < level.width; col++) {
        const pos = (row * level.width) + col
        const arr = layer.data
        if (arr[pos] > 0) {
          const object = gameObjectFactory({
            x: col * level.tilewidth,
            y: row * level.tileheight,
            height: level.tileheight,
            width: level.tilewidth,
            collisions: collisions, // add prop in editor
            shape: "sprite",
            sprite: layerSprite, // todo make this more dynamic
            tileNum: arr[pos],
            tilesetData: level.tilesets.find(tileset => layerSprite !== undefined) as TileSet
          })
          objects.push(object)
        }
      }
    }
  })
  return objects
}