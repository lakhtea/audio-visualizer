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
    circles.push([Math.random() * width, height + 50, Math.random(), Math.floor(Math.random() * radius.length)]);
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

audio1.ontimeupdate = function () {
  var percent = audio1.currentTime / audio1.duration * 100;
  scrub.el.style.left = "calc(".concat(percent, "% + 10px)");
  console.log(percent);
};

timeline.onmousedown = function () {
  mouseDown = true;
  scrub.origin = timeline.offsetLeft;
  scrub.last.x = scrub.el.offsetLeft + scrubContainer.offsetLeft + timeline.offsetLeft + 50;
  return false;
};

timeline.onmousemove = function (e) {
  if (mouseDown === true) {
    var scrubStyle = getComputedStyle(scrub.el),
        scrubOffset = parseInt(scrubStyle.width, 10) / 2,
        position = parseInt(scrubStyle.left, 10),
        newPosition = position + (e.clientX - scrub.last.x),
        timeStyle = getComputedStyle(timeline, 10),
        timeWidth = parseInt(timeStyle.width, 10);

    if (e.clientX < timeline.offsetLeft + scrubContainer.offsetLeft + scrubOffset * 2) {
      newPosition = 10;
    } else if (e.clientX >= timeWidth + timeline.offsetLeft + scrubContainer.offsetLeft - scrubOffset * 2) {
      newPosition = timeWidth - timeline.offsetLeft + 20 + scrubOffset * 2;
    }

    scrub.el.style.left = newPosition + "px";
    scrub.last.x = e.clientX;
    var percent = e.offsetX / timeWidth;
    audio1.currentTime = percent * audio1.duration;
    audio1.play();
    playButton.innerHTML = "pause";
  }
};

timeline.onclick = function (e) {
  // if (mouseDown === true) {
  var scrubStyle = getComputedStyle(scrub.el),
      scrubOffset = parseInt(scrubStyle.width, 10) / 2,
      position = parseInt(scrubStyle.left, 10),
      newPosition = position + (e.clientX - scrub.last.x),
      timeStyle = getComputedStyle(timeline, 10),
      timeWidth = parseInt(timeStyle.width, 10);

  if (e.clientX < timeline.offsetLeft + scrubContainer.offsetLeft + scrubOffset * 2) {
    newPosition = 10;
  } else if (e.clientX >= timeWidth + timeline.offsetLeft + scrubContainer.offsetLeft - scrubOffset * 2) {
    newPosition = timeWidth - timeline.offsetLeft + 20 + scrubOffset * 2;
  }

  scrub.el.style.left = newPosition + "px";
  scrub.last.x = e.clientX;
  var percent = e.offsetX / timeWidth;
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
  song: "/dist/music/7rings.mp3"
}, {
  title: "Giorno's Theme",
  artist: "Jojo's Bizarre Adventure",
  song: "/dist/music/jojo.mp3"
}, {
  title: "Shinzo wo Sasageyo!",
  artist: "Linked Horizon",
  song: "/dist/music/sasegayo.mp3"
}, {
  title: "Seven Nation Army",
  artist: "The White Stripes",
  song: "/dist/music/sna.mp3"
}, {
  title: "Unravel",
  artist: "Toru Kitajima",
  song: "/dist/music/unravel.mp3"
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
  var audioCtx = new AudioContext();

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

file.addEventListener("change", function () {
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
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zb25ncy5qcyIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvc3R5bGVzL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImFuZ2xlIiwicm90YXRpb25TcGVlZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImxpbmVXaWR0aCIsImluc2V0Iiwic2lkZXMiLCJjcmVhdGVDaXJjbGUiLCJzZXRJbnRlcnZhbCIsImNpcmNsZXMiLCJwbGF5VmlzdWFsaXplciIsIngiLCJ5IiwiY3R4IiwiYnVmZmVyTGVuZ3RoIiwiYmFyV2lkdGgiLCJkYXRhQXJyYXkiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJjdHgyIiwiY29uZGl0aW9uYWxDaXJjbGUiLCJkcmF3Q2lyY2xlcyIsInJhZGl1cyIsInJlZHVjZXIiLCJsZW5ndGgiLCJwdXNoIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiaHVlIiwiaSIsImJhckhlaWdodCIsImdyYWRpZW50IiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJiZWdpblBhdGgiLCJzYXZlIiwidHJhbnNsYXRlIiwibW92ZVRvIiwiZHJhd0NpcmNsZSIsImZpbGxTdHlsZSIsImZpbGwiLCJyZXN0b3JlIiwic3Ryb2tlIiwic2hpZnQiLCJiYXJIZWlnaHRSZWR1Y2VyIiwiYXJjIiwiUEkiLCJkcmF3U3RhciIsInJvdGF0ZSIsImxpbmVUbyIsInJvdGF0aW9uIiwic2hhcGUiLCJzdHJva2VTdHlsZSIsInNjcnViIiwiZWwiLCJjdXJyZW50IiwibGFzdCIsInRpbWVsaW5lIiwibW91c2VEb3duIiwiYXVkaW8xIiwic2NydWJDb250YWluZXIiLCJwbGF5IiwicGxheUJ1dHRvbiIsIm9udGltZXVwZGF0ZSIsInBlcmNlbnQiLCJzdHlsZSIsImxlZnQiLCJjb25zb2xlIiwibG9nIiwib25tb3VzZWRvd24iLCJvcmlnaW4iLCJvZmZzZXRMZWZ0Iiwib25tb3VzZW1vdmUiLCJlIiwic2NydWJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJzY3J1Yk9mZnNldCIsInBhcnNlSW50IiwicG9zaXRpb24iLCJuZXdQb3NpdGlvbiIsImNsaWVudFgiLCJ0aW1lU3R5bGUiLCJ0aW1lV2lkdGgiLCJvZmZzZXRYIiwiaW5uZXJIVE1MIiwib25jbGljayIsIm9ubW91c2V1cCIsImFkZEV2ZW50TGlzdGVuZXIiLCJwYXVzZWQiLCJwYXVzZSIsImRlbW9zIiwidGl0bGUiLCJhcnRpc3QiLCJzb25nIiwiY29udGFpbmVyIiwiZmlsZSIsImNhbnZhcyIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImdldENvbnRleHQiLCJjYW52YXMyIiwiYXVkaW9Tb3VyY2UiLCJhbmFseXNlciIsInNvbmdUaXRsZSIsInNvbmdBcnRpc3QiLCJidXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJidXR0b24iLCJpZHgiLCJjaGFuZ2VBdWRpb1NvdXJjZSIsImF1ZGlvQ3R4IiwiQXVkaW9Db250ZXh0IiwiY3JlYXRlTWVkaWFFbGVtZW50U291cmNlIiwiZXJyb3IiLCJjcmVhdGVBbmFseXNlciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImZmdFNpemUiLCJmcmVxdWVuY3lCaW5Db3VudCIsIlVpbnQ4QXJyYXkiLCJhbmltYXRlIiwiY2xlYXJSZWN0IiwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmaWxlcyIsIm5hbWUiLCJzbGljZSIsInNyYyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSyxHQUFHLEVBQVo7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsT0FBekQ7QUFDQSxJQUFJQyxTQUFTLEdBQUdILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBckQ7QUFDQSxJQUFJRSxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixPQUF4QixFQUFpQ0MsS0FBakMsR0FBeUMsSUFBckQ7QUFDQSxJQUFJRyxLQUFLLEdBQUdMLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBakQ7QUFDQSxJQUFJSSxZQUFZLEdBQUcsSUFBbkI7QUFDQUMsV0FBVyxDQUFDO0FBQUEsU0FBT0QsWUFBWSxHQUFHLElBQXRCO0FBQUEsQ0FBRCxFQUE4QixJQUE5QixDQUFYO0FBQ0EsSUFBSUUsT0FBTyxHQUFHLEVBQWQ7QUFFTyxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQzVCQyxDQUQ0QixFQUU1QkMsQ0FGNEIsRUFHNUJDLEdBSDRCLEVBSTVCQyxZQUo0QixFQUs1QkMsUUFMNEIsRUFNNUJDLFNBTjRCLEVBTzVCQyxXQVA0QixFQVE1QkMsUUFSNEIsRUFTNUJDLEtBVDRCLEVBVTVCQyxNQVY0QixFQVc1QkMsSUFY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LENBQW5CO0FBRUE0RCxRQUFNLENBQUNzRSxHQUFQLEdBQWFwQyxJQUFiO0FBQ0FXLFdBQVMsQ0FBQ3BCLFNBQVYsR0FBc0JPLEtBQXRCO0FBQ0FjLFlBQVUsQ0FBQ3JCLFNBQVgsR0FBdUJRLE1BQXZCO0FBQ0FqQyxRQUFNLENBQUNFLElBQVA7QUFDQUMsWUFBVSxDQUFDc0IsU0FBWCxHQUF1QixPQUF2QjtBQVZ1RCxjQVk5QixDQUFDTSx5Q0FBSyxDQUFDb0IsR0FBRCxDQUFOLEVBQWFwQiw0Q0FBYixDQVo4QjtBQVl0REEsOENBWnNEO0FBWTVDQSwyQ0FBSyxDQUFDb0IsR0FBRCxDQVp1QztBQWF2REosU0FBTyxDQUFDRSxPQUFSLENBQWdCLFVBQUNDLE1BQUQsRUFBU0MsR0FBVCxFQUFpQjtBQUMvQkQsVUFBTSxDQUFDekIsU0FBUCxHQUFtQk0seUNBQUssQ0FBQ29CLEdBQUcsR0FBRyxDQUFQLENBQUwsQ0FBZW5CLEtBQWxDOztBQUNBa0IsVUFBTSxDQUFDeEIsT0FBUCxHQUFpQjtBQUFBLGFBQU0wQixpQkFBaUIsQ0FBQ3JCLHlDQUFLLENBQUNvQixHQUFHLEdBQUcsQ0FBUCxDQUFOLEVBQWlCQSxHQUFHLEdBQUcsQ0FBdkIsQ0FBdkI7QUFBQSxLQUFqQjtBQUNELEdBSEQ7QUFJRCxDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgYW5nbGUgPSAxMDtcbmxldCByb3RhdGlvblNwZWVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ4XCIpLnZhbHVlICogMC4wMDAwNTtcbmxldCBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xubGV0IGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG5sZXQgc2lkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5cIikudmFsdWUgKiAxO1xubGV0IGNyZWF0ZUNpcmNsZSA9IHRydWU7XG5zZXRJbnRlcnZhbCgoKSA9PiAoY3JlYXRlQ2lyY2xlID0gdHJ1ZSksIDEwMDApO1xubGV0IGNpcmNsZXMgPSBbXTtcblxuZXhwb3J0IGNvbnN0IHBsYXlWaXN1YWxpemVyID0gKFxuICB4LFxuICB5LFxuICBjdHgsXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBjdHgyXG4pID0+IHtcbiAgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG4gIGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG4gIGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG4gIHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbiAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4IC8gMyxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZSAvIDRcbiAgKTtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4ICogKDUgLyAzKSxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICAtYW5nbGUgLyA0XG4gICk7XG4gIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICAgIHgsXG4gICAgeSxcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZVxuICApO1xuXG4gIGRyYXdDaXJjbGVzKGN0eDIsIGRhdGFBcnJheSwgMSAvIDIsIHdpZHRoLCBoZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gZHJhd0NpcmNsZXMoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgaWYgKGNpcmNsZXMubGVuZ3RoIDwgNDAgJiYgY3JlYXRlQ2lyY2xlKSB7XG4gICAgY2lyY2xlcy5wdXNoKFtcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB3aWR0aCxcbiAgICAgIGhlaWdodCArIDUwLFxuICAgICAgTWF0aC5yYW5kb20oKSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhZGl1cy5sZW5ndGgpLFxuICAgIF0pO1xuICAgIGNyZWF0ZUNpcmNsZSA9IGZhbHNlO1xuICB9XG4gIGxldCBodWUgPSByYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNpcmNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gcmFkaXVzW2NpcmNsZXNbaV1bM11dIC8gMiArIDUwO1xuICAgIGxldCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAxMCwgMCwgMCwgODUpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JWApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcIiMxMzIzNTZcIik7XG5cbiAgICAvLyBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoY2lyY2xlc1tpXVswXSwgY2lyY2xlc1tpXVsxXSk7XG4gICAgLy8gY3R4LnRyYW5zbGF0ZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIGJhckhlaWdodCk7XG4gICAgZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgcmVkdWNlcik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBpZiAoY2lyY2xlc1tpXVsxXSA8PSAtMjUpIHtcbiAgICAgIGNpcmNsZXMuc2hpZnQoKTtcbiAgICB9XG4gICAgY2lyY2xlc1tpXVswXSArPSBjaXJjbGVzW2ldWzJdO1xuICAgIGNpcmNsZXNbaV1bMV0gLT0gTWF0aC5yYW5kb20oKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCBiYXJIZWlnaHRSZWR1Y2VyKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYygwLCAwLCBiYXJIZWlnaHQgKiBiYXJIZWlnaHRSZWR1Y2VyLCAwLCBNYXRoLlBJICogMik7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gZHJhd1N0YXIoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHgsIHksIGluc2V0LCBzaWRlcykge1xuICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgY3R4LnNhdmUoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gcmFkaXVzKTtcbiAgICBjdHgucm90YXRlKE1hdGguUEkgLyBzaWRlcyk7XG4gICAgY3R4LmxpbmVUbygwLCAtcmFkaXVzICogaW5zZXQpO1xuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSAvIHNpZGVzKTtcbiAgICBjdHgubGluZVRvKDAsIC1yYWRpdXMpO1xuICAgIGN0eC5saW5lVG8oMCwgcmFkaXVzKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICB4LFxuICB5LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN0eCxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICByb3RhdGlvblxuKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldO1xuICAgIGxldCBodWUgPSBjdXJyZW50VGltZSAqIGk7XG4gICAgbGV0IHNoYXBlID0gZHJhd0NpcmNsZTtcblxuICAgIGlmIChyb3RhdGlvbiA9PT0gYW5nbGUgJiYgaSAlIDEwID09PSAwKSB7XG4gICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAzO1xuICAgICAgc2hhcGUgPSBkcmF3U3RhcjtcbiAgICB9XG4gICAgaWYgKHJvdGF0aW9uID09PSBhbmdsZSAmJiBpICUgMTAgIT09IDApIHtcbiAgICAgIGJhckhlaWdodCA9IGRhdGFBcnJheVtpXSAqIDI7XG4gICAgICBzaGFwZSA9ICgpID0+IHt9O1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHgudHJhbnNsYXRlKHgsIHkpO1xuXG4gICAgY3R4LnJvdGF0ZShpICogcm90YXRpb24pO1xuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDIwMCUsICR7aX0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgY3R4LmxpbmVUbygwLCBiYXJIZWlnaHQpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuOCkge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDIsIHgsIHksIGluc2V0LCBzaWRlcyk7XG4gICAgfSBlbHNlIGlmIChpID4gYnVmZmVyTGVuZ3RoICogMC41KSB7XG4gICAgICBzaGFwZShjdHgsIGJhckhlaWdodCwgMSwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9IGVsc2UgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjcpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxLjUsIHgsIHksIGluc2V0LCBzaWRlcyk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbiAgYW5nbGUgKz0gcm90YXRpb25TcGVlZDtcbn1cbiIsImxldCBzY3J1YiA9IHtcbiAgICBlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3J1YlwiKSxcbiAgICBjdXJyZW50OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gICAgbGFzdDoge1xuICAgICAgeDogMCxcbiAgICB9LFxuICB9LFxuICB0aW1lbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZWxpbmVcIiksXG4gIG1vdXNlRG93biA9IGZhbHNlLFxuICBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKSxcbiAgc2NydWJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViLWNvbnRhaW5lclwiKSxcbiAgcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKSxcbiAgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZS1pY29uXCIpO1xuXG5hdWRpbzEub250aW1ldXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICBsZXQgcGVyY2VudCA9IChhdWRpbzEuY3VycmVudFRpbWUgLyBhdWRpbzEuZHVyYXRpb24pICogMTAwO1xuICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gYGNhbGMoJHtwZXJjZW50fSUgKyAxMHB4KWA7XG4gIGNvbnNvbGUubG9nKHBlcmNlbnQpO1xufTtcblxudGltZWxpbmUub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IHRydWU7XG4gIHNjcnViLm9yaWdpbiA9IHRpbWVsaW5lLm9mZnNldExlZnQ7XG4gIHNjcnViLmxhc3QueCA9XG4gICAgc2NydWIuZWwub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgNTA7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgaWYgKG1vdXNlRG93biA9PT0gdHJ1ZSkge1xuICAgIGxldCBzY3J1YlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3J1Yi5lbCksXG4gICAgICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gICAgICBwb3NpdGlvbiA9IHBhcnNlSW50KHNjcnViU3R5bGUubGVmdCwgMTApLFxuICAgICAgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIChlLmNsaWVudFggLSBzY3J1Yi5sYXN0LngpLFxuICAgICAgdGltZVN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSwgMTApLFxuICAgICAgdGltZVdpZHRoID0gcGFyc2VJbnQodGltZVN0eWxlLndpZHRoLCAxMCk7XG4gICAgaWYgKFxuICAgICAgZS5jbGllbnRYIDxcbiAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgc2NydWJPZmZzZXQgKiAyXG4gICAgKSB7XG4gICAgICBuZXdQb3NpdGlvbiA9IDEwO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBlLmNsaWVudFggPj1cbiAgICAgIHRpbWVXaWR0aCArXG4gICAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgK1xuICAgICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgICAgc2NydWJPZmZzZXQgKiAyXG4gICAgKSB7XG4gICAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgICB9XG4gICAgc2NydWIuZWwuc3R5bGUubGVmdCA9IG5ld1Bvc2l0aW9uICsgXCJweFwiO1xuICAgIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICAgIGxldCBwZXJjZW50ID0gZS5vZmZzZXRYIC8gdGltZVdpZHRoO1xuICAgIGF1ZGlvMS5jdXJyZW50VGltZSA9IHBlcmNlbnQgKiBhdWRpbzEuZHVyYXRpb247XG4gICAgYXVkaW8xLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbiAgfVxufTtcblxudGltZWxpbmUub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gIC8vIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgbGV0IHNjcnViU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNjcnViLmVsKSxcbiAgICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uICsgKGUuY2xpZW50WCAtIHNjcnViLmxhc3QueCksXG4gICAgdGltZVN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSwgMTApLFxuICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICBpZiAoXG4gICAgZS5jbGllbnRYIDxcbiAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IDEwO1xuICB9IGVsc2UgaWYgKFxuICAgIGUuY2xpZW50WCA+PVxuICAgIHRpbWVXaWR0aCArXG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgLVxuICAgICAgc2NydWJPZmZzZXQgKiAyXG4gICkge1xuICAgIG5ld1Bvc2l0aW9uID0gdGltZVdpZHRoIC0gdGltZWxpbmUub2Zmc2V0TGVmdCArIDIwICsgc2NydWJPZmZzZXQgKiAyO1xuICB9XG4gIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgc2NydWIubGFzdC54ID0gZS5jbGllbnRYO1xuXG4gIGxldCBwZXJjZW50ID0gZS5vZmZzZXRYIC8gdGltZVdpZHRoO1xuICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICBhdWRpbzEucGxheSgpO1xuICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbn07XG5cbmRvY3VtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgbW91c2VEb3duID0gZmFsc2U7XG59O1xuXG5wbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBpZiAoYXVkaW8xLnBhdXNlZCkge1xuICAgIGF1ZGlvMS5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG4gIH0gZWxzZSBpZiAoIWF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGF1c2UoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGxheV9hcnJvd1wiO1xuICB9XG59KTtcbiIsImV4cG9ydCBjb25zdCBkZW1vcyA9IFtcbiAge1xuICAgIHRpdGxlOiBcIjcgUmluZ3NcIixcbiAgICBhcnRpc3Q6IFwiQXJpYW5hIEdyYW5kZVwiLFxuICAgIHNvbmc6IFwiL2Rpc3QvbXVzaWMvN3JpbmdzLm1wM1wiLFxuICB9LFxuXG4gIHtcbiAgICB0aXRsZTogXCJHaW9ybm8ncyBUaGVtZVwiLFxuICAgIGFydGlzdDogXCJKb2pvJ3MgQml6YXJyZSBBZHZlbnR1cmVcIixcbiAgICBzb25nOiBcIi9kaXN0L211c2ljL2pvam8ubXAzXCIsXG4gIH0sXG5cbiAge1xuICAgIHRpdGxlOiBcIlNoaW56byB3byBTYXNhZ2V5byFcIixcbiAgICBhcnRpc3Q6IFwiTGlua2VkIEhvcml6b25cIixcbiAgICBzb25nOiBcIi9kaXN0L211c2ljL3Nhc2VnYXlvLm1wM1wiLFxuICB9LFxuXG4gIHtcbiAgICB0aXRsZTogXCJTZXZlbiBOYXRpb24gQXJteVwiLFxuICAgIGFydGlzdDogXCJUaGUgV2hpdGUgU3RyaXBlc1wiLFxuICAgIHNvbmc6IFwiL2Rpc3QvbXVzaWMvc25hLm1wM1wiLFxuICB9LFxuICB7XG4gICAgdGl0bGU6IFwiVW5yYXZlbFwiLFxuICAgIGFydGlzdDogXCJUb3J1IEtpdGFqaW1hXCIsXG4gICAgc29uZzogXCIvZGlzdC9tdXNpYy91bnJhdmVsLm1wM1wiLFxuICB9LFxuXTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5jc3NcIjtcbmltcG9ydCBcIi4vc2NydWJCYXJcIjtcblxuaW1wb3J0IHsgcGxheVZpc3VhbGl6ZXIgfSBmcm9tIFwiLi9tYWluVmlzdWFsaXplclwiO1xuaW1wb3J0IHsgZGVtb3MgfSBmcm9tIFwiLi9zb25nc1wiO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKTtcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGV1cGxvYWRcIik7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhczFcIik7XG5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5jb25zdCBjYW52YXMyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMyXCIpO1xuY2FudmFzMi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY2FudmFzMi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHgyID0gY2FudmFzMi5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmxldCBhdWRpb1NvdXJjZTtcbmxldCBhbmFseXNlcjtcblxubGV0IGJhcldpZHRoID0gMTU7XG5cbmxldCB4ID0gY2FudmFzLndpZHRoIC8gMjtcbmxldCB5ID0gY2FudmFzLmhlaWdodCAvIDI7XG5cbmNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuY29uc3Qgc29uZ1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLXRpdGxlXCIpO1xuY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5zb25nVGl0bGUuaW5uZXJIVE1MID0gZGVtb3NbMF0udGl0bGU7XG5zb25nQXJ0aXN0LmlubmVySFRNTCA9IGRlbW9zWzBdLmFydGlzdDtcblxuY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnV0dG9uXCIpO1xuYnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGlkeCkgPT4ge1xuICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gY2hhbmdlQXVkaW9Tb3VyY2UoZGVtb3NbaWR4ICsgMV0sIGlkeCArIDEpO1xufSk7XG5cbmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBhdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuICB0cnkge1xuICAgIGF1ZGlvU291cmNlID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvMSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFuYWx5c2VyID0gYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgYXVkaW9Tb3VyY2UuY29ubmVjdChhbmFseXNlcik7XG4gIGFuYWx5c2VyLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICBhbmFseXNlci5mZnRTaXplID0gMjU2O1xuICBjb25zdCBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcbiAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuICAvLyBydW5zIGlmIHlvdSBjbGljayBhbnl3aGVyZSBpbiB0aGUgY29udGFpbmVyXG4gIGxldCBoZWlnaHQgPSBjYW52YXMyLmhlaWdodDtcbiAgbGV0IHdpZHRoID0gY2FudmFzMi53aWR0aDtcbiAgLy8gYW5pbWF0ZSBsb29wXG4gIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGN0eDIuY2xlYXJSZWN0KDAsIDAsIGNhbnZhczIud2lkdGgsIGNhbnZhczIuaGVpZ2h0KTtcbiAgICBhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShkYXRhQXJyYXkpO1xuXG4gICAgbGV0IGN1cnJlbnRUaW1lID0gYXVkaW8xLmN1cnJlbnRUaW1lO1xuICAgIGxldCBkdXJhdGlvbiA9IGF1ZGlvMS5kdXJhdGlvbjtcblxuICAgIHBsYXlWaXN1YWxpemVyKFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBjdHgsXG4gICAgICBidWZmZXJMZW5ndGgsXG4gICAgICBiYXJXaWR0aCxcbiAgICAgIGRhdGFBcnJheSxcbiAgICAgIGN1cnJlbnRUaW1lLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN0eDJcbiAgICApO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgfTtcbiAgYW5pbWF0ZSgpO1xufSk7XG5cbi8vIGZpbGUgdXBsb2FkXG5maWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZXM7XG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5cbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IGZpbGVzWzBdLm5hbWUuc2xpY2UoMCwgLTQpO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IFwiVXNlciBVcGxvYWRcIjtcblxuICBhdWRpbzEuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1swXSk7XG4gIGF1ZGlvMS5sb2FkKCk7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xufSk7XG5cbmZ1bmN0aW9uIGNoYW5nZUF1ZGlvU291cmNlKHsgdGl0bGUsIGFydGlzdCwgc29uZyB9LCBpZHgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG4gIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcblxuICBhdWRpbzEuc3JjID0gc29uZztcbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IGFydGlzdDtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG5cbiAgW2RlbW9zWzBdLCBkZW1vc1tpZHhdXSA9IFtkZW1vc1tpZHhdLCBkZW1vc1swXV07XG4gIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpZHgpID0+IHtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VBdWRpb1NvdXJjZShkZW1vc1tpZHggKyAxXSwgaWR4ICsgMSk7XG4gIH0pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==