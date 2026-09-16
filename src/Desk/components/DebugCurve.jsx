import {BufferGeometry} from "three"

const DebugCurve = ({curve}) => {
  const points = curve.getPoints(50)
  const geometry = new BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={'blue'}/>
    </line>
  )
}

export default DebugCurve