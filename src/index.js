import "./styles/index.css";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

ctx.lineWidth = 2;
ctx.globalCompositeOperation = "difference";

let audioSource;
let analyser;

container.addEventListener("click", function () {
  // runs if you click anywhere in the container
  const audio1 = document.getElementById("audio1");
  const audioCtx = new AudioContext();
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let barWidth = 15;
  let barHeight;
  let x;
  // animate loop
  const animate = () => {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  };
  animate();
});

// file upload
file.addEventListener("change", function () {
  const files = this.files;
  const audio1 = document.getElementById("audio1");
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
});

// draw rotation visualizer
// function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
//   for (let i = 0; i < bufferLength; i++) {
//     // dataArray values range from 0 - 250
//     barHeight = dataArray[i] * 5;
//     // creates a savepoint for the canvas
//     ctx.save();
//     // translates 0,0 postion from top right to center
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     // rotates canvas a certain amount of radians
//     ctx.rotate(i + (Math.PI * 2) / bufferLength);
//     //colors
//     const red = (i * barHeight) / 20;
//     const green = i / 4;
//     const blue = barHeight / 2;
//     ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
//     ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//     x += barWidth;
//     ctx.restore();
//   }
// }

// firework
// function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
//   for (let i = 0; i < bufferLength; i++) {
//     // dataArray values range from 0 - 250
//     barHeight = dataArray[i] * 1.5;
//     // creates a savepoint for the canvas
//     ctx.save();
//     // translates 0,0 postion from top right to center
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     // rotates canvas a certain amount of radians
//     ctx.rotate(i * 3);
//     //colors
//     const hue = i * 0.3;
//     ctx.fillStyle = `hsl(${hue}, 100%, ${barHeight / 3}%)`;
//     ctx.fillRect(0, 0, barWidth, barHeight);
//     x += barWidth;
//     ctx.restore();
//   }
// }

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    // dataArray values range from 0 - 250
    barHeight = dataArray[i] * 1.5;
    // creates a savepoint for the canvas
    ctx.save();
    // translates 0,0 postion from top right to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // rotates canvas a certain amount of radians
    ctx.rotate(i * 3.2);
    //colors
    const hue = i * 0.1;
    ctx.strokeStyle = `hsl(${hue}, 100%, ${barHeight / 3}%)`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, barHeight);
    ctx.stroke();
    x += barWidth;
    if (i > bufferLength * 0.6) {
      ctx.beginPath();
      ctx.arc(0, 0, barHeight, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}
