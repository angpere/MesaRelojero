import React, { Component } from 'react';
import './Piezas.css'

import Pieza from '../components/Pieza'

class Piezas extends Component {
    
    constructor(props) {
      super(props);
      this.handleDrag = this.handleDrag.bind(this);
      this.handleDrop = this.handleDrop.bind(this);
      console.log(this.props.arrayPiezas)
    }
  
    handleDrag(i, x, y) {
      this.props.onDrag(x, y, i);
    }
  
    handleDrop(i){
      this.props.onDrop(i)
    }
  
    render() {
        return (
            <div className="muchas_piezas">
                {Array.from(this.props.arrayPiezas).map((piece, index) =>
                    <Pieza 
                        key={index} 
                        isDrag={this.handleDrag.bind(this, index)} 
                        isDrop={this.handleDrop.bind(this, index)} 
                        piece={piece}
                    />
                )}
            </div>
        );
    }

}
export default Piezas;