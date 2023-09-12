
import React, { useEffect, useRef, useState } from 'react'
import { characterObjectFactory, gameObjectFactory } from './factories'
import { handleControls, handleKeyDown, handleKeyUp } from "./inputHandlers"
import { calcGravity, calcMovement } from "./motionCalculations"
import { draw, handleCamera, makeThingsMove } from "./draw"
import { cycleThroughPositions, moveRight, moveTo } from './gameActions'
import { checkBoundsCollision, checkObjectCollisions } from './collisions'
export default function Canvas(props: any) {
  let lastTime: number = Date.now()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const camera: Camera = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  }
  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    camera.height = canvas.height
    camera.width = canvas.width


    // todo abstract level creation
    const bounds: LevelBounds = { x1: -800, y1: -800, x2: canvas.width + 800, y2: canvas.height }
    const objects: (gameObject & CharacterObject)[] = []
    const player = characterObjectFactory({ x: (canvas.width / 2) - 50, y: canvas.height / 2, height: 100, width: 100, shape: "sprite", sprite: "sprite", moveSpeed: 1, jumpForce: 3, weight: 0.5 });
    const block = gameObjectFactory({ x: canvas.width - 200, y: canvas.height - 200, height: 50, width: 200, color: "#500", shape: "rectangle", })
    const platform = gameObjectFactory({
      x: (canvas.width / 8) + 300, y: canvas.height - (canvas.height / 4), height: 50, width: 100, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1,
      positions: [
        { x: (canvas.width / 8) + 600, y: canvas.height - (canvas.height / 4) },
        { x: (canvas.width / 8) + 300, y: canvas.height - (canvas.height / 4) },
        { x: (canvas.width / 8) + 300, y: canvas.height - (canvas.height / 2) },
      ]
    })
    const platform2 = gameObjectFactory({
      x: canvas.width - (canvas.width / 8), y: canvas.height - (canvas.height / 4), height: 50, width: 200, color: "#050", shape: "rectangle", collisions: { bottom: false }, moveSpeed: 0.1, weight: 1,
      positions: [
        { x: (canvas.width / 8) + 600, y: canvas.height - (canvas.height / 8) },
        { x: (canvas.width / 8) + 800, y: canvas.height - (canvas.height / 8) - 50 },
        { x: (canvas.width / 8) + 600, y: canvas.height - (canvas.height / 4) },
      ],
      cycleType: "reversing"
    })
    const wall = gameObjectFactory({ x: canvas.width / 8, y: canvas.height / 2, height: canvas.height / 2, width: 50, color: "#500", shape: "rectangle", collisions: { left: false } })

    objects.push(block)
    objects.push(wall)
    objects.push(platform)
    objects.push(platform2)
    objects.push(player)
    console.log('objects: ', objects)
    console.log('platform: ', platform)
    console.log('platform2: ', platform2)

    let frameId: number = 0
    const render = (timestamp: number): void => {
      // Value check here, because when tabbed away it suddenly adds all the time to delta
      const delta = timestamp - lastTime < 1000 ? timestamp - lastTime : 1
      lastTime = timestamp

      if (context) {
        context.clearRect(bounds.x1, bounds.y1, Math.abs(bounds.x1) + bounds.x2, Math.abs(bounds.y1) + bounds.y2)

        handleControls(player)
        makeThingsMove(objects, delta, bounds)
        // todo handle camera
        handleCamera(context, camera, player, bounds, delta) // todo fix stickyness

        objects.forEach(object => {
          draw(context, object)
        })
      }
      frameId = window.requestAnimationFrame(render)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('keydown', (e) => { handleKeyDown(e, player) })
    window.addEventListener('keyup', (e) => { handleKeyUp(e, player) })

    render(0)
    return () => {
      // clearInterval(interval)
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', (e) => { handleKeyDown(e, player) })
      window.removeEventListener('keyup', (e) => { handleKeyUp(e, player) })
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