import React from 'react';
import './Home.css';
import Botones from '../components/Botones'
import { Link } from "react-router-dom";

export default function Home() {

  const style_button = {
    //width: '200px',
  };

  return (
    <div className="Home">
        <div className="Marco"> 
          <h1>MESA DEL RELOJERO</h1>
          <div className="Espacio" />
          <Link to="/niveles">
              <Botones title="JUGAR" style={style_button}/>  
          </Link>
          <Link to="/ranking">
              <Botones title="RANKING" style={style_button}/>  
          </Link>

          <Link to="/comojugar">
              <Botones title="COMO JUGAR" style={style_button}/>  
          </Link>

        </div>                   
    </div>
  );
}

