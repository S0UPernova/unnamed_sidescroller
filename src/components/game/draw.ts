import { gameObject } from "../../types"
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
        if (obj.tilesetData === undefined || obj.tileNum === undefined) {

          ctx.drawImage(
            obj.sprite,
            obj.x,
            obj.y,
            obj.width,
            obj.width,
          )
        }
        else {
          if (obj.tileNum === undefined || obj.tileNum === 0) return
          //! minus ones here because 0 show a lack of value, but spritesheet math starts at 0
          const col = (obj.tileNum - 1) % (obj.tilesetData.columns)
          const row = Math.floor((obj.tileNum - 1) / obj.tilesetData?.columns)

          if (obj.tileNum === 18) console.log(`row: ${row}, col: ${col}, corrected: ${(9 * row)}`)
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
  }
}