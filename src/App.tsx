import React from "react"
import Canvas from "./components/game/canvas"
import './App.scss'
import Nav from "./components/nav"

function App() {
  return (
    <>
      <Nav/>
        <Canvas/>
    </>
  )
}
export default App