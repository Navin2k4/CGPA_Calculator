import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'
import Calculator from './pages/Calculator'
import Header from './components/Header'
import FooterComp from './components/FooterComp';
import IssueForm from './components/IssueForm';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Calculator />} />
      </Routes>
      <IssueForm />
      <FooterComp />
    </BrowserRouter>
  )
}

export default App
