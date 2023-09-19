import { BlobOptions } from "buffer"
import { ExecFileOptionsWithStringEncoding } from "child_process"
import { Characters, Sprite } from "./components/game/sprites"

// todo make separate dynamic gameObject
type gameObject = {
  x: number,
  y: number,
  width: number,
  height: number,
  weight?: number
  color?: hexString
  shape: Shape
  collisions: Collisions
  lastDirRight: boolean
  

  moveSpeed: number
  velocity: { x: number, y: number },
  positionInCycle?: number
  positions?: vec2d[]
  cycleDirForward?: boolean
  cycleType?: CycleType
  tileRow?: number
  sprite: AnimatedSprite | undefined
  currentAnimation?: keyof CharacterAnimationMap
  idleAnimation?:  AnimatedSprite
  animations?: CharacterAnimationMap
  actionToAnimationMap?: ActionToAnimationMap
  tileArr?: number[]
  tilesetData?: TileSet
}

type CycleType = "circular" | "reversing"


type CharacterAnimationMap = {
  idle: AnimatedSprite,
  run: AnimatedSprite
}
type keys = keyof typeof CharacterActionMap
// type ActionToAnimationMap = {
//   [key: (keys | string)]: keyof WarewolfAnimationMap
// }

type Camera = {
  x: number
  y: number
  height: number
  width: number
}

type LevelBounds = {
  x1: number
  y1: number
  x2: number
  y2: number
}

type CharacterObject = gameObject & {
  jumpForce?: number
  gravityMultiplier?: number

}

type AnimatedSprite = {
  frames: number
  framesPerSecond: number
  timeSinceLastFrameUpdate: number
  currentFrame: number
  image: HTMLImageElement
}

type ActionToAnimationMap = {
  [key: CharacterActions]: keyof CharacterAnimationMap
}

type Collisions = {
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}
type Controls = {
  [key: string]: keyof CharacterActions
}

type vec2d = {
  x: number, y: number
}
type CharacterActions = {
  jump: CharacterAction
  crouch: CharacterAction
  moveRight: CharacterAction
  moveLeft: CharacterAction
  enableGravity: CharacterAction
} & gameObjectAction

type CharacterAction = (obj: gameObject, keyDown: boolean) => void
type gameObjectAction = (obj: gameObject) => void

type gameObjectActions = {
  stopX: gameObjectAction
  stopY: gameObjectAction
}

type hexString = `#${string}`

type Shape = "ellipse" | "rectangle" | "sprite" | "tileArr" | "animated"

type TileSet = {
  "columns": number,
  "firstgid": number,
  "image": string,
  "imageheight": number,
  "imagewidth": number,
  "margin": number,
  "name": string,
  "spacing": number,
  "tilecount": number,
  "tileheight": number,
  "tilewidth": number
}

type WhereIs = "backgound" | "midground" | "foreground"

type CustomProps = {
  "name": string
  "type": string
  "value": string | boolean | number
}

type LayerObject = {
  "height": number,
  "id": number,
  "name": string,
  "rotation": number,
  "type": string,
  "visible": boolean,
  "width": number,
  "x": number,
  "y": number,
  "properties"?: CustomProps[]
}

type LevelLayer = {
  "class"?: string
  "data"?: number[],
  "height"?: number,
  "id": number,
  "name": string,
  "opacity": number,
  "type": string,
  "visible": boolean,
  "width"?: number,
  "x": number,
  "y": number,
  "properties"?: CustomProps[]
  "objects"?: LayerObject[]
}


type LevelJson = {
  "class"?: string,
  "compressionlevel": number,
  "height": number,
  "infinite": boolean,
  "layers": LevelLayer[],
  "nextlayerid": number,
  "nextobjectid": number,
  "orientation": string, // TODO add the other options for this
  "renderorder": string, // TODO add the other options for this
  "tiledversion": string,
  "tileheight": number,
  "tilesets": TileSet[],
  "tilewidth": number,
  "type": string, // TODO add the other options for this
  "version": string,
  "width": number
}