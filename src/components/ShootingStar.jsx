import Sketch from 'react-p5';
import React , { useEffect, useState }from "react";
import { CATCH_STATUS } from "../utilities";
import {starData} from "../starData";
import PlanetCard from "./PlanetCard"
import "./ShootingStar.css"
import jingleBell from "../asset/music/jingleBell.mp3"
import drone from "../asset/music/drone.wav"
import caught from "../asset/music/caught.wav"
import 'p5/lib/addons/p5.sound';


let height;
let width;
let shootingStarY = 0;
let shootingStarX = 0;
let xMovingSpeedFast = 2;
let xMovingSpeedSlow = 6;
let yMoveingSpeedFast = 1;
let yMoveingSpeedSlow = 3;

let hoverState = undefined

let shootSound;
let jingleSound;
let caughtSound;

function ShootingStar(props) {
  const [showCard, setShowCard] = useState(undefined);
  
  // sound
  useEffect(()=>{
    let timeout;
    switch (props.currentState){
      case CATCH_STATUS.CATCHING:
        console.log('catching')
        // prevent too many same clips from playing at the same time
        if (!shootSound.isPlaying()){
          shootSound.play()
        }
        // jingleSound should stop when user is not praying
        if (props.direction == -1){
          jingleSound.stop()
        } else if (props.direction == 1) {
          if (!jingleSound.isLooping()){
            jingleSound.play()
          }
        }
        return;
      case CATCH_STATUS.SUCCESS:
        caughtSound.play()
        jingleSound.stop()
        shootSound.stop()
        return;
      case CATCH_STATUS.FAIL:
        jingleSound.stop()
        shootSound.stop()
        return;
      default:
        break;
    }
    return timeout
  },[props.currentState, props.direction])


  const setup = (p5, canvasParentRef) => {
    [height, width] = [p5.windowHeight, p5.windowWidth];
    p5.createCanvas(width, height).parent(canvasParentRef);
    
    shootingStarX = 0.8 * width;
    shootingStarY = 0;

    // sound setup
    shootSound = p5.loadSound(drone);
    jingleSound = p5.loadSound(jingleBell);
    caughtSound = p5.loadSound(caught)
    jingleSound.setLoop(true)
    shootSound.setLoop(false)

  }
  function star(x, y, radius1, radius2, npoints, p5) {
    let angle = p5.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p5.stroke(0, 0, 0, 0.8);
    p5.beginShape();
    for (let a = 0; a < p5.TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      p5.vertex(sx, sy);
    }
    p5.endShape(p5.CLOSE);
  }
  const draw = (p5) => {
    p5.clear();
    if (props.currentState == CATCH_STATUS.CATCHING){
        p5.push();
      // move slow if 
      if (props.direction == 1){
        shootingStarX = shootingStarX - width/(xMovingSpeedSlow*10*p5.getFrameRate())
        shootingStarY = shootingStarY + height/(yMoveingSpeedSlow*10*p5.getFrameRate());
      }
      if (props.direction == -1){
        shootingStarX = shootingStarX - width/(xMovingSpeedFast*10*p5.getFrameRate())
        shootingStarY = shootingStarY + height/(yMoveingSpeedFast*10*p5.getFrameRate());
      }
    
      // rotate
      p5.translate(shootingStarX, shootingStarY);
      p5.rotate(p5.frameCount / -200.0);
      star(0,0, 5, 25, 6,p5);
      p5.pop();
      
    }

    if (props.currentState == CATCH_STATUS.WAITING){
      shootingStarX = 0.8 * width;
      shootingStarY = 0;
    }
    // many stars
    for (let i = 0; i < starData.length; i++){
      p5.push();
      p5.translate(starData[i].x*width, height * starData[i].y);
      p5.rotate(p5.frameCount / -200.0);
      star(0, 0, starData[i].radius1, starData[i].radius2, 6,p5);
      p5.pop();
    }
    //wrong
    let hit = false;
    for (let i = 0; i < starData.length; i++){
      let distance =p5.dist(p5.mouseX, p5.mouseY, starData[i].x*width, height * starData[i].y)
      if (distance < starData[i].radius2) {
        hit = true
        hoverState = starData[i]
        setShowCard({...hoverState, posX: p5.mouseX, posY:p5.mouseY+80});
      }
    
    }  

    if (!hit){
      hoverState = undefined;
    setShowCard(undefined)
    }
};
  return (<div className="ShootingStar" style={{position:"absolute"}}>
  <Sketch setup={setup} draw={draw} />
  {showCard ? <PlanetCard planetInfo = {showCard}/> : null}
  </div>);
  }


export default ShootingStar;