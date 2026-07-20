import React from 'react'
import { Canvas } from '@react-three/fiber'

const Desk = () => {
  return (
    <>
        <Canvas>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={'red'}/>
          <ambientLight intensity={1} />
          </mesh>
        </Canvas>
    </>
  )
}

export default Desk