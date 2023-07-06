import React, { Component } from "react";
import './Pieza.css'


class Pieza extends Component {
  
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleMouseDown(e) {
        e.preventDefault()
        console.log(e.target)
        let moveHandler = e => {
            let x = e.clientX
            let y = e.clientY
            this.props.isDrag(x, y);
        };
        document.onmousemove = moveHandler
        document.ontouchmove = moveHandler
        let upHandler = e => {

            // // Para no aguantar el click
            // if(e.target.className !== 'contenedor_pieza'){  
            //   return
            // }

            this.props.isDrop();
            document.onmousemove = null;
        };
        document.onmouseup = upHandler
        document.ontouchend = upHandler
      }

    numColumUsed(letras) {
        let numCols = 2;
        for (let index in letras){
            if (((parseInt(index)+1) % 4 === 0) && (letras[index] !== '0' && letras[index] !== 0)){
                return 4;
            }
            if (((parseInt(index)+2) % 4 === 0) && (letras[index] !== '0' && letras[index] !== 0)){
                numCols = 3;
            }
        }
        return numCols;
    }


    render() {
        let pieza = []
        let contendor_pieza = []
        if (this.numColumUsed(this.props.piece.letras) === 4) {
            for (let letra in this.props.piece.letras){
                if(this.props.piece.letras[letra] === ' '){
                    pieza.push(
                        <div className="una_letra">
                            {'⬛'}
                        </div>
                    )
                }else if(this.props.piece.letras[letra] === '0'){
                    pieza.push(
                        <div className="una_letra_vacia">
                            {''}
                        </div>
                    )
                }else{
                    pieza.push(
                        <div className="una_letra">
                            {(this.props.piece.letras[letra])}
                        </div>
                    )
                }
            }
        }else if(this.numColumUsed(this.props.piece.letras) === 3){
            for (let letra in this.props.piece.letras){
                if (((parseInt(letra)+1) % 4 !== 0)){
                    if(this.props.piece.letras[letra] === ' '){
                        pieza.push(
                            <div className="una_letra">
                                {'⬛'}
                            </div>
                        )
                    }else if(this.props.piece.letras[letra] === '0'){
                        pieza.push(
                            <div className="una_letra_vacia">
                                {''}
                            </div>
                        )
                    }else{
                        pieza.push(
                            <div className="una_letra" >
                                {(this.props.piece.letras[letra])}
                            </div>
                        )
                    }
                }
            }
        }else if(this.numColumUsed(this.props.piece.letras) === 2){
            for (let letra in this.props.piece.letras){
                if (((parseInt(letra)+1) % 4 !== 0) && ((parseInt(letra)+2) % 4 !== 0)){
                    if(this.props.piece.letras[letra] === ' '){
                        pieza.push(
                            <div className="una_letra">
                                {'⬛'}
                            </div>
                        )
                    }else if(this.props.piece.letras[letra] === '0'){
                        pieza.push(
                            <div className="una_letra_vacia">
                                {''}
                            </div>
                        )
                    }else{
                        pieza.push(
                            <div className="una_letra">
                                {(this.props.piece.letras[letra])}
                            </div>
                        )
                    }
                }
            }
        }
        
        if (this.numColumUsed(this.props.piece.letras) === 2){
            contendor_pieza.push(
                <div
                    className="una_pieza_2"
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleMouseDown}
                    style={this.props.piece.style}
                    key={pieza}
                >
                    {pieza}

                </div>
            )
        }  else if (this.numColumUsed(this.props.piece.letras) === 3){
            contendor_pieza.push(
                <div
                    className="una_pieza_3"
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleMouseDown}
                    style={this.props.piece.style}
                    key={pieza}
                >
                    {pieza}

                </div>
            )
        } else {
            contendor_pieza.push(
                <div
                    className="una_pieza_4"
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleMouseDown}
                    style={this.props.piece.style}
                    key={pieza}
                >
                    {pieza}

                </div>
            )
        }

        return (
            <div 
                className="contenedor_pieza"
            >
                {contendor_pieza}
           </div> 
        );
    }
}

export default Pieza;
