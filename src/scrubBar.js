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
let scrubStyle = getComputedStyle(scrub.el),
  scrubOffset = parseInt(scrubStyle.width, 10) / 2,
  position = parseInt(scrubStyle.left, 10),
  timeStyle = getComputedStyle(timeline, 10),
  timeWidth = parseInt(timeStyle.width, 10);

audio1.ontimeupdate = function () {
  if (mouseDown === false) {
    let timelineWidth =
      parseInt(getComputedStyle(timeline).width, 10) - scrubOffset * 2 - 20;
    let timePercent = audio1.currentTime / audio1.duration;
    let newPos = timelineWidth * timePercent + 10;
    scrub.el.style.left = newPos + "px";
  }
};

timeline.onmousedown = function () {
  mouseDown = true;
  scrub.origin = timeline.offsetLeft;
  scrub.last.x =
    scrub.el.offsetLeft +
    scrubContainer.offsetLeft +
    timeline.offsetLeft +
    scrubOffset * 2;
  console.log("working");
};

timeline.onmousemove = function (e) {
  if (mouseDown === true) {
    audio1.pause();
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

    let percent =
      (e.pageX -
        timeline.offsetLeft -
        scrubContainer.offsetLeft -
        scrubOffset) /
      timeWidth;
    audio1.currentTime = percent * audio1.duration;
    console.log(
      newPosition,
      e.offsetX,
      e.pageX,
      percent,
      scrub.last.x,
      e.clientX
    );
  }
};

timeline.onclick = function (e) {
  let scrubStyle = getComputedStyle(scrub.el),
    scrubOffset = parseInt(scrubStyle.width, 10) / 2,
    position = parseInt(scrubStyle.left, 10),
    newPosition = position + (e.clientX - scrub.last.x),
    timeStyle = getComputedStyle(timeline, 10),
    timeWidth = parseInt(timeStyle.width, 10) - 70;
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

  let percent =
    (e.pageX - timeline.offsetLeft - scrubContainer.offsetLeft - scrubOffset) /
    timeWidth;
  audio1.currentTime = percent * audio1.duration;
};

scrubContainer.onmouseup = function () {
  mouseDown = false;
  audio1.play();
  playButton.innerHTML = "pause";
};

play.addEventListener("click", function (e) {
  e.stopPropagation();
  if (audio1.paused) {
    audio1.play();
    playButton.innerHTML = "pause";
  } else if (!audio1.paused) {
    audio1.pause();
    playButton.innerHTML = "play_arrow";
  }
});
