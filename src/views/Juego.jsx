import React, { Component } from 'react';


import './Juego.css';
import Tablero from '../components/Tablero'
import Piezas from '../components/Piezas'
import Contador from '../components/Contador'
import Clasificacion from '../components/Clasificacion'

const SHADOW_COLOR = "rgba(255, 90, 255, .3)"
const PISTA_COLOR = "rgba(204, 133, 201, .5)"
const PLACED_COLOR = "rgba(205, 205, 205, .8)"

class Juego extends Component {
  
  constructor(props) {
    console.log(props);
    super(props); 
      
    this.datos = this.props.info;

    this.book = this.props.info.libro;
    this.sentence = this.senteceInGoodArray(this.props.info.frase);
    this.author = this.props.info.autor; 
    this.letters = this.lettersInGoodArray(this.props.info.letras);

    this.state = {
      blocks : this.piecesInGoodArray(this.props.info.piezas),
      time: 0,
      targetCells : this.initTargetCells(this.letters, this.sentence),
      isDragging: false,
      dragBlock: {},
      positionDrop: []
    };
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.drawShadow = this.drawShadow.bind(this);
    console.log(this.state.targetCells);

    this.finalizado = false;
    this.pistaEncendida = false;
    this.dificultad = (this.props.info.dificultad ? this.props.info.dificultad : [0,true] );
    this.tiempoFinalizado = false;
  }

  componentDidMount() {
    if(this.dificultad[0] > 0){
      this.setState({ 
        time: this.dificultad[0],  
      });
      this.interval = setInterval(() => {
        this.setState(prevState => ({ time: prevState.time - 1 }));

        if(this.state.time <= 0){
          clearInterval(this.interval);
          this.tiempoFinalizado = true;
          this.forceUpdate();
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      }, 1000);
    }else{
      this.interval = setInterval(() => {
        this.setState(prevState => ({ time: prevState.time + 1 }));
      }, 1000);
    }
  }

  printSecondsinString(seconds){
    if(seconds<=0){
      return ("00");
    }
    let segundos = Math.floor(seconds) % 60;
    let segundos_0 = (segundos < 10) ? (`0${segundos}`) : segundos;
    return(""+segundos_0);
  }
  printMinutesinString(seconds){
    if(seconds<=0){
      return ("00");
    }
    let minutos = Math.floor(seconds / 60) % 60;
    let minutos_0 = (minutos < 10) ? (`0${minutos}`) : minutos;
    return(""+minutos_0);
  }
  printHoursinString(seconds){
    if(seconds<=0){
      return ("00");
    }
    let horas = Math.floor(seconds / 3600) % 24;
    let horas_0 = (horas < 10) ? (`0${horas}`) : horas;
    return(""+horas_0);
  }


  handleDrag(x, y, i) {
    let blocks = this.state.blocks;
    blocks[i].style = {
      position: "absolute",
      transform: "scale(1.28)",
      left: x-35,
      top: y-35,
      opacity: 0.7,
    }
    this.setState({
      blocks,
      isDragging: true,
      dragBlock: blocks[i],
    });
  }

  handleDrop(i){
    let onGrid = false;
    let piezaEnSuSitio = true;

    let letras = this.state.dragBlock.letras;
    let tablero = this.state.targetCells;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 27; j++) {
        if(tablero[i][j].color === SHADOW_COLOR){
          onGrid = true;
          break;
        }
      }
    }

    let startX = this.state.positionDrop[0];
    let startY = this.state.positionDrop[1];
    let numBucles = -1;
    for (let index in letras){ 
      
      if ((parseInt(index)) % 4 === 0){
        numBucles += 1;
      }
      let cellX = startX + numBucles, cellY = startY + (parseInt(index) % 4);
      if(letras[index] !== '0') {
        if (this.sentence[(cellX*27)+cellY] !== letras[index]){
          piezaEnSuSitio = false;
          break;
        }
      } 
    }

    if(onGrid && piezaEnSuSitio){
      numBucles = -1;
      for (let index in letras){ 
        if ((parseInt(index)) % 4 === 0){
          numBucles += 1;
        }
        let cellX = startX + numBucles, cellY = startY + (parseInt(index) % 4);
        if(letras[index] !== '0') {
          if (this.sentence[(cellX*27)+cellY] === letras[index]){
            tablero[cellX][cellY] = {
              color: PLACED_COLOR,
              used: 1,
              fill: this.sentence[(cellX*27)+cellY]
            };
          }
        } 
      }
      
      let grupoPiezas = this.state.blocks;
      grupoPiezas.splice(i, 1)
      if(grupoPiezas.length === 0){

        clearInterval(this.interval);
        this.finalizado = true;
        
        console.log("----------------   Terminaste     --------------")


      }

      this.setState({ 
        targetCells: tablero,
        isDragging: false,
        srcCells: grupoPiezas,
        dragBlock: {},
        positionDrop: []

      });

    }else{
      let srcCells = this.state.blocks;
      srcCells[i].style = {}
      this.setState({
        srcCells,
        isDragging: false,
        dragBlock: null,
        targetCells: this.clearShadow(),
        canDrop: true
      });
    }
  }

  clearShadow(){
    let cells = this.state.targetCells;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 27; j++) {
        if (cells[i][j].color === SHADOW_COLOR) {
          cells[i][j] = {
            color: "transparent",
            fill: cells[i][j].fill,
            used: 0
          };
        }
      }
    }
    return cells
  }


  drawShadow(x, y){
    if (this.state.isDragging) {
      let tablero = this.clearShadow();
      let letras_pieza = this.state.dragBlock.letras

      let startX = x - 1;
      let startY = y - 1;
      let numBucles = -1;

      let fueraTablero = false;
      for (let index in letras_pieza){
        if ((parseInt(index)) % 4 === 0){
          numBucles += 1;
        }
        let cellX = startX + numBucles, cellY = startY + (parseInt(index) % 4)
        if (letras_pieza[index] !== '0'){
          if (cellX>=10 || cellX<0 || cellY>=27 || cellY<0){
            fueraTablero = true;
          }
        }
      }
      
      numBucles = -1;
      for (let index in letras_pieza){
        if ((parseInt(index)) % 4 === 0){
          numBucles += 1;
        }
        let cellX = startX + numBucles;
        let cellY = startY + (parseInt(index) % 4)   
        if(cellX>=0 && cellX<10 && cellY>=0 && cellY<27){ 
          if(!tablero[cellX][cellY].used && letras_pieza[index] !== '0' && !fueraTablero){ 
            tablero[cellX][cellY] = {
              color: SHADOW_COLOR,
              fill: tablero[cellX][cellY].fill
            }
          } 
        } 
      }
      this.setState({
        targetCells: tablero,
        positionDrop: [startX, startY]
      });
    }
  }



  initTargetCells(letters, sentence){
    let targetCells = [];
    let alreadyUsed = 0;
    for (let x = 0; x < 10; x++) {
      targetCells.push([]);
      for (let y = 0; y < 27; y++) {
        
        for (let position in letters){
          if (letters[position][0] === x && letters[position][1] === y) {
            targetCells[x][y] = {
              color: "transparent",
              used: 0,
              fill: sentence[(x*27)+y]
            };
            alreadyUsed = 1;
          }
        }

        if (alreadyUsed === 0) {
          targetCells[x][y] = {
            color: "transparent",
            used: 0,
            fill: 0
          };
        }    
        alreadyUsed = 0;
      }
    }
    return targetCells;
  }

  // Array de strings  ->  array de arrays de 16 posiciones
  piecesInGoodArray(pieces){
    let finalArray = [];
    for (let numArray in pieces){
      let onePiece = pieces[numArray].split(',');
      for (let position in onePiece){
        if(onePiece[position] === ''){
          onePiece[position - 1] = onePiece[position-1]+","
          onePiece.splice(position, 1);
        }
      }

      if (onePiece.length < 16){
        let length = onePiece.length;
        for (let i=0 ; i < (16-length) ; i++){
          onePiece.push('0');
        }
      }

      // Control de errores
      if (onePiece.length !== 16){
        // Error en la base de datos en el apartado de la frase
        console.log(Error);

      }

      let oneElement = {
        letras: onePiece,
        style: {},
        used: 0
      }

      finalArray.push(oneElement);
    }
    return finalArray; 
  }


  // Array de string  ->  array de arrays
  lettersInGoodArray(letters){
    let finalArray = [];
    for (let position in letters){
      let newArray = letters[position].split(',');
      if (newArray.length === 2){
        newArray[0] = parseInt(newArray[0]);  // try del parse
        newArray[1] = parseInt(newArray[1]);

        if (newArray[0]>=10 || newArray[0]<0 || isNaN(newArray[0])){
            // error en el primer numero
            console.log(Error);
        }else if (newArray[1]>=27 || newArray[1]<0 || isNaN(newArray[1])){
            // error de rango en el segundo numero
            console.log(Error);
        }
      }else{

        // Error en la base de datos en el apartado de las letras
        console.log(Error);

      }
      finalArray.push(newArray);
    }

    return finalArray; 
  }


  // string  ->  array de arrays de strings
  senteceInGoodArray(sentence){
    let finalArray = sentence.split('');
    for (let position in finalArray){
      if(finalArray[position] === '.'){
        finalArray[position - 1] = finalArray[position-1]+"."
        finalArray.splice(position, 1);
      }
      if(finalArray[position] === ';'){
        finalArray[position - 1] = finalArray[position-1]+";"
        finalArray.splice(position, 1);
      }
      if(finalArray[position] === ','){
        finalArray[position - 1] = finalArray[position-1]+","
        finalArray.splice(position, 1);
      }
    }
    if (finalArray.length !== 270 ){

      // Error en la base de datos en el apartado de la frase

      console.log(Error);

    }
    console.log(finalArray)
    return finalArray; 
  }

  setPistaTablero = () => {
    if(!this.pistaEncendida){
      this.pistaEncendida = true;
      let targetCells_pista = this.state.targetCells;

      let piezas = this.state.blocks;
      let indexPieza = Math.floor(Math.random() * piezas.length);
      let blockPista = this.state.blocks[indexPieza]

      for(let x=0 ; x<10 ; x++){
        for(let y=0 ; y<27 ; y++){

          let piezaEnSuSitio = true;
          let numBucles = 0;
          for (let index in blockPista.letras){
            
            if ((parseInt(index)) % 4 === 0){
              numBucles += 1;
            }
            let cellX = x + numBucles - 1, cellY = y + (parseInt(index) % 4);
            
            if(blockPista.letras[index] !== '0') {
              if (this.sentence[(cellX*27)+cellY] !== blockPista.letras[index]){
                piezaEnSuSitio = false;
                break;
              }
            } 
          }

          if (piezaEnSuSitio){
            numBucles = 0;
            for (let index in blockPista.letras){ 
              if ((parseInt(index)) % 4 === 0){
                numBucles += 1;
              }
              let cellX = x + numBucles - 1, cellY = y + (parseInt(index) % 4);
              if(blockPista.letras[index] !== '0') {
                if (this.sentence[(cellX*27)+cellY] === blockPista.letras[index]){
                  targetCells_pista[cellX][cellY] = {
                    color: PISTA_COLOR,
                    used: targetCells_pista[cellX][cellY].used,
                    fill: targetCells_pista[cellX][cellY].fill,
                  };
                }
              } 
            }

            blockPista.style = {
              'color': 'rgb(133,0,133)',
              'text-shadow': '10px 10px 45px rgba(0, 0, 0, 1.0)',
              
            }
            console.log(blockPista)

            let tiempoAñadido = this.state.time;
            if(this.dificultad[0] === 0){
              tiempoAñadido = tiempoAñadido + 20;
            }else{
              tiempoAñadido = tiempoAñadido - 20;
            }
            this.setState({ 
              targetCells: targetCells_pista,  
              time: tiempoAñadido,  
              blocks: piezas,
            });

          }        
        }
      }    

      setTimeout(() => {
        let cells = this.state.targetCells;
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 27; j++) {
            if (cells[i][j].color === PISTA_COLOR) {
              cells[i][j] = {
                color: "transparent",
                fill: cells[i][j].fill,
                used: cells[i][j].used,
              };
            }
          }
        }
        
        blockPista.style = {}

        this.setState({ 
          targetCells: cells, 
          blocks: piezas,   
        });
        this.pistaEncendida = false;
      }, 6000);    
    }
  }


  render() {
    return (  
      <div className="General">
        {this.tiempoFinalizado && (
                <div className="popup-overlay3">
                    <div className="popup-content3">
                        <div className="text_up3">
                            Tiempo finalizado.
                        </div>
                    </div>
                </div>
            )}
        <div id="Arriba">
          <div id="Tablero" onMouseLeave={e => this.clearShadow()}> 
            <Tablero
              isDragging={this.state.isDragging}
              targetCells={this.state.targetCells}
              block={this.state.dragBlock}
              onBlockMove={this.drawShadow}
            />
          </div>

          <div id="Derecha">           
            <div id="Contador">
              <Contador 
                segundos={this.printSecondsinString(this.state.time)}
                minutos={this.printMinutesinString(this.state.time)}
                horas={this.printHoursinString(this.state.time)}
               />
            </div>
            <div id="Informacion">
              <div id="autorylibro">
                <div id="Autor">
                  {this.author}:
                </div>
                <div id="Libro">
                  « {this.book} »
                </div>
              </div>
              <div id="bloqueBotonPista">
                <button className="botonPista" onClick={this.setPistaTablero} disabled={this.dificultad[1] ? this.pistaEncendida : true}>Pista</button>
              </div>
            </div>
          </div>
        </div>

        <div id="Piezas">
          <Piezas
            onDrag={this.handleDrag}
            onDrop={this.handleDrop}
            arrayPiezas={this.state.blocks}
          />
        </div>

        <Clasificacion 
          mostrar={this.finalizado}
          tiempo={(this.dificultad[0] > 0) ? (this.dificultad[0] - this.state.time) : this.state.time}
        />
      </div>
    );
  }
}

export default Juego;