import React from 'react'

const Glass = () => {
  return (
    <meshPhysicalMaterial
          color="#e8f4ff"
          metalness={0}
          roughness={0.1}
          transmission={1}
          thickness={0.1}
          ior={1.5}
          transparent
          opacity={1}
          depthWrite={false}
    />
  )
}

export default Glass