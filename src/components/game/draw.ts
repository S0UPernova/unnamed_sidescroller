import { time } from "console"
import { run } from "node:test"
import { CharacterAnimationMap, gameObject } from "../../types"
import { levelInit } from "./initLevel"
import { tileset } from "./sprites"


export function draw(ctx: CanvasRenderingContext2D, obj: gameObject, delta?: number): void {
  switch (obj.shape) {
    case "ellipse": {
      ctx.beginPath()
      ctx.ellipse(obj.x, obj.y, obj.width, obj.height, 0, 0, 2 * Math.PI)
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
      // todo Add dev mode option for showing bounding boxes
      // ctx.fillStyle = 'rgba(60, 0, 60, 0.3)'
      // ctx.fillRect(obj.x, obj.y, obj.width, obj.height)

      // todo Add dev mode option for showing collision boxes
      // ctx.fillStyle = 'rgba(60, 0, 0, 0.5)'
      // ctx.fillRect(obj.collisionBox.x1, obj.collisionBox.y1, obj.collisionBox.size.x, obj.collisionBox.size.y)

      drawAnimatedSprite(ctx, obj, delta !== undefined ? delta : 0)
      break
  }
}

function drawAnimatedSprite(ctx: CanvasRenderingContext2D, obj: gameObject, delta: number) {
  if (obj.currentAnimation !== undefined && obj.actionToAnimationMap !== undefined && obj.animations !== undefined && obj?.animations?.[obj.currentAnimation] !== undefined) {
    if (obj.velocity.y === 0 && obj.velocity.x === 0 && obj.currentAnimation === "jump") {
      obj.currentAnimation = "idle"
    }

    // if (obj.animations[obj.currentAnimation].nextAnimation !== undefined && obj.animations[obj.currentAnimation].loopAnimation === false && obj.animations[obj.currentAnimation].currentFrame >= obj.animations[obj.currentAnimation].frames -1) {
      // obj.animations[obj.currentAnimation].currentFrame = 0
      // obj.currentAnimation = obj.animations[obj.currentAnimation].nextAnimation as keyof CharacterAnimationMap
    // }

    const currentAnimation = obj.animations[obj.currentAnimation]
    if (currentAnimation.timeSinceLastFrameUpdate === undefined || currentAnimation.timeSinceLastFrameUpdate < 0) currentAnimation.timeSinceLastFrameUpdate = 0
    if (currentAnimation.currentFrame === undefined) currentAnimation.currentFrame = 0
    if (delta) {
      currentAnimation.timeSinceLastFrameUpdate += delta
    }
    const threshold = 1000 / currentAnimation.framesPerSecond
    const timeElapsed = currentAnimation.timeSinceLastFrameUpdate
    if (timeElapsed >= threshold) {
      const nextFrameAtEnd = currentAnimation.loopAnimation ? 0 : currentAnimation.frames - 1
      currentAnimation.currentFrame + 1 >= currentAnimation.frames ? currentAnimation.currentFrame = nextFrameAtEnd : currentAnimation.currentFrame++
      currentAnimation.timeSinceLastFrameUpdate = 0
    }
    // const offset =  > threshold
    if (obj.lastDirRight === false) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(
        currentAnimation.image,
        (currentAnimation.image.width / currentAnimation.frames) * currentAnimation.currentFrame,
        0,
        currentAnimation.image.width / currentAnimation.frames,
        currentAnimation.image.height,
        -obj.x - obj.width,
        obj.y,
        obj.width,
        obj.height,
      )
      ctx.restore()
    }
    else if (currentAnimation.image) {
      ctx.drawImage(
        currentAnimation.image,
        (currentAnimation.image.width / currentAnimation.frames) * currentAnimation.currentFrame,
        0,
        currentAnimation.image.width / currentAnimation.frames,
        currentAnimation.image.height,
        obj.x,
        obj.y,
        obj.width,
        obj.height,
      )
    }
  }
}