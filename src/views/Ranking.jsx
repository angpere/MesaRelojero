import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import db from '../bd/Firebase'

import './Ranking.css';
import Botones from '../components/Botones'


export default function Ranking() {

  const [niveles, setNiveles] = useState([])

  useEffect(() => {
    const obtenerDatos = async() => {
      try{
        const datos = await getDocs(collection(db, 'clasificacion'))
        let arrayNiveles = []
        
        datos.forEach((doc) => {
          let numero_nivel = doc.id;
          
          // Control de errores en BD
          if (!isNaN(parseInt(numero_nivel))) {
            arrayNiveles.push(numero_nivel)
          }else{
            console.log("Error en la BD. Nombre de la coleccion no adecuado")
          }
        });

        let nivelesOrdenados = arrayNiveles.sort((a, b) => a - b);
        setNiveles(nivelesOrdenados)
        
      }catch(error){
        console.error("Ha ocurrido un error al obtener el documento:", error);
      }
    }

    obtenerDatos();

  }, []);


  const botonesNiveles = []
  for (let index = 0 ; index < niveles.length ; index++){

    let nombreProvisional = "NIVEL "+niveles[index];
    let linkProvisional = "/ranking/nivel/"+niveles[index];
    let keyId = "nivel"+niveles[index];

    botonesNiveles.push(
      <Link key={keyId} to={linkProvisional}>
        <Botones title={nombreProvisional}/>  
      </Link>
    );
  }

  return (
    <div className="Fondo_Niveles">
      <div className="Fondo_Oscuro">
        <div className="Titulo"> 
            CLASIFICATORIA
          </div>
          
          <div className="Niveles">
            {botonesNiveles}
          </div>
      </div>
    </div>
  );
}