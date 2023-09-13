import { makeThingsMove, handleCamera } from "./motion"
import { draw } from './draw'
import { characterObjectFactory, gameObjectFactory } from './factories'
import { handleControls } from './inputHandlers'
import { LevelInitReturn } from "./initLevel"
// import * as level1 from './levels/level1.json'




export function levelRender(context: CanvasRenderingContext2D, delta: number, levelData: LevelInitReturn) {
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
    context.scale(4, 4)
    context.fillStyle = "#aaa"
    context.fillText("press space to start", (levelData.bounds.x2 / 12) - 50, levelData.bounds.y2 / 20)
    context.scale(.25, .25)
  }
  draw(context, levelData.player)
}





