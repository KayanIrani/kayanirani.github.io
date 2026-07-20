import { useState } from 'react'
import Desk from './Desk/Desk.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Desk/>
    </>
  )
}

export default App
