import React from 'react'
import { Html } from '@react-three/drei'
import LaptopScreenView from '../../components/LaptopScreenView'


// can add prop as mobileStyle and laptop style for overlayhtml in it's after-effects
const HtmlOverlay = ({isHidden,setHidden,position,rotation}) => {
  return (
    <Html className='content'
          transform occlude
          onOcclude={setHidden}
          // rotation-x={laptopScreenConfigs.finalAngle}
          position={position}
          rotation={rotation}
          style={{
            // add transition: here eg: transition: 'all 0.5s',
            transition: 'all 0.5s',
            opacity: isHidden ? 0:1,
            pointerEvents: isHidden ? 'none': 'auto',
            visibility: isHidden ? 'hidden':'visible'
          }}
        >
          <div className='wrapper' onPointerDown={(e) => e.stopPropagation()}>
            <Laptop ScreenView />
          </div>
    </Html>
  )
}

export default HtmlOverlay