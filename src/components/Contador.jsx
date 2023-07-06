import React, { Component } from "react";
import './Contador.css'


class Contador extends Component {

    render() {
        return (
            <div className="container">
                <div id="timer">
                    <div className="hours"> 
                        <div className="numbers" key="horas"> {this.props.horas} </div>
                            HORAS
                    </div > 
                    
                    <div className="minutes"> 
                        <div className="numbers" key="minutos">{this.props.minutos}</div>
                            MINUTOS
                    </div> 

                    <div className="seconds"> 
                        <div className="numbers" key="segundos">{this.props.segundos}</div>
                            SEGUNDOS
                    </div> 
                </div>
            </div>
        );
    }
}
export default Contador;