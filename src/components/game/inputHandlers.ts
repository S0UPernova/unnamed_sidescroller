const handleKeyUp = (e: KeyboardEvent, obj: gameObject) => {
  switch (e.key) {
    case "ArrowUp":
      if (obj.velocity.y < 0) {
        obj.velocity.y = 0
      }
      break
    case "ArrowRight":
      if (obj.velocity.x > 0) {
        obj.velocity.x = 0
      }
      break
    case "ArrowDown":
      if (obj.velocity.y > 0) {
        obj.velocity.y = 0
      }
      break
    case "ArrowLeft":
      if (obj.velocity.x < 0) {
        obj.velocity.x = 0
      }
      break
  }
}

const handleKeyDown = (e: KeyboardEvent, obj: gameObject) => {
  switch (e.key) {
    case "ArrowUp":
      if (obj.velocity.y === 0) {
        obj.velocity.y = -3
      }
      break
    case "ArrowRight":
      obj.velocity.x = 1
      break
    case "ArrowDown":
      obj.velocity.y = 1
      break
    case "ArrowLeft":
      obj.velocity.x = -1
      break
  }
}

export {
  handleKeyDown,
  handleKeyUp
}