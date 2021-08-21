let angle = 10;
let rotationSpeed = document.getElementById("x").value * 0.00005;
let lineWidth = document.getElementById("y").value * 1;
let inset = document.getElementById("inset").value * 0.01;
let sides = document.getElementById("n").value * 1;
let createCircle = true;
setInterval(() => (createCircle = true), 1000);
let circles = [];

export const playVisualizer = (
  x,
  y,
  ctx,
  bufferLength,
  barWidth,
  dataArray,
  currentTime,
  duration,
  width,
  height,
  ctx2
) => {
  rotationSpeed = document.getElementById("x").value * 0.00005;
  lineWidth = document.getElementById("y").value * 1;
  inset = document.getElementById("inset").value * 0.01;
  sides = document.getElementById("n").value * 1;
  ctx.lineWidth = lineWidth;

  conditionalCircle(
    x / 3,
    y / 2,
    bufferLength,
    barWidth,
    dataArray,
    ctx,
    currentTime,
    duration,
    angle / 4
  );

  conditionalCircle(
    x * (5 / 3),
    y / 2,
    bufferLength,
    barWidth,
    dataArray,
    ctx,
    currentTime,
    duration,
    -angle / 4
  );
  conditionalCircle(
    x,
    y,
    bufferLength,
    barWidth,
    dataArray,
    ctx,
    currentTime,
    duration,
    angle
  );

  drawCircles(ctx2, dataArray, 1 / 2, width, height);
};

function drawCircles(ctx, radius, reducer, width, height) {
  if (circles.length < 40 && createCircle) {
    circles.push([
      Math.random() * width,
      height + 50,
      Math.random() * 2 - 1,
      Math.floor(Math.random() * radius.length),
    ]);
    createCircle = false;
  }
  let hue = radius[Math.floor(Math.random() * radius.length)];
  for (let i = 0; i < circles.length; i++) {
    let barHeight = radius[circles[i][3]] / 2 + 50;
    let gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
    gradient.addColorStop(0, `hsl(${hue * i}, 200%, ${30}%`);
    gradient.addColorStop(1, "#132356");

    ctx.beginPath();
    ctx.save();
    ctx.translate(circles[i][0], circles[i][1]);
    ctx.moveTo(0, 0 - barHeight);
    drawCircle(ctx, barHeight, reducer);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
    ctx.stroke();

    if (circles[i][1] <= -25) {
      circles.shift();
    }
    circles[i][0] += circles[i][2];
    circles[i][1] -= Math.random();
  }
  ctx.restore();
}

function drawCircle(ctx, barHeight, barHeightReducer) {
  ctx.beginPath();
  ctx.arc(0, 0, barHeight * barHeightReducer, 0, Math.PI * 2);
  ctx.stroke();
}

function drawStar(ctx, radius, reducer, x, y, inset, sides) {
  ctx.beginPath();

  ctx.save();
  for (let i = 0; i < sides; i++) {
    ctx.moveTo(0, 0 - radius);
    ctx.rotate(Math.PI / sides);
    ctx.lineTo(0, -radius * inset);
    ctx.rotate(Math.PI / sides);
    ctx.lineTo(0, -radius);
    ctx.lineTo(0, radius);
  }
  ctx.restore();
  ctx.stroke();
}

function conditionalCircle(
  x,
  y,
  bufferLength,
  barWidth,
  dataArray,
  ctx,
  currentTime,
  duration,
  rotation
) {
  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i];
    let hue = currentTime * i;
    let shape = drawCircle;

    if (rotation === angle && i % 10 === 0) {
      barHeight = dataArray[i] * 3;
      shape = drawStar;
    }
    if (rotation === angle && i % 10 !== 0) {
      barHeight = dataArray[i] * 2;
      shape = () => {};
    }

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(i * rotation);

    ctx.strokeStyle = `hsl(${hue}, 200%, ${i}%)`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, barHeight);
    ctx.stroke();
    if (i > bufferLength * 0.8) {
      shape(ctx, barHeight, 2, x, y, inset, sides);
    } else if (i > bufferLength * 0.5) {
      shape(ctx, barHeight, 1, x, y, inset, sides);
    } else if (i > bufferLength * 0.7) {
      shape(ctx, barHeight, 1.5, x, y, inset, sides);
    }
    ctx.restore();
  }
  angle += rotationSpeed;
}
