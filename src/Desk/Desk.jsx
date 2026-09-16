import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

 import Scene from './components/Scene.jsx'
import { CameraControls, Environment } from '@react-three/drei'


const Desk = () => {
  const controls = useRef()
  const roomControls = useRef()

  const [scrollProgress,setScrollProgress] = useState(0)
  return (
    <>
        <Canvas
          camera={{
              position:[-299.81,39.52,14.47],
              fov: 70,
            }}
        >
          <CameraControls ref={controls}/>
          <Scene controls={controls} roomControls={roomControls}/>

        </Canvas>
    </>
  )
}

export default Desk