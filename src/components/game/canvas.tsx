
import React, { useEffect, useRef } from 'react'
import { levelInit, LevelInitReturn } from './initLevel'
import { handleKeyDown, handleKeyUp } from "./inputHandlers"
import { levelRender } from './levelRender'

export default function Canvas(props: any) {
  let lastTime: number = Date.now()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let frameId: number = 0
    let level: LevelInitReturn | undefined = undefined

    const renderLoop = (timestamp: number): void => {
      const delta = !isNaN(timestamp) && timestamp - lastTime < 200 ? timestamp - lastTime : 0
      lastTime = timestamp

      if (context) {
        if (level === undefined) level = levelInit(1, canvas.height, canvas.width)
        levelRender(context, delta, level)
      }
      frameId = window.requestAnimationFrame(renderLoop)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('keydown', (e) => { handleKeyDown(e) })
    window.addEventListener('keyup', (e) => { handleKeyUp(e) })
    renderLoop(0)
    return () => {
      // clearInterval(interval)
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', (e) => { handleKeyDown(e) })
      window.removeEventListener('keyup', (e) => { handleKeyUp(e) })
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