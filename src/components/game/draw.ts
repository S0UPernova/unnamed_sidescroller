import { time } from "console"
import { run } from "node:test"
import { gameObject } from "../../types"
import { levelInit } from "./initLevel"
import { tileset } from "./sprites"


export function draw(ctx: CanvasRenderingContext2D, obj: gameObject, delta?: number): void {
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
        if (obj.tilesetData === undefined || obj.tileArr === undefined) {
          ctx.drawImage(
            obj.sprite.image,
            obj.x,
            obj.y,
            obj.width,
            obj.width,
          )
        }
        else {
          if (obj.tileArr === undefined || obj.tileArr[0] === 0) return
          //! minus ones here because 0 show a lack of value, but spritesheet math starts at 0
          const col = (obj.tileArr[0] - 1) % (obj.tilesetData.columns)
          const row = Math.floor((obj.tileArr[0] - 1) / obj.tilesetData?.columns)

          ctx.drawImage(
            obj.sprite.image,
            col * obj.tilesetData.tilewidth,
            row * obj.tilesetData.tileheight,
            obj.tilesetData.tilewidth,
            obj.tilesetData.tileheight,
            obj.x,
            obj.y,
            obj.tilesetData.tilewidth,
            obj.tilesetData.tileheight,
          )
        }
      }
      break
    case "tileArr":
      obj.tileArr?.forEach((num, i) => {
        if (obj.sprite !== undefined && obj.tileArr !== undefined && obj.tilesetData !== undefined) {
          const objWidth = Math.floor(obj.width / obj.tilesetData.tilewidth)
          const col = (num - 1) % (obj.tilesetData.columns)
          const row = Math.floor((num - 1) / obj.tilesetData.columns)

          const treeCol = (i) % (objWidth)
          const treeRow = Math.floor(i / objWidth)

          ctx.drawImage(
            obj.sprite.image,
            col * obj.tilesetData.tilewidth,
            row * obj.tilesetData.tileheight,
            obj.tilesetData.tilewidth,
            obj.tilesetData.tileheight,
            obj.x + (treeCol * obj.tilesetData.tilewidth),
            obj.y + (treeRow * obj.tilesetData.tileheight),
            obj.tilesetData.tilewidth,
            obj.tilesetData.tileheight,
          )
        }
      })
      break
    case "animated":
      
      if (obj.idleAnimation !== undefined && obj.actionToAnimationMap !== undefined && obj.animations !== undefined) {
        if (obj.velocity.x !== 0) {
          obj.currentAnimation = obj.animations["run"]
        }
        else {
          obj.currentAnimation = obj.idleAnimation
        }
        // if (obj.tilesetData === undefined || obj.tileArr === undefined) {
        if (obj.currentAnimation.timeSinceLastFrameUpdate === undefined) obj.currentAnimation.timeSinceLastFrameUpdate = 0
        if (obj.currentAnimation.currentFrame === undefined) obj.currentAnimation.currentFrame = 0
        if (delta) {
          obj.currentAnimation.timeSinceLastFrameUpdate += delta
        }
        const threshold = 1000 / obj.currentAnimation.framesPerSecond
        const timeElapsed = obj.currentAnimation.timeSinceLastFrameUpdate
        if (timeElapsed >= threshold) {
          obj.currentAnimation.currentFrame + 1 >= obj.currentAnimation.frames ? obj.currentAnimation.currentFrame = 0 : obj.currentAnimation.currentFrame++
          obj.currentAnimation.timeSinceLastFrameUpdate = 0
        }
        // const offset =  > threshold
        if (obj.lastDirRight === false) {
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(
            obj.currentAnimation.image,
            (obj.currentAnimation.image.width / obj.currentAnimation.frames) * obj.currentAnimation.currentFrame,
            0,
            obj.currentAnimation.image.width / obj.currentAnimation.frames,
            obj.currentAnimation.image.height,
            -obj.x - obj.width,
            obj.y,
            obj.width,
            obj.height,
          )
          ctx.restore()
        }
        else if (obj.currentAnimation.image){
          ctx.drawImage(
            obj.currentAnimation.image,
            (obj.currentAnimation.image.width / obj.currentAnimation.frames) * obj.currentAnimation.currentFrame,
            0,
            obj.currentAnimation.image.width / obj.currentAnimation.frames,
            obj.currentAnimation.image.height,
            obj.x,
            obj.y,
            obj.width,
            obj.height,
          )
        }
      }
      break
  }
}