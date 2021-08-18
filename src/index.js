import "./styles/index.css";
import "./scrubBar";

import { playVisualizer } from "./mainVisualizer";
import { demos } from "./songs";

const modal = document.getElementById("modal-container");
document.getElementById("continue-button").onclick = () =>
  modal.classList.add("closed");

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

const toggleUI = document.getElementById("toggle-ui");
const audio1 = document.getElementById("audio1");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
songTitle.innerHTML = demos[0].title;
songArtist.innerHTML = demos[0].artist;

const buttons = document.querySelectorAll(".button");
buttons.forEach((button, idx) => {
  button.innerHTML = demos[idx + 1].title;
  button.onclick = () => changeAudioSource(demos[idx + 1], idx + 1);
});

container.addEventListener("click", function () {
  const playButton = document.getElementById("play-pause-icon");
  audio1.play();
  playButton.innerHTML = "pause";
});

audio1.addEventListener("play", function () {
  const audioCtx = new AudioContext();
  const playButton = document.getElementById("play-pause-icon");
  if (audio1.paused) {
    audio1.play();
    playButton.innerHTML = "pause";
  }
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
file.addEventListener("change", function (e) {
  const files = this.files;
  const audio1 = document.getElementById("audio1");
  const playButton = document.getElementById("play-pause-icon");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");

  songTitle.innerHTML = files[0].name.slice(0, -4);
  songArtist.innerHTML = "User Upload";

  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  playButton.innerHTML = "pause";
});

function changeAudioSource({ title, artist, song }, idx) {
  const audio1 = document.getElementById("audio1");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const playButton = document.getElementById("play-pause-icon");

  audio1.src = song;
  songTitle.innerHTML = title;
  songArtist.innerHTML = artist;
  audio1.play();
  playButton.innerHTML = "pause";

  [demos[0], demos[idx]] = [demos[idx], demos[0]];
  buttons.forEach((button, idx) => {
    button.innerHTML = demos[idx + 1].title;
    button.onclick = () => changeAudioSource(demos[idx + 1], idx + 1);
  });
}

toggleUI.addEventListener("click", function (e) {
  e.stopPropagation();
  const scrubContainer = document.getElementById("scrub-container");
  const sliderContainer = document.getElementById("sliders");
  const linksContainer = document.getElementById("my-links");

  scrubContainer.classList.toggle("hidden");
  sliderContainer.classList.toggle("hidden");
  linksContainer.classList.toggle("hidden");

  if (scrubContainer.classList.contains("hidden")) {
    toggleUI.innerHTML = "Reveal UI";
  } else {
    toggleUI.innerHTML = "Hide UI";
  }
});
