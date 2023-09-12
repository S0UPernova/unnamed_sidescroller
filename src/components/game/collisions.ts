export function checkObjectCollisions(object1: gameObject, objects: gameObject[], delta: number): void {
  objects.forEach(object2 => {
    checkForAnObjectCollision(object1, object2, delta)
  })
}

export function checkForAnObjectCollision(object1: gameObject, object2: gameObject, delta: number) {
  let newPos1 = {
    x: object1.x + (object1.velocity.x * delta),
    y: object1.y + (object1.velocity.y * delta)
  }
  let newPos2 = {
    x: object2.x + (object2.velocity.x * delta),
    y: object2.y + (object2.velocity.y * delta)
  }
  // colliding top
  if (object2.collisions.top && isCollidingTop(object1, object1, object2)) {
    object1.velocity.y = 0
    // stops object from going through
    object1.y = (object2.y - object1.height)

    // allows object on platform to move with platform
    if (object2.velocity.x !== 0) {
      const val = ( newPos2.x - object2.x)
      object1.x = object1.x + val
    }
    return
  }

  // colliding bottom
  if (object2.collisions.bottom && isCollidingBottom(object1, object1, object2)) {
    object1.velocity.y = -0.0001 // not significant and !== to 0 for a check elsewhere
    object1.y = object2.y + object2.height //- object1.height
    return
  }

  // colliding right
  if (object2.collisions.right && isCollidingRight(object1, object1, object2)) {
    const weight1 = object1.weight ? object1.weight : 0
    const weight2 = object2.weight ? object2.weight : 0
    if (weight1 > weight2) {
      object2.velocity.x = 0//object1.velocity.x
      object2.x = newPos1.x

    }
    else if (weight1 < weight2) {
      object1.velocity.x = 0//object2.velocity.x
      object1.x = newPos2.x + object2.width //- object1.height

    }
    return
  }

  // colliding left
  if (object2.collisions.left && isCollidingLeft(object1, object1, object2)) {
    object1.velocity.x = 0
    object1.x = (object2.x - object1.width)
    return
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
    (object1.velocity.x < 0 || object2.velocity.x > 0) && isColliding(newPos, object1, object2)
    && newPos.x > object2.x + object2.width - (object1.width / 4)
    && newPos.x + object1.width > object2.x + object2.width - (object1.width / 4)
  )
}


export function checkBoundsCollision(obj: gameObject, bounds: LevelBounds): void {
  const borderPadding = 15
  // too far to the right
  if (obj.x + obj.width > bounds.x2 - borderPadding) {
    obj.x = bounds.x2 - obj.width - borderPadding
  }

  // too far to the left
  if (obj.x <= bounds.x1 + borderPadding) {
    obj.x = bounds.x1 + borderPadding
  }

  // too far down
  if (obj.y + obj.height > bounds.y2) {
    obj.y = bounds.y2 - obj.height
    obj.velocity.y = 0
  }

  // too far up
  if (obj.y < bounds.y1) {
    obj.y = bounds.y1
  }
}