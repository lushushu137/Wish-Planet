import React from 'react';
import Sketch from 'react-p5';

function Background() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }
  var palette = [
    '#242C41',
    '#30384D',
    '#3D415A',
    '#595D76',
    '#81889B',
    '#9FA8BB',
    '#224870',
  ];
  let ctx;
  let height;
  let width;
  const setup = (p5, canvasParentRef) => {
    [height, width] = [p5.windowHeight, p5.windowWidth];
    p5.createCanvas(width, height).parent(canvasParentRef);
    ctx = p5.drawingContext;
    p5.background(255, 130, 20);

    generate();
  };
  function generate() {
    sky(palette[6], palette[4]);

    var cloudX = Math.random() * width;
    var cloudY = height * 0.5;
    var cloudW = width / 2;
    var cloudH = height * 0.4;

    var sunX = width / 4 + (Math.random() * width) / 2;
    var sunY = height * 0.2 * Math.random() + height / 10;
    sun(sunX, sunY, palette[6]);
    cloud(cloudX, cloudY, cloudW, cloudH, palette[6]);

    mountain(7, height * 0.2, height * 0.3, palette[4]);
    mountain(12, height * 0.1, height * 0.4, palette[3]);
    mountain(8, height * 0.01, height * 0.48, palette[2]);

    var n = Math.floor(height / 30);
    for (var i = 0; i < n; i++) {
      var rowSize = i * height * 0.01 + 20;
      var rowX = -Math.random() * width * 0.2;
      var rowY = height * 0.5 + i * height * 0.03;
      var rowLength = width * 1.2;
      var rowDensity = Math.random();

      if (i < n / 4) {
        treeRow(
          rowX,
          rowY,
          rowLength,
          rowSize,
          rowDensity,
          palette[2],
          palette[3]
        );
      } else {
        treeRow(
          rowX,
          rowY,
          rowLength,
          rowSize,
          rowDensity,
          palette[1],
          palette[2]
        );
      }
    }
  }

  function sky(color1, color2) {
    var grad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  function mountain(segments, maxHeight, position, color) {
    var points = [];
    points.push(new Point(0, height));
    points.push(new Point(0, position));
    for (var i = 0; i < segments + 1; i++) {
      var x = (width / segments) * i;
      var y = Math.random() * maxHeight + position;
      points.push(new Point(x, y));
    }
    points.push(new Point(width, position));
    points.push(new Point(width, height));

    ctx.fillStyle = color;
    ctx.beginPath();
    pointsToCurve(points);
    ctx.fill();
  }

  function pointsToCurve(points) {
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
  }

  function sun(x, y, color) {
    var w = width / 4;
    var s = Math.random() * 10 + 10;

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  function tree(x, y, size, colorShadow, colorTree) {
    ctx.strokeStyle = colorShadow;
    ctx.lineWidth = size / 3;
    ctx.beginPath();
    ctx.moveTo(x - size / 10, y);
    ctx.lineTo(x + size / 10, y);
    ctx.stroke();

    ctx.strokeStyle = colorTree;
    ctx.fillStyle = colorTree;
    ctx.lineWidth = size / 8;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x + size / 3, y);
    ctx.lineTo(x, y - size);
    ctx.lineTo(x - size / 3, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  function treeRow(x, y, length, size, density, colorShadow, colorTree) {
    var grad = ctx.createLinearGradient(x, y - size * 4, x, y);
    grad.addColorStop(0, colorTree);
    grad.addColorStop(1, colorShadow);

    var n = length / (size * 0.7);
    for (var i = 0; i < n + 1; i++) {
      if (Math.random() < density) {
        var offset = ((i % 2) * size) / 8; //make odd higher;
        var offsetRandom = Math.random() * size * 0.1;
        var treeX = x + i * size * 0.7 + offsetRandom;
        var treeY = y + offset;
        var treeSize = size + (size / 2) * Math.random();

        tree(treeX, treeY, treeSize, colorShadow, grad);
      }
    }
  }

  function cloud(x, y, w, h, color) {
    var n = Math.floor(Math.random() * 3 + 3);
    var stepSize = w / 2 / n;
    var lineWidth = h * 0.2;
    ctx.strokeStyle = color;

    for (var i = 0; i < n; i++) {
      var offset = Math.random() * stepSize * 2;
      ctx.lineWidth = lineWidth + lineWidth * Math.random();
      ctx.beginPath();
      ctx.moveTo(x + offset + stepSize * i, y - lineWidth * i);
      ctx.lineTo(x + offset + w - stepSize * i, y - lineWidth * i);
      ctx.stroke();
    }
  }

  const draw = (p5) => {
  };
  return  <div className="Background">
    <Sketch setup={setup} draw={draw} />

  </div>
}

export default Background;