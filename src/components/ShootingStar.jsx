import * as React from 'react';
import Sketch from 'react-p5';
let height;
let width;
function ShootingStar() {
  const setup = (p5, canvasParentRef) => {
    [height, width] = [p5.windowHeight, p5.windowWidth];
    p5.createCanvas(width, height).parent(canvasParentRef);
  }
  const draw = (p5) => {
    // p5.background(0,0,0, 0);
    p5.clear();
    p5.push();
    p5.translate(width * 0.8, height * 0.2);
    p5.rotate(p5.frameCount / -200.0);
    star(0,0, 5, 25, 6,p5);
    p5.pop();
    
    p5.push();
    p5.translate(width * 0.5, height * 0.1);
    p5.rotate(p5.frameCount / -200.0);
    star(0,0, 4, 20, 6,p5);
    p5.pop();

    p5.push();
    p5.translate(width * 0.1, height * 0.2);
    p5.rotate(p5.frameCount / -200.0);
    star(0,0, 3, 15, 6,p5);
    p5.pop();


};

function star(x, y, radius1, radius2, npoints, p5) {
    
    let angle = p5.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p5.stroke(0,0,0,0.8)
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
  
  return <div style={{position:"absolute"}}>
  <Sketch setup={setup} draw={draw} />
  </div>;

}

export default ShootingStar;