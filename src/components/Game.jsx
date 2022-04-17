import Fade from '@mui/material/Fade';
import React , { useEffect, useRef, useState }from "react";
import * as ml5 from 'ml5';
import LinearProgress from '@mui/material/LinearProgress';
import ShootingStar from "./ShootingStar";
import guide from '../asset/pic/guide.png'
import guide2 from '../asset/pic/guide2.png'
import guide3 from '../asset/pic/guide3.png'
import { checkHandStatus,HAND_STATUS, CATCH_STATUS, appState, sleep} from "../utilities";
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
    const [catchStatus, setCatchStatus] = useState(CATCH_STATUS.SHOW_LAST_STAR) 
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
        let showLastStarTimeOut, waitTimeOut, catchTimeOut, successTimeOut, failTimeOut;
        switch (catchStatus){
            case CATCH_STATUS.SHOW_LAST_STAR:
                if (!!props.newStarData){
                    console.log(props.newStarData);
                    showLastStarTimeOut = setTimeout(()=>{
                        props.clearNewStar(undefined)
                        setCatchStatus(CATCH_STATUS.WAITING)
                    }, 3000)
                } else {
                    setCatchStatus(CATCH_STATUS.WAITING)
                }
                return;
            case CATCH_STATUS.WAITING:
                setText("Waiting for a star...")
                setProgress(0);
                setDirection(0);
                waitTimeOut = setTimeout(() => {
                    setCatchStatus(CATCH_STATUS.CATCHING)
                }, 5000 * (props.gameLoop + 1))
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
                props.playSound("caughtSound");
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
                clearTimeout(showLastStarTimeOut)
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
            <h3>{text}</h3>
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
                    style={{"opacity": catchStatus == CATCH_STATUS.SHOW_LAST_STAR ? 0 : 1}}
                />
                {/* <canvas
                    ref={canvasRef}
                    className="canvas"  
                    width={width}
                    height={height}
                ></canvas> */}
                <Fade in={catchStatus == CATCH_STATUS.CATCHING} timeout={1000}>
                    <img className='guide' src={guide3} />
                </Fade> 
                
             </div>
             <ShootingStar
              direction={direction}
              currentState={catchStatus}
              newStar={props.newStarData}
            />
        </div>
    </Fade> 

      );   
}

export default Game;



