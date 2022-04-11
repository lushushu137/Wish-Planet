import React from 'react';
import "./Welcome.css"
import { appState } from "../utilities";

function Welcome(props) {
    const handleClick = () => {
        props.toNextState(appState.TUTORIAL);
    }
    return ( <div className='Welcome'>
        <h1>Wish Planet</h1>
        <button className='btn' onClick={handleClick}>Enter</button>
    </div> );
}

export default Welcome;