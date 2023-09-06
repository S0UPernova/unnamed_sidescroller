export function checkObjectCollisions(newPos: { x: number, y: number }, object1: gameObject, objects: gameObject[]): void {
  objects.forEach(object2 => {
    checkForAnObjectCollision(newPos, object1, object2)
  })
}

export function checkForAnObjectCollision(newPos: vec2d, object1: gameObject, object2: gameObject) {
// colliding top
if (object2.collisions.top && isCollidingTop(newPos, object1, object2)) {
  object1.velocity.y = 0
  newPos.y = (object2.y - object1.height)
  return
  // break
}

// colliding bottom
if (object2.collisions.bottom && isCollidingBottom(newPos, object1, object2)) {
  object1.velocity.y = 0
  newPos.y = object2.y + object2.height //- object1.height
  return
  // break
}

// colliding right
if (object2.collisions.right && isCollidingRight(newPos, object1, object2)) {
  object1.velocity.x = 0
  newPos.x = object2.x + object2.width //- object1.height
  return
  // break
}

// colliding left
if (object2.collisions.left && isCollidingLeft(newPos, object1, object2)) {
  object1.velocity.x = 0
  newPos.x = (object2.x - object1.width)
  return
  // break
}
}

/**
 * 
 * @param {{x: number, y: number}} newPos
 * @param {gameObject} object1 
 * @param {gameObject} object2 
 * @returns {boolean} 
 */
export function isColliding(newPos: { x: number, y: number }, object1: gameObject, object2: gameObject): boolean {
  return (
    newPos.y + object1.height > object2.y
    && newPos.y < object2.y + object2.height

    && newPos.x + object1.width > object2.x
    && newPos.x < object2.x + object2.width)
}

function isCollidingTop(newPos: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    object1.velocity.y > 0 && isColliding(newPos, object1, object2)
    && newPos.y + object1.height < object2.y + (object1.height / 4)
    && newPos.y + object1.height < object2.y + object2.height - (object1.height / 4)
  )
}

function isCollidingBottom(newPos: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    object1.velocity.y < 0 && isColliding(newPos, object1, object2)
    && newPos.y < object2.y + object2.height - (object1.height / 4)
    && newPos.y + object1.height > object2.y + object2.height - (object1.height / 4)
  )
}

function isCollidingLeft(newPos: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    object1.velocity.x > 0 && isColliding(newPos, object1, object2)
    && newPos.x + object1.width < object2.x + (object1.width / 4)
    && newPos.x + object1.width < object2.x + object2.width - (object1.width / 4)
  )
}

function isCollidingRight(newPos: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    object1.velocity.x < 0 && isColliding(newPos, object1, object2)
    && newPos.x > object2.x + object2.width - (object1.width / 4)
    && newPos.x + object1.width > object2.x + object2.width - (object1.width / 4)
  )
}


export function checkBoundsCollision(newPos: { x: number, y: number }, obj: gameObject, bounds: { x: number, y: number }): void {
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
}