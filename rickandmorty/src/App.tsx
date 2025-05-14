import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Authentication from './Authentication'
import Characterlist from './Character-list'
function App() {
  

  return (
    <>
      <Authentication />
      <Characterlist />
      
    </>
  )
}

export default App
