

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
        
        ctx.drawImage(
          obj.sprite,
          obj.x,
          obj.y,
          obj.width,
          obj.width
          
          );

      }
      break
  }
}





