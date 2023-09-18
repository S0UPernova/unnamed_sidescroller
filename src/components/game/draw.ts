import { gameObject } from "../../types"
import { levelInit } from "./initLevel"
import { tileset } from "./sprites"


export function draw(ctx: CanvasRenderingContext2D, obj: gameObject): void {
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
            obj.sprite,
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
            obj.sprite,
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
            obj.sprite,
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
  }
}