import React from 'react'
import { Canvas } from '@react-three/fiber'

const Desk = () => {
  return (
    <>
        <Canvas>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={'red'}/>
          </mesh>
          <ambientLight intensity={1} />
        </Canvas>
    </>
  )
}

export default Desk