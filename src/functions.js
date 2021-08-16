let createCircle = true;
setInterval(() => (createCircle = true), 1000);
let circles = [];
let lowPitch = false;
let angle = 10;

export function drawCircles(ctx, radius, reducer, width, height) {
  if (circles.length < 25 && createCircle) {
    circles.push([
      Math.random() * width,
      height,
      Math.random() * 3 - 1.5,
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

    // ctx.strokeStyle = `hsl(${hue * i}, 200%, ${30}%)`;
    ctx.beginPath();
    ctx.save();
    ctx.translate(circles[i][0], circles[i][1]);
    // ctx.translate(width / 2, height / 2);
    ctx.moveTo(0, 0 - barHeight);
    drawCircle(ctx, barHeight, reducer);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
    ctx.stroke();

    if (circles[i][1] <= 0) {
      circles.shift();
    }
    circles[i][0] += circles[i][2];
    circles[i][1] -= Math.random();
  }
  ctx.restore();
}

export function drawCircle(ctx, barHeight, barHeightReducer) {
  ctx.beginPath();
  ctx.arc(0, 0, barHeight * barHeightReducer, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawStar(ctx, radius, reducer, x, y, inset, sides) {
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

export function conditionalCircle(
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
    if (i > bufferLength * 0.5) {
      shape(ctx, barHeight, 1 / 2, x, y, inset, sides);
    }
    if (i > bufferLength * 0.8) {
      shape(ctx, barHeight, 3, x, y, inset, sides);
      if (dataArray[i] > 0) lowPitch = true;
    }
    ctx.restore();
  }
  angle += rotationSpeed;
}
