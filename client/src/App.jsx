import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'
import Calculator from './pages/Calculator'
import Header from './components/Header'
import FooterComp from './components/FooterComp';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Calculator />} />
      </Routes>
      <FooterComp />
    </BrowserRouter>
  )
}

export default App
