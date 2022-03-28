import React , { useEffect, useRef }from "react";
import * as ml5 from 'ml5';
import { drawHand, drawPose, isHandPraying,drawFace, isEyePraying} from "../utilities";

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';



const width = 800;
const height = 600;
const videoStyle ={
    position: "absolute",
    top:"50%",
    left:"50%",
    transform: "translate(-50%, -50%) rotateY(180deg)",
    textAlign: "center",
    zIndex: 9,
    width: width,
    height: height,
  }
  const canvasStyle={
      ...videoStyle,
      transform: "translate(-50%, -50%)"
  }

function Video (){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            videoRef.current.onloadeddata = start;
        });
    }, [])

    const start = ()=>{
        // detect hands closing;
        startPoseNet()
        //  detect eyes closing
        startFeceMesh()
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
            isHandPraying(results, canvasRef.current)
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
        <div>
          <video
            ref={videoRef}
            style={videoStyle}
            width={width}
            height={height}
            />
            <canvas
              ref={canvasRef}
              style={canvasStyle}
              width={width}
              height={height}
            ></canvas>
        </div>
      );   
}

export default Video;