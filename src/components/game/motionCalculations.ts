export function calcGravity(velocity: { x: number, y: number, }, delta: number) {
  const gravity = 0.01
  const terminalVelocity = 1
  const speed = velocity.y + (gravity * delta)
  velocity.y = speed > terminalVelocity ? terminalVelocity : speed
}

export function calcMovement(obj: gameObject, bounds: { x: number, y: number }, delta: number, objects: gameObject[]) {
  // set initial values
  let newPos = {
    x: obj.x + (obj.velocity.x * delta),
    y: obj.y + (obj.velocity.y * delta)
  }
  checkBounds(newPos, obj, bounds)
  checkCollision(newPos, obj, objects)
  obj.x = newPos.x
  obj.y = newPos.y
}

function checkCollision(newPos: { x: number, y: number }, obj: gameObject, objects: gameObject[]): void {
  // objects.forEach(object => {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    // colliding top
    if (
      obj.velocity.y > 0
      && newPos.y + obj.height > object.y
      && newPos.y + obj.height < object.y + object.height
      && newPos.x + obj.width > object.x
      && newPos.x < object.x + object.width
    ) {
      obj.velocity.y = 0
      newPos.y = (object.y - obj.height)
    }
  }
  // return {
  //   x: newPos.x,
  //   y: newPos.y
  // }
  // obj.x = newPos.x
  // obj.y = newPos.y
}

function checkBounds(newPos: { x: number, y: number }, obj: gameObject, bounds: { x: number, y: number }): void {
  // too far to the right
  if (newPos.x + obj.width > bounds.x) {
    newPos.x = bounds.x - obj.width
  }

  // too far to the left
  if (newPos.x < 0) {
    newPos.x = 0
  }


  // too far down
  if (newPos.y + obj.height > bounds.y) {
    newPos.y = bounds.y - obj.height
    obj.velocity.y = 0
  }

  // too far up
  if (newPos.y < obj.height) {
    newPos.y = obj.height
  }

  // mutate the object
  // obj.x = newPos.x
  // obj.y = newPos.y
  // return {
  //   x: newPos.x,
  //   y: newPos.y
  // }
}