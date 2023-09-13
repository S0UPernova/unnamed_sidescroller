

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
            const col = obj.tileNum % obj.tilesetData.columns -1
            const row = Math.floor(obj.tileNum / obj.tilesetData?.columns)
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
  }
}





