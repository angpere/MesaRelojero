import React, { useEffect, useState } from 'react';
import { useLocation} from 'react-router-dom';

import { doc, getDoc } from "firebase/firestore";
import db from '../bd/Firebase'

import Juego from "./Juego.jsx";


function InfoJuego() {
 
  const path = useLocation().pathname.split("/", 3);
  const numNivel = path[2];
  
  const [datos, setDatos] = useState({})

  useEffect(() => {
    
    const obtenerDatos = async() => {
      try{
        const docRef = doc(db, "niveles", numNivel);
        const docSnap = await getDoc(docRef);
        setDatos(docSnap.data());

      }catch(error){
        console.error("Ha ocurrido un error al obtener el documento:", error);
      }
    }
    obtenerDatos();    
  }, [numNivel]);

  if(Object.keys(datos).length !== 0){
    return (   
        <div>
            <Juego info={datos} />
        </div>
      );
  }
  
}

export default InfoJuego;