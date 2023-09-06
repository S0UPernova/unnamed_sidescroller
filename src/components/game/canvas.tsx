import { useEffect, useRef, useState } from 'react'
import { gameObjectFactory } from './factories'
import { handleKeyDown, handleKeyUp } from "./inputHandlers"
import { calcGravity, calcMovement } from "./motionCalculations"
import { draw } from "./draw"
export default function Canvas(props: any) {
  let timestamp: number = Date.now()
  let deltaTime: number = 0
  let delta: number = 0

  // init game objects
  // const player = gameObjectFactory({ x: 100, y: 100, height: 100, width: 80, shape: "ellipse", color: "#e8e" })
  const block = gameObjectFactory({x: 800, y: 800, height: 50, width: 200, color: "#500", shape: "rectangle"})
  const objects: gameObject[] = []
  objects.push(block)
  const player = gameObjectFactory({ x: 200, y: 500, height: 100, width: 100, shape: "sprite", sprite: "sprite" });
  
  const canvasRef = useRef<HTMLCanvasElement>(null)



  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let frameId: number = 0

    const render = (): void => {
      // used to animate consistantly
      deltaTime = Date.now()
      delta = deltaTime - timestamp
      timestamp = deltaTime
      //Our draw come here
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        
        calcGravity(player.velocity, delta)
        calcMovement(player, { x: canvas.width, y: canvas.height }, delta, objects)
        draw(context, player)
        draw(context, block)
        // draw(context, sprite)
      }
      frameId = window.requestAnimationFrame(render)
    }
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', (e) => { handleKeyDown(e, player) })
    window.addEventListener('keyup', (e) => { handleKeyUp(e, player) })

    render()
    return () => {
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