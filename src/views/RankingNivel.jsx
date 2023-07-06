import React, { useState, useEffect } from 'react';
import { useLocation} from 'react-router-dom';

import { doc, getDoc } from "firebase/firestore";
import db from '../bd/Firebase'

import './RankingNivel.css';

export default function Ranking() {

    const path = useLocation().pathname.split("/", 4);
    const numNivel = path[3];

    const [datosDB, setDatosDB] = useState([]);

    useEffect(() => {
        const obtenerDatos = async() => {  
            try{
                const docRef = doc(db, "clasificacion", numNivel);
                const docSnap = await getDoc(docRef);

                let arrayDatos = docSnap.data()

                // Control de errores BD 
                for(let index in docSnap.data()){
                    let numTiempo = docSnap.data()[index];
                    if (isNaN(parseInt(numTiempo))) {
                        console.log("Error en BD. Uno de los tiempos guardados en el nivel "+numNivel+" no es correcto y se descartará de la clasificación.");
                        delete arrayDatos[index];
                    }   
                }

                let dataSort = Object.entries(arrayDatos).sort((a,b) => a[1] - b[1]);            
                setDatosDB(dataSort);

            }catch(error){
                console.error("Ha ocurrido un error al obtener la colección:", error);
            }
        }
        obtenerDatos();

    }, [numNivel]);


    const imprimirPosicionRanking = () => {
        let arrayDivs = [];
        let posicion = 1;
        for(let index=0 ; index < datosDB.length ; index++) {
            if (index > 0){
                if((putTimeFormat(datosDB[index][1]) !== putTimeFormat(datosDB[index-1][1]))){
                    posicion = index + 1;
                }
            }
            
            arrayDivs.push(
                <div className="leaderboard__profile" key={index}>  
                    <span className="leaderboard__ranking">{posicion}</span>
                    <span className="leaderboard__name">{datosDB[index][0]}</span>
                    <span className="leaderboard__value">{putTimeFormat(datosDB[index][1])}</span>
                </div>
            );
        }
        setTimeout(() => {
            
          }, 100);    
        if(arrayDivs.length === 0){
            arrayDivs.push(
                <div className="leaderboard__profile" key={"0"}>  
                    <span className="leaderboard__vacio">No hay datos en este nivel</span>
                </div>
            );
        }
        return arrayDivs;
    }

    const putTimeFormat = (number) => {
        let horas = Math.floor(number / 3600) % 24;
        let minutos = Math.floor(number / 60) % 60;
        let segundos = Math.floor(number) % 60;
    
        let segundos_0 = (segundos < 10) ? (`0${segundos}`) : segundos;
        let minutos_0 = (minutos < 10) ? (`0${minutos}`) : minutos;
        let horas_0 = (horas < 10) ? (`0${horas}`) : horas;
    
        return (horas_0+":"+minutos_0+":"+segundos_0);
    };

    
    return(
        <div className="fondoranking">
            <div className="TituloRankingNivel"> RANKING  DEL  NIVEL  {numNivel} </div>
            <div className="leaderboard">
                <div className="divprofiles">
                    {imprimirPosicionRanking()}
                </div>
            </div>
        </div>
    );
    
}