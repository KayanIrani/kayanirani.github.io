import React, {useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import {Vector3} from "three"


import Scene from './components/Scene.jsx'


const Desk = () => {
  const controls = useRef();
  const camera = useRef();

  const [scrollProgress,setScrollProgress] = useState(0);
  const targetScrollProgress = useRef(0)
  const scrollSpeed = 0.004
  const lerpFactor = 0.1;
  const isSwiping = useRef(false)
  const mouseOffset = useRef(new Vector3())

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

    // Camera slightly moving in the direction of the mouse pointer
    const handelMouseMove = (event)=>{
      // since mouse X,Y at (0,0) start from top left corner this is to normalize it to the center of the screen
      const mouseX = (event.clientX / window.innerWidth) *2  -1;
      const mouseY = (event.clientY / window.innerHeight) *2  -1;

      const sensitivityX = 0.25
      const sensitivityY = 0.25 
      mouseOffset.current.x = mouseX * sensitivityX
      mouseOffset.current.y = mouseY * sensitivityY
    }

    // To add a mobile feature in the future maybe gyroscope or finger movements

    window.addEventListener("wheel",handleWheel)
    window.addEventListener("pointerdown",handlePointerDown)
    window.addEventListener("pointermove",handlePointerMove)
    window.addEventListener("pointerup",handlePointerUp)
    window.addEventListener("mousemove",handelMouseMove)

    // clean up function
    return ()=>{
      window.removeEventListener("wheel",handleWheel)
      window.removeEventListener("pointerdown",handlePointerDown)
      window.removeEventListener("pointermove",handlePointerMove)
      window.removeEventListener("pointerup",handlePointerUp)
      window.removeEventListener("mousemove",handelMouseMove)
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
            mouseOffset={mouseOffset}
          />

        </Canvas>
    </>
  )
}

export default Desk