import React, { Component } from 'react';
import './Tablero.css'


class Tablero extends Component {

    constructor(props){
        super(props); 
        console.log(this.props);
    }

    handleMouseOver(i, j, e) {
        this.props.onBlockMove(i,j)
    }
    
    render () {
        let squares = [];
        let cells = this.props.targetCells;
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 27; y++) {
                let texto = '';
                if(cells[x][y].fill === 0){
                    texto = '';
                }else if (cells[x][y].fill === ' '){
                    texto = '⬛';
                }else{
                    texto = cells[x][y].fill;
                }
                squares.push(
                    <div
                        className="bloque_tablero"
                        style={{ backgroundColor: cells[x][y].color }}
                        onMouseOver={e => this.handleMouseOver(x, y)} 
                        key={(x*27)+y}
                    >{texto}</div>
                );
            }
        }    

        return (
            <div id="tablero">
                {Array.from(squares).map((i, index) =>
                    squares[index]
                )}
            </div>
        )
    }
}

export default Tablero;
