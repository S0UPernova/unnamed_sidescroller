type Actions = {
  jump: (obj: gameObject, keyDown: boolean) => void
  crouch: (obj: gameObject, keyDown: boolean) => void
  moveRight: (obj: gameObject, keyDown: boolean) => void
  moveLeft: (obj: gameObject, keyDown: boolean) => void
  stopX: (obj: gameObject) => void
  stopY: (obj: gameObject) => void 
  moveTo: (obj: gameObject, target: vec2d, margin: number) => boolean 
}
type Controls = {
  [key: string]: keyof Actions
}

const actionMap: Actions = {
  moveRight: (obj: gameObject, keyDown: boolean) => {
    if (keyDown && obj.velocity.x >= 0) {
      obj.velocity.x = 1
    }
    else if (keyDown) {
      obj.velocity.x = 0
    }
    if (!keyDown && obj.velocity.x > 0) {
      obj.velocity.x = 0
    }
  },
  moveLeft: (obj: gameObject, keyDown: boolean) => {
    if (keyDown && obj.velocity.x <= 0) {
      obj.velocity.x = -1
    }
    else if (keyDown) {
      obj.velocity.x = 0
    }
    if (!keyDown && obj.velocity.x < 0) {
      obj.velocity.x = 0
    }
  },
  jump: (obj: gameObject, keyDown: boolean) => {
    if (keyDown && obj.velocity.y === 0) {
      obj.velocity.y = -3
    }
    if (!keyDown && obj.velocity.y < 0) {
      obj.velocity.y = 0.00001
    }
  },
  crouch(obj: gameObject, keyDown: boolean) {
    // todo add functionality
  },

  stopX(obj: gameObject) {
    // not sure if this is needed, bud I want a function for when both buttons are pressed
    obj.velocity.x = 0
  },
  stopY(obj: gameObject) {
    // not sure is this is needed
    obj.velocity.y = 0
  },
  /**
   * 
   * @param {gameObject} obj
   * @param {vec2d} target 
   * @returns {boolean} true if already in location false if moving there
   */
  moveTo(obj: gameObject, target: vec2d, margin: number): boolean {
    const tx = target.x - obj.x
    const ty = target.y - obj.y
    if (Math.abs(tx) <= margin && Math.abs(ty) <= margin) return true
    const dist = Math.sqrt(tx*tx+ty*ty)
    const rad = Math.atan2(ty, tx)
    const angle = rad / Math.PI * 180
    const thrust = obj.moveSpeed > 0 ? obj.moveSpeed : 1

    obj.velocity.x = (tx/dist)*thrust
    obj.velocity.y = (ty/dist)*thrust
    return false
  }
}
const controlMap: Controls = {
  "ArrowUp": "jump",
  "ArrowRight": "moveRight",
  "ArrowDown": "crouch",
  "ArrowLeft": "moveLeft",

  "w": "jump",
  "a": "moveLeft",
  "s": "crouch",
  "d": "moveRight",
}

type Input = {
  [key: string]: boolean
}

// current input object
const input: Input = {}

function handleControls(obj: gameObject) {
  let left: boolean = false
  let right: boolean = false
  console.log("input: ", input)
  for (const [k, v] of Object.entries(input)) {
    if (Object.keys(controlMap).includes(k)) {
      const key = k as keyof Controls
      const action = controlMap[key]
      // // special cases to handle
      if (action === "moveRight" && v === true) {
        right = true
      }
      if (action === "moveLeft" && v === true) {
        left = true
      }
      
      // todo refactor to be able to make it work in standard input for click to move to point
      if (action !== "moveTo") {
        actionMap[action](obj, v)
      }
      if (v === false) {
        delete input[key]
      }
    }
  }

  // special case resolution
  if (left && right) {
    actionMap.stopX(obj)
  }
}

function handleKeyUp(e: KeyboardEvent, obj: gameObject) {
  input[e.key] = false
}

function handleKeyDown(e: KeyboardEvent, obj: gameObject) {
  input[e.key] = true
}

export {
  handleKeyDown,
  handleKeyUp,
  handleControls,
  actionMap
}