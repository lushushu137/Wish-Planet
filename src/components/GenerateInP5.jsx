import Sketch from 'react-p5';
import React , { useEffect, useRef, useState }from "react";
import 'p5/lib/addons/p5.sound';
import "./GenerateInP5.css"
import {generatingState} from '../utilities';
import generatedSoundSource from "../asset/music/generated.wav";
let seed = 2000;

let mic;
let fft;
let inColor;
let outColor;
let backgroundColor;
let canvaswidth = 400;
let canvasheight = 400;
let micOn;
let input;

let animPoint;

let curveXPoints = [];
let curveYPoints = [];
let circleSize = canvasheight / 2;

let pct = [];
let wavePos = [];

let m = 200;
let n = 200;

let state = generatingState.BEFORE;
let generatedSound;
function GenerateInP5(props) {
  const setup = (p5, canvasParentRef) => {

    p5.soundFormats('wav', 'ogg');
    generatedSound = p5.loadSound(generatedSoundSource);





    let cnv = p5.createCanvas(canvaswidth, canvasheight).parent(canvasParentRef);
    p5.randomSeed(seed);

    inColor = p5.color("#3B6A9E");
    outColor = p5.color("#EEFC84E8");
    mic = new p5.constructor.AudioIn();
    fft = new p5.constructor.FFT();
    mic.start();
    fft.setInput(mic);

    const start = () => {
      p5.userStartAudio();
      props.setGeneratingState(generatingState.MIDDLE)
      setTimeout(()=>{
        mic.stop();
        generatedSound.play()
        props.setGeneratingState(generatingState.END, p5, cnv)
        cnv.mousePressed(()=>{});
        console.log(p5.getAudioContext());
      }, 3000)
    }

    p5.getAudioContext().suspend()
    cnv.mousePressed(start);

   

  
  }



  const draw = (p5) => {

   // background(200);
   p5.fill(0,10,70,100);
   p5.circle(200, 200, circleSize);
  

  //Sound visual
  let wave = fft.waveform(); //每一帧得到一串数组1024个

  if (pct[0] == undefined) {
    //Sets all the initial points value to 0
    for (let i = 0; i < wave.length; i++) {
      pct[i] = 0;
      wavePos[i] = [0, 0];
    }
  }

  //Moves all of the points according to the soundwave
  let pointNum = 10; //几边形
  for (let i = 0; i < pointNum; i++) {
    let index = p5.floor(p5.map(i, 0, pointNum, 0, wave.length)); //floor取整

    if (pct[index] == 0) {
      wavePos[index][0] = wavePos[index][1];
      wavePos[index][1] = wave[index];
    }

    animPoint = p5.lerp(wavePos[index][0], wavePos[index][1], pct[index]);
    //lerp取两个点之间的值
    pct[index] += 0.3;

    if (pct[index] >= 1) {
      pct[index] = 0;
    }

    let amplitude = 100;
    let h = p5.constrain(animPoint * amplitude, 0, 150);
    let a = p5.cos(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * h;
    let o = p5.sin(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * h;

    curveXPoints[i] =
    p5.width / 2 +
      a +
      p5.cos(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * (circleSize / 2);
    curveYPoints[i] =
    p5.height / 2 +
      o +
      p5.sin(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * (circleSize / 2);
  }

  //Creates dots that follow the path of the sound wave
  for (let i = 0; i < pointNum; i++) {
    for (let j = 0; j < 1 - pointNum / 100; j += pointNum / 100) {
      //noStroke();

      let x = p5.curvePoint(
        curveXPoints[i % pointNum],
        curveXPoints[(i + 1) % pointNum],
        curveXPoints[(i + 2) % pointNum],
        curveXPoints[(i + 3) % pointNum],
        j
      );
      let y = p5.curvePoint(
        curveYPoints[i % pointNum],
        curveYPoints[(i + 1) % pointNum],
        curveYPoints[(i + 2) % pointNum],
        curveYPoints[(i + 3) % pointNum],
        j
      );

      p5.fill(outColor);
      //noStroke();
      p5.stroke(200,230,255,30);
      p5.line(m,n,x,y);
      p5.circle(x, y, 1);
      m = x;
      n = y;
    }
  }
  };





  return <div className='GenerateInP5'>
  <Sketch setup={setup} draw={draw} />
  </div>;

}

export default GenerateInP5;