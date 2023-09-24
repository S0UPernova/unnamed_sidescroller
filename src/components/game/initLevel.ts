import { timingSafeEqual } from 'crypto'
import { Camera, CharacterObject, Collisions, CycleType, gameObject, hexString, LayerObject, CustomProps, Bounds, LevelJson, LevelLayer, TileSet, vec2d, WhereIs } from '../../types'
import { characterObjectFactory, gameObjectFactory } from './factories'
import * as level1 from './levels/level1.json'
import { Sprite, tileset, warewolf } from './sprites'

export interface LevelInitReturn {
  tiles: gameObject[]
  trees: gameObject[]
  player: CharacterObject
  bounds: Bounds
  camera: Camera
  platforms: gameObject[] // todo remove
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

  const { tiles, platforms, trees } = buildObjects(currentLevel)
  const bounds = { x1: 0, y1: 0, x2: currentLevel.width * currentLevel.tilewidth, y2: currentLevel.height * currentLevel.tileheight }

  const camera: Camera = {
    x: 0,
    y: 0,
    height: canvasHeight,
    width: canvasWidth,
  }

  const player = characterObjectFactory({ x: (bounds.x2 / 2) - 50, y: bounds.y1 + 50, height: 60, width: 60, shape: "animated", character: "warewolf",  moveSpeed: 1, jumpForce: 3, weight: 0.5, colisionBox: {offset: {x: 0, y: 20}, size: {x: 60, y: 40}} })

  return {
    tiles: tiles,
    platforms: platforms,
    trees,
    player: player,
    bounds: { x1: 0, y1: 0, x2: currentLevel.width * currentLevel.tilewidth, y2: currentLevel.height * currentLevel.tileheight },
    camera: camera
  }
}

function buildObjects(level: LevelJson) {
  const tiles: gameObject[] = []
  const platforms: gameObject[] = []
  const trees: gameObject[] = []
  // const trees: gameObject[] = [] //todo add this
  level.layers.forEach((layer: LevelLayer, layerNum: number) => {
    const isPlatform = layer.class //=== "platform"
    // const whereIs = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "where")?.value as WhereIs | undefined : undefined // todo use this for draw order
    // todo factor out these for loops to separate functions
    switch (layer.class) {
      case "platform": {
        if (layer.objects === undefined) return tiles
        const object = platformFactory(layer)
        if (object !== undefined) platforms.push(object)
        break
      }
      case "background":
      case "midground": {
        tileFactory(level, layerNum).forEach(obj => tiles.push(obj))
      }
        break
      case "trees": {
        treeFactory(level, layerNum).forEach(tree => trees.push(tree))
      }
    }

    // todo add section for tree layer (should be an object layer)
  })
  return {
    tiles: tiles,
    trees: trees,
    platforms: platforms,
    // todo add trees, and any other things that will be needed
  }
}

function platformFactory(layer: LevelLayer): gameObject | undefined {

  if (layer.objects === undefined) return undefined
  const platformArr: vec2d[] = []
  const color = layer.properties !== undefined ? layer.properties.find(tileset => tileset.name === "color")?.value as hexString | undefined : undefined// maybe add a regex check
  const moveSpeed = layer.properties !== undefined ? layer.properties.find(tileset => tileset.name === "moveSpeed")?.value as unknown : undefined
  layer.objects?.forEach((obj: LayerObject, i: number) => {
    platformArr.push({ x: obj.x, y: obj.y })
  })

  return gameObjectFactory({
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
}

function tileFactory(level: LevelJson, layerNum: number): gameObject[] {
  const layer = level.layers[layerNum]

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
  const objects: gameObject[] = []
  if (layer?.data) {
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
          // tileRow: whereIs === 'foreground' ? row : undefined,
          sprite: layerSprite, // todo make this more dynamic
          tileArr: [numberAtTile],
          tilesetData: level.tilesets.find(tileset => layerSprite !== undefined ? layerSprite : undefined) as TileSet | undefined
        })
        objects.push(object)
      }
    }
  }
  return objects
}

function treeFactory(level: LevelJson, layerNum: number): gameObject[] {
  const layer = level.layers[layerNum]
  if (layer.objects === undefined) return []
  
  const trees: gameObject[] = []
  
  layer.objects.forEach(obj => {
    const layerSprite = obj.properties !== undefined ? obj.properties.find(prop => prop.name === "tileset")?.value as Sprite | undefined : undefined
    const _tileArr = obj.properties !== undefined ? obj.properties.find(prop => prop.name === "tileArr")?.value as string | undefined : undefined
    const tileArr = _tileArr !== undefined ? JSON.parse(_tileArr) : undefined
    const object = gameObjectFactory({
      x: obj.x,
      y: obj.y,
      height: obj.height,
      width: obj.width,
      collisions: false, // add prop in editor
      shape: "tileArr",
      sprite: layerSprite, // todo make this more dynamic
      tileArr: tileArr,
      tilesetData: level.tilesets.find(tileset => layerSprite !== undefined ? layerSprite : undefined) as TileSet | undefined
    })
    trees.push(object)
  })
  // const layerSprite = layer.properties !== undefined ? layer.properties.find(prop => prop.name === "tileset")?.value as Sprite | undefined : undefined
return trees
}