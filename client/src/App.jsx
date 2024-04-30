import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'
import Calculator from './pages/Calculator'
import Header from './components/Header'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Calculator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
