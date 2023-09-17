import { makeThingsMove, handleCamera } from "./motion"
import { draw } from './draw'
import { handleControls } from './inputHandlers'
import { LevelInitReturn } from "./initLevel"

export function levelRender(context: CanvasRenderingContext2D, delta: number, levelData: LevelInitReturn) {
  context.clearRect(levelData.bounds.x1, levelData.bounds.y1, levelData.bounds.x2 + 10, levelData.bounds.y2 + 10)

  handleControls(levelData.player)
  makeThingsMove(levelData.player, [...levelData.staticObjects, ...levelData.dynamicObjects], delta, levelData.bounds)
  handleCamera(context, levelData.camera, levelData.player, levelData.bounds, delta) // todo fix stickyness
  // todo get depth check for trees to work so that player can be on either side of the treeS
  // const renderQueue: gameObject[] = []
  // todo get this to not be hard coded
  // const tileHeight: number = 64
  // const playerY = Math.ceil(levelData.player.y + levelData.player.height / tileHeight)
  levelData.staticObjects.forEach(object => {
    // if (object.tileRow !== undefined && playerY < object.y / tileHeight) {
    //   renderQueue.push(object)
    // }
    // else {
      draw(context, object)
    // }
  })
  // levelData.dynamicObjects.forEach(object => {
  //   draw(context, object)
  // })
  if (levelData.player.gravityMultiplier === undefined) {
    context.scale(4, 4)
    context.fillStyle = "#aaa"
    context.fillText("press space to start", (levelData.bounds.x2 / 12) - 50, levelData.bounds.y2 / 20)
    context.scale(.25, .25)
  }
  draw(context, levelData.player)
  // renderQueue.forEach(obj => {
  //   draw(context, obj)
  // })
}