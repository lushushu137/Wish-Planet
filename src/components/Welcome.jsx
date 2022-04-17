// import LoadingButton from '@mui/lab/LoadingButton';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import "./Welcome.css"
import { appState } from "../utilities";
import useSound from 'use-sound';
import bgm from "../asset/music/bgm.mp3";
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import {theme} from "../styles"

function Welcome(props) {
    const [play, data] = useSound(bgm);
    const [fadeIn, setFadeIn] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        data.sound?.onload?.push(()=>setLoading(false));
        data.sound?.loop()
    }, [data])
    const handleClick = () => {
        setFadeIn(false);
        setTimeout(()=>props.toNextState(appState.TUTORIAL), 1000)
        
        play();
    }

    return ( 
    <Fade in={fadeIn} timeout={1000}>
        <div className='Welcome'>
            <h1>Wish Planet</h1>
            <p>SEND A WISH UPON A STAR</p>
            
            <ThemeProvider theme={theme}>
            <Button 
            sx={{
                marginTop: 5
            }}
                onClick={handleClick}
                variant="outlined"
                disableElevation
                size="large"
                disabled = {loading? false: true}
            >Enter</Button>

            {/* <LoadingButton
            size="large"
            onClick={handleClick}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
            >
            Enter
            </LoadingButton> */}

            </ThemeProvider>
        </div>
    </Fade> 
    );
}

export default Welcome;