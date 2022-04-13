import Fade from '@mui/material/Fade';
import Sketch from 'react-p5';
import React , { useEffect, useRef, useState }from "react";
import * as ml5 from 'ml5';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import ShootingStar from "./ShootingStar";

import { drawHand, drawPose, checkHandStatus,HAND_STATUS,drawFace, isEyePraying, CATCH_STATUS, appState} from "../utilities";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import "./Game.css"


const width = 400;
const height = 300;

function Game (props){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const stateRef = useRef(null);
    const [text, setText] = useState("")
    const [progress, setProgress] = useState(0)
    const [direction, setDirection] = useState(0) // increase or decrease
    const [catchStatus, setCatchStatus] = useState(CATCH_STATUS.WAITING) 
    const [fadeIn, setFadeIn] = useState(true);

    // set video
    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            videoRef.current.onloadeddata = start;
        });
    }, [])
    useEffect(() => {
        stateRef.current = catchStatus;
      }, [catchStatus]);
    
    // state machine
    useEffect(() => {
        let waitTimeOut, catchTimeOut, successTimeOut, failTimeOut;
        switch (catchStatus){
            case CATCH_STATUS.WAITING:
                setText("waiting for a star...")
                setProgress(0);
                setDirection(0);
                waitTimeOut = setTimeout(() => {
                    setCatchStatus(CATCH_STATUS.CATCHING)
                }, 5000)
                return;
            case CATCH_STATUS.CATCHING:
                setText("Quick! Make a wish!")
                catchTimeOut = setTimeout(()=>{
                    if (stateRef.current == CATCH_STATUS.CATCHING){
                        setCatchStatus(CATCH_STATUS.FAIL)
                    }
                }, 10000)
                return;
            case CATCH_STATUS.SUCCESS:
                setText("You caught a star :)")
                successTimeOut=setTimeout(
                    () => {
                        setFadeIn(false)
                        setTimeout(()=>props.toNextState(appState.GENERATING),1000)
                    }, 2000)
                return;
            
            case CATCH_STATUS.FAIL:
                setText("You missed a star :(")
                failTimeOut = setTimeout(() => {
                    setCatchStatus(CATCH_STATUS.WAITING)
                }, 2000)
                return;
            default:
                break;
        }
        return (
            () => {
                clearTimeout(waitTimeOut)
                clearTimeout(catchTimeOut)
                clearTimeout(successTimeOut)
                clearTimeout(failTimeOut)
            }
        )
    },[catchStatus])


    // progress
    useEffect(()=>{
        let curr = progress;
        let timer;
        if (catchStatus == CATCH_STATUS.CATCHING) {
            timer = setInterval(() => {
                curr = curr + direction * 2;
                curr = curr < 0 ? 0 : curr
                if (curr > 100) {
                    setCatchStatus(CATCH_STATUS.SUCCESS);
                } 
                setProgress(curr)
            }, 100)
        }
      
        return ()=>{
            console.log('clear timer')
            timer&&clearInterval(timer)
        }
    },[catchStatus, direction])


    
    const start = ()=>{
        // detect hands closing;
        startPoseNet()
    }
      
    const startPoseNet = async() =>{
        const poseNet = ml5.poseNet(videoRef.current, {
            flipHorizontal:true, 
            detectionType:"single"
        } , poseModelLoaded,);
        function poseModelLoaded() {
            console.log('poseNet Loaded!');
        }
        poseNet.on('pose', (results) => {
            // drawPose(results, canvasRef.current)
            let handState = checkHandStatus(results, canvasRef.current);
            if (handState == HAND_STATUS.PRAYING) {
                setDirection(1)
            } else {
                setDirection(-1)
            }
        });
    }
    return (
    <Fade in={fadeIn} timeout={1000}>
        
        <div className="Game">
            <h2>{text}</h2>
            <LinearProgress 
                sx={{
                    opacity: catchStatus == CATCH_STATUS.CATCHING ? 1 : 0,
                    height: 10,
                    borderRadius: 5,
                    width: 300,
                    marginBottom: 20
                }}
                variant="determinate" value={progress}/>
             <div className="videoAndCanvas">
                <video
                    ref={videoRef}
                    className="video"
                    width={width}
                    height={height}
                />
                <canvas
                    ref={canvasRef}
                    className="canvas"  
                    width={width}
                    height={height}
                ></canvas>
             </div>
             <ShootingStar
              direction={direction}
              currentState={catchStatus}
            />
        </div>
    </Fade> 

      );   
}

export default Game;



