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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zb25ncy5qcyIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvc3R5bGVzL2luZGV4LmNzcz8yYTMxIiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYW5nbGUiLCJyb3RhdGlvblNwZWVkIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwibGluZVdpZHRoIiwiaW5zZXQiLCJzaWRlcyIsImNyZWF0ZUNpcmNsZSIsInNldEludGVydmFsIiwiY2lyY2xlcyIsInBsYXlWaXN1YWxpemVyIiwieCIsInkiLCJjdHgiLCJidWZmZXJMZW5ndGgiLCJiYXJXaWR0aCIsImRhdGFBcnJheSIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJ3aWR0aCIsImhlaWdodCIsImN0eDIiLCJjb25kaXRpb25hbENpcmNsZSIsImRyYXdDaXJjbGVzIiwicmFkaXVzIiwicmVkdWNlciIsImxlbmd0aCIsInB1c2giLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJodWUiLCJpIiwiYmFySGVpZ2h0IiwiZ3JhZGllbnQiLCJjcmVhdGVSYWRpYWxHcmFkaWVudCIsImFkZENvbG9yU3RvcCIsImJlZ2luUGF0aCIsInNhdmUiLCJ0cmFuc2xhdGUiLCJtb3ZlVG8iLCJkcmF3Q2lyY2xlIiwiZmlsbFN0eWxlIiwiZmlsbCIsInJlc3RvcmUiLCJzdHJva2UiLCJzaGlmdCIsImJhckhlaWdodFJlZHVjZXIiLCJhcmMiLCJQSSIsImRyYXdTdGFyIiwicm90YXRlIiwibGluZVRvIiwicm90YXRpb24iLCJzaGFwZSIsInN0cm9rZVN0eWxlIiwic2NydWIiLCJlbCIsImN1cnJlbnQiLCJsYXN0IiwidGltZWxpbmUiLCJtb3VzZURvd24iLCJhdWRpbzEiLCJzY3J1YkNvbnRhaW5lciIsInBsYXkiLCJwbGF5QnV0dG9uIiwic2NydWJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJzY3J1Yk9mZnNldCIsInBhcnNlSW50IiwicG9zaXRpb24iLCJsZWZ0IiwidGltZVN0eWxlIiwidGltZVdpZHRoIiwib250aW1ldXBkYXRlIiwidGltZWxpbmVXaWR0aCIsInRpbWVQZXJjZW50IiwibmV3UG9zIiwic3R5bGUiLCJvbm1vdXNlZG93biIsIm9yaWdpbiIsIm9mZnNldExlZnQiLCJjb25zb2xlIiwibG9nIiwib25tb3VzZW1vdmUiLCJlIiwicGF1c2UiLCJuZXdQb3NpdGlvbiIsImNsaWVudFgiLCJwZXJjZW50IiwicGFnZVgiLCJvZmZzZXRYIiwib25jbGljayIsIm9ubW91c2V1cCIsImlubmVySFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJwYXVzZWQiLCJkZW1vcyIsInRpdGxlIiwiYXJ0aXN0Iiwic29uZyIsIm1vZGFsIiwiY2xhc3NMaXN0IiwiYWRkIiwiY29udGFpbmVyIiwiZmlsZSIsImNhbnZhcyIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImdldENvbnRleHQiLCJjYW52YXMyIiwiYXVkaW9Tb3VyY2UiLCJhbmFseXNlciIsInRvZ2dsZVVJIiwic29uZ1RpdGxlIiwic29uZ0FydGlzdCIsImJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImJ1dHRvbiIsImlkeCIsImNoYW5nZUF1ZGlvU291cmNlIiwiYXVkaW9DdHgiLCJBdWRpb0NvbnRleHQiLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJlcnJvciIsImNyZWF0ZUFuYWx5c2VyIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZmZ0U2l6ZSIsImZyZXF1ZW5jeUJpbkNvdW50IiwiVWludDhBcnJheSIsImFuaW1hdGUiLCJjbGVhclJlY3QiLCJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGVzIiwibmFtZSIsInNsaWNlIiwic3JjIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibG9hZCIsInNsaWRlckNvbnRhaW5lciIsImxpbmtzQ29udGFpbmVyIiwidG9nZ2xlIiwiY29udGFpbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSyxHQUFHLEVBQVo7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsT0FBekQ7QUFDQSxJQUFJQyxTQUFTLEdBQUdILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBckQ7QUFDQSxJQUFJRSxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixPQUF4QixFQUFpQ0MsS0FBakMsR0FBeUMsSUFBckQ7QUFDQSxJQUFJRyxLQUFLLEdBQUdMLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBakQ7QUFDQSxJQUFJSSxZQUFZLEdBQUcsSUFBbkI7QUFDQUMsV0FBVyxDQUFDO0FBQUEsU0FBT0QsWUFBWSxHQUFHLElBQXRCO0FBQUEsQ0FBRCxFQUE4QixJQUE5QixDQUFYO0FBQ0EsSUFBSUUsT0FBTyxHQUFHLEVBQWQ7QUFFTyxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQzVCQyxDQUQ0QixFQUU1QkMsQ0FGNEIsRUFHNUJDLEdBSDRCLEVBSTVCQyxZQUo0QixFQUs1QkMsUUFMNEIsRUFNNUJDLFNBTjRCLEVBTzVCQyxXQVA0QixFQVE1QkMsUUFSNEIsRUFTNUJDLEtBVDRCLEVBVTVCQyxNQVY0QixFQVc1QkMsSUFYNEIsRUFZekI7QUFDSHJCLGVBQWEsR0FBR0MsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxPQUFyRDtBQUNBQyxXQUFTLEdBQUdILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBakQ7QUFDQUUsT0FBSyxHQUFHSixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUNDLEtBQWpDLEdBQXlDLElBQWpEO0FBQ0FHLE9BQUssR0FBR0wsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxDQUE3QztBQUNBVSxLQUFHLENBQUNULFNBQUosR0FBZ0JBLFNBQWhCO0FBRUFrQixtQkFBaUIsQ0FDZlgsQ0FBQyxHQUFHLENBRFcsRUFFZkMsQ0FBQyxHQUFHLENBRlcsRUFHZkUsWUFIZSxFQUlmQyxRQUplLEVBS2ZDLFNBTGUsRUFNZkgsR0FOZSxFQU9mSSxXQVBlLEVBUWZDLFFBUmUsRUFTZm5CLEtBQUssR0FBRyxDQVRPLENBQWpCO0FBWUF1QixtQkFBaUIsQ0FDZlgsQ0FBQyxJQUFJLElBQUksQ0FBUixDQURjLEVBRWZDLENBQUMsR0FBRyxDQUZXLEVBR2ZFLFlBSGUsRUFJZkMsUUFKZSxFQUtmQyxTQUxlLEVBTWZILEdBTmUsRUFPZkksV0FQZSxFQVFmQyxRQVJlLEVBU2YsQ0FBQ25CLEtBQUQsR0FBUyxDQVRNLENBQWpCO0FBV0F1QixtQkFBaUIsQ0FDZlgsQ0FEZSxFQUVmQyxDQUZlLEVBR2ZFLFlBSGUsRUFJZkMsUUFKZSxFQUtmQyxTQUxlLEVBTWZILEdBTmUsRUFPZkksV0FQZSxFQVFmQyxRQVJlLEVBU2ZuQixLQVRlLENBQWpCO0FBWUF3QixhQUFXLENBQUNGLElBQUQsRUFBT0wsU0FBUCxFQUFrQixJQUFJLENBQXRCLEVBQXlCRyxLQUF6QixFQUFnQ0MsTUFBaEMsQ0FBWDtBQUNELENBdkRNOztBQXlEUCxTQUFTRyxXQUFULENBQXFCVixHQUFyQixFQUEwQlcsTUFBMUIsRUFBa0NDLE9BQWxDLEVBQTJDTixLQUEzQyxFQUFrREMsTUFBbEQsRUFBMEQ7QUFDeEQsTUFBSVgsT0FBTyxDQUFDaUIsTUFBUixHQUFpQixFQUFqQixJQUF1Qm5CLFlBQTNCLEVBQXlDO0FBQ3ZDRSxXQUFPLENBQUNrQixJQUFSLENBQWEsQ0FDWEMsSUFBSSxDQUFDQyxNQUFMLEtBQWdCVixLQURMLEVBRVhDLE1BQU0sR0FBRyxFQUZFLEVBR1hRLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixDQUFoQixHQUFvQixDQUhULEVBSVhELElBQUksQ0FBQ0UsS0FBTCxDQUFXRixJQUFJLENBQUNDLE1BQUwsS0FBZ0JMLE1BQU0sQ0FBQ0UsTUFBbEMsQ0FKVyxDQUFiO0FBTUFuQixnQkFBWSxHQUFHLEtBQWY7QUFDRDs7QUFDRCxNQUFJd0IsR0FBRyxHQUFHUCxNQUFNLENBQUNJLElBQUksQ0FBQ0UsS0FBTCxDQUFXRixJQUFJLENBQUNDLE1BQUwsS0FBZ0JMLE1BQU0sQ0FBQ0UsTUFBbEMsQ0FBRCxDQUFoQjs7QUFDQSxPQUFLLElBQUlNLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd2QixPQUFPLENBQUNpQixNQUE1QixFQUFvQ00sQ0FBQyxFQUFyQyxFQUF5QztBQUN2QyxRQUFJQyxTQUFTLEdBQUdULE1BQU0sQ0FBQ2YsT0FBTyxDQUFDdUIsQ0FBRCxDQUFQLENBQVcsQ0FBWCxDQUFELENBQU4sR0FBd0IsQ0FBeEIsR0FBNEIsRUFBNUM7QUFDQSxRQUFJRSxRQUFRLEdBQUdyQixHQUFHLENBQUNzQixvQkFBSixDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixFQUEvQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxFQUF6QyxDQUFmO0FBQ0FELFlBQVEsQ0FBQ0UsWUFBVCxDQUFzQixDQUF0QixnQkFBZ0NMLEdBQUcsR0FBR0MsQ0FBdEMsY0FBa0QsRUFBbEQ7QUFDQUUsWUFBUSxDQUFDRSxZQUFULENBQXNCLENBQXRCLEVBQXlCLFNBQXpCLEVBSnVDLENBTXZDOztBQUNBdkIsT0FBRyxDQUFDd0IsU0FBSjtBQUNBeEIsT0FBRyxDQUFDeUIsSUFBSjtBQUNBekIsT0FBRyxDQUFDMEIsU0FBSixDQUFjOUIsT0FBTyxDQUFDdUIsQ0FBRCxDQUFQLENBQVcsQ0FBWCxDQUFkLEVBQTZCdkIsT0FBTyxDQUFDdUIsQ0FBRCxDQUFQLENBQVcsQ0FBWCxDQUE3QixFQVR1QyxDQVV2Qzs7QUFDQW5CLE9BQUcsQ0FBQzJCLE1BQUosQ0FBVyxDQUFYLEVBQWMsSUFBSVAsU0FBbEI7QUFDQVEsY0FBVSxDQUFDNUIsR0FBRCxFQUFNb0IsU0FBTixFQUFpQlIsT0FBakIsQ0FBVjtBQUNBWixPQUFHLENBQUM2QixTQUFKLEdBQWdCUixRQUFoQjtBQUNBckIsT0FBRyxDQUFDOEIsSUFBSjtBQUNBOUIsT0FBRyxDQUFDK0IsT0FBSjtBQUNBL0IsT0FBRyxDQUFDZ0MsTUFBSjs7QUFFQSxRQUFJcEMsT0FBTyxDQUFDdUIsQ0FBRCxDQUFQLENBQVcsQ0FBWCxLQUFpQixDQUFDLEVBQXRCLEVBQTBCO0FBQ3hCdkIsYUFBTyxDQUFDcUMsS0FBUjtBQUNEOztBQUNEckMsV0FBTyxDQUFDdUIsQ0FBRCxDQUFQLENBQVcsQ0FBWCxLQUFpQnZCLE9BQU8sQ0FBQ3VCLENBQUQsQ0FBUCxDQUFXLENBQVgsQ0FBakI7QUFDQXZCLFdBQU8sQ0FBQ3VCLENBQUQsQ0FBUCxDQUFXLENBQVgsS0FBaUJKLElBQUksQ0FBQ0MsTUFBTCxFQUFqQjtBQUNEOztBQUNEaEIsS0FBRyxDQUFDK0IsT0FBSjtBQUNEOztBQUVELFNBQVNILFVBQVQsQ0FBb0I1QixHQUFwQixFQUF5Qm9CLFNBQXpCLEVBQW9DYyxnQkFBcEMsRUFBc0Q7QUFDcERsQyxLQUFHLENBQUN3QixTQUFKO0FBQ0F4QixLQUFHLENBQUNtQyxHQUFKLENBQVEsQ0FBUixFQUFXLENBQVgsRUFBY2YsU0FBUyxHQUFHYyxnQkFBMUIsRUFBNEMsQ0FBNUMsRUFBK0NuQixJQUFJLENBQUNxQixFQUFMLEdBQVUsQ0FBekQ7QUFDQXBDLEtBQUcsQ0FBQ2dDLE1BQUo7QUFDRDs7QUFFRCxTQUFTSyxRQUFULENBQWtCckMsR0FBbEIsRUFBdUJXLE1BQXZCLEVBQStCQyxPQUEvQixFQUF3Q2QsQ0FBeEMsRUFBMkNDLENBQTNDLEVBQThDUCxLQUE5QyxFQUFxREMsS0FBckQsRUFBNEQ7QUFDMURPLEtBQUcsQ0FBQ3dCLFNBQUo7QUFFQXhCLEtBQUcsQ0FBQ3lCLElBQUo7O0FBQ0EsT0FBSyxJQUFJTixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMUIsS0FBcEIsRUFBMkIwQixDQUFDLEVBQTVCLEVBQWdDO0FBQzlCbkIsT0FBRyxDQUFDMkIsTUFBSixDQUFXLENBQVgsRUFBYyxJQUFJaEIsTUFBbEI7QUFDQVgsT0FBRyxDQUFDc0MsTUFBSixDQUFXdkIsSUFBSSxDQUFDcUIsRUFBTCxHQUFVM0MsS0FBckI7QUFDQU8sT0FBRyxDQUFDdUMsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFDNUIsTUFBRCxHQUFVbkIsS0FBeEI7QUFDQVEsT0FBRyxDQUFDc0MsTUFBSixDQUFXdkIsSUFBSSxDQUFDcUIsRUFBTCxHQUFVM0MsS0FBckI7QUFDQU8sT0FBRyxDQUFDdUMsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFDNUIsTUFBZjtBQUNBWCxPQUFHLENBQUN1QyxNQUFKLENBQVcsQ0FBWCxFQUFjNUIsTUFBZDtBQUNEOztBQUNEWCxLQUFHLENBQUMrQixPQUFKO0FBQ0EvQixLQUFHLENBQUNnQyxNQUFKO0FBQ0Q7O0FBRUQsU0FBU3ZCLGlCQUFULENBQ0VYLENBREYsRUFFRUMsQ0FGRixFQUdFRSxZQUhGLEVBSUVDLFFBSkYsRUFLRUMsU0FMRixFQU1FSCxHQU5GLEVBT0VJLFdBUEYsRUFRRUMsUUFSRixFQVNFbUMsUUFURixFQVVFO0FBQ0EsT0FBSyxJQUFJckIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2xCLFlBQXBCLEVBQWtDa0IsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJQyxTQUFTLEdBQUdqQixTQUFTLENBQUNnQixDQUFELENBQXpCO0FBQ0EsUUFBSUQsR0FBRyxHQUFHZCxXQUFXLEdBQUdlLENBQXhCO0FBQ0EsUUFBSXNCLEtBQUssR0FBR2IsVUFBWjs7QUFFQSxRQUFJWSxRQUFRLEtBQUt0RCxLQUFiLElBQXNCaUMsQ0FBQyxHQUFHLEVBQUosS0FBVyxDQUFyQyxFQUF3QztBQUN0Q0MsZUFBUyxHQUFHakIsU0FBUyxDQUFDZ0IsQ0FBRCxDQUFULEdBQWUsQ0FBM0I7QUFDQXNCLFdBQUssR0FBR0osUUFBUjtBQUNEOztBQUNELFFBQUlHLFFBQVEsS0FBS3RELEtBQWIsSUFBc0JpQyxDQUFDLEdBQUcsRUFBSixLQUFXLENBQXJDLEVBQXdDO0FBQ3RDQyxlQUFTLEdBQUdqQixTQUFTLENBQUNnQixDQUFELENBQVQsR0FBZSxDQUEzQjs7QUFDQXNCLFdBQUssR0FBRyxpQkFBTSxDQUFFLENBQWhCO0FBQ0Q7O0FBRUR6QyxPQUFHLENBQUN5QixJQUFKO0FBRUF6QixPQUFHLENBQUMwQixTQUFKLENBQWM1QixDQUFkLEVBQWlCQyxDQUFqQjtBQUVBQyxPQUFHLENBQUNzQyxNQUFKLENBQVduQixDQUFDLEdBQUdxQixRQUFmO0FBRUF4QyxPQUFHLENBQUMwQyxXQUFKLGlCQUF5QnhCLEdBQXpCLHFCQUF1Q0MsQ0FBdkM7QUFDQW5CLE9BQUcsQ0FBQ3dCLFNBQUo7QUFDQXhCLE9BQUcsQ0FBQzJCLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZDtBQUNBM0IsT0FBRyxDQUFDdUMsTUFBSixDQUFXLENBQVgsRUFBY25CLFNBQWQ7QUFDQXBCLE9BQUcsQ0FBQ2dDLE1BQUo7O0FBQ0EsUUFBSWIsQ0FBQyxHQUFHbEIsWUFBWSxHQUFHLEdBQXZCLEVBQTRCO0FBQzFCd0MsV0FBSyxDQUFDekMsR0FBRCxFQUFNb0IsU0FBTixFQUFpQixDQUFqQixFQUFvQnRCLENBQXBCLEVBQXVCQyxDQUF2QixFQUEwQlAsS0FBMUIsRUFBaUNDLEtBQWpDLENBQUw7QUFDRCxLQUZELE1BRU8sSUFBSTBCLENBQUMsR0FBR2xCLFlBQVksR0FBRyxHQUF2QixFQUE0QjtBQUNqQ3dDLFdBQUssQ0FBQ3pDLEdBQUQsRUFBTW9CLFNBQU4sRUFBaUIsQ0FBakIsRUFBb0J0QixDQUFwQixFQUF1QkMsQ0FBdkIsRUFBMEJQLEtBQTFCLEVBQWlDQyxLQUFqQyxDQUFMO0FBQ0QsS0FGTSxNQUVBLElBQUkwQixDQUFDLEdBQUdsQixZQUFZLEdBQUcsR0FBdkIsRUFBNEI7QUFDakN3QyxXQUFLLENBQUN6QyxHQUFELEVBQU1vQixTQUFOLEVBQWlCLEdBQWpCLEVBQXNCdEIsQ0FBdEIsRUFBeUJDLENBQXpCLEVBQTRCUCxLQUE1QixFQUFtQ0MsS0FBbkMsQ0FBTDtBQUNEOztBQUNETyxPQUFHLENBQUMrQixPQUFKO0FBQ0Q7O0FBQ0Q3QyxPQUFLLElBQUlDLGFBQVQ7QUFDRCxDOzs7Ozs7Ozs7O0FDNUtELElBQUl3RCxLQUFLLEdBQUc7QUFDUkMsSUFBRSxFQUFFeEQsUUFBUSxDQUFDQyxjQUFULENBQXdCLE9BQXhCLENBREk7QUFFUndELFNBQU8sRUFBRTtBQUNQL0MsS0FBQyxFQUFFO0FBREksR0FGRDtBQUtSZ0QsTUFBSSxFQUFFO0FBQ0poRCxLQUFDLEVBQUU7QUFEQztBQUxFLENBQVo7QUFBQSxJQVNFaUQsUUFBUSxHQUFHM0QsUUFBUSxDQUFDQyxjQUFULENBQXdCLFVBQXhCLENBVGI7QUFBQSxJQVVFMkQsU0FBUyxHQUFHLEtBVmQ7QUFBQSxJQVdFQyxNQUFNLEdBQUc3RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FYWDtBQUFBLElBWUU2RCxjQUFjLEdBQUc5RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsaUJBQXhCLENBWm5CO0FBQUEsSUFhRThELElBQUksR0FBRy9ELFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixNQUF4QixDQWJUO0FBQUEsSUFjRStELFVBQVUsR0FBR2hFLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FkZjtBQWVBLElBQUlnRSxVQUFVLEdBQUdDLGdCQUFnQixDQUFDWCxLQUFLLENBQUNDLEVBQVAsQ0FBakM7QUFBQSxJQUNFVyxXQUFXLEdBQUdDLFFBQVEsQ0FBQ0gsVUFBVSxDQUFDL0MsS0FBWixFQUFtQixFQUFuQixDQUFSLEdBQWlDLENBRGpEO0FBQUEsSUFFRW1ELFFBQVEsR0FBR0QsUUFBUSxDQUFDSCxVQUFVLENBQUNLLElBQVosRUFBa0IsRUFBbEIsQ0FGckI7QUFBQSxJQUdFQyxTQUFTLEdBQUdMLGdCQUFnQixDQUFDUCxRQUFELEVBQVcsRUFBWCxDQUg5QjtBQUFBLElBSUVhLFNBQVMsR0FBR0osUUFBUSxDQUFDRyxTQUFTLENBQUNyRCxLQUFYLEVBQWtCLEVBQWxCLENBSnRCOztBQU1BMkMsTUFBTSxDQUFDWSxZQUFQLEdBQXNCLFlBQVk7QUFDaEMsTUFBSWIsU0FBUyxLQUFLLEtBQWxCLEVBQXlCO0FBQ3ZCLFFBQUljLGFBQWEsR0FDZk4sUUFBUSxDQUFDRixnQkFBZ0IsQ0FBQ1AsUUFBRCxDQUFoQixDQUEyQnpDLEtBQTVCLEVBQW1DLEVBQW5DLENBQVIsR0FBaURpRCxXQUFXLEdBQUcsQ0FBL0QsR0FBbUUsRUFEckU7QUFFQSxRQUFJUSxXQUFXLEdBQUdkLE1BQU0sQ0FBQzdDLFdBQVAsR0FBcUI2QyxNQUFNLENBQUM1QyxRQUE5QztBQUNBLFFBQUkyRCxNQUFNLEdBQUdGLGFBQWEsR0FBR0MsV0FBaEIsR0FBOEIsRUFBM0M7QUFDQXBCLFNBQUssQ0FBQ0MsRUFBTixDQUFTcUIsS0FBVCxDQUFlUCxJQUFmLEdBQXNCTSxNQUFNLEdBQUcsSUFBL0I7QUFDRDtBQUNGLENBUkQ7O0FBVUFqQixRQUFRLENBQUNtQixXQUFULEdBQXVCLFlBQVk7QUFDakNsQixXQUFTLEdBQUcsSUFBWjtBQUNBTCxPQUFLLENBQUN3QixNQUFOLEdBQWVwQixRQUFRLENBQUNxQixVQUF4QjtBQUNBekIsT0FBSyxDQUFDRyxJQUFOLENBQVdoRCxDQUFYLEdBQ0U2QyxLQUFLLENBQUNDLEVBQU4sQ0FBU3dCLFVBQVQsR0FDQWxCLGNBQWMsQ0FBQ2tCLFVBRGYsR0FFQXJCLFFBQVEsQ0FBQ3FCLFVBRlQsR0FHQWIsV0FBVyxHQUFHLENBSmhCO0FBS0FjLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVo7QUFDRCxDQVREOztBQVdBdkIsUUFBUSxDQUFDd0IsV0FBVCxHQUF1QixVQUFVQyxDQUFWLEVBQWE7QUFDbEMsTUFBSXhCLFNBQVMsS0FBSyxJQUFsQixFQUF3QjtBQUN0QkMsVUFBTSxDQUFDd0IsS0FBUDs7QUFDQSxRQUFJcEIsV0FBVSxHQUFHQyxnQkFBZ0IsQ0FBQ1gsS0FBSyxDQUFDQyxFQUFQLENBQWpDO0FBQUEsUUFDRVcsWUFBVyxHQUFHQyxRQUFRLENBQUNILFdBQVUsQ0FBQy9DLEtBQVosRUFBbUIsRUFBbkIsQ0FBUixHQUFpQyxDQURqRDtBQUFBLFFBRUVtRCxTQUFRLEdBQUdELFFBQVEsQ0FBQ0gsV0FBVSxDQUFDSyxJQUFaLEVBQWtCLEVBQWxCLENBRnJCO0FBQUEsUUFHRWdCLFdBQVcsR0FBR2pCLFNBQVEsSUFBSWUsQ0FBQyxDQUFDRyxPQUFGLEdBQVloQyxLQUFLLENBQUNHLElBQU4sQ0FBV2hELENBQTNCLENBSHhCO0FBQUEsUUFJRTZELFVBQVMsR0FBR0wsZ0JBQWdCLENBQUNQLFFBQUQsRUFBVyxFQUFYLENBSjlCO0FBQUEsUUFLRWEsVUFBUyxHQUFHSixRQUFRLENBQUNHLFVBQVMsQ0FBQ3JELEtBQVgsRUFBa0IsRUFBbEIsQ0FMdEI7O0FBTUEsUUFDRWtFLENBQUMsQ0FBQ0csT0FBRixHQUNBNUIsUUFBUSxDQUFDcUIsVUFBVCxHQUFzQmxCLGNBQWMsQ0FBQ2tCLFVBQXJDLEdBQWtEYixZQUFXLEdBQUcsQ0FGbEUsRUFHRTtBQUNBbUIsaUJBQVcsR0FBRyxFQUFkO0FBQ0QsS0FMRCxNQUtPLElBQ0xGLENBQUMsQ0FBQ0csT0FBRixJQUNBZixVQUFTLEdBQ1BiLFFBQVEsQ0FBQ3FCLFVBRFgsR0FFRWxCLGNBQWMsQ0FBQ2tCLFVBRmpCLEdBR0ViLFlBQVcsR0FBRyxDQUxYLEVBTUw7QUFDQW1CLGlCQUFXLEdBQUdkLFVBQVMsR0FBR2IsUUFBUSxDQUFDcUIsVUFBckIsR0FBa0MsRUFBbEMsR0FBdUNiLFlBQVcsR0FBRyxDQUFuRTtBQUNEOztBQUNEWixTQUFLLENBQUNDLEVBQU4sQ0FBU3FCLEtBQVQsQ0FBZVAsSUFBZixHQUFzQmdCLFdBQVcsR0FBRyxJQUFwQztBQUNBL0IsU0FBSyxDQUFDRyxJQUFOLENBQVdoRCxDQUFYLEdBQWUwRSxDQUFDLENBQUNHLE9BQWpCO0FBRUEsUUFBSUMsT0FBTyxHQUNULENBQUNKLENBQUMsQ0FBQ0ssS0FBRixHQUNDOUIsUUFBUSxDQUFDcUIsVUFEVixHQUVDbEIsY0FBYyxDQUFDa0IsVUFGaEIsR0FHQ2IsWUFIRixJQUlBSyxVQUxGO0FBTUFYLFVBQU0sQ0FBQzdDLFdBQVAsR0FBcUJ3RSxPQUFPLEdBQUczQixNQUFNLENBQUM1QyxRQUF0QztBQUNBZ0UsV0FBTyxDQUFDQyxHQUFSLENBQ0VJLFdBREYsRUFFRUYsQ0FBQyxDQUFDTSxPQUZKLEVBR0VOLENBQUMsQ0FBQ0ssS0FISixFQUlFRCxPQUpGLEVBS0VqQyxLQUFLLENBQUNHLElBQU4sQ0FBV2hELENBTGIsRUFNRTBFLENBQUMsQ0FBQ0csT0FOSjtBQVFEO0FBQ0YsQ0ExQ0Q7O0FBNENBNUIsUUFBUSxDQUFDZ0MsT0FBVCxHQUFtQixVQUFVUCxDQUFWLEVBQWE7QUFDOUIsTUFBSW5CLFVBQVUsR0FBR0MsZ0JBQWdCLENBQUNYLEtBQUssQ0FBQ0MsRUFBUCxDQUFqQztBQUFBLE1BQ0VXLFdBQVcsR0FBR0MsUUFBUSxDQUFDSCxVQUFVLENBQUMvQyxLQUFaLEVBQW1CLEVBQW5CLENBQVIsR0FBaUMsQ0FEakQ7QUFBQSxNQUVFbUQsUUFBUSxHQUFHRCxRQUFRLENBQUNILFVBQVUsQ0FBQ0ssSUFBWixFQUFrQixFQUFsQixDQUZyQjtBQUFBLE1BR0VnQixXQUFXLEdBQUdqQixRQUFRLElBQUllLENBQUMsQ0FBQ0csT0FBRixHQUFZaEMsS0FBSyxDQUFDRyxJQUFOLENBQVdoRCxDQUEzQixDQUh4QjtBQUFBLE1BSUU2RCxTQUFTLEdBQUdMLGdCQUFnQixDQUFDUCxRQUFELEVBQVcsRUFBWCxDQUo5QjtBQUFBLE1BS0VhLFNBQVMsR0FBR0osUUFBUSxDQUFDRyxTQUFTLENBQUNyRCxLQUFYLEVBQWtCLEVBQWxCLENBQVIsR0FBZ0MsRUFMOUM7O0FBTUEsTUFDRWtFLENBQUMsQ0FBQ0csT0FBRixHQUNBNUIsUUFBUSxDQUFDcUIsVUFBVCxHQUFzQmxCLGNBQWMsQ0FBQ2tCLFVBQXJDLEdBQWtEYixXQUFXLEdBQUcsQ0FGbEUsRUFHRTtBQUNBbUIsZUFBVyxHQUFHLEVBQWQ7QUFDRCxHQUxELE1BS08sSUFDTEYsQ0FBQyxDQUFDRyxPQUFGLElBQ0FmLFNBQVMsR0FDUGIsUUFBUSxDQUFDcUIsVUFEWCxHQUVFbEIsY0FBYyxDQUFDa0IsVUFGakIsR0FHRWIsV0FBVyxHQUFHLENBTFgsRUFNTDtBQUNBbUIsZUFBVyxHQUFHZCxTQUFTLEdBQUdiLFFBQVEsQ0FBQ3FCLFVBQXJCLEdBQWtDLEVBQWxDLEdBQXVDYixXQUFXLEdBQUcsQ0FBbkU7QUFDRDs7QUFDRFosT0FBSyxDQUFDQyxFQUFOLENBQVNxQixLQUFULENBQWVQLElBQWYsR0FBc0JnQixXQUFXLEdBQUcsSUFBcEM7QUFDQS9CLE9BQUssQ0FBQ0csSUFBTixDQUFXaEQsQ0FBWCxHQUFlMEUsQ0FBQyxDQUFDRyxPQUFqQjtBQUVBLE1BQUlDLE9BQU8sR0FDVCxDQUFDSixDQUFDLENBQUNLLEtBQUYsR0FBVTlCLFFBQVEsQ0FBQ3FCLFVBQW5CLEdBQWdDbEIsY0FBYyxDQUFDa0IsVUFBL0MsR0FBNERiLFdBQTdELElBQ0FLLFNBRkY7QUFHQVgsUUFBTSxDQUFDN0MsV0FBUCxHQUFxQndFLE9BQU8sR0FBRzNCLE1BQU0sQ0FBQzVDLFFBQXRDO0FBQ0QsQ0E1QkQ7O0FBOEJBNkMsY0FBYyxDQUFDOEIsU0FBZixHQUEyQixZQUFZO0FBQ3JDaEMsV0FBUyxHQUFHLEtBQVo7QUFDQUMsUUFBTSxDQUFDRSxJQUFQO0FBQ0FDLFlBQVUsQ0FBQzZCLFNBQVgsR0FBdUIsT0FBdkI7QUFDRCxDQUpEOztBQU1BOUIsSUFBSSxDQUFDK0IsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBVVYsQ0FBVixFQUFhO0FBQzFDQSxHQUFDLENBQUNXLGVBQUY7O0FBQ0EsTUFBSWxDLE1BQU0sQ0FBQ21DLE1BQVgsRUFBbUI7QUFDakJuQyxVQUFNLENBQUNFLElBQVA7QUFDQUMsY0FBVSxDQUFDNkIsU0FBWCxHQUF1QixPQUF2QjtBQUNELEdBSEQsTUFHTyxJQUFJLENBQUNoQyxNQUFNLENBQUNtQyxNQUFaLEVBQW9CO0FBQ3pCbkMsVUFBTSxDQUFDd0IsS0FBUDtBQUNBckIsY0FBVSxDQUFDNkIsU0FBWCxHQUF1QixZQUF2QjtBQUNEO0FBQ0YsQ0FURCxFOzs7Ozs7Ozs7Ozs7Ozs7QUMxSE8sSUFBTUksS0FBSyxHQUFHLENBQ25CO0FBQ0VDLE9BQUssRUFBRSxTQURUO0FBRUVDLFFBQU0sRUFBRSxlQUZWO0FBR0VDLE1BQUksRUFBRTtBQUhSLENBRG1CLEVBT25CO0FBQ0VGLE9BQUssRUFBRSxnQkFEVDtBQUVFQyxRQUFNLEVBQUUsMEJBRlY7QUFHRUMsTUFBSSxFQUFFO0FBSFIsQ0FQbUIsRUFhbkI7QUFDRUYsT0FBSyxFQUFFLFdBRFQ7QUFFRUMsUUFBTSxFQUFFLGNBRlY7QUFHRUMsTUFBSSxFQUFFO0FBSFIsQ0FibUIsRUFtQm5CO0FBQ0VGLE9BQUssRUFBRSxtQkFEVDtBQUVFQyxRQUFNLEVBQUUsbUJBRlY7QUFHRUMsTUFBSSxFQUFFO0FBSFIsQ0FuQm1CLEVBd0JuQjtBQUNFRixPQUFLLEVBQUUsU0FEVDtBQUVFQyxRQUFNLEVBQUUsZUFGVjtBQUdFQyxNQUFJLEVBQUU7QUFIUixDQXhCbUIsQ0FBZCxDOzs7Ozs7Ozs7Ozs7QUNBUDs7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLGNBQWMsMEJBQTBCLEVBQUU7V0FDMUMsY0FBYyxlQUFlO1dBQzdCLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsNkNBQTZDLHdEQUF3RCxFOzs7OztXQ0FyRztXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBRUE7QUFDQTtBQUVBLElBQU1DLEtBQUssR0FBR3JHLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBZDs7QUFDQUQsUUFBUSxDQUFDQyxjQUFULENBQXdCLGlCQUF4QixFQUEyQzBGLE9BQTNDLEdBQXFEO0FBQUEsU0FDbkRVLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsQ0FEbUQ7QUFBQSxDQUFyRDs7QUFHQSxJQUFNQyxTQUFTLEdBQUd4RyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBbEI7QUFDQSxJQUFNd0csSUFBSSxHQUFHekcsUUFBUSxDQUFDQyxjQUFULENBQXdCLFlBQXhCLENBQWI7QUFDQSxJQUFNeUcsTUFBTSxHQUFHMUcsUUFBUSxDQUFDQyxjQUFULENBQXdCLFNBQXhCLENBQWY7QUFDQXlHLE1BQU0sQ0FBQ3hGLEtBQVAsR0FBZXlGLE1BQU0sQ0FBQ0MsVUFBdEI7QUFDQUYsTUFBTSxDQUFDdkYsTUFBUCxHQUFnQndGLE1BQU0sQ0FBQ0UsV0FBdkI7QUFDQSxJQUFNakcsR0FBRyxHQUFHOEYsTUFBTSxDQUFDSSxVQUFQLENBQWtCLElBQWxCLENBQVo7QUFFQSxJQUFNQyxPQUFPLEdBQUcvRyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQThHLE9BQU8sQ0FBQzdGLEtBQVIsR0FBZ0J5RixNQUFNLENBQUNDLFVBQXZCO0FBQ0FHLE9BQU8sQ0FBQzVGLE1BQVIsR0FBaUJ3RixNQUFNLENBQUNFLFdBQXhCO0FBQ0EsSUFBTXpGLElBQUksR0FBRzJGLE9BQU8sQ0FBQ0QsVUFBUixDQUFtQixJQUFuQixDQUFiO0FBRUEsSUFBSUUsV0FBSjtBQUNBLElBQUlDLFFBQUo7QUFFQSxJQUFJbkcsUUFBUSxHQUFHLEVBQWY7QUFFQSxJQUFJSixDQUFDLEdBQUdnRyxNQUFNLENBQUN4RixLQUFQLEdBQWUsQ0FBdkI7QUFDQSxJQUFJUCxDQUFDLEdBQUcrRixNQUFNLENBQUN2RixNQUFQLEdBQWdCLENBQXhCO0FBRUEsSUFBTStGLFFBQVEsR0FBR2xILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixXQUF4QixDQUFqQjtBQUNBLElBQU00RCxNQUFNLEdBQUc3RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjtBQUNBLElBQU1rSCxTQUFTLEdBQUduSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBbEI7QUFDQSxJQUFNbUgsVUFBVSxHQUFHcEgsUUFBUSxDQUFDQyxjQUFULENBQXdCLGFBQXhCLENBQW5CO0FBQ0FrSCxTQUFTLENBQUN0QixTQUFWLEdBQXNCSSxrREFBdEI7QUFDQW1CLFVBQVUsQ0FBQ3ZCLFNBQVgsR0FBdUJJLG1EQUF2QjtBQUVBLElBQU1vQixPQUFPLEdBQUdySCxRQUFRLENBQUNzSCxnQkFBVCxDQUEwQixTQUExQixDQUFoQjtBQUNBRCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0IsVUFBQ0MsTUFBRCxFQUFTQyxHQUFULEVBQWlCO0FBQy9CRCxRQUFNLENBQUMzQixTQUFQLEdBQW1CSSx5Q0FBSyxDQUFDd0IsR0FBRyxHQUFHLENBQVAsQ0FBTCxDQUFldkIsS0FBbEM7O0FBQ0FzQixRQUFNLENBQUM3QixPQUFQLEdBQWlCO0FBQUEsV0FBTStCLGlCQUFpQixDQUFDekIseUNBQUssQ0FBQ3dCLEdBQUcsR0FBRyxDQUFQLENBQU4sRUFBaUJBLEdBQUcsR0FBRyxDQUF2QixDQUF2QjtBQUFBLEdBQWpCO0FBQ0QsQ0FIRDtBQUtBakIsU0FBUyxDQUFDVixnQkFBVixDQUEyQixPQUEzQixFQUFvQyxZQUFZO0FBQzlDLE1BQU05QixVQUFVLEdBQUdoRSxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsaUJBQXhCLENBQW5CO0FBQ0E0RCxRQUFNLENBQUNFLElBQVA7QUFDQUMsWUFBVSxDQUFDNkIsU0FBWCxHQUF1QixPQUF2QjtBQUNELENBSkQ7QUFNQWhDLE1BQU0sQ0FBQ2lDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFlBQVk7QUFDMUMsTUFBTTZCLFFBQVEsR0FBRyxJQUFJQyxZQUFKLEVBQWpCO0FBQ0EsTUFBTTVELFVBQVUsR0FBR2hFLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBbkI7O0FBQ0EsTUFBSTRELE1BQU0sQ0FBQ21DLE1BQVgsRUFBbUI7QUFDakJuQyxVQUFNLENBQUNFLElBQVA7QUFDQUMsY0FBVSxDQUFDNkIsU0FBWCxHQUF1QixPQUF2QjtBQUNEOztBQUNELE1BQUk7QUFDRm1CLGVBQVcsR0FBR1csUUFBUSxDQUFDRSx3QkFBVCxDQUFrQ2hFLE1BQWxDLENBQWQ7QUFDRCxHQUZELENBRUUsT0FBT2lFLEtBQVAsRUFBYztBQUNkO0FBQ0Q7O0FBQ0RiLFVBQVEsR0FBR1UsUUFBUSxDQUFDSSxjQUFULEVBQVg7QUFDQWYsYUFBVyxDQUFDZ0IsT0FBWixDQUFvQmYsUUFBcEI7QUFDQUEsVUFBUSxDQUFDZSxPQUFULENBQWlCTCxRQUFRLENBQUNNLFdBQTFCO0FBQ0FoQixVQUFRLENBQUNpQixPQUFULEdBQW1CLEdBQW5CO0FBQ0EsTUFBTXJILFlBQVksR0FBR29HLFFBQVEsQ0FBQ2tCLGlCQUE5QjtBQUNBLE1BQU1wSCxTQUFTLEdBQUcsSUFBSXFILFVBQUosQ0FBZXZILFlBQWYsQ0FBbEIsQ0FqQjBDLENBbUIxQzs7QUFDQSxNQUFJTSxNQUFNLEdBQUc0RixPQUFPLENBQUM1RixNQUFyQjtBQUNBLE1BQUlELEtBQUssR0FBRzZGLE9BQU8sQ0FBQzdGLEtBQXBCLENBckIwQyxDQXNCMUM7O0FBQ0EsTUFBTW1ILE9BQU8sR0FBRyxTQUFWQSxPQUFVLEdBQU07QUFDcEJ6SCxPQUFHLENBQUMwSCxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQjVCLE1BQU0sQ0FBQ3hGLEtBQTNCLEVBQWtDd0YsTUFBTSxDQUFDdkYsTUFBekM7QUFDQUMsUUFBSSxDQUFDa0gsU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUJ2QixPQUFPLENBQUM3RixLQUE3QixFQUFvQzZGLE9BQU8sQ0FBQzVGLE1BQTVDO0FBQ0E4RixZQUFRLENBQUNzQixvQkFBVCxDQUE4QnhILFNBQTlCO0FBRUEsUUFBSUMsV0FBVyxHQUFHNkMsTUFBTSxDQUFDN0MsV0FBekI7QUFDQSxRQUFJQyxRQUFRLEdBQUc0QyxNQUFNLENBQUM1QyxRQUF0QjtBQUVBUixtRUFBYyxDQUNaQyxDQURZLEVBRVpDLENBRlksRUFHWkMsR0FIWSxFQUlaQyxZQUpZLEVBS1pDLFFBTFksRUFNWkMsU0FOWSxFQU9aQyxXQVBZLEVBUVpDLFFBUlksRUFTWkMsS0FUWSxFQVVaQyxNQVZZLEVBV1pDLElBWFksQ0FBZDtBQWFBb0gseUJBQXFCLENBQUNILE9BQUQsQ0FBckI7QUFDRCxHQXRCRDs7QUF1QkFBLFNBQU87QUFDUixDQS9DRCxFLENBaURBOztBQUNBNUIsSUFBSSxDQUFDWCxnQkFBTCxDQUFzQixRQUF0QixFQUFnQyxVQUFVVixDQUFWLEVBQWE7QUFDM0MsTUFBTXFELEtBQUssR0FBRyxLQUFLQSxLQUFuQjtBQUNBLE1BQU01RSxNQUFNLEdBQUc3RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjtBQUNBLE1BQU0rRCxVQUFVLEdBQUdoRSxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsaUJBQXhCLENBQW5CO0FBQ0EsTUFBTWtILFNBQVMsR0FBR25ILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixZQUF4QixDQUFsQjtBQUNBLE1BQU1tSCxVQUFVLEdBQUdwSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBbkI7QUFFQWtILFdBQVMsQ0FBQ3RCLFNBQVYsR0FBc0I0QyxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQixDQUFwQixFQUF1QixDQUFDLENBQXhCLENBQXRCO0FBQ0F2QixZQUFVLENBQUN2QixTQUFYLEdBQXVCLGFBQXZCO0FBRUFoQyxRQUFNLENBQUMrRSxHQUFQLEdBQWFDLEdBQUcsQ0FBQ0MsZUFBSixDQUFvQkwsS0FBSyxDQUFDLENBQUQsQ0FBekIsQ0FBYjtBQUNBNUUsUUFBTSxDQUFDa0YsSUFBUDtBQUNBbEYsUUFBTSxDQUFDRSxJQUFQO0FBQ0FDLFlBQVUsQ0FBQzZCLFNBQVgsR0FBdUIsT0FBdkI7QUFDRCxDQWREOztBQWdCQSxTQUFTNkIsaUJBQVQsT0FBb0RELEdBQXBELEVBQXlEO0FBQUEsTUFBNUJ2QixLQUE0QixRQUE1QkEsS0FBNEI7QUFBQSxNQUFyQkMsTUFBcUIsUUFBckJBLE1BQXFCO0FBQUEsTUFBYkMsSUFBYSxRQUFiQSxJQUFhO0FBQ3ZELE1BQU12QyxNQUFNLEdBQUc3RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjtBQUNBLE1BQU1rSCxTQUFTLEdBQUduSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBbEI7QUFDQSxNQUFNbUgsVUFBVSxHQUFHcEgsUUFBUSxDQUFDQyxjQUFULENBQXdCLGFBQXhCLENBQW5CO0FBQ0EsTUFBTStELFVBQVUsR0FBR2hFLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBbkI7QUFFQTRELFFBQU0sQ0FBQytFLEdBQVAsR0FBYXhDLElBQWI7QUFDQWUsV0FBUyxDQUFDdEIsU0FBVixHQUFzQkssS0FBdEI7QUFDQWtCLFlBQVUsQ0FBQ3ZCLFNBQVgsR0FBdUJNLE1BQXZCO0FBQ0F0QyxRQUFNLENBQUNFLElBQVA7QUFDQUMsWUFBVSxDQUFDNkIsU0FBWCxHQUF1QixPQUF2QjtBQVZ1RCxjQVk5QixDQUFDSSx5Q0FBSyxDQUFDd0IsR0FBRCxDQUFOLEVBQWF4Qiw0Q0FBYixDQVo4QjtBQVl0REEsOENBWnNEO0FBWTVDQSwyQ0FBSyxDQUFDd0IsR0FBRCxDQVp1QztBQWF2REosU0FBTyxDQUFDRSxPQUFSLENBQWdCLFVBQUNDLE1BQUQsRUFBU0MsR0FBVCxFQUFpQjtBQUMvQkQsVUFBTSxDQUFDM0IsU0FBUCxHQUFtQkkseUNBQUssQ0FBQ3dCLEdBQUcsR0FBRyxDQUFQLENBQUwsQ0FBZXZCLEtBQWxDOztBQUNBc0IsVUFBTSxDQUFDN0IsT0FBUCxHQUFpQjtBQUFBLGFBQU0rQixpQkFBaUIsQ0FBQ3pCLHlDQUFLLENBQUN3QixHQUFHLEdBQUcsQ0FBUCxDQUFOLEVBQWlCQSxHQUFHLEdBQUcsQ0FBdkIsQ0FBdkI7QUFBQSxLQUFqQjtBQUNELEdBSEQ7QUFJRDs7QUFFRFAsUUFBUSxDQUFDcEIsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBVVYsQ0FBVixFQUFhO0FBQzlDQSxHQUFDLENBQUNXLGVBQUY7QUFDQSxNQUFNakMsY0FBYyxHQUFHOUQsUUFBUSxDQUFDQyxjQUFULENBQXdCLGlCQUF4QixDQUF2QjtBQUNBLE1BQU0rSSxlQUFlLEdBQUdoSixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBeEI7QUFDQSxNQUFNZ0osY0FBYyxHQUFHakosUUFBUSxDQUFDQyxjQUFULENBQXdCLFVBQXhCLENBQXZCO0FBRUE2RCxnQkFBYyxDQUFDd0MsU0FBZixDQUF5QjRDLE1BQXpCLENBQWdDLFFBQWhDO0FBQ0FGLGlCQUFlLENBQUMxQyxTQUFoQixDQUEwQjRDLE1BQTFCLENBQWlDLFFBQWpDO0FBQ0FELGdCQUFjLENBQUMzQyxTQUFmLENBQXlCNEMsTUFBekIsQ0FBZ0MsUUFBaEM7O0FBRUEsTUFBSXBGLGNBQWMsQ0FBQ3dDLFNBQWYsQ0FBeUI2QyxRQUF6QixDQUFrQyxRQUFsQyxDQUFKLEVBQWlEO0FBQy9DakMsWUFBUSxDQUFDckIsU0FBVCxHQUFxQixXQUFyQjtBQUNELEdBRkQsTUFFTztBQUNMcUIsWUFBUSxDQUFDckIsU0FBVCxHQUFxQixTQUFyQjtBQUNEO0FBQ0YsQ0FmRCxFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgYW5nbGUgPSAxMDtcbmxldCByb3RhdGlvblNwZWVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ4XCIpLnZhbHVlICogMC4wMDAwNTtcbmxldCBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xubGV0IGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG5sZXQgc2lkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5cIikudmFsdWUgKiAxO1xubGV0IGNyZWF0ZUNpcmNsZSA9IHRydWU7XG5zZXRJbnRlcnZhbCgoKSA9PiAoY3JlYXRlQ2lyY2xlID0gdHJ1ZSksIDEwMDApO1xubGV0IGNpcmNsZXMgPSBbXTtcblxuZXhwb3J0IGNvbnN0IHBsYXlWaXN1YWxpemVyID0gKFxuICB4LFxuICB5LFxuICBjdHgsXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBjdHgyXG4pID0+IHtcbiAgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG4gIGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG4gIGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG4gIHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbiAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4IC8gMyxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZSAvIDRcbiAgKTtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4ICogKDUgLyAzKSxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICAtYW5nbGUgLyA0XG4gICk7XG4gIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICAgIHgsXG4gICAgeSxcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZVxuICApO1xuXG4gIGRyYXdDaXJjbGVzKGN0eDIsIGRhdGFBcnJheSwgMSAvIDIsIHdpZHRoLCBoZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gZHJhd0NpcmNsZXMoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgaWYgKGNpcmNsZXMubGVuZ3RoIDwgNDAgJiYgY3JlYXRlQ2lyY2xlKSB7XG4gICAgY2lyY2xlcy5wdXNoKFtcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB3aWR0aCxcbiAgICAgIGhlaWdodCArIDUwLFxuICAgICAgTWF0aC5yYW5kb20oKSAqIDIgLSAxLFxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCksXG4gICAgXSk7XG4gICAgY3JlYXRlQ2lyY2xlID0gZmFsc2U7XG4gIH1cbiAgbGV0IGh1ZSA9IHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2lyY2xlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBiYXJIZWlnaHQgPSByYWRpdXNbY2lyY2xlc1tpXVszXV0gLyAyICsgNTA7XG4gICAgbGV0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDEwLCAwLCAwLCA4NSk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lYCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIFwiIzEzMjM1NlwiKTtcblxuICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9IGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZShjaXJjbGVzW2ldWzBdLCBjaXJjbGVzW2ldWzFdKTtcbiAgICAvLyBjdHgudHJhbnNsYXRlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gYmFySGVpZ2h0KTtcbiAgICBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCByZWR1Y2VyKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zdHJva2UoKTtcblxuICAgIGlmIChjaXJjbGVzW2ldWzFdIDw9IC0yNSkge1xuICAgICAgY2lyY2xlcy5zaGlmdCgpO1xuICAgIH1cbiAgICBjaXJjbGVzW2ldWzBdICs9IGNpcmNsZXNbaV1bMl07XG4gICAgY2lyY2xlc1tpXVsxXSAtPSBNYXRoLnJhbmRvbSgpO1xuICB9XG4gIGN0eC5yZXN0b3JlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGUoY3R4LCBiYXJIZWlnaHQsIGJhckhlaWdodFJlZHVjZXIpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguYXJjKDAsIDAsIGJhckhlaWdodCAqIGJhckhlaWdodFJlZHVjZXIsIDAsIE1hdGguUEkgKiAyKTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3U3RhcihjdHgsIHJhZGl1cywgcmVkdWNlciwgeCwgeSwgaW5zZXQsIHNpZGVzKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcblxuICBjdHguc2F2ZSgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcbiAgICBjdHgubW92ZVRvKDAsIDAgLSByYWRpdXMpO1xuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSAvIHNpZGVzKTtcbiAgICBjdHgubGluZVRvKDAsIC1yYWRpdXMgKiBpbnNldCk7XG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJIC8gc2lkZXMpO1xuICAgIGN0eC5saW5lVG8oMCwgLXJhZGl1cyk7XG4gICAgY3R4LmxpbmVUbygwLCByYWRpdXMpO1xuICB9XG4gIGN0eC5yZXN0b3JlKCk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gY29uZGl0aW9uYWxDaXJjbGUoXG4gIHgsXG4gIHksXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3R4LFxuICBjdXJyZW50VGltZSxcbiAgZHVyYXRpb24sXG4gIHJvdGF0aW9uXG4pIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuICAgIGxldCBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV07XG4gICAgbGV0IGh1ZSA9IGN1cnJlbnRUaW1lICogaTtcbiAgICBsZXQgc2hhcGUgPSBkcmF3Q2lyY2xlO1xuXG4gICAgaWYgKHJvdGF0aW9uID09PSBhbmdsZSAmJiBpICUgMTAgPT09IDApIHtcbiAgICAgIGJhckhlaWdodCA9IGRhdGFBcnJheVtpXSAqIDM7XG4gICAgICBzaGFwZSA9IGRyYXdTdGFyO1xuICAgIH1cbiAgICBpZiAocm90YXRpb24gPT09IGFuZ2xlICYmIGkgJSAxMCAhPT0gMCkge1xuICAgICAgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldICogMjtcbiAgICAgIHNoYXBlID0gKCkgPT4ge307XG4gICAgfVxuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC50cmFuc2xhdGUoeCwgeSk7XG5cbiAgICBjdHgucm90YXRlKGkgKiByb3RhdGlvbik7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlfSwgMjAwJSwgJHtpfSUpYDtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCAwKTtcbiAgICBjdHgubGluZVRvKDAsIGJhckhlaWdodCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGlmIChpID4gYnVmZmVyTGVuZ3RoICogMC44KSB7XG4gICAgICBzaGFwZShjdHgsIGJhckhlaWdodCwgMiwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9IGVsc2UgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjUpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxLCB4LCB5LCBpbnNldCwgc2lkZXMpO1xuICAgIH0gZWxzZSBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuNykge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDEuNSwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICBhbmdsZSArPSByb3RhdGlvblNwZWVkO1xufVxuIiwibGV0IHNjcnViID0ge1xuICAgIGVsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViXCIpLFxuICAgIGN1cnJlbnQ6IHtcbiAgICAgIHg6IDAsXG4gICAgfSxcbiAgICBsYXN0OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gIH0sXG4gIHRpbWVsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aW1lbGluZVwiKSxcbiAgbW91c2VEb3duID0gZmFsc2UsXG4gIGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpLFxuICBzY3J1YkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NydWItY29udGFpbmVyXCIpLFxuICBwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpLFxuICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG5sZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gIHBvc2l0aW9uID0gcGFyc2VJbnQoc2NydWJTdHlsZS5sZWZ0LCAxMCksXG4gIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgdGltZVdpZHRoID0gcGFyc2VJbnQodGltZVN0eWxlLndpZHRoLCAxMCk7XG5cbmF1ZGlvMS5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChtb3VzZURvd24gPT09IGZhbHNlKSB7XG4gICAgbGV0IHRpbWVsaW5lV2lkdGggPVxuICAgICAgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSkud2lkdGgsIDEwKSAtIHNjcnViT2Zmc2V0ICogMiAtIDIwO1xuICAgIGxldCB0aW1lUGVyY2VudCA9IGF1ZGlvMS5jdXJyZW50VGltZSAvIGF1ZGlvMS5kdXJhdGlvbjtcbiAgICBsZXQgbmV3UG9zID0gdGltZWxpbmVXaWR0aCAqIHRpbWVQZXJjZW50ICsgMTA7XG4gICAgc2NydWIuZWwuc3R5bGUubGVmdCA9IG5ld1BvcyArIFwicHhcIjtcbiAgfVxufTtcblxudGltZWxpbmUub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IHRydWU7XG4gIHNjcnViLm9yaWdpbiA9IHRpbWVsaW5lLm9mZnNldExlZnQ7XG4gIHNjcnViLmxhc3QueCA9XG4gICAgc2NydWIuZWwub2Zmc2V0TGVmdCArXG4gICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArXG4gICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgc2NydWJPZmZzZXQgKiAyO1xuICBjb25zb2xlLmxvZyhcIndvcmtpbmdcIik7XG59O1xuXG50aW1lbGluZS5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgICBhdWRpbzEucGF1c2UoKTtcbiAgICBsZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICAgICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICAgIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyAoZS5jbGllbnRYIC0gc2NydWIubGFzdC54KSxcbiAgICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICAgIGlmIChcbiAgICAgIGUuY2xpZW50WCA8XG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZS5jbGllbnRYID49XG4gICAgICB0aW1lV2lkdGggK1xuICAgICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICAgIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSB0aW1lV2lkdGggLSB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgMjAgKyBzY3J1Yk9mZnNldCAqIDI7XG4gICAgfVxuICAgIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgICBzY3J1Yi5sYXN0LnggPSBlLmNsaWVudFg7XG5cbiAgICBsZXQgcGVyY2VudCA9XG4gICAgICAoZS5wYWdlWCAtXG4gICAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgLVxuICAgICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgICAgc2NydWJPZmZzZXQpIC9cbiAgICAgIHRpbWVXaWR0aDtcbiAgICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgbmV3UG9zaXRpb24sXG4gICAgICBlLm9mZnNldFgsXG4gICAgICBlLnBhZ2VYLFxuICAgICAgcGVyY2VudCxcbiAgICAgIHNjcnViLmxhc3QueCxcbiAgICAgIGUuY2xpZW50WFxuICAgICk7XG4gIH1cbn07XG5cbnRpbWVsaW5lLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICBsZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICAgIHNjcnViT2Zmc2V0ID0gcGFyc2VJbnQoc2NydWJTdHlsZS53aWR0aCwgMTApIC8gMixcbiAgICBwb3NpdGlvbiA9IHBhcnNlSW50KHNjcnViU3R5bGUubGVmdCwgMTApLFxuICAgIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyAoZS5jbGllbnRYIC0gc2NydWIubGFzdC54KSxcbiAgICB0aW1lU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRpbWVsaW5lLCAxMCksXG4gICAgdGltZVdpZHRoID0gcGFyc2VJbnQodGltZVN0eWxlLndpZHRoLCAxMCkgLSA3MDtcbiAgaWYgKFxuICAgIGUuY2xpZW50WCA8XG4gICAgdGltZWxpbmUub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyBzY3J1Yk9mZnNldCAqIDJcbiAgKSB7XG4gICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgfSBlbHNlIGlmIChcbiAgICBlLmNsaWVudFggPj1cbiAgICB0aW1lV2lkdGggK1xuICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgfVxuICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gbmV3UG9zaXRpb24gKyBcInB4XCI7XG4gIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICBsZXQgcGVyY2VudCA9XG4gICAgKGUucGFnZVggLSB0aW1lbGluZS5vZmZzZXRMZWZ0IC0gc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtIHNjcnViT2Zmc2V0KSAvXG4gICAgdGltZVdpZHRoO1xuICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xufTtcblxuc2NydWJDb250YWluZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICBtb3VzZURvd24gPSBmYWxzZTtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59O1xuXG5wbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBpZiAoYXVkaW8xLnBhdXNlZCkge1xuICAgIGF1ZGlvMS5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG4gIH0gZWxzZSBpZiAoIWF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGF1c2UoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGxheV9hcnJvd1wiO1xuICB9XG59KTtcbiIsImV4cG9ydCBjb25zdCBkZW1vcyA9IFtcbiAge1xuICAgIHRpdGxlOiBcIjcgUmluZ3NcIixcbiAgICBhcnRpc3Q6IFwiQXJpYW5hIEdyYW5kZVwiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljLzdyaW5ncy5tcDNcIixcbiAgfSxcblxuICB7XG4gICAgdGl0bGU6IFwiR2lvcm5vJ3MgVGhlbWVcIixcbiAgICBhcnRpc3Q6IFwiSm9qbydzIEJpemFycmUgQWR2ZW50dXJlXCIsXG4gICAgc29uZzogXCIuL2Rpc3QvbXVzaWMvam9qby5tcDNcIixcbiAgfSxcblxuICB7XG4gICAgdGl0bGU6IFwiQWRvcmUgWW91XCIsXG4gICAgYXJ0aXN0OiBcIkhhcnJ5IFN0eWxlc1wiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljL2Fkb3JleW91Lm1wM1wiLFxuICB9LFxuXG4gIHtcbiAgICB0aXRsZTogXCJTZXZlbiBOYXRpb24gQXJteVwiLFxuICAgIGFydGlzdDogXCJUaGUgV2hpdGUgU3RyaXBlc1wiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljL3NuYS5tcDNcIixcbiAgfSxcbiAge1xuICAgIHRpdGxlOiBcIlVucmF2ZWxcIixcbiAgICBhcnRpc3Q6IFwiVG9ydSBLaXRhamltYVwiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljL3VucmF2ZWwubXAzXCIsXG4gIH0sXG5dO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vc3R5bGVzL2luZGV4LmNzc1wiO1xuaW1wb3J0IFwiLi9zY3J1YkJhclwiO1xuXG5pbXBvcnQgeyBwbGF5VmlzdWFsaXplciB9IGZyb20gXCIuL21haW5WaXN1YWxpemVyXCI7XG5pbXBvcnQgeyBkZW1vcyB9IGZyb20gXCIuL3NvbmdzXCI7XG5cbmNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbC1jb250YWluZXJcIik7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRpbnVlLWJ1dHRvblwiKS5vbmNsaWNrID0gKCkgPT5cbiAgbW9kYWwuY2xhc3NMaXN0LmFkZChcImNsb3NlZFwiKTtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIik7XG5jb25zdCBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxldXBsb2FkXCIpO1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMxXCIpO1xuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuY29uc3QgY2FudmFzMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzMlwiKTtcbmNhbnZhczIud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhczIuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4MiA9IGNhbnZhczIuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5sZXQgYXVkaW9Tb3VyY2U7XG5sZXQgYW5hbHlzZXI7XG5cbmxldCBiYXJXaWR0aCA9IDE1O1xuXG5sZXQgeCA9IGNhbnZhcy53aWR0aCAvIDI7XG5sZXQgeSA9IGNhbnZhcy5oZWlnaHQgLyAyO1xuXG5jb25zdCB0b2dnbGVVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlLXVpXCIpO1xuY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG5jb25zdCBzb25nVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctdGl0bGVcIik7XG5jb25zdCBzb25nQXJ0aXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLWFydGlzdFwiKTtcbnNvbmdUaXRsZS5pbm5lckhUTUwgPSBkZW1vc1swXS50aXRsZTtcbnNvbmdBcnRpc3QuaW5uZXJIVE1MID0gZGVtb3NbMF0uYXJ0aXN0O1xuXG5jb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5idXR0b25cIik7XG5idXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaWR4KSA9PiB7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBkZW1vc1tpZHggKyAxXS50aXRsZTtcbiAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VBdWRpb1NvdXJjZShkZW1vc1tpZHggKyAxXSwgaWR4ICsgMSk7XG59KTtcblxuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59KTtcblxuYXVkaW8xLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYXVkaW9DdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcbiAgaWYgKGF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGxheSgpO1xuICAgIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xuICB9XG4gIHRyeSB7XG4gICAgYXVkaW9Tb3VyY2UgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW8xKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpO1xuICBhdWRpb1NvdXJjZS5jb25uZWN0KGFuYWx5c2VyKTtcbiAgYW5hbHlzZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gIGFuYWx5c2VyLmZmdFNpemUgPSAyNTY7XG4gIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG4gIC8vIHJ1bnMgaWYgeW91IGNsaWNrIGFueXdoZXJlIGluIHRoZSBjb250YWluZXJcbiAgbGV0IGhlaWdodCA9IGNhbnZhczIuaGVpZ2h0O1xuICBsZXQgd2lkdGggPSBjYW52YXMyLndpZHRoO1xuICAvLyBhbmltYXRlIGxvb3BcbiAgY29uc3QgYW5pbWF0ZSA9ICgpID0+IHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgY3R4Mi5jbGVhclJlY3QoMCwgMCwgY2FudmFzMi53aWR0aCwgY2FudmFzMi5oZWlnaHQpO1xuICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGRhdGFBcnJheSk7XG5cbiAgICBsZXQgY3VycmVudFRpbWUgPSBhdWRpbzEuY3VycmVudFRpbWU7XG4gICAgbGV0IGR1cmF0aW9uID0gYXVkaW8xLmR1cmF0aW9uO1xuXG4gICAgcGxheVZpc3VhbGl6ZXIoXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGN0eCxcbiAgICAgIGJ1ZmZlckxlbmd0aCxcbiAgICAgIGJhcldpZHRoLFxuICAgICAgZGF0YUFycmF5LFxuICAgICAgY3VycmVudFRpbWUsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgY3R4MlxuICAgICk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICB9O1xuICBhbmltYXRlKCk7XG59KTtcblxuLy8gZmlsZSB1cGxvYWRcbmZpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZSkge1xuICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZXM7XG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5cbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IGZpbGVzWzBdLm5hbWUuc2xpY2UoMCwgLTQpO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IFwiVXNlciBVcGxvYWRcIjtcblxuICBhdWRpbzEuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1swXSk7XG4gIGF1ZGlvMS5sb2FkKCk7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xufSk7XG5cbmZ1bmN0aW9uIGNoYW5nZUF1ZGlvU291cmNlKHsgdGl0bGUsIGFydGlzdCwgc29uZyB9LCBpZHgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG4gIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcblxuICBhdWRpbzEuc3JjID0gc29uZztcbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IGFydGlzdDtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG5cbiAgW2RlbW9zWzBdLCBkZW1vc1tpZHhdXSA9IFtkZW1vc1tpZHhdLCBkZW1vc1swXV07XG4gIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpZHgpID0+IHtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VBdWRpb1NvdXJjZShkZW1vc1tpZHggKyAxXSwgaWR4ICsgMSk7XG4gIH0pO1xufVxuXG50b2dnbGVVSS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgY29uc3Qgc2NydWJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViLWNvbnRhaW5lclwiKTtcbiAgY29uc3Qgc2xpZGVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXJzXCIpO1xuICBjb25zdCBsaW5rc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXktbGlua3NcIik7XG5cbiAgc2NydWJDb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcbiAgc2xpZGVyQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG4gIGxpbmtzQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG5cbiAgaWYgKHNjcnViQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuICAgIHRvZ2dsZVVJLmlubmVySFRNTCA9IFwiUmV2ZWFsIFVJXCI7XG4gIH0gZWxzZSB7XG4gICAgdG9nZ2xlVUkuaW5uZXJIVE1MID0gXCJIaWRlIFVJXCI7XG4gIH1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==