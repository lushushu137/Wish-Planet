import Sketch from 'react-p5';
import React , { useEffect, useState }from "react";
import { CATCH_STATUS } from "../utilities";
import {starData} from "../starData";
import PlanetCard from "./PlanetCard"
import "./ShootingStar.css"
import jingleBell from "../asset/music/jingleBell.mp3"
import drone from "../asset/music/drone.wav"
import 'p5/lib/addons/p5.sound';

let osc, envelope, oscPlaying;
let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];

let position;
let velocity;
let slowVelocity;

let height;
let width;

let hoverState = undefined

let shootSound;
let jingleSound;
let jingleVol = 0;

let startTime;

function ShootingStar(props) {
  const [showCard, setShowCard] = useState(undefined);

  const preload = (p5) => {
    // sound setup
    shootSound = p5.loadSound(drone);
    jingleSound = p5.loadSound(jingleBell);
    // caughtSound = p5.loadSound(caught)
    jingleSound.setLoop(true)
    shootSound.setLoop(false)
    console.log(shootSound)
  }

  const setup = (p5, canvasParentRef) => {
    [height, width] = [p5.windowHeight, p5.windowWidth];
    p5.createCanvas(width, height).parent(canvasParentRef);

    position = p5.createVector(width*0.8, 0);
    velocity = p5.createVector(-1,0.8)
    slowVelocity = p5.createVector(-1,0.8)
    velocity.mult(1.5);
    slowVelocity.mult(0.5)

    for (let i = 0; i< starData.length; i++){
      starData[i]["freq"] = p5.random(500,1000)
    }

    osc = new p5.constructor.Oscillator('sine');
    envelope = new p5.constructor.Envelope();
    envelope.setADSR(0.001, 0.5, 0.1, 0.5);
    envelope.setRange(1, 0);

    // osc.start();
console.log("osc:", osc)
console.log("envelope:", envelope)




  }
  function star(x, y, radius1, radius2, npoints, p5, freq) {
    let angle = p5.TWO_PI / npoints;
    let halfAngle = angle / 2.0;

    let color = p5.color(255, 255, 255)
    color.setAlpha(200 + 56 * p5.sin(p5.millis() / freq));
    p5.noStroke();

    p5.beginShape();
    for (let a = 0; a < p5.TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      p5.vertex(sx, sy);
    }
    p5.fill(color)
    p5.endShape(p5.CLOSE);
  }
  const renderStars = (p5)=>{
    for (let i = 0; i < starData.length; i++){
      p5.push();
      p5.translate(starData[i].x*width, height * starData[i].y);
      p5.rotate(p5.frameCount / -200.0);
      star(0, 0, starData[i].radius1, starData[i].radius2, 6,p5, starData[i].freq);
      p5.pop();
    }
  }
  const draw = (p5) => {
    p5.clear();

    // hover to see detail
    let hit = false;
    for (let i = 0; i < starData.length; i++){
      let distance =p5.dist(p5.mouseX, p5.mouseY, starData[i].x*width, height * starData[i].y)
      if (distance < starData[i].radius2) {
        hit = true
        if (!hoverState || hoverState.id !== starData[i].id){
          hoverState = starData[i]
          setShowCard({...hoverState, posX: starData[i].x * width-120, posY:starData[i].y * height + 50});
          let freqValue = p5.midiToFreq(scaleArray[starData[i].id % scaleArray.length]);
          osc.freq(freqValue);
          if (!osc.started){
            osc.start();
          }
          envelope.play(osc, 0, 0.1);
        }
      }
    }

    if (oscPlaying) {
      // smooth the transitions by 0.1 seconds
      osc.freq(p5.midiToFreq(60), 0.1);
    }


    if (!hit){
      hoverState = undefined;
      setShowCard(undefined)
    }
  
    switch(props.currentState){
      case CATCH_STATUS.SHOW_LAST_STAR:
        if (props.newStar){
          console.log("props.newStar:", props.newStar)
          p5.push();
          p5.translate(props.newStar.x*width, height * props.newStar.y);
          p5.rotate(p5.frameCount / -200.0);
          star(0, 0, props.newStar.radius1, props.newStar.radius2, 6,p5);
          p5.pop();
        }
        return;
      case CATCH_STATUS.WAITING:
        position = p5.createVector(width*0.8, 0);
        renderStars(p5)
        return;
      case CATCH_STATUS.CATCHING:
        startTime = startTime ? startTime : p5.millis();
        renderStars(p5)

         // draw shooting star
         star(position.x, position.y, 5, 25, 6,p5);
         if (props.direction == 1 || props.direction == 0){
           position.add(slowVelocity);
         }
         if (props.direction == -1){
           position.add(velocity);
         }
 
         // sound
         if (!shootSound.isPlaying()){
           shootSound.play()
         }
         if (!jingleSound.isLooping()){
           jingleSound.play()
         }
         if (props.direction == -1){
           jingleVol = jingleVol<0?0:jingleVol>1?1:jingleVol - 0.02
         } else if (props.direction == 1) {
           jingleVol = jingleVol<0?0:jingleVol>1?1:jingleVol + 0.02
         }
         jingleSound.amp(jingleVol)

         let now = p5.millis();
         let panning = p5.map(now-startTime, 0, 10000, 1.0, -1.0, true);
         shootSound.pan(panning);
         return;
      case CATCH_STATUS.FAIL:
        renderStars(p5);
        startTime = undefined;
        if (jingleSound.isLooping()){
          jingleSound.amp(0)
          jingleSound.stop();
        }
        return;
      case CATCH_STATUS.SUCCESS:
        renderStars(p5)
        if (jingleSound.isLooping()){
          jingleSound.amp(0)
          jingleSound.stop();
        }
        return;
      default:
        break;
    }

   
};
  return (<div className="ShootingStar" style={{position:"absolute"}}>
  <Sketch preload={preload} setup={setup} draw={draw} />
    {showCard ? 
        <PlanetCard planetInfo = {showCard}/>
    :null
    }
  </div>);
  }


export default ShootingStar;