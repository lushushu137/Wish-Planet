import { checkHandStatus,HAND_STATUS, CATCH_STATUS, appState, sleep} from "../utilities";
import * as ml5 from 'ml5';
// import LoadingButton from '@mui/lab/LoadingButton';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import "./Welcome.css"
import useSound from 'use-sound';
import bgm from "../asset/music/bgm.mp3";
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import {theme} from "../styles"

function Welcome(props) {
    const [play, data] = useSound(bgm);
    const [fadeIn, setFadeIn] = useState(true);

    const [videoLoaded, setVideoLoaded] = useState(false)

    useEffect(()=>{
        data.sound?.loop();
    }, [data])

    // set video
    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            props.videoRef.current.srcObject = stream;
            props.videoRef.current.play();
            props.videoRef.current.onloadeddata = start;
        });
    }, [])
    const start = ()=>{
        // detect hands closing;
        startPoseNet();
    }

    const startPoseNet = () =>{
        const poseNet = ml5.poseNet(props.videoRef.current, {
            flipHorizontal:true, 
            detectionType:"single"
        } , poseModelLoaded,);
        function poseModelLoaded() {
            setVideoLoaded(true);

        }
        poseNet.on('pose', (results) => {
            let handState = checkHandStatus(results);
            if (handState == HAND_STATUS.PRAYING) {
                props.setDirection(1)
            } else {
                props.setDirection(-1)
            }
        });
    }







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

            {
                videoLoaded ?
            <Button 
                    onClick={handleClick}
                    variant="outlined"
                    disableElevation
                    size="large"
                >Enter
            </Button> :
            <p>LOADING...</p>
            //  <Button 
            //  sx={{
            //      marginTop: 5
            //  }}
            //      variant="outlined"
            //      disableElevation
            //      size="large"
            //      disabled
            //  >Loading...
            // </Button> 
            }



            </ThemeProvider>
        </div>
    </Fade> 
    );
}

export default Welcome;