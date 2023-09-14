import { gameObject, LevelBounds, vec2d } from "../../types"

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

  const isHittingTop = isCollidingTop(newPos1, newPos2, object1, object2)
  const isHittingBottom = isCollidingBottom(newPos1, newPos2, object1, object2)
  const isHittingLeft = isCollidingLeft(newPos1, newPos2, object1, object2)
  const isHittingRight = isCollidingRight(newPos1, newPos2, object1, object2)

  // colliding top
  if (object2.collisions.top && isHittingTop) {

    object1.velocity.y = 0
    // stops object from going through
    object1.y = (object2.y - object1.height)
    // allows object on platform to move with platform
    if (object2.velocity.x !== 0) {
      const val = (newPos2.x - object2.x)
      object1.x = object1.x + val
    }
    return
  }

  // colliding right
  else if (object2.collisions.right && isHittingRight) {
    // todo add weighted interaction, needs to take into account object2 collisions on the oposite side

    const weight1 = object1.weight ? object1.weight : 0
    const weight2 = object2.weight ? object2.weight : 0
    if (weight1 > weight2) {
      object2.velocity.x = 0
      object2.x = newPos1.x - object2.width
    }
    else if (weight1 < weight2) {
    object1.velocity.x = 0//object2.velocity.x
    object1.x = newPos2.x + object2.width //- object1.height
    }
  }

  // colliding left
  else if (object2.collisions.left && isHittingLeft) {
    // todo add weighted interaction, needs to take into account object2 collisions on the oposite side

    const weight1 = object1.weight ? object1.weight : 0
    const weight2 = object2.weight ? object2.weight : 0
    if (weight1 > weight2) {
      object2.velocity.x = 0
      object2.x = newPos1.x + object1.width
    }
    else if (weight1 < weight2) {
    object1.velocity.x = 0
    object1.x = (newPos2.x - object1.width)
    }
  }

  // colliding bottom
  else if (object2.collisions.bottom && isHittingBottom) {
    object1.velocity.y = -0.0001 // not significant and !== to 0 for a check elsewhere
    object1.y = object2.y + object2.height //- object1.height
    return
  }


}


/**
 * 
 * @param {{x: number, y: number}} newPos1
 * @param {gameObject} object1 
 * @param {gameObject} object2 
 * @returns {boolean} 
 */
export function isColliding(newPos1: vec2d, newPos2: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    Math.floor(object1.y + object1.height) > Math.floor(object2.y)
    && Math.floor(object1.y) < Math.floor(object2.y + object2.height)

    && Math.floor(object1.x + object1.width) > Math.floor(object2.x)
    && Math.floor(object1.x) < Math.floor(object2.x + object2.width))
}

function isCollidingTop(newPos1: vec2d, newPos2: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    (object1.velocity.y > 0 || object2.velocity.y < 0)
    && isColliding(newPos1, newPos2, object1, object2)

    // Adding some margin into the object 
    && Math.floor(object1.y + object1.height) < Math.floor(object2.y + object1.height / 2)
  )
}

function isCollidingBottom(newPos1: vec2d, newPos2: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    (object1.velocity.y < 0 || object2.velocity.y > 0)
    && isColliding(object1, newPos2, object1, object2)

    // Adding some margin into the object 
    && Math.floor(object1.y) > Math.floor(object2.y + object2.height - (object1.height / 2))
    // making sure that it is not triggered while inside object when it doesn't have collisions on one side
    && Math.floor(object1.y + object1.height) > Math.floor(object2.y + object2.height - (object1.height / 2))
  )
}

function isCollidingLeft(newPos1: vec2d, newPos2: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    (object1.velocity.x > 0 || object2.velocity.x < 0)
    && isColliding(newPos1, newPos2, object1, object2)
    // Adding some margin into object
    && Math.floor(object1.x + object1.width) < Math.floor(object2.x + (object1.width / 2))
  )
}

function isCollidingRight(newPos1: vec2d, newPos2: vec2d, object1: gameObject, object2: gameObject): boolean {
  return (
    (object1.velocity.x < 0 || object2.velocity.x > 0)
    && isColliding(newPos1, newPos2, object1, object2)
    // Adding some margin into object
    && Math.floor(object1.x) > Math.floor(object2.x + object2.width - (object1.width / 2))
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