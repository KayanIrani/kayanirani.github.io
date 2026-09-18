import React, {useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

 import Scene from './components/Scene.jsx'
import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'


const Desk = () => {
  const controls = useRef();
  const camera = useRef();

  const [scrollProgress,setScrollProgress] = useState(0);
  const targetScrollProgress = useRef(0)
  const scrollSpeed = 0.000005
  const lerpFactor = 0.1;

  useEffect(()=>{
    const handleWheel = (event)=>{
      // deltaY return number greater than 0 when scrolling down and when up it's negative
      targetScrollProgress.current += (event.deltaY*scrollSpeed)
    }
    window.addEventListener("wheel",handleWheel)

    // clean up function
    return ()=>{
      window.removeEventListener("wheel",handleWheel)
    }
  },[])
  return (
    <>
        <Canvas>
          {/* <CameraControls ref={controls}/> */}
          
          <PerspectiveCamera 
            ref={camera}
            makeDefault
            fov={70}
            position={[-299.81,39.52,14.47]}  
          />
          <OrbitControls />
          <Scene 
            controls={controls} 
            camera={camera}
            scrollProgress={scrollProgress}
            setScrollProgress={setScrollProgress}
            targetScrollProgress={targetScrollProgress}
            lerpFactor={lerpFactor}
          
          />

        </Canvas>
    </>
  )
}

export default Desk