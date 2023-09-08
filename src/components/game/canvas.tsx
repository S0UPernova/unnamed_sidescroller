
import React, { useEffect, useRef, useState } from 'react'
import { gameObjectFactory } from './factories'
import { handleControls, handleKeyDown, handleKeyUp, actionMap } from "./inputHandlers"
import { calcGravity, calcMovement } from "./motionCalculations"
import { draw } from "./draw"
import { checkBoundsCollision, checkObjectCollisions } from './collisions'
export default function Canvas(props: any) {
  let lastTime: number = Date.now()

  // init game objects
  // const player = gameObjectFactory({ x: 100, y: 100, height: 100, width: 80, shape: "ellipse", color: "#e8e" })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  let platformCycleNum = 0
/**
 * 
 * @param {gameObject} obj 
 * @param {vec2d} posList 
 * @param {number} currentPos 
 * @returns {number} the current step in the cycle
 */
function cycleThroughPositions(obj:gameObject, posList: vec2d[], currentPos: number): number {
  const nextPos: number = currentPos + 1 <= posList.length - 1 ? currentPos + 1 : 0
  const inPosition: boolean = actionMap.moveTo(obj, posList[nextPos], 5)
  return inPosition ? nextPos : currentPos
}

  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const objects: gameObject[] = []
    const platformPositions = [
      {x: (canvas.width / 8) +  300, y: canvas.height - (canvas.height / 4)},
      {x: (canvas.width / 8) +  800, y: canvas.height - (canvas.height / 4)}
    ]
    const player = gameObjectFactory({ x: (canvas.width / 2) - 50, y: canvas.height / 2, height: 100, width: 100, shape: "sprite", sprite: "sprite" });
    const block = gameObjectFactory({ x: canvas.width - 200, y: canvas.height - 200, height: 50, width: 200, color: "#500", shape: "rectangle", })
    const platform = gameObjectFactory({ x: (canvas.width / 8) +  300, y: canvas.height - (canvas.height / 4), height: 50, width: 200, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1 })
    const wall = gameObjectFactory({ x: canvas.width / 8, y: canvas.height / 2, height: canvas.height / 2, width: 50, color: "#500", shape: "rectangle", collisions: { left: false } })

    objects.push(block)
    objects.push(wall)
    objects.push(platform)

    let frameId: number = 0
    const render = (timestamp: number): void => {

      // used to animate consistantly
      const delta = timestamp - lastTime
      lastTime = timestamp

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)

        // let player do stuff
        handleControls(player)
        
        // calc steps
        calcGravity(player.velocity, delta)
        calcMovement(player, delta)
        calcMovement(platform, delta)
        platformCycleNum = cycleThroughPositions(platform, platformPositions, platformCycleNum)
        
        // collision checks
        checkBoundsCollision(player, {x: canvas.width, y: canvas.height})
        checkObjectCollisions(player, objects, delta)
        
        objects.forEach(object => {
          draw(context, object)
        })
        draw(context, player)
      }
      frameId = window.requestAnimationFrame(render)
    }
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', (e) => {handleKeyDown(e, player)})
    window.addEventListener('keyup', (e) => {handleKeyUp(e, player)})

    render(0)
    return () => {
      // clearInterval(interval)
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', (e) => {handleKeyDown(e, player)})
      window.removeEventListener('keyup',(e) => {handleKeyUp(e, player)})
    }

  }, [canvasRef])

  const resize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }
  }

  return <canvas ref={canvasRef} {...props} />
}