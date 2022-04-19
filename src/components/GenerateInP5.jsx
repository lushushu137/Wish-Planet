import Sketch from 'react-p5';
import React , { useEffect, useRef, useState }from "react";
import 'p5/lib/addons/p5.sound';
import "./GenerateInP5.css"
import {generatingState} from '../utilities';
import generatedSoundSource from "../asset/music/generated.wav";
import MicIcon from '@mui/icons-material/Mic';
import { IconButton } from '@mui/material';
import {theme} from "../styles"
import { ThemeProvider } from '@mui/material/styles';

let seed = Math.random() * 2000;

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

let generatedSound;


let clr = [
  {x:"#FFEED3", y:"#621717"},
{x:"#E5FFE8", y:"#022906"},
{x:"#D0EEFF", y:"#1C229B"},
{x:"#EC7BE1", y:"#8D782A"},
{x:"#A09FDA", y:"#A10D43"},
{x:"#C48ACD", y:"#248D87"},
{x:"#8BBCF6", y:"#8C254A"},
{x:"#EC7B7B", y:"#70BDAF"}
]


let colorPair
let slevel;
let volume = 10;
let lastvolume;
let volumedistance;
let aimvolume;
let currentc = 0;
let maxvolume = 0;
let currentr = 0;
let coll;
let col3;
let col4;
let col5;
let linecolor;
let colors1 = [" #BB9999"," #7F6969","#B2AE97","#AFB8A3","#9AB6AE","#7F9597"," #848E9C","#7F7999","#9A85A1","#947583","#866B6B"," #4C5777","#4E4263","#313C4C", "#FC6565","#E48C38","#EC1E6D"];
let colors2 = ["#FEE1E1","rgb(252,250,225)","rgb(190,233,252)","rgb(255,213,216)","rgb(216,239,246)"
];
function GenerateInP5(props) {
  const btnRef = useRef(null);
  const [state, setState] = useState(generatingState.BEFORE)
  let recording = false;
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

    
    p5.push();
    p5.noStroke();
    p5.translate(p5.width / 2, p5.height / 2);

    colorPair = p5.random(clr)
    col3 = p5.color(colorPair.x);
    col4 = p5.color(colorPair.y);

    let circleR = p5.width / 2;
    var grad = p5.drawingContext.createLinearGradient(
      0,
      0,
      -circleR / 2,
      -circleR / 2
    );
    grad.addColorStop(0, col3);
    grad.addColorStop(1, col4);
    p5.drawingContext.fillStyle = grad;
    p5.circle(0, 0, circleR);
      p5.pop()

    const handleClick = () => {
      if (recording){
        stop()
      } else {
        start()
        recording = !recording;
      }
    }
    const start = () => {
      p5.userStartAudio();
      setState(generatingState.MIDDLE)
      props.setGeneratingState(generatingState.MIDDLE)
    }
    const stop =()=> {
      mic.stop();
      generatedSound.play()
      setState(generatingState.END)
      props.setGeneratingState(generatingState.END, p5, cnv)
      btnRef.current?.removeEventListener('click', handleClick);
    }

    p5.getAudioContext().suspend()

    btnRef.current?.addEventListener('click', handleClick)
    console.log(mic)
  }

  function draw2(p5) {
    if (state == generatingState.MIDDLE){
       ////////////////// get MAX volume ////
    slevel = mic.getLevel();
    volume = p5.round(slevel * 2000); //(5,200)
    volumedistance = p5.abs(volume - lastvolume);
    ///////////////////////////////////////
    if (volumedistance > 10) {
      aimvolume = volume;
    } else {}
    if (currentc < aimvolume) {
      currentc += 2;
    } else {
      currentc -= 2;
    }
    currentr=p5.map(currentc,-10,200,10,80);
    // print(currentr);
    lastvolume= volume;
    //////////
    //star
    p5.randomSeed(seed);
    p5.noStroke();
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    // audio gradient
    col3 = p5.color(colorPair.x);
    coll = col3;
    let addr =p5.red(col3);
    let addg =p5.green(col3);
    let addb =p5.blue(col3);
    console.log("currentc:", currentc)
    console.log("addr:", addr)

    col3.setRed(currentc+addr);
    col3.setBlue(currentc+addb);
    col3.setGreen(currentc+addg);
    
    col4 = p5.color(colorPair.y);
    let addr4 = p5.red(col4);
    let addg4 = p5.green(col4);
    let addb4 = p5.blue(col4);
    col4.setRed(currentr+addr4);
    col4.setBlue(currentr+addb4);
    col4.setGreen(currentr+addg4);
    
    let circleR = p5.width / 2;
    var grad = p5.drawingContext.createLinearGradient(
      0,
      0,
      -circleR / 2,
      -circleR / 2
    );
    grad.addColorStop(0, col3);
    grad.addColorStop(1, col4);
    p5.drawingContext.fillStyle = grad;
    p5.circle(0, 0, circleR);
    p5.pop();
    linecolor = coll;
    ///////////////////////////////////////////////////////
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
  
      let amplitude = 250;
      let h = p5.constrain(animPoint * amplitude, 0, 90);
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
        /////draw dot and line     
        p5.stroke(255,255,255,40);//change
        p5.strokeWeight(1.5);
        p5.line(m, n, x, y);
        p5.fill(linecolor);
        p5.circle(x, y, 0.6);
        m = x;
        n = y;
      }
    }
    }
   
  }
  const draw = (p5) => {

     ////////////////// get MAX volume ////
  slevel = mic.getLevel();
  volume = p5.round(slevel * 2000); //(5,200)
  if (maxvolume < volume) {
    maxvolume = volume;
  }else{}
  if (currentr < maxvolume) {
    currentr += 7;
  } else {
    currentr = maxvolume;
  }
  ///////////////////////////////////////
  
  //////////
  //star
  p5.randomSeed(seed);
  p5.noStroke();
  p5.push();
  p5.translate(p5.width / 2, p5.height / 2);

  // audio gradient
  col4 = p5.color(p5.random(colors1));
  col4.setRed(currentr);
  // col4.setGreen(currentr);
  // col4.setBlue(currentr);
  col3 = p5.color(p5.random(colors1));
  col5 = p5.random(colors2);

  let circleR = p5.width / 2;
  var grad = p5.drawingContext.createLinearGradient(
    0,
    0,
    -circleR / 2,
    -circleR / 2
  );
  grad.addColorStop(0, col3);
  grad.addColorStop(1, col4);

  p5.drawingContext.fillStyle = grad;
  p5.circle(0, 0, circleR);
  p5.pop();
  linecolor = col5;
  ///////////////////////////////////////////////////////
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

    let amplitude = 200;
    let h = p5.constrain(animPoint * amplitude, 0, 90);
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
      /////draw dot and line
      p5.fill(linecolor);
      p5.stroke(200, 230, 255, 35);
      p5.line(m, n, x, y);
      p5.circle(x, y, 1.3);
      m = x;
      n = y;
    }
  }



  //  // background(200);
  //  p5.fill(0,10,70,100);
  //  p5.circle(200, 200, circleSize);
  

  // //Sound visual
  // let wave = fft.waveform(); //每一帧得到一串数组1024个

  // if (pct[0] == undefined) {
  //   //Sets all the initial points value to 0
  //   for (let i = 0; i < wave.length; i++) {
  //     pct[i] = 0;
  //     wavePos[i] = [0, 0];
  //   }
  // }

  // //Moves all of the points according to the soundwave
  // let pointNum = 10; //几边形
  // for (let i = 0; i < pointNum; i++) {
  //   let index = p5.floor(p5.map(i, 0, pointNum, 0, wave.length)); //floor取整

  //   if (pct[index] == 0) {
  //     wavePos[index][0] = wavePos[index][1];
  //     wavePos[index][1] = wave[index];
  //   }

  //   animPoint = p5.lerp(wavePos[index][0], wavePos[index][1], pct[index]);
  //   //lerp取两个点之间的值
  //   pct[index] += 0.3;

  //   if (pct[index] >= 1) {
  //     pct[index] = 0;
  //   }

  //   let amplitude = 100;
  //   let h = p5.constrain(animPoint * amplitude, 0, 150);
  //   let a = p5.cos(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * h;
  //   let o = p5.sin(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * h;

  //   curveXPoints[i] =
  //   p5.width / 2 +
  //     a +
  //     p5.cos(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * (circleSize / 2);
  //   curveYPoints[i] =
  //   p5.height / 2 +
  //     o +
  //     p5.sin(p5.radians(p5.map(i, 0, pointNum, 0, 360))) * (circleSize / 2);
  // }

  // //Creates dots that follow the path of the sound wave
  // for (let i = 0; i < pointNum; i++) {
  //   for (let j = 0; j < 1 - pointNum / 100; j += pointNum / 100) {
  //     //noStroke();

  //     let x = p5.curvePoint(
  //       curveXPoints[i % pointNum],
  //       curveXPoints[(i + 1) % pointNum],
  //       curveXPoints[(i + 2) % pointNum],
  //       curveXPoints[(i + 3) % pointNum],
  //       j
  //     );
  //     let y = p5.curvePoint(
  //       curveYPoints[i % pointNum],
  //       curveYPoints[(i + 1) % pointNum],
  //       curveYPoints[(i + 2) % pointNum],
  //       curveYPoints[(i + 3) % pointNum],
  //       j
  //     );

  //     p5.fill(outColor);
  //     //noStroke();
  //     p5.stroke(200,230,255,30);
  //     p5.line(m,n,x,y);
  //     p5.circle(x, y, 1);
  //     m = x;
  //     n = y;
  //   }
  // }
  };





  return <div className='GenerateInP5'>
  {state == generatingState.END ? null : 
    <div className='start-icon'>
          <ThemeProvider theme={theme}>

      <IconButton 
      size={"large"}
        ref={btnRef} 
        color={
          state == generatingState.BEFORE ? "primary" 
          : "secondary"
        } 
        >
            <MicIcon fontSize="large"></MicIcon>
      </IconButton>
      </ThemeProvider>
  </div>
  }
  
  <Sketch setup={setup} draw={draw} />
    
  </div>;

}

export default GenerateInP5;