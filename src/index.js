import React from 'react';
import './index.css';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./views/Home.jsx";
import Niveles from "./views/Niveles.jsx";
import ComoJugar from "./views/ComoJugar.jsx";
import Ranking from "./views/Ranking.jsx";
import InfoJuego from "./views/InfoJuego.jsx";
import RankingNivel from "./views/RankingNivel.jsx";

render(
  <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/niveles" element={<Niveles />} />
        <Route exact path="/nivel/:nivelId" element={<InfoJuego />} />
        <Route exact path="/ranking" element={<Ranking />} />
        <Route exact path="/ranking/nivel/:nivelId" element={<RankingNivel />} />
        <Route exact path="/comojugar" element={<ComoJugar />} />
      </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);
