import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import Room from "./Room.jsx"


const Scene = ({controls,roomControls})=>{
  //   useFrame(()=>{
    // console.log("Position:")
    // console.log(controls.current.getPosition())
    // console.log("Rotation")
    // console.log(controls.current.camera.rotation)
    // console.log(controls.current);
    
  // })
  return (
    <>
        <Environment 
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        // for cubemap 2 -> pi/2 and for cubemap 1 -> pi
        backgroundRotation={[0, Math.PI/2 , 0]} // optional rotation (default: 0, only works with three 0.163 and up)
        files={[
            '/cubemaps/cubemap2/px.webp',
            '/cubemaps/cubemap2/nx.webp',
            '/cubemaps/cubemap2/py.webp',
            '/cubemaps/cubemap2/ny.webp',
            '/cubemaps/cubemap2/pz.webp',
            '/cubemaps/cubemap2/nz.webp'
        ]
        }/>
        
        <ambientLight intensity={2} />
        {/* Useful for loading screen feature */}
        <Suspense fallback={null}>
            <Room ref={roomControls}/>
        </Suspense>
    </>
  )
}

export default Scene;