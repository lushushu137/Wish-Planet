import React, { useState } from 'react';
import { appState } from "../utilities";
import "./Tutorial.css"
import Fade from '@mui/material/Fade';


function Tutorial(props) {
    const [fadeIn, setFadeIn] = useState(true);
    const handleClick = () => {
        setFadeIn(false);
        setTimeout(()=>props.toNextState(appState.GAMING), 1000)
    }

    return ( 
        <Fade in={fadeIn} timeout={1000}>
    
    <div className='Tutorial'>
        <div className="container">
            <p>{"Catch a shooting star by putting your hands together!"}</p>
            <div className="tutorial-pic">
                <img src="" alt="some pic here"></img>
            </div>
            <button className="btn" onClick={handleClick}>LET'S GO</button>
        </div>
        
    </div> 
    </Fade> 
    
    );
}

export default Tutorial;