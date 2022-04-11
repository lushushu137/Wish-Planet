import React from 'react';
import { appState } from "../utilities";
import "./Tutorial.css"


function Tutorial(props) {
    const handleClick = () => {
        props.toNextState(appState.GAMING)
    }

    return ( <div className='Tutorial'>
        <div className="container">
            <p>{"Catch a shooting star by putting your hands together!"}</p>
            <div className="tutorial-pic">
                <img src="" alt="some pic here"></img>
            </div>
            <button className="btn" onClick={handleClick}>LET'S GO</button>
        </div>
        
    </div> );
}

export default Tutorial;