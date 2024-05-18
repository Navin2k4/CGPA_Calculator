import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'
import Header from './components/Header'
import FooterComp from './components/FooterComp';
import StudentData from './pages/StudentData';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/studentData" element={<StudentData />} />
      </Routes>
      <FooterComp />
    </BrowserRouter>
  )
}

export default App
