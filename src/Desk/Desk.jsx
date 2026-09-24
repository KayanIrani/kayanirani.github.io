import React, {useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

 import Scene from './components/Scene.jsx'
import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'


const Desk = () => {
  const controls = useRef();
  const camera = useRef();

  const [scrollProgress,setScrollProgress] = useState(0);
  const targetScrollProgress = useRef(0)
  const scrollSpeed = 0.004
  const lerpFactor = 0.1;
  const isSwiping = useRef(false)

  useEffect(()=>{
    const handleWheel = (event)=>{
      // deltaY return number greater than 0 when scrolling down and when up it's negative
      targetScrollProgress.current += (Math.sign(event.deltaY) * scrollSpeed)
    }
    const handlePointerDown = ()=>{
      isSwiping.current = true
    }
    const handlePointerUp = ()=>{
      isSwiping.current = false
    }
    const handlePointerMove = (event)=>{
      if (!isSwiping.current){
        return
      }
      targetScrollProgress.current += (Math.sign(event.movementY) * scrollSpeed)
    }
    window.addEventListener("wheel",handleWheel)
    // window.addEventListener("pointerdown",handlePointerDown)
    // window.addEventListener("pointermove",handlePointerMove)
    // window.addEventListener("pointerup",handlePointerUp)

    // clean up function
    return ()=>{
      window.removeEventListener("wheel",handleWheel)
      // window.removeEventListener("pointerdown",handlePointerDown)
      // window.removeEventListener("pointermove",handlePointerMove)
      // window.removeEventListener("pointerup",handlePointerUp)
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
            position={[-294.81,39.52,14.47]}  
          />
          <OrbitControls ref={controls} camera={camera.current}/>
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