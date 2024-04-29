import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'
import Calculator from './pages/Calculator'
import Header from './components/Header'
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Calculator />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
