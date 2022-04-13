import React, { useEffect, useState } from 'react';
import "./Welcome.css"
import { appState } from "../utilities";
import useSound from 'use-sound';
import bgm from "../asset/music/bgm.mp3";
import Fade from '@mui/material/Fade';

function Welcome(props) {
    const [play, data] = useSound(bgm);
    const [fadeIn, setFadeIn] = useState(true);

    const handleClick = () => {
        setFadeIn(false);
        setTimeout(()=>props.toNextState(appState.TUTORIAL), 1000)
        
        play();
        data.sound.loop()
    }

    return ( 
    <Fade in={fadeIn} timeout={1000}>
        <div className='Welcome'>
            <h1>Wish Planet</h1>
            <button className='btn' onClick={handleClick}>Enter</button>
        </div>
    </Fade> 
    );
}

export default Welcome;