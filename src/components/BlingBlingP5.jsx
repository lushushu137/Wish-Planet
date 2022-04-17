import Sketch from 'react-p5';
import React , { useEffect, useRef, useState }from "react";
import "./BlingBlingP5.css"

let movers = [];
let mover_num = 10;
let palette = ["#FFEB3B47", "#FFFFFFA5"];

function BlingBling(){
    
    const setup = (p5, canvasParentRef) => {

        class Mover {
            constructor(x, y, d, c) {
              this.init(x, y, d, c);
            }
          
            init(x, y, d, c) {
              this.pos = p5.createVector(x, y);
              this.sizeMax = d;
              this.size = d;
              this.c = c;
              this.ns = p5.random(100, 300);//cricle movement area
            }
            update() {
              let n = p5.noise(this.pos.x / this.ns, this.pos.y / this.ns); //0~1;
              let angle = n * 360;
              this.pos.add(p5.constructor.Vector.fromAngle(angle));
              this.size = p5.constrain(this.size - 0.1, 0, this.sizeMax);
              if (this.size == 0) {
                this.respawn();
              }
            }
            respawn() {
              let x = p5.random(p5.width);
              let y = p5.random(p5.height);
              let d = p5.random(20);//circle maxsize
              let c = p5.random(palette);
              this.init(x, y, d, c);
            }
            display() {
                p5.push();
              p5.translate(this.pos.x, this.pos.y);
              p5.fill(this.c);
              p5.noStroke();
              p5.circle(0, 0, this.size);
              p5.pop();
            }
          }
          

        p5.createCanvas(400, 400).parent(canvasParentRef);
        for (let i = 0; i < mover_num; i++) {
          let x = p5.random(p5.width);
          let y = p5.random(p5.height);
          let d = p5.random(0.2, 3);
          let c = p5.color(palette[i % palette.length]);
          let mover = new Mover(x, y, d, c);
          movers.push(mover);
        }
    }
  const draw = (p5) => {
    p5.background(255,255,255,0);
    p5.clear()
    p5.push();
    for (let mover of movers) {
      mover.update();
      mover.display();
    }
    p5.pop();
  }
    return <div className='BlingBling'>
            <Sketch setup={setup} draw={draw} />
    </div>
}

export default BlingBling;