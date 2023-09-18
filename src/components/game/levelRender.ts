import { makeThingsMove, handleCamera } from "./motion"
import { draw } from './draw'
import { handleControls } from './inputHandlers'
import { LevelInitReturn } from "./initLevel"
import { gameObject } from "../../types"

export function levelRender(context: CanvasRenderingContext2D, delta: number, levelData: LevelInitReturn) {
  context.clearRect(levelData.bounds.x1, levelData.bounds.y1, levelData.bounds.x2 + 10, levelData.bounds.y2 + 10)
  const drawAfterPlayer: gameObject[] = []

  handleControls(levelData.player)
  makeThingsMove(levelData.player, [...levelData.tiles, ...levelData.platforms], delta, levelData.bounds)
  handleCamera(context, levelData.camera, levelData.player, levelData.bounds, delta) // todo fix stickyness

  levelData.tiles.forEach(object => {
    draw(context, object)
  })
  
  levelData.platforms.forEach(object => {
    draw(context, object)
  })

  
  levelData.trees.forEach(object => {
    if ( levelData.player.y + levelData.player.height < object.y + object.height) {
      drawAfterPlayer.push(object)
    }
    else {
      draw(context, object)
    }
  })

  if (levelData.player.gravityMultiplier === undefined) {
    context.scale(4, 4)
    context.fillStyle = "#aaa"
    context.fillText("press space to start", (levelData.bounds.x2 / 12) - 50, levelData.bounds.y2 / 20)
    context.scale(.25, .25)
  }

  draw(context, levelData.player)
  drawAfterPlayer.forEach(obj => {
    draw(context, obj)
  })
}