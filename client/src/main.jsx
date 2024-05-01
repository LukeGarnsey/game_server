import React from 'react';
import { createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import Game from './pages/Game.jsx';
import Lobby from './pages/Lobby.jsx';

const router = (
  <Routes>
    <Route path='/' element={<App/>}>
      <Route index element={<Lobby/>} />
      <Route path='/:paramGameId' element={<Game/>}/>
    </Route>
  </Routes>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>{router}</Router>
  </React.StrictMode>,
)
