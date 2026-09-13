import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import Room from "./components/Room.jsx"

import { CameraControls } from '@react-three/drei'

const Scene = ({controls})=>{
  // useFrame(()=>{
  //   // console.log("Position:")
  //   // console.log(controls.current.getPosition())
  //   // console.log("Rotation")
  //   // console.log(controls.current.camera.rotation)
  // })
}
const Desk = () => {
  const controls = useRef()
  return (
    <>
        <Canvas
          camera={{
              position:[-299.81,39.52,14.47],
              fov: 70,
            }}
        >
          <CameraControls ref={controls}/>
          {/* <mesh>
            <boxGeometry />
            <meshStandardMaterial color={'red'}/>
          </mesh> */}
          <ambientLight intensity={5} />
          <Scene controls={controls}/>
          <Room />
        </Canvas>
    </>
  )
}

export default Desk