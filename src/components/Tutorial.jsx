import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {theme} from "../styles"

import React, { useState } from 'react';
import { appState } from "../utilities";
import "./Tutorial.css"
import Fade from '@mui/material/Fade';
import GuideGif from '../asset/pic/guidegif.gif'

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
                <img src={GuideGif} alt="some pic here"></img>
            </div>
            <ThemeProvider theme={theme}>
            <Button 
                onClick={handleClick}
                variant="outlined"
                disableElevation
            >LET'S GO</Button>
            </ThemeProvider>
        </div>
        
    </div> 
    </Fade> 
    
    );
}

export default Tutorial;