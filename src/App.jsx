import { useState } from 'react'
import KayanVerse from './kayanverse/KayanVerse.jsx'
import "./App.css"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <KayanVerse/>
    </>
  )
}

export default App
1