import React , { useEffect, useRef, useState }from "react";
import * as ml5 from 'ml5';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

import { drawHand, drawPose, checkHandStatus,HAND_STATUS,drawFace, isEyePraying} from "../utilities";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import "./Video.css"


const width = 800;
const height = 600;

function Video (){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [progress, setProgress] = useState(0)
    const [direction, setDirection] = useState(0)

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
        if (direction == 0) return;
        let timer = setInterval(() => {
            curr = curr + direction * 10;
            curr = curr < 0 ? 0 : curr > 100 ? 100: curr
            setProgress(curr)
        }, 500)
        return ()=>{
            console.log('clear timer')
            timer&&clearInterval(timer)
        }
    },[direction])


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
        <LinearProgress variant="determinate" value={progress} />
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
      );   
}

export default Video;