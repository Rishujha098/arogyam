import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Chatbot from './components/Chatbot/Chatbot.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chatbot' element={<Chatbot />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;