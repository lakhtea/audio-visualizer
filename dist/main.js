/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/mainVisualizer.js":
/*!*******************************!*\
  !*** ./src/mainVisualizer.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playVisualizer": function() { return /* binding */ playVisualizer; }
/* harmony export */ });
var angle = 10;
var rotationSpeed = document.getElementById("x").value * 0.00005;
var lineWidth = document.getElementById("y").value * 1;
var inset = document.getElementById("inset").value * 0.01;
var sides = document.getElementById("n").value * 1;
var createCircle = true;
setInterval(function () {
  return createCircle = true;
}, 1000);
var circles = [];
var playVisualizer = function playVisualizer(x, y, ctx, bufferLength, barWidth, dataArray, currentTime, duration, width, height, ctx2) {
  rotationSpeed = document.getElementById("x").value * 0.00005;
  lineWidth = document.getElementById("y").value * 1;
  inset = document.getElementById("inset").value * 0.01;
  sides = document.getElementById("n").value * 1;
  ctx.lineWidth = lineWidth;
  conditionalCircle(x / 3, y / 2, bufferLength, barWidth, dataArray, ctx, currentTime, duration, angle / 4);
  conditionalCircle(x * (5 / 3), y / 2, bufferLength, barWidth, dataArray, ctx, currentTime, duration, -angle / 4);
  conditionalCircle(x, y, bufferLength, barWidth, dataArray, ctx, currentTime, duration, angle);
  drawCircles(ctx2, dataArray, 1 / 2, width, height);
};

function drawCircles(ctx, radius, reducer, width, height) {
  if (circles.length < 40 && createCircle) {
    circles.push([Math.random() * width, height + 50, Math.random() * 2 - 1, Math.floor(Math.random() * radius.length)]);
    createCircle = false;
  }

  var hue = radius[Math.floor(Math.random() * radius.length)];

  for (var i = 0; i < circles.length; i++) {
    var barHeight = radius[circles[i][3]] / 2 + 50;
    var gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
    gradient.addColorStop(0, "hsl(".concat(hue * i, ", 200%, ", 30, "%"));
    gradient.addColorStop(1, "#132356"); // ctx.strokeStyle = `hsl(${hue * i}, 200%, ${30}%)`;

    ctx.beginPath();
    ctx.save();
    ctx.translate(circles[i][0], circles[i][1]); // ctx.translate(width / 2, height / 2);

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

  for (var i = 0; i < sides; i++) {
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

function conditionalCircle(x, y, bufferLength, barWidth, dataArray, ctx, currentTime, duration, rotation) {
  for (var i = 0; i < bufferLength; i++) {
    var barHeight = dataArray[i];
    var hue = currentTime * i;
    var shape = drawCircle;

    if (rotation === angle && i % 10 === 0) {
      barHeight = dataArray[i] * 3;
      shape = drawStar;
    }

    if (rotation === angle && i % 10 !== 0) {
      barHeight = dataArray[i] * 2;

      shape = function shape() {};
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(i * rotation);
    ctx.strokeStyle = "hsl(".concat(hue, ", 200%, ").concat(i, "%)");
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

/***/ }),

/***/ "./src/scrubBar.js":
/*!*************************!*\
  !*** ./src/scrubBar.js ***!
  \*************************/
/***/ (function() {

var scrub = {
  el: document.getElementById("scrub"),
  current: {
    x: 0
  },
  last: {
    x: 0
  }
},
    timeline = document.getElementById("timeline"),
    mouseDown = false,
    audio1 = document.getElementById("audio1"),
    scrubContainer = document.getElementById("scrub-container"),
    play = document.getElementById("play"),
    playButton = document.getElementById("play-pause-icon");
var scrubStyle = getComputedStyle(scrub.el),
    scrubOffset = parseInt(scrubStyle.width, 10) / 2,
    position = parseInt(scrubStyle.left, 10),
    timeStyle = getComputedStyle(timeline, 10),
    timeWidth = parseInt(timeStyle.width, 10);

audio1.ontimeupdate = function () {
  if (mouseDown === false) {
    var timelineWidth = parseInt(getComputedStyle(timeline).width, 10) - scrubOffset * 2 - 20;
    var timePercent = audio1.currentTime / audio1.duration;
    var newPos = timelineWidth * timePercent + 10;
    scrub.el.style.left = newPos + "px";
  }
};

timeline.onmousedown = function () {
  mouseDown = true;
  scrub.origin = timeline.offsetLeft;
  scrub.last.x = scrub.el.offsetLeft + scrubContainer.offsetLeft + timeline.offsetLeft + scrubOffset * 2;
  console.log("working");
};

timeline.onmousemove = function (e) {
  if (mouseDown === true) {
    audio1.pause();

    var _scrubStyle = getComputedStyle(scrub.el),
        _scrubOffset = parseInt(_scrubStyle.width, 10) / 2,
        _position = parseInt(_scrubStyle.left, 10),
        newPosition = _position + (e.clientX - scrub.last.x),
        _timeStyle = getComputedStyle(timeline, 10),
        _timeWidth = parseInt(_timeStyle.width, 10);

    if (e.clientX < timeline.offsetLeft + scrubContainer.offsetLeft + _scrubOffset * 2) {
      newPosition = 10;
    } else if (e.clientX >= _timeWidth + timeline.offsetLeft + scrubContainer.offsetLeft - _scrubOffset * 2) {
      newPosition = _timeWidth - timeline.offsetLeft + 20 + _scrubOffset * 2;
    }

    scrub.el.style.left = newPosition + "px";
    scrub.last.x = e.clientX;
    var percent = (e.pageX - timeline.offsetLeft - scrubContainer.offsetLeft - _scrubOffset) / _timeWidth;
    audio1.currentTime = percent * audio1.duration;
    console.log(newPosition, e.offsetX, e.pageX, percent, scrub.last.x, e.clientX);
  }
};

timeline.onclick = function (e) {
  var scrubStyle = getComputedStyle(scrub.el),
      scrubOffset = parseInt(scrubStyle.width, 10) / 2,
      position = parseInt(scrubStyle.left, 10),
      newPosition = position + (e.clientX - scrub.last.x),
      timeStyle = getComputedStyle(timeline, 10),
      timeWidth = parseInt(timeStyle.width, 10) - 70;

  if (e.clientX < timeline.offsetLeft + scrubContainer.offsetLeft + scrubOffset * 2) {
    newPosition = 10;
  } else if (e.clientX >= timeWidth + timeline.offsetLeft + scrubContainer.offsetLeft - scrubOffset * 2) {
    newPosition = timeWidth - timeline.offsetLeft + 20 + scrubOffset * 2;
  }

  scrub.el.style.left = newPosition + "px";
  scrub.last.x = e.clientX;
  var percent = (e.pageX - timeline.offsetLeft - scrubContainer.offsetLeft - scrubOffset) / timeWidth;
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

/***/ }),

/***/ "./src/songs.js":
/*!**********************!*\
  !*** ./src/songs.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demos": function() { return /* binding */ demos; }
/* harmony export */ });
var demos = [{
  title: "7 Rings",
  artist: "Ariana Grande",
  song: "./dist/music/7rings.mp3"
}, {
  title: "Giorno's Theme",
  artist: "Jojo's Bizarre Adventure",
  song: "./dist/music/jojo.mp3"
}, {
  title: "Adore You",
  artist: "Harry Styles",
  song: "./dist/music/adoreyou.mp3"
}, {
  title: "Seven Nation Army",
  artist: "The White Stripes",
  song: "./dist/music/sna.mp3"
}, {
  title: "Unravel",
  artist: "Toru Kitajima",
  song: "./dist/music/unravel.mp3"
}];

/***/ }),

/***/ "./src/styles/index.css":
/*!******************************!*\
  !*** ./src/styles/index.css ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.css */ "./src/styles/index.css");
/* harmony import */ var _scrubBar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scrubBar */ "./src/scrubBar.js");
/* harmony import */ var _scrubBar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scrubBar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mainVisualizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mainVisualizer */ "./src/mainVisualizer.js");
/* harmony import */ var _songs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./songs */ "./src/songs.js");




var modal = document.getElementById("modal-container");

document.getElementById("continue-button").onclick = function () {
  return modal.classList.add("closed");
};

var container = document.getElementById("container");
var file = document.getElementById("fileupload");
var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var canvas2 = document.getElementById("canvas2");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
var ctx2 = canvas2.getContext("2d");
var audioSource;
var analyser;
var barWidth = 15;
var x = canvas.width / 2;
var y = canvas.height / 2;
var toggleUI = document.getElementById("toggle-ui");
var audio1 = document.getElementById("audio1");
var songTitle = document.getElementById("song-title");
var songArtist = document.getElementById("song-artist");
songTitle.innerHTML = _songs__WEBPACK_IMPORTED_MODULE_3__.demos[0].title;
songArtist.innerHTML = _songs__WEBPACK_IMPORTED_MODULE_3__.demos[0].artist;
var buttons = document.querySelectorAll(".button");
buttons.forEach(function (button, idx) {
  button.innerHTML = _songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx + 1].title;

  button.onclick = function () {
    return changeAudioSource(_songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx + 1], idx + 1);
  };
});
container.addEventListener("click", function () {
  var playButton = document.getElementById("play-pause-icon");
  audio1.play();
  playButton.innerHTML = "pause";
});
audio1.addEventListener("play", function () {
  var audioCtx = new AudioContext();
  var playButton = document.getElementById("play-pause-icon");

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
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength); // runs if you click anywhere in the container

  var height = canvas2.height;
  var width = canvas2.width; // animate loop

  var animate = function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    analyser.getByteFrequencyData(dataArray);
    var currentTime = audio1.currentTime;
    var duration = audio1.duration;
    (0,_mainVisualizer__WEBPACK_IMPORTED_MODULE_2__.playVisualizer)(x, y, ctx, bufferLength, barWidth, dataArray, currentTime, duration, width, height, ctx2);
    requestAnimationFrame(animate);
  };

  animate();
}); // file upload

file.addEventListener("change", function (e) {
  var files = this.files;
  var audio1 = document.getElementById("audio1");
  var playButton = document.getElementById("play-pause-icon");
  var songTitle = document.getElementById("song-title");
  var songArtist = document.getElementById("song-artist");
  songTitle.innerHTML = files[0].name.slice(0, -4);
  songArtist.innerHTML = "User Upload";
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  playButton.innerHTML = "pause";
});

function changeAudioSource(_ref, idx) {
  var title = _ref.title,
      artist = _ref.artist,
      song = _ref.song;
  var audio1 = document.getElementById("audio1");
  var songTitle = document.getElementById("song-title");
  var songArtist = document.getElementById("song-artist");
  var playButton = document.getElementById("play-pause-icon");
  audio1.src = song;
  songTitle.innerHTML = title;
  songArtist.innerHTML = artist;
  audio1.play();
  playButton.innerHTML = "pause";
  var _ref2 = [_songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx], _songs__WEBPACK_IMPORTED_MODULE_3__.demos[0]];
  _songs__WEBPACK_IMPORTED_MODULE_3__.demos[0] = _ref2[0];
  _songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx] = _ref2[1];
  buttons.forEach(function (button, idx) {
    button.innerHTML = _songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx + 1].title;

    button.onclick = function () {
      return changeAudioSource(_songs__WEBPACK_IMPORTED_MODULE_3__.demos[idx + 1], idx + 1);
    };
  });
}

toggleUI.addEventListener("click", function (e) {
  e.stopPropagation();
  var scrubContainer = document.getElementById("scrub-container");
  var sliderContainer = document.getElementById("sliders");
  var linksContainer = document.getElementById("my-links");
  scrubContainer.classList.toggle("hidden");
  sliderContainer.classList.toggle("hidden");
  linksContainer.classList.toggle("hidden");

  if (scrubContainer.classList.contains("hidden")) {
    toggleUI.innerHTML = "Reveal UI";
  } else {
    toggleUI.innerHTML = "Hide UI";
  }
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zb25ncy5qcyIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvc3R5bGVzL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImFuZ2xlIiwicm90YXRpb25TcGVlZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImxpbmVXaWR0aCIsImluc2V0Iiwic2lkZXMiLCJjcmVhdGVDaXJjbGUiLCJzZXRJbnRlcnZhbCIsImNpcmNsZXMiLCJwbGF5VmlzdWFsaXplciIsIngiLCJ5IiwiY3R4IiwiYnVmZmVyTGVuZ3RoIiwiYmFyV2lkdGgiLCJkYXRhQXJyYXkiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJjdHgyIiwiY29uZGl0aW9uYWxDaXJjbGUiLCJkcmF3Q2lyY2xlcyIsInJhZGl1cyIsInJlZHVjZXIiLCJsZW5ndGgiLCJwdXNoIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiaHVlIiwiaSIsImJhckhlaWdodCIsImdyYWRpZW50IiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJiZWdpblBhdGgiLCJzYXZlIiwidHJhbnNsYXRlIiwibW92ZVRvIiwiZHJhd0NpcmNsZSIsImZpbGxTdHlsZSIsImZpbGwiLCJyZXN0b3JlIiwic3Ryb2tlIiwic2hpZnQiLCJiYXJIZWlnaHRSZWR1Y2VyIiwiYXJjIiwiUEkiLCJkcmF3U3RhciIsInJvdGF0ZSIsImxpbmVUbyIsInJvdGF0aW9uIiwic2hhcGUiLCJzdHJva2VTdHlsZSIsInNjcnViIiwiZWwiLCJjdXJyZW50IiwibGFzdCIsInRpbWVsaW5lIiwibW91c2VEb3duIiwiYXVkaW8xIiwic2NydWJDb250YWluZXIiLCJwbGF5IiwicGxheUJ1dHRvbiIsInNjcnViU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwic2NydWJPZmZzZXQiLCJwYXJzZUludCIsInBvc2l0aW9uIiwibGVmdCIsInRpbWVTdHlsZSIsInRpbWVXaWR0aCIsIm9udGltZXVwZGF0ZSIsInRpbWVsaW5lV2lkdGgiLCJ0aW1lUGVyY2VudCIsIm5ld1BvcyIsInN0eWxlIiwib25tb3VzZWRvd24iLCJvcmlnaW4iLCJvZmZzZXRMZWZ0IiwiY29uc29sZSIsImxvZyIsIm9ubW91c2Vtb3ZlIiwiZSIsInBhdXNlIiwibmV3UG9zaXRpb24iLCJjbGllbnRYIiwicGVyY2VudCIsInBhZ2VYIiwib2Zmc2V0WCIsIm9uY2xpY2siLCJvbm1vdXNldXAiLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwicGF1c2VkIiwiZGVtb3MiLCJ0aXRsZSIsImFydGlzdCIsInNvbmciLCJtb2RhbCIsImNsYXNzTGlzdCIsImFkZCIsImNvbnRhaW5lciIsImZpbGUiLCJjYW52YXMiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJnZXRDb250ZXh0IiwiY2FudmFzMiIsImF1ZGlvU291cmNlIiwiYW5hbHlzZXIiLCJ0b2dnbGVVSSIsInNvbmdUaXRsZSIsInNvbmdBcnRpc3QiLCJidXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJidXR0b24iLCJpZHgiLCJjaGFuZ2VBdWRpb1NvdXJjZSIsImF1ZGlvQ3R4IiwiQXVkaW9Db250ZXh0IiwiY3JlYXRlTWVkaWFFbGVtZW50U291cmNlIiwiZXJyb3IiLCJjcmVhdGVBbmFseXNlciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImZmdFNpemUiLCJmcmVxdWVuY3lCaW5Db3VudCIsIlVpbnQ4QXJyYXkiLCJhbmltYXRlIiwiY2xlYXJSZWN0IiwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmaWxlcyIsIm5hbWUiLCJzbGljZSIsInNyYyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImxvYWQiLCJzbGlkZXJDb250YWluZXIiLCJsaW5rc0NvbnRhaW5lciIsInRvZ2dsZSIsImNvbnRhaW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLEtBQUssR0FBRyxFQUFaO0FBQ0EsSUFBSUMsYUFBYSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkJDLEtBQTdCLEdBQXFDLE9BQXpEO0FBQ0EsSUFBSUMsU0FBUyxHQUFHSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkJDLEtBQTdCLEdBQXFDLENBQXJEO0FBQ0EsSUFBSUUsS0FBSyxHQUFHSixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUNDLEtBQWpDLEdBQXlDLElBQXJEO0FBQ0EsSUFBSUcsS0FBSyxHQUFHTCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkJDLEtBQTdCLEdBQXFDLENBQWpEO0FBQ0EsSUFBSUksWUFBWSxHQUFHLElBQW5CO0FBQ0FDLFdBQVcsQ0FBQztBQUFBLFNBQU9ELFlBQVksR0FBRyxJQUF0QjtBQUFBLENBQUQsRUFBOEIsSUFBOUIsQ0FBWDtBQUNBLElBQUlFLE9BQU8sR0FBRyxFQUFkO0FBRU8sSUFBTUMsY0FBYyxH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LFNBQVQsR0FBcUIsU0FBckI7QUFDRDtBQUNGLENBZkQsRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFuZ2xlID0gMTA7XG5sZXQgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG5sZXQgbGluZVdpZHRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5XCIpLnZhbHVlICogMTtcbmxldCBpbnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXRcIikudmFsdWUgKiAwLjAxO1xubGV0IHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbmxldCBjcmVhdGVDaXJjbGUgPSB0cnVlO1xuc2V0SW50ZXJ2YWwoKCkgPT4gKGNyZWF0ZUNpcmNsZSA9IHRydWUpLCAxMDAwKTtcbmxldCBjaXJjbGVzID0gW107XG5cbmV4cG9ydCBjb25zdCBwbGF5VmlzdWFsaXplciA9IChcbiAgeCxcbiAgeSxcbiAgY3R4LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN1cnJlbnRUaW1lLFxuICBkdXJhdGlvbixcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgY3R4MlxuKSA9PiB7XG4gIHJvdGF0aW9uU3BlZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhcIikudmFsdWUgKiAwLjAwMDA1O1xuICBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xuICBpbnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXRcIikudmFsdWUgKiAwLjAxO1xuICBzaWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiblwiKS52YWx1ZSAqIDE7XG4gIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAvIDMsXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGUgLyA0XG4gICk7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAqICg1IC8gMyksXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgLWFuZ2xlIC8gNFxuICApO1xuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4LFxuICAgIHksXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGVcbiAgKTtcblxuICBkcmF3Q2lyY2xlcyhjdHgyLCBkYXRhQXJyYXksIDEgLyAyLCB3aWR0aCwgaGVpZ2h0KTtcbn07XG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGVzKGN0eCwgcmFkaXVzLCByZWR1Y2VyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIGlmIChjaXJjbGVzLmxlbmd0aCA8IDQwICYmIGNyZWF0ZUNpcmNsZSkge1xuICAgIGNpcmNsZXMucHVzaChbXG4gICAgICBNYXRoLnJhbmRvbSgpICogd2lkdGgsXG4gICAgICBoZWlnaHQgKyA1MCxcbiAgICAgIE1hdGgucmFuZG9tKCkgKiAyIC0gMSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhZGl1cy5sZW5ndGgpLFxuICAgIF0pO1xuICAgIGNyZWF0ZUNpcmNsZSA9IGZhbHNlO1xuICB9XG4gIGxldCBodWUgPSByYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNpcmNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gcmFkaXVzW2NpcmNsZXNbaV1bM11dIC8gMiArIDUwO1xuICAgIGxldCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAxMCwgMCwgMCwgODUpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JWApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcIiMxMzIzNTZcIik7XG5cbiAgICAvLyBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoY2lyY2xlc1tpXVswXSwgY2lyY2xlc1tpXVsxXSk7XG4gICAgLy8gY3R4LnRyYW5zbGF0ZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIGJhckhlaWdodCk7XG4gICAgZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgcmVkdWNlcik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBpZiAoY2lyY2xlc1tpXVsxXSA8PSAtMjUpIHtcbiAgICAgIGNpcmNsZXMuc2hpZnQoKTtcbiAgICB9XG4gICAgY2lyY2xlc1tpXVswXSArPSBjaXJjbGVzW2ldWzJdO1xuICAgIGNpcmNsZXNbaV1bMV0gLT0gTWF0aC5yYW5kb20oKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCBiYXJIZWlnaHRSZWR1Y2VyKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYygwLCAwLCBiYXJIZWlnaHQgKiBiYXJIZWlnaHRSZWR1Y2VyLCAwLCBNYXRoLlBJICogMik7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gZHJhd1N0YXIoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHgsIHksIGluc2V0LCBzaWRlcykge1xuICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgY3R4LnNhdmUoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gcmFkaXVzKTtcbiAgICBjdHgucm90YXRlKE1hdGguUEkgLyBzaWRlcyk7XG4gICAgY3R4LmxpbmVUbygwLCAtcmFkaXVzICogaW5zZXQpO1xuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSAvIHNpZGVzKTtcbiAgICBjdHgubGluZVRvKDAsIC1yYWRpdXMpO1xuICAgIGN0eC5saW5lVG8oMCwgcmFkaXVzKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICB4LFxuICB5LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN0eCxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICByb3RhdGlvblxuKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldO1xuICAgIGxldCBodWUgPSBjdXJyZW50VGltZSAqIGk7XG4gICAgbGV0IHNoYXBlID0gZHJhd0NpcmNsZTtcblxuICAgIGlmIChyb3RhdGlvbiA9PT0gYW5nbGUgJiYgaSAlIDEwID09PSAwKSB7XG4gICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAzO1xuICAgICAgc2hhcGUgPSBkcmF3U3RhcjtcbiAgICB9XG4gICAgaWYgKHJvdGF0aW9uID09PSBhbmdsZSAmJiBpICUgMTAgIT09IDApIHtcbiAgICAgIGJhckhlaWdodCA9IGRhdGFBcnJheVtpXSAqIDI7XG4gICAgICBzaGFwZSA9ICgpID0+IHt9O1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHgudHJhbnNsYXRlKHgsIHkpO1xuXG4gICAgY3R4LnJvdGF0ZShpICogcm90YXRpb24pO1xuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDIwMCUsICR7aX0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgY3R4LmxpbmVUbygwLCBiYXJIZWlnaHQpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuOCkge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDIsIHgsIHksIGluc2V0LCBzaWRlcyk7XG4gICAgfSBlbHNlIGlmIChpID4gYnVmZmVyTGVuZ3RoICogMC41KSB7XG4gICAgICBzaGFwZShjdHgsIGJhckhlaWdodCwgMSwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9IGVsc2UgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjcpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxLjUsIHgsIHksIGluc2V0LCBzaWRlcyk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbiAgYW5nbGUgKz0gcm90YXRpb25TcGVlZDtcbn1cbiIsImxldCBzY3J1YiA9IHtcbiAgICBlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3J1YlwiKSxcbiAgICBjdXJyZW50OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gICAgbGFzdDoge1xuICAgICAgeDogMCxcbiAgICB9LFxuICB9LFxuICB0aW1lbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZWxpbmVcIiksXG4gIG1vdXNlRG93biA9IGZhbHNlLFxuICBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKSxcbiAgc2NydWJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViLWNvbnRhaW5lclwiKSxcbiAgcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKSxcbiAgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZS1pY29uXCIpO1xubGV0IHNjcnViU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNjcnViLmVsKSxcbiAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICBwb3NpdGlvbiA9IHBhcnNlSW50KHNjcnViU3R5bGUubGVmdCwgMTApLFxuICB0aW1lU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRpbWVsaW5lLCAxMCksXG4gIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuXG5hdWRpbzEub250aW1ldXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICBpZiAobW91c2VEb3duID09PSBmYWxzZSkge1xuICAgIGxldCB0aW1lbGluZVdpZHRoID1cbiAgICAgIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUpLndpZHRoLCAxMCkgLSBzY3J1Yk9mZnNldCAqIDIgLSAyMDtcbiAgICBsZXQgdGltZVBlcmNlbnQgPSBhdWRpbzEuY3VycmVudFRpbWUgLyBhdWRpbzEuZHVyYXRpb247XG4gICAgbGV0IG5ld1BvcyA9IHRpbWVsaW5lV2lkdGggKiB0aW1lUGVyY2VudCArIDEwO1xuICAgIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3MgKyBcInB4XCI7XG4gIH1cbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICBtb3VzZURvd24gPSB0cnVlO1xuICBzY3J1Yi5vcmlnaW4gPSB0aW1lbGluZS5vZmZzZXRMZWZ0O1xuICBzY3J1Yi5sYXN0LnggPVxuICAgIHNjcnViLmVsLm9mZnNldExlZnQgK1xuICAgIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgK1xuICAgIHRpbWVsaW5lLm9mZnNldExlZnQgK1xuICAgIHNjcnViT2Zmc2V0ICogMjtcbiAgY29uc29sZS5sb2coXCJ3b3JraW5nXCIpO1xufTtcblxudGltZWxpbmUub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICBpZiAobW91c2VEb3duID09PSB0cnVlKSB7XG4gICAgYXVkaW8xLnBhdXNlKCk7XG4gICAgbGV0IHNjcnViU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNjcnViLmVsKSxcbiAgICAgIHNjcnViT2Zmc2V0ID0gcGFyc2VJbnQoc2NydWJTdHlsZS53aWR0aCwgMTApIC8gMixcbiAgICAgIHBvc2l0aW9uID0gcGFyc2VJbnQoc2NydWJTdHlsZS5sZWZ0LCAxMCksXG4gICAgICBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uICsgKGUuY2xpZW50WCAtIHNjcnViLmxhc3QueCksXG4gICAgICB0aW1lU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRpbWVsaW5lLCAxMCksXG4gICAgICB0aW1lV2lkdGggPSBwYXJzZUludCh0aW1lU3R5bGUud2lkdGgsIDEwKTtcbiAgICBpZiAoXG4gICAgICBlLmNsaWVudFggPFxuICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyBzY3J1Yk9mZnNldCAqIDJcbiAgICApIHtcbiAgICAgIG5ld1Bvc2l0aW9uID0gMTA7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGUuY2xpZW50WCA+PVxuICAgICAgdGltZVdpZHRoICtcbiAgICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgICAgIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgLVxuICAgICAgICBzY3J1Yk9mZnNldCAqIDJcbiAgICApIHtcbiAgICAgIG5ld1Bvc2l0aW9uID0gdGltZVdpZHRoIC0gdGltZWxpbmUub2Zmc2V0TGVmdCArIDIwICsgc2NydWJPZmZzZXQgKiAyO1xuICAgIH1cbiAgICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gbmV3UG9zaXRpb24gKyBcInB4XCI7XG4gICAgc2NydWIubGFzdC54ID0gZS5jbGllbnRYO1xuXG4gICAgbGV0IHBlcmNlbnQgPVxuICAgICAgKGUucGFnZVggLVxuICAgICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0IC1cbiAgICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICAgIHNjcnViT2Zmc2V0KSAvXG4gICAgICB0aW1lV2lkdGg7XG4gICAgYXVkaW8xLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIGF1ZGlvMS5kdXJhdGlvbjtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIG5ld1Bvc2l0aW9uLFxuICAgICAgZS5vZmZzZXRYLFxuICAgICAgZS5wYWdlWCxcbiAgICAgIHBlcmNlbnQsXG4gICAgICBzY3J1Yi5sYXN0LngsXG4gICAgICBlLmNsaWVudFhcbiAgICApO1xuICB9XG59O1xuXG50aW1lbGluZS5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgbGV0IHNjcnViU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNjcnViLmVsKSxcbiAgICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uICsgKGUuY2xpZW50WCAtIHNjcnViLmxhc3QueCksXG4gICAgdGltZVN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSwgMTApLFxuICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApIC0gNzA7XG4gIGlmIChcbiAgICBlLmNsaWVudFggPFxuICAgIHRpbWVsaW5lLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgc2NydWJPZmZzZXQgKiAyXG4gICkge1xuICAgIG5ld1Bvc2l0aW9uID0gMTA7XG4gIH0gZWxzZSBpZiAoXG4gICAgZS5jbGllbnRYID49XG4gICAgdGltZVdpZHRoICtcbiAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgK1xuICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICBzY3J1Yk9mZnNldCAqIDJcbiAgKSB7XG4gICAgbmV3UG9zaXRpb24gPSB0aW1lV2lkdGggLSB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgMjAgKyBzY3J1Yk9mZnNldCAqIDI7XG4gIH1cbiAgc2NydWIuZWwuc3R5bGUubGVmdCA9IG5ld1Bvc2l0aW9uICsgXCJweFwiO1xuICBzY3J1Yi5sYXN0LnggPSBlLmNsaWVudFg7XG5cbiAgbGV0IHBlcmNlbnQgPVxuICAgIChlLnBhZ2VYIC0gdGltZWxpbmUub2Zmc2V0TGVmdCAtIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgLSBzY3J1Yk9mZnNldCkgL1xuICAgIHRpbWVXaWR0aDtcbiAgYXVkaW8xLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIGF1ZGlvMS5kdXJhdGlvbjtcbn07XG5cbnNjcnViQ29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgbW91c2VEb3duID0gZmFsc2U7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xufTtcblxucGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgaWYgKGF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGxheSgpO1xuICAgIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xuICB9IGVsc2UgaWYgKCFhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBhdXNlKCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBsYXlfYXJyb3dcIjtcbiAgfVxufSk7XG4iLCJleHBvcnQgY29uc3QgZGVtb3MgPSBbXG4gIHtcbiAgICB0aXRsZTogXCI3IFJpbmdzXCIsXG4gICAgYXJ0aXN0OiBcIkFyaWFuYSBHcmFuZGVcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy83cmluZ3MubXAzXCIsXG4gIH0sXG5cbiAge1xuICAgIHRpdGxlOiBcIkdpb3JubydzIFRoZW1lXCIsXG4gICAgYXJ0aXN0OiBcIkpvam8ncyBCaXphcnJlIEFkdmVudHVyZVwiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljL2pvam8ubXAzXCIsXG4gIH0sXG5cbiAge1xuICAgIHRpdGxlOiBcIkFkb3JlIFlvdVwiLFxuICAgIGFydGlzdDogXCJIYXJyeSBTdHlsZXNcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy9hZG9yZXlvdS5tcDNcIixcbiAgfSxcblxuICB7XG4gICAgdGl0bGU6IFwiU2V2ZW4gTmF0aW9uIEFybXlcIixcbiAgICBhcnRpc3Q6IFwiVGhlIFdoaXRlIFN0cmlwZXNcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy9zbmEubXAzXCIsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogXCJVbnJhdmVsXCIsXG4gICAgYXJ0aXN0OiBcIlRvcnUgS2l0YWppbWFcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy91bnJhdmVsLm1wM1wiLFxuICB9LFxuXTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5jc3NcIjtcbmltcG9ydCBcIi4vc2NydWJCYXJcIjtcblxuaW1wb3J0IHsgcGxheVZpc3VhbGl6ZXIgfSBmcm9tIFwiLi9tYWluVmlzdWFsaXplclwiO1xuaW1wb3J0IHsgZGVtb3MgfSBmcm9tIFwiLi9zb25nc1wiO1xuXG5jb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kYWwtY29udGFpbmVyXCIpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250aW51ZS1idXR0b25cIikub25jbGljayA9ICgpID0+XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJjbG9zZWRcIik7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuY29uc3QgZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXVwbG9hZFwiKTtcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzMVwiKTtcbmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmNvbnN0IGNhbnZhczIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhczJcIik7XG5jYW52YXMyLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMyLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbmNvbnN0IGN0eDIgPSBjYW52YXMyLmdldENvbnRleHQoXCIyZFwiKTtcblxubGV0IGF1ZGlvU291cmNlO1xubGV0IGFuYWx5c2VyO1xuXG5sZXQgYmFyV2lkdGggPSAxNTtcblxubGV0IHggPSBjYW52YXMud2lkdGggLyAyO1xubGV0IHkgPSBjYW52YXMuaGVpZ2h0IC8gMjtcblxuY29uc3QgdG9nZ2xlVUkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvZ2dsZS11aVwiKTtcbmNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuY29uc3Qgc29uZ1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLXRpdGxlXCIpO1xuY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5zb25nVGl0bGUuaW5uZXJIVE1MID0gZGVtb3NbMF0udGl0bGU7XG5zb25nQXJ0aXN0LmlubmVySFRNTCA9IGRlbW9zWzBdLmFydGlzdDtcblxuY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnV0dG9uXCIpO1xuYnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGlkeCkgPT4ge1xuICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gY2hhbmdlQXVkaW9Tb3VyY2UoZGVtb3NbaWR4ICsgMV0sIGlkeCArIDEpO1xufSk7XG5cbmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xufSk7XG5cbmF1ZGlvMS5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG4gIGlmIChhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbiAgfVxuICB0cnkge1xuICAgIGF1ZGlvU291cmNlID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvMSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFuYWx5c2VyID0gYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgYXVkaW9Tb3VyY2UuY29ubmVjdChhbmFseXNlcik7XG4gIGFuYWx5c2VyLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICBhbmFseXNlci5mZnRTaXplID0gMjU2O1xuICBjb25zdCBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcbiAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuICAvLyBydW5zIGlmIHlvdSBjbGljayBhbnl3aGVyZSBpbiB0aGUgY29udGFpbmVyXG4gIGxldCBoZWlnaHQgPSBjYW52YXMyLmhlaWdodDtcbiAgbGV0IHdpZHRoID0gY2FudmFzMi53aWR0aDtcbiAgLy8gYW5pbWF0ZSBsb29wXG4gIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGN0eDIuY2xlYXJSZWN0KDAsIDAsIGNhbnZhczIud2lkdGgsIGNhbnZhczIuaGVpZ2h0KTtcbiAgICBhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShkYXRhQXJyYXkpO1xuXG4gICAgbGV0IGN1cnJlbnRUaW1lID0gYXVkaW8xLmN1cnJlbnRUaW1lO1xuICAgIGxldCBkdXJhdGlvbiA9IGF1ZGlvMS5kdXJhdGlvbjtcblxuICAgIHBsYXlWaXN1YWxpemVyKFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBjdHgsXG4gICAgICBidWZmZXJMZW5ndGgsXG4gICAgICBiYXJXaWR0aCxcbiAgICAgIGRhdGFBcnJheSxcbiAgICAgIGN1cnJlbnRUaW1lLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN0eDJcbiAgICApO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgfTtcbiAgYW5pbWF0ZSgpO1xufSk7XG5cbi8vIGZpbGUgdXBsb2FkXG5maWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcbiAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzO1xuICBjb25zdCBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKTtcbiAgY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZS1pY29uXCIpO1xuICBjb25zdCBzb25nVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctdGl0bGVcIik7XG4gIGNvbnN0IHNvbmdBcnRpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctYXJ0aXN0XCIpO1xuXG4gIHNvbmdUaXRsZS5pbm5lckhUTUwgPSBmaWxlc1swXS5uYW1lLnNsaWNlKDAsIC00KTtcbiAgc29uZ0FydGlzdC5pbm5lckhUTUwgPSBcIlVzZXIgVXBsb2FkXCI7XG5cbiAgYXVkaW8xLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZXNbMF0pO1xuICBhdWRpbzEubG9hZCgpO1xuICBhdWRpbzEucGxheSgpO1xuICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbn0pO1xuXG5mdW5jdGlvbiBjaGFuZ2VBdWRpb1NvdXJjZSh7IHRpdGxlLCBhcnRpc3QsIHNvbmcgfSwgaWR4KSB7XG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBjb25zdCBzb25nVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctdGl0bGVcIik7XG4gIGNvbnN0IHNvbmdBcnRpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctYXJ0aXN0XCIpO1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG5cbiAgYXVkaW8xLnNyYyA9IHNvbmc7XG4gIHNvbmdUaXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbiAgc29uZ0FydGlzdC5pbm5lckhUTUwgPSBhcnRpc3Q7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xuXG4gIFtkZW1vc1swXSwgZGVtb3NbaWR4XV0gPSBbZGVtb3NbaWR4XSwgZGVtb3NbMF1dO1xuICBidXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaWR4KSA9PiB7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IGRlbW9zW2lkeCArIDFdLnRpdGxlO1xuICAgIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gY2hhbmdlQXVkaW9Tb3VyY2UoZGVtb3NbaWR4ICsgMV0sIGlkeCArIDEpO1xuICB9KTtcbn1cblxudG9nZ2xlVUkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGNvbnN0IHNjcnViQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3J1Yi1jb250YWluZXJcIik7XG4gIGNvbnN0IHNsaWRlckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyc1wiKTtcbiAgY29uc3QgbGlua3NDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15LWxpbmtzXCIpO1xuXG4gIHNjcnViQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG4gIHNsaWRlckNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xuICBsaW5rc0NvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xuXG4gIGlmIChzY3J1YkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcbiAgICB0b2dnbGVVSS5pbm5lckhUTUwgPSBcIlJldmVhbCBVSVwiO1xuICB9IGVsc2Uge1xuICAgIHRvZ2dsZVVJLmlubmVySFRNTCA9IFwiSGlkZSBVSVwiO1xuICB9XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=