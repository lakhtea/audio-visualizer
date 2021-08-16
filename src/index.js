import "./styles/index.css";
import "./scrubBar";

import { playVisualizer } from "./mainVisualizer";

const container = document.getElementById("container");
const file = document.getElementById("fileupload");
const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("canvas2");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const ctx2 = canvas2.getContext("2d");

let audioSource;
let analyser;

let barWidth = 15;

let x = canvas.width / 2;
let y = canvas.height / 2;

const myStorage = window.localStorage;

localStorage.setItem("7rings", URL.createObjectURL(audio1.src));

container.addEventListener("click", function () {
  const audio1 = document.getElementById("audio1");
  audio1.src = localStorage.getItem("7rings");
  const audioCtx = new AudioContext();
  try {
    audioSource = audioCtx.createMediaElementSource(audio1);
  } catch (error) {
    return;
  }
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const fileName = audio1.src.slice(32, -4);
  const songTitle = document.getElementById("song-title");

  songTitle.innerHTML = fileName;
  // runs if you click anywhere in the container
  let height = canvas2.height;
  let width = canvas2.width;
  // animate loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    analyser.getByteFrequencyData(dataArray);

    let currentTime = audio1.currentTime;
    let duration = audio1.duration;

    playVisualizer(
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
    );
    requestAnimationFrame(animate);
  };
  animate();
});

// file upload
file.addEventListener("change", function () {
  const files = this.files;
  const audio1 = document.getElementById("audio1");
  const playButton = document.getElementById("play-pause-icon");
  const songTitle = document.getElementById("song-title");

  songTitle.innerHTML = files[0].name.slice(0, -4);

  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  playButton.innerHTML = "pause";
});
