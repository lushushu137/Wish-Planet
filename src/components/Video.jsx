import React , { useEffect, useRef, useState }from "react";
import * as ml5 from 'ml5';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

import { drawHand, drawPose, checkHandStatus,HAND_STATUS,drawFace, isEyePraying} from "../utilities";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import "./Video.css"


const width = 400;
const height = 300;

const catchStatus = {
    WAITING: Symbol(),
    CATCHING: Symbol(),
    SUCCESS: Symbol(),
    FAIL: Symbol(),
}

function Video (props){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [text, setText] = useState("")
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [progress, setProgress] = useState(0)
    const [direction, setDirection] = useState(0)
    const [shooting, setShooting] = useState(false)
    const [catched, setCatched] = useState(catchStatus.WAITING)

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
    // progress
    useEffect(()=>{
        let curr = progress;
        let timer;
        if (direction != 0 && shooting) {
            timer = setInterval(() => {
                curr = curr + direction*2;
                curr = curr < 0 ? 0 : curr
                if (curr > 100) {
                    setCatched(catchStatus.SUCCESS)
                    setShowProgressBar(false)
                    setText("You catched a star :)")
                } 
                setProgress(curr)
            }, 50)
        }
      
        return ()=>{
            console.log('clear timer')
            timer&&clearInterval(timer)
        }
    },[direction,shooting])

    // mock shooting star
    useEffect(() => {
        if (!props.shooting) {
            setShooting(false);
            setCatched(catchStatus.CATCHING);
            if (catched == catchStatus.FAIL || catched == catchStatus.CATCHING){
                setShowProgressBar(false)
                setText("You missed a star :(")
            }  else if (catched == catchStatus.WAITING){
                setText("waiting for a star...")
                setShowProgressBar(false)
            }
        } else{
            setShowProgressBar(true)
            setText("Quick! Make a wish!")
            setShooting(true)
        }
       
    },[props.shooting])

    
    const start = ()=>{
        // detect hands closing;
        startPoseNet()
        //  detect eyes closing
        // startFeceMesh()
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
            drawPose(results, canvasRef.current)
            let handState = checkHandStatus(results, canvasRef.current);
            if (handState == HAND_STATUS.PRAYING) {
                setDirection(1)
            } else {
                setDirection(-1)
            }
        });
    }
    function startFeceMesh(){
        const facemesh = ml5.facemesh(videoRef.current, 
            {
            // flipHorizontal:true, 
            // predictIrises: true,
            maxFaces:1
        },
        faceModelLoaded);
        function faceModelLoaded(){
            console.log('facemesh Loaded!');
        }
        facemesh.on('face', results => {
         drawFace(results, canvasRef.current)
         isEyePraying(results, canvasRef.current)
        })
    }
    return (
        <div className="Video">
            <h2>{text}</h2>
            <LinearProgress 
                sx={{
                    opacity: showProgressBar ? 1 : 0,
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
           
        </div>
      );   
}

export default Video;