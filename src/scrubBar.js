let scrub = {
    el: document.getElementById("scrub"),
    current: {
      x: 0,
    },
    last: {
      x: 0,
    },
  },
  timeline = document.getElementById("timeline"),
  mouseDown = false,
  audio1 = document.getElementById("audio1"),
  scrubContainer = document.getElementById("scrub-container"),
  play = document.getElementById("play"),
  playButton = document.getElementById("play-pause-icon");

audio1.ontimeupdate = function () {
  let percent = (audio1.currentTime / audio1.duration) * 100;
  scrub.el.style.left = `calc(${percent}% + 10px)`;
};

timeline.onmousedown = function () {
  mouseDown = true;
  scrub.origin = timeline.offsetLeft;
  scrub.last.x =
    scrub.el.offsetLeft + scrubContainer.offsetLeft + timeline.offsetLeft + 50;
  return false;
};

timeline.onmousemove = function (e) {
  if (mouseDown === true) {
    let scrubStyle = getComputedStyle(scrub.el),
      scrubOffset = parseInt(scrubStyle.width, 10) / 2,
      position = parseInt(scrubStyle.left, 10),
      newPosition = position + (e.clientX - scrub.last.x),
      timeStyle = getComputedStyle(timeline, 10),
      timeWidth = parseInt(timeStyle.width, 10);
    if (
      e.clientX <
      timeline.offsetLeft + scrubContainer.offsetLeft + scrubOffset * 2
    ) {
      newPosition = 10;
    } else if (
      e.clientX >=
      timeWidth +
        timeline.offsetLeft +
        scrubContainer.offsetLeft -
        scrubOffset * 2
    ) {
      newPosition = timeWidth - timeline.offsetLeft + 20 + scrubOffset * 2;
    }
    scrub.el.style.left = newPosition + "px";
    scrub.last.x = e.clientX;

    let percent = e.offsetX / timeWidth;
    audio1.currentTime = percent * audio1.duration;
    audio1.play();
    playButton.innerHTML = "pause";
  }
};

timeline.onclick = function (e) {
  // if (mouseDown === true) {
  let scrubStyle = getComputedStyle(scrub.el),
    scrubOffset = parseInt(scrubStyle.width, 10) / 2,
    position = parseInt(scrubStyle.left, 10),
    newPosition = position + (e.clientX - scrub.last.x),
    timeStyle = getComputedStyle(timeline, 10),
    timeWidth = parseInt(timeStyle.width, 10);
  if (
    e.clientX <
    timeline.offsetLeft + scrubContainer.offsetLeft + scrubOffset * 2
  ) {
    newPosition = 10;
  } else if (
    e.clientX >=
    timeWidth +
      timeline.offsetLeft +
      scrubContainer.offsetLeft -
      scrubOffset * 2
  ) {
    newPosition = timeWidth - timeline.offsetLeft + 20 + scrubOffset * 2;
  }
  scrub.el.style.left = newPosition + "px";
  scrub.last.x = e.clientX;

  let percent = e.offsetX / timeWidth;
  audio1.currentTime = percent * audio1.duration;
  audio1.play();
  playButton.innerHTML = "pause";
};

document.onmouseup = function () {
  mouseDown = false;
};

play.addEventListener("click", function (e) {
  if (audio1.paused) {
    audio1.play();
    playButton.innerHTML = "pause";
  } else if (!audio1.paused) {
    audio1.pause();
    playButton.innerHTML = "play_arrow";
  }
});
