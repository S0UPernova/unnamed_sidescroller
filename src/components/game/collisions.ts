import { serialize } from "v8"
import { dynamicObject, gameObject, Bounds, vec2d } from "../../types"
import { translateObjectByAmount, translateObjectToPoint } from "./motion"

// todo check if hitbox
export function checkObjectCollisions(object1: dynamicObject, objects: dynamicObject[], delta: number): void {
  objects.forEach(object2 => {
    checkForAnObjectCollision(object1, object2, delta)
  })
}

export function checkForAnObjectCollision(object1: dynamicObject, object2: dynamicObject, delta: number) {
  let newPos1 = {
    x: object1.collisionBox.x1 + (object1.velocity.x * delta),
    y: object1.collisionBox.y1 + (object1.velocity.y * delta)
  }
  let newPos2 = {
    x: object2.x + (object2.velocity.x * delta),
    y: object2.y + (object2.velocity.y * delta)
  }

  const isHittingTop = isCollidingTop(object1, object2)
  const isHittingBottom = isCollidingBottom(object1, object2)
  const isHittingLeft = isCollidingLeft(object1, object2)
  const isHittingRight = isCollidingRight(object1, object2)

  // colliding top
  if (object2.collisions.top && isHittingTop) {
    object1.velocity.y = 0
    // stops object from going through
    translateObjectToPoint(object1, {x: object1.x, y: object2.collisionBox.y1 - (object1.collisionBox.offset.y + object1.collisionBox.size.y)})

    // allows object on platform to move with platform
    if (object2.velocity.x !== 0) {
      const val = (newPos2.x - object2.x)
      translateObjectByAmount(object1, {x: val, y: 0})
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
      translateObjectToPoint(object2, {x: newPos1.x - object1.collisionBox.size.x, y: object2.y})
      // object2.x = newPos1.x - sizeTwo.width
    }
    else if (weight1 < weight2) {
    object1.velocity.x = 0
    translateObjectToPoint(object1, {x: newPos2.x + object2.collisionBox.size.x, y: object1.y})

    // object1.x - newPos2.x + sizeTwo.width
    }
    else {
      object1.velocity.x = 0
      object2.velocity.x = 0
    }
  }

  // colliding left
  else if (object2.collisions.left && isHittingLeft) {
    // todo add weighted interaction, needs to take into account object2 collisions on the oposite side

    const weight1 = object1.weight ? object1.weight : 0
    const weight2 = object2.weight ? object2.weight : 0
    if (weight1 > weight2) {
      object2.velocity.x = 0
      object2.x = newPos1.x + object1.collisionBox.size.x
    }
    else if (weight1 < weight2) {
    object1.velocity.x = 0
    // object1.collisionBox.x1 = (newPos2.x - sizeOne.width)
    translateObjectToPoint(object1, {x: newPos2.x - object1.collisionBox.size.x, y: object1.y})
    }
  }

  // colliding bottom
  else if (object2.collisions.bottom && isHittingBottom) {
    object1.velocity.y = -0.0001 // not significant and !== to 0 for a check elsewhere
    translateObjectToPoint(object1, {x: object1.x, y: object2.collisionBox.y2 - object1.collisionBox.offset.y})
    return
  }
}

/**
 * 
 * @param {gameObject} object1 
 * @param {gameObject} object2 
 * @returns {boolean} 
 */
export function isColliding(object1: dynamicObject, object2: dynamicObject): boolean {
  return (
    Math.floor(object1.collisionBox.y2) > Math.floor(object2.collisionBox.y1)
    && Math.floor(object1.collisionBox.y1) < Math.floor(object2.collisionBox.y2)
    && Math.floor(object1.collisionBox.x2) > Math.floor(object2.collisionBox.x1)
    && Math.floor(object1.collisionBox.x1) < Math.floor(object2.collisionBox.x2))
}

function isCollidingTop(object1: dynamicObject, object2: dynamicObject): boolean {
  return (
    (object1.velocity.y > 0 || object2.velocity.y < 0)
     && isColliding(object1, object2)

    // Adding some margin into the object 
    && Math.floor(object1.collisionBox.y2) < Math.floor(object2.collisionBox.y1 + (object2.collisionBox.size.y / 2))
  )
}

function isCollidingBottom(object1: dynamicObject, object2: dynamicObject): boolean {
  return (
    (object1.velocity.y < 0 || object2.velocity.y > 0)
    && isColliding(object1, object2)

    // Adding some margin into the object 
    && Math.floor(object1.collisionBox.y1) > Math.floor(object2.collisionBox.y2 - (object2.collisionBox.size.y / 2))
  )
}

function isCollidingLeft(object1: dynamicObject, object2: dynamicObject): boolean {
  return (
    (object1.velocity.x > 0 || object2.velocity.x < 0)
    && isColliding(object1, object2)

    // Adding some margin into object
    && Math.floor(object1.collisionBox.x1 + object1.collisionBox.size.x) < Math.floor(object2.collisionBox.x1 + (object1.collisionBox.size.x / 2))
  )
}

function isCollidingRight(object1: dynamicObject, object2: dynamicObject): boolean {
  return (
    (object1.velocity.x < 0 || object2.velocity.x > 0)
    && isColliding(object1, object2)

    // Adding some margin into object
    && Math.floor(object1.collisionBox.x1) > Math.floor(object2.collisionBox.x2 - (object1.collisionBox.size.x / 2))
  )
}


export function checkBoundsCollision(obj: gameObject, bounds: Bounds): void {
  const borderPadding = 15
  // too far to the right
  if (obj.x + obj.width > bounds.x2 - borderPadding) {
    translateObjectToPoint(obj, {x: bounds.x2 - obj.width - borderPadding, y: obj.y})
  }

  // too far to the left
  if (obj.x <= bounds.x1 + borderPadding) {
    obj.x = bounds.x1 + borderPadding
    translateObjectToPoint(obj, {y: obj.y, x: bounds.x1 + borderPadding})
  }

  // too far down
  if (obj.y + obj.height > bounds.y2) {
    // obj.y = bounds.y2 - obj.height
    obj.velocity.y = 0
    translateObjectToPoint(obj, {x: obj.x, y: bounds.y2 - obj.height})
  }

  // too far up
  if (obj.y < bounds.y1) {
    // obj.y = bounds.y1
    translateObjectToPoint(obj, {x: obj.x, y: bounds.y1})
  }
}