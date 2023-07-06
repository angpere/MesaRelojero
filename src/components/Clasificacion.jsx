import React, { useState, useEffect } from 'react';
import { useLocation} from 'react-router-dom';

import { doc, getDocs, updateDoc, collection, getDoc, setDoc } from "firebase/firestore";
import db from '../bd/Firebase'

import './Clasificacion.css';

const paginaVolver = "/";

function Clasificacion (props) {

    const path = useLocation().pathname.split("/", 3);
    const numNivel = path[2];

    
    const [datosDB, setDatosDB] = useState([]);

    const [finalizado, setFinalizado] = useState(false);
    const [inputValido, setInputValido] = useState(false);
    const [nombreExiste, setNombreExiste] = useState(false);
    const [feedback, setFeedback] = useState(false);

    useEffect(() => {
        setFinalizado(props.mostrar);

        const actualizarDatos = async() => {  
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

                if(arrayNiveles.includes(numNivel)){
                    try{
                        const docRef = doc(db, "clasificacion", numNivel);
                        const docSnap = await getDoc(docRef);

                        const dataSort = Object.entries(docSnap.data()).sort((a,b) => a[1] - b[1]);
                        setDatosDB(dataSort);
                        console.log(dataSort);
                    }catch(error){
                        console.error("Ha ocurrido un error al obtener el documento:", error);
                    }
                    
                }else{
                    try {
                        const docRef = doc(db, "clasificacion", numNivel);
                        await setDoc(docRef, {});
                      } catch (error) {
                        console.error("Error al crear el documento:", error);
                      }

                }
            }catch(error){
                console.error("Ha ocurrido un error al obtener el documento:", error);
            }
        }
        actualizarDatos();

    }, [props.mostrar, numNivel]);

    
    const escribirDB = async(array) => {
        try{
            const docRef = doc(db, "clasificacion", numNivel);
            let nombre = array[0];
            let numero = array[1];
            
            let dato = {
                [nombre]: numero,
            };
            try{
                await updateDoc(docRef, dato);
            }catch(error){
                console.log("Error al introducir un dato a la BD")
            }
        }catch(error){
            console.error("Ha ocurrido un error al obtener el documento:", error);
        }
    }

    const colocarDatosIzquierda = () => {
        let divReturn = [];
        let cont = 0;
        for (let index = 0; index<5 && index<datosDB.length ; index++){
            if(cont % 2 === 0){
                divReturn.push(
                    <div id="colum_left_1">{datosDB[index][0]}</div>
                )
            }else{
                divReturn.push(
                    <div id="colum_left_2">{datosDB[index][0]}</div>
                )
            }
            cont = cont + 1;
        }
        // Si no hay 5 en el ranking
        for(cont; cont<5; cont++){
            if(cont % 2 === 0){
                divReturn.push(
                    <div id="colum_left_1"></div>
                )
            }else{
                divReturn.push(
                    <div id="colum_left_2"></div>
                )
            }
        }
        return(divReturn)
    }

    const colocarDatosDerecha = () => {
        let divReturn = [];
        let cont = 0;
        for (let index = 0; index<5 && index<datosDB.length ; index++){
            let tiempo = putTimeFormat(datosDB[index][1]);
            if(cont % 2 === 0){
                divReturn.push(
                    <div id="colum_right_1">{tiempo}</div>
                )
            }else{
                divReturn.push(
                    <div id="colum_right_2">{tiempo}</div>
                )
            }
            cont = cont + 1;
        }
        // Si no hay 5 en el ranking
        for(cont; cont<5; cont++){
            if(cont % 2 === 0){
                divReturn.push(
                    <div id="colum_right_1"></div>
                )
            }else{
                divReturn.push(
                    <div id="colum_right_2"></div>
                )
            }
        }
        return(divReturn)
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

    const handleInputChange = (event) => {
        setNombreExiste(false);
        const valor = event.target.value;
        const regex = /^[a-zA-Z0-9_.-]{6,15}$/;

        if (regex.test(valor)) {
            setInputValido(true);
        }else{
            setInputValido(false);
        }

        for(let index in datosDB){
            if (datosDB[index][0].toString() === valor.toString()){
                setNombreExiste(true);
            }
        }
    };
   

    // const openPopup = () => {
    //     setFinalizado(true);
    // };
    
    const closePopup = () => {
        escribirDB([document.getElementById('valor_input').value, props.tiempo]);

        setFinalizado(false)
        setFeedback(true);

        setTimeout(() => {
            window.location.href = paginaVolver;
          }, 1200);
    };



    return(
        <div className="principal">
            {/* <button onClick={openPopup}>Mostrar Pop Up</button> */}
            {finalizado && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="text_up">
                            CLASIFICACIÓN
                        </div>
                        <div className="informacion">
                            <div className="columna">
                                <div className="titulo"> NOMBRE </div>

                                {colocarDatosIzquierda()}
                                
                                
                            </div>
                            <div className="columna">
                                <div className="titulo"> TIEMPO </div>

                                {colocarDatosDerecha()}
                                
                            </div>
                        </div>
                        <div className="informacion">
                            <div className="columna">
                                <input type="text" id="valor_input" autoComplete="off" onChange={handleInputChange} className="results"></input>
                            </div>
                            <div className="columna">
                                <div className="results">{putTimeFormat(props.tiempo)} </div>
                            </div>
                        </div>
                        
                        <button 
                            className={nombreExiste ? 'botonDesactivadoNombre' : (inputValido ? 'boton' :'botonDesactivado')}
                            onClick={closePopup} 
                            disabled={!inputValido || nombreExiste}>
                                GUARDAR MI TIEMPO
                        </button>
                        
                    </div>
                    
                </div>
            )}
            {feedback && (
                <div className="popup-overlay2">
                    <div className="popup-content2">
                        <div className="text_up2">
                            Tu clasificación ha sido guardada.
                        </div>
                    </div>
                </div>
            )}
        </div>
     );

}

export default Clasificacion;