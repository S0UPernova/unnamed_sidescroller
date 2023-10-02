import { CharacterObject, Controls } from "../../types"
import { CharacterActionMap, GameObjectActionMap } from "./gameActions"



export const controlMap: Controls = {
  "ArrowUp": "jump",
  "ArrowRight": "moveRight",
  "ArrowDown": "crouch",
  "ArrowLeft": "moveLeft",
  "Enter": "enableGravity",
  " ": "attack1",
  "Control": "attack2",
  "Shift": "attack3",
  "w": "jump",
  "a": "moveLeft",
  "s": "crouch",
  "d": "moveRight",
}

type Input = {
  [key: string]: boolean
}

// current input object
export const input: Input = {}
function handleControls(obj: CharacterObject) {
  let left: boolean = false
  let right: boolean = false
  for (const [k, v] of Object.entries(input)) {
    if (Object.keys(controlMap).includes(k)) {
      const key = k as keyof Controls
      const action = controlMap[key]

      // special case to handle
      if (action === "moveRight" && v === true) {
        right = true
      }
      if (action === "moveLeft" && v === true) {
        left = true
      }

      // todo refactor to be able to make it work in standard input for click to move to point
      if (action === "attack1" || action === "attack2" || action === "attack3") {
        // CharacterActionMap[action]
        if (obj.attacks !== undefined) {
          // todo add state mods for each attack, so if jumping do this instead, running, another alt.
          if (obj.currentAnimation === "run") {
            CharacterActionMap[action](obj, obj.attacks["runAttack"], v)
          }
          else if (!obj.attacking) {
            CharacterActionMap[action](obj, obj.attacks[action], v)
          }
        }

      }
      else if (!obj.attacking) {
        CharacterActionMap[action](obj, v)
      }
      if (v === false) {
        delete input[key]
      }
    }
  }

  // special case resolution
  if (left && right) {
    GameObjectActionMap.stopX(obj)
  }
}

function handleKeyUp(e: KeyboardEvent) {
  input[e.key] = false
}

function handleKeyDown(e: KeyboardEvent) {
  input[e.key] = true
}

export {
  handleKeyDown,
  handleKeyUp,
  handleControls,
}