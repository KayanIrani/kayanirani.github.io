import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import Room from "./Room.jsx"
import {CatmullRomCurve3, MathUtils, Vector3} from "three"
import DebugCurve from "./DebugCurve.jsx";

const Scene = ({
    controls,
    camera,
    scrollProgress,
    setScrollProgress,
    targetScrollProgress,
    lerpFactor
  })=>{

  const cameraCurve = new CatmullRomCurve3([
    new Vector3(-299.81,39.52,14.47),
    new Vector3(-263.55,35.52,12.77),
    new Vector3(-257.36,33.92,12.42),
    new Vector3(-189.64,29.98,9.15),
    new Vector3(-139.75,18.42,6.74),
    new Vector3(-134.90,39.98,10.74),
    new Vector3(-121.91,57.56,41.72),
    new Vector3(-87.16,81.49,75.34),
    new Vector3(-52.88,109.57,78.63),
    new Vector3(-30.77,114.31,76.83),
    new Vector3(-11.28,118.06,76.49),
    new Vector3(-8.32,86.99,56.36),
    new Vector3(1.12,62.76,43.95),
    new Vector3(1.47,50.76,52.01),
    new Vector3(0.13,32.95,58.51),
    new Vector3(1.13,22.23,44.20),
  ]);

    useFrame(()=>{
      if(camera){
        const newProgress = MathUtils.lerp(scrollProgress,targetScrollProgress.current,lerpFactor)
        setScrollProgress(newProgress)
        const point= cameraCurve.getPoint(newProgress)
        camera.current.position.copy(point)
      }
      
  })
  return (
    <>
        <DebugCurve curve={cameraCurve}/>
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
            <Room />
        </Suspense>

    </>
  )
}

export default Scene;