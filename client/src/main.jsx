import React from 'react';
import { createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import ChatManager from './pages/ChatManager.jsx';
import Home from './pages/Home.jsx';

const router = (
  <Routes>
    <Route path='/' element={<App/>}>
      <Route index element={<Home/>} />
      <Route path='chat' element ={<ChatManager/>} />

    </Route>
  </Routes>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>{router}</Router>
  </React.StrictMode>,
)
