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

audio1.ontimeupdate = function () {
  var percent = audio1.currentTime / audio1.duration * 100;
  scrub.el.style.left = "calc(".concat(percent, "% + 10px)");
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
  song: "./dist/music/7rings.mp3"
}, {
  title: "Giorno's Theme",
  artist: "Jojo's Bizarre Adventure",
  song: "./dist/music/jojo.mp3"
}, {
  title: "Shinzo wo Sasageyo!",
  artist: "Linked Horizon",
  song: "./dist/music/sasegayo.mp3"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zb25ncy5qcyIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvc3R5bGVzL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImFuZ2xlIiwicm90YXRpb25TcGVlZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImxpbmVXaWR0aCIsImluc2V0Iiwic2lkZXMiLCJjcmVhdGVDaXJjbGUiLCJzZXRJbnRlcnZhbCIsImNpcmNsZXMiLCJwbGF5VmlzdWFsaXplciIsIngiLCJ5IiwiY3R4IiwiYnVmZmVyTGVuZ3RoIiwiYmFyV2lkdGgiLCJkYXRhQXJyYXkiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJjdHgyIiwiY29uZGl0aW9uYWxDaXJjbGUiLCJkcmF3Q2lyY2xlcyIsInJhZGl1cyIsInJlZHVjZXIiLCJsZW5ndGgiLCJwdXNoIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiaHVlIiwiaSIsImJhckhlaWdodCIsImdyYWRpZW50IiwiY3JlYXRlUmFkaWFsR3JhZGllbnQiLCJhZGRDb2xvclN0b3AiLCJiZWdpblBhdGgiLCJzYXZlIiwidHJhbnNsYXRlIiwibW92ZVRvIiwiZHJhd0NpcmNsZSIsImZpbGxTdHlsZSIsImZpbGwiLCJyZXN0b3JlIiwic3Ryb2tlIiwic2hpZnQiLCJiYXJIZWlnaHRSZWR1Y2VyIiwiYXJjIiwiUEkiLCJkcmF3U3RhciIsInJvdGF0ZSIsImxpbmVUbyIsInJvdGF0aW9uIiwic2hhcGUiLCJzdHJva2VTdHlsZSIsInNjcnViIiwiZWwiLCJjdXJyZW50IiwibGFzdCIsInRpbWVsaW5lIiwibW91c2VEb3duIiwiYXVkaW8xIiwic2NydWJDb250YWluZXIiLCJwbGF5IiwicGxheUJ1dHRvbiIsIm9udGltZXVwZGF0ZSIsInBlcmNlbnQiLCJzdHlsZSIsImxlZnQiLCJvbm1vdXNlZG93biIsIm9yaWdpbiIsIm9mZnNldExlZnQiLCJvbm1vdXNlbW92ZSIsImUiLCJzY3J1YlN0eWxlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInNjcnViT2Zmc2V0IiwicGFyc2VJbnQiLCJwb3NpdGlvbiIsIm5ld1Bvc2l0aW9uIiwiY2xpZW50WCIsInRpbWVTdHlsZSIsInRpbWVXaWR0aCIsIm9mZnNldFgiLCJpbm5lckhUTUwiLCJvbmNsaWNrIiwib25tb3VzZXVwIiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhdXNlZCIsInBhdXNlIiwiZGVtb3MiLCJ0aXRsZSIsImFydGlzdCIsInNvbmciLCJjb250YWluZXIiLCJmaWxlIiwiY2FudmFzIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiZ2V0Q29udGV4dCIsImNhbnZhczIiLCJhdWRpb1NvdXJjZSIsImFuYWx5c2VyIiwic29uZ1RpdGxlIiwic29uZ0FydGlzdCIsImJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImJ1dHRvbiIsImlkeCIsImNoYW5nZUF1ZGlvU291cmNlIiwiYXVkaW9DdHgiLCJBdWRpb0NvbnRleHQiLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJlcnJvciIsImNyZWF0ZUFuYWx5c2VyIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiZmZ0U2l6ZSIsImZyZXF1ZW5jeUJpbkNvdW50IiwiVWludDhBcnJheSIsImFuaW1hdGUiLCJjbGVhclJlY3QiLCJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGVzIiwibmFtZSIsInNsaWNlIiwic3JjIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxLQUFLLEdBQUcsRUFBWjtBQUNBLElBQUlDLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxPQUF6RDtBQUNBLElBQUlDLFNBQVMsR0FBR0gsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxDQUFyRDtBQUNBLElBQUlFLEtBQUssR0FBR0osUUFBUSxDQUFDQyxjQUFULENBQXdCLE9BQXhCLEVBQWlDQyxLQUFqQyxHQUF5QyxJQUFyRDtBQUNBLElBQUlHLEtBQUssR0FBR0wsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxDQUFqRDtBQUNBLElBQUlJLFlBQVksR0FBRyxJQUFuQjtBQUNBQyxXQUFXLENBQUM7QUFBQSxTQUFPRCxZQUFZLEdBQUcsSUFBdEI7QUFBQSxDQUFELEVBQThCLElBQTlCLENBQVg7QUFDQSxJQUFJRSxPQUFPLEdBQUcsRUFBZDtBQUVPLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FDNUJDLENBRDRCLEVBRTVCQyxDQUY0QixFQUc1QkMsR0FINEIsRUFJNUJDLFlBSjRCLEVBSzVCQyxRQUw0QixFQU01QkMsU0FONEIsRUFPNUJDLFdBUDRCLEVBUTVCQyxRQVI0QixFQVM1QkMsS0FUNEIsRUFVNUJDLE1BVjRCLEVBVzVCQyxJQVg0QixFQVl6QjtBQUNIckIs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QyxJQUFiO0FBQ0FXLFdBQVMsQ0FBQ3BCLFNBQVYsR0FBc0JPLEtBQXRCO0FBQ0FjLFlBQVUsQ0FBQ3JCLFNBQVgsR0FBdUJRLE1BQXZCO0FBQ0EvQixRQUFNLENBQUNFLElBQVA7QUFDQUMsWUFBVSxDQUFDb0IsU0FBWCxHQUF1QixPQUF2QjtBQVZ1RCxjQVk5QixDQUFDTSx5Q0FBSyxDQUFDb0IsR0FBRCxDQUFOLEVBQWFwQiw0Q0FBYixDQVo4QjtBQVl0REEsOENBWnNEO0FBWTVDQSwyQ0FBSyxDQUFDb0IsR0FBRCxDQVp1QztBQWF2REosU0FBTyxDQUFDRSxPQUFSLENBQWdCLFVBQUNDLE1BQUQsRUFBU0MsR0FBVCxFQUFpQjtBQUMvQkQsVUFBTSxDQUFDekIsU0FBUCxHQUFtQk0seUNBQUssQ0FBQ29CLEdBQUcsR0FBRyxDQUFQLENBQUwsQ0FBZW5CLEtBQWxDOztBQUNBa0IsVUFBTSxDQUFDeEIsT0FBUCxHQUFpQjtBQUFBLGFBQU0wQixpQkFBaUIsQ0FBQ3JCLHlDQUFLLENBQUNvQixHQUFHLEdBQUcsQ0FBUCxDQUFOLEVBQWlCQSxHQUFHLEdBQUcsQ0FBdkIsQ0FBdkI7QUFBQSxLQUFqQjtBQUNELEdBSEQ7QUFJRCxDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgYW5nbGUgPSAxMDtcbmxldCByb3RhdGlvblNwZWVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ4XCIpLnZhbHVlICogMC4wMDAwNTtcbmxldCBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xubGV0IGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG5sZXQgc2lkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5cIikudmFsdWUgKiAxO1xubGV0IGNyZWF0ZUNpcmNsZSA9IHRydWU7XG5zZXRJbnRlcnZhbCgoKSA9PiAoY3JlYXRlQ2lyY2xlID0gdHJ1ZSksIDEwMDApO1xubGV0IGNpcmNsZXMgPSBbXTtcblxuZXhwb3J0IGNvbnN0IHBsYXlWaXN1YWxpemVyID0gKFxuICB4LFxuICB5LFxuICBjdHgsXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBjdHgyXG4pID0+IHtcbiAgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG4gIGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG4gIGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG4gIHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbiAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4IC8gMyxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZSAvIDRcbiAgKTtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4ICogKDUgLyAzKSxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICAtYW5nbGUgLyA0XG4gICk7XG4gIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICAgIHgsXG4gICAgeSxcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZVxuICApO1xuXG4gIGRyYXdDaXJjbGVzKGN0eDIsIGRhdGFBcnJheSwgMSAvIDIsIHdpZHRoLCBoZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gZHJhd0NpcmNsZXMoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgaWYgKGNpcmNsZXMubGVuZ3RoIDwgNDAgJiYgY3JlYXRlQ2lyY2xlKSB7XG4gICAgY2lyY2xlcy5wdXNoKFtcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB3aWR0aCxcbiAgICAgIGhlaWdodCArIDUwLFxuICAgICAgTWF0aC5yYW5kb20oKSAqIDIgLSAxLFxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCksXG4gICAgXSk7XG4gICAgY3JlYXRlQ2lyY2xlID0gZmFsc2U7XG4gIH1cbiAgbGV0IGh1ZSA9IHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2lyY2xlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBiYXJIZWlnaHQgPSByYWRpdXNbY2lyY2xlc1tpXVszXV0gLyAyICsgNTA7XG4gICAgbGV0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDEwLCAwLCAwLCA4NSk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lYCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIFwiIzEzMjM1NlwiKTtcblxuICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9IGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZShjaXJjbGVzW2ldWzBdLCBjaXJjbGVzW2ldWzFdKTtcbiAgICAvLyBjdHgudHJhbnNsYXRlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gYmFySGVpZ2h0KTtcbiAgICBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCByZWR1Y2VyKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zdHJva2UoKTtcblxuICAgIGlmIChjaXJjbGVzW2ldWzFdIDw9IC0yNSkge1xuICAgICAgY2lyY2xlcy5zaGlmdCgpO1xuICAgIH1cbiAgICBjaXJjbGVzW2ldWzBdICs9IGNpcmNsZXNbaV1bMl07XG4gICAgY2lyY2xlc1tpXVsxXSAtPSBNYXRoLnJhbmRvbSgpO1xuICB9XG4gIGN0eC5yZXN0b3JlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGUoY3R4LCBiYXJIZWlnaHQsIGJhckhlaWdodFJlZHVjZXIpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguYXJjKDAsIDAsIGJhckhlaWdodCAqIGJhckhlaWdodFJlZHVjZXIsIDAsIE1hdGguUEkgKiAyKTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3U3RhcihjdHgsIHJhZGl1cywgcmVkdWNlciwgeCwgeSwgaW5zZXQsIHNpZGVzKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcblxuICBjdHguc2F2ZSgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcbiAgICBjdHgubW92ZVRvKDAsIDAgLSByYWRpdXMpO1xuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSAvIHNpZGVzKTtcbiAgICBjdHgubGluZVRvKDAsIC1yYWRpdXMgKiBpbnNldCk7XG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJIC8gc2lkZXMpO1xuICAgIGN0eC5saW5lVG8oMCwgLXJhZGl1cyk7XG4gICAgY3R4LmxpbmVUbygwLCByYWRpdXMpO1xuICB9XG4gIGN0eC5yZXN0b3JlKCk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gY29uZGl0aW9uYWxDaXJjbGUoXG4gIHgsXG4gIHksXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3R4LFxuICBjdXJyZW50VGltZSxcbiAgZHVyYXRpb24sXG4gIHJvdGF0aW9uXG4pIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuICAgIGxldCBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV07XG4gICAgbGV0IGh1ZSA9IGN1cnJlbnRUaW1lICogaTtcbiAgICBsZXQgc2hhcGUgPSBkcmF3Q2lyY2xlO1xuXG4gICAgaWYgKHJvdGF0aW9uID09PSBhbmdsZSAmJiBpICUgMTAgPT09IDApIHtcbiAgICAgIGJhckhlaWdodCA9IGRhdGFBcnJheVtpXSAqIDM7XG4gICAgICBzaGFwZSA9IGRyYXdTdGFyO1xuICAgIH1cbiAgICBpZiAocm90YXRpb24gPT09IGFuZ2xlICYmIGkgJSAxMCAhPT0gMCkge1xuICAgICAgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldICogMjtcbiAgICAgIHNoYXBlID0gKCkgPT4ge307XG4gICAgfVxuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC50cmFuc2xhdGUoeCwgeSk7XG5cbiAgICBjdHgucm90YXRlKGkgKiByb3RhdGlvbik7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlfSwgMjAwJSwgJHtpfSUpYDtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCAwKTtcbiAgICBjdHgubGluZVRvKDAsIGJhckhlaWdodCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGlmIChpID4gYnVmZmVyTGVuZ3RoICogMC44KSB7XG4gICAgICBzaGFwZShjdHgsIGJhckhlaWdodCwgMiwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9IGVsc2UgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjUpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxLCB4LCB5LCBpbnNldCwgc2lkZXMpO1xuICAgIH0gZWxzZSBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuNykge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDEuNSwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICBhbmdsZSArPSByb3RhdGlvblNwZWVkO1xufVxuIiwibGV0IHNjcnViID0ge1xuICAgIGVsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViXCIpLFxuICAgIGN1cnJlbnQ6IHtcbiAgICAgIHg6IDAsXG4gICAgfSxcbiAgICBsYXN0OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gIH0sXG4gIHRpbWVsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aW1lbGluZVwiKSxcbiAgbW91c2VEb3duID0gZmFsc2UsXG4gIGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpLFxuICBzY3J1YkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NydWItY29udGFpbmVyXCIpLFxuICBwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpLFxuICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG5cbmF1ZGlvMS5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBwZXJjZW50ID0gKGF1ZGlvMS5jdXJyZW50VGltZSAvIGF1ZGlvMS5kdXJhdGlvbikgKiAxMDA7XG4gIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBgY2FsYygke3BlcmNlbnR9JSArIDEwcHgpYDtcbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICBtb3VzZURvd24gPSB0cnVlO1xuICBzY3J1Yi5vcmlnaW4gPSB0aW1lbGluZS5vZmZzZXRMZWZ0O1xuICBzY3J1Yi5sYXN0LnggPVxuICAgIHNjcnViLmVsLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgdGltZWxpbmUub2Zmc2V0TGVmdCArIDUwO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lbGluZS5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgICBsZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICAgICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICAgIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyAoZS5jbGllbnRYIC0gc2NydWIubGFzdC54KSxcbiAgICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICAgIGlmIChcbiAgICAgIGUuY2xpZW50WCA8XG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZS5jbGllbnRYID49XG4gICAgICB0aW1lV2lkdGggK1xuICAgICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICAgIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSB0aW1lV2lkdGggLSB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgMjAgKyBzY3J1Yk9mZnNldCAqIDI7XG4gICAgfVxuICAgIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgICBzY3J1Yi5sYXN0LnggPSBlLmNsaWVudFg7XG5cbiAgICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICAgIGF1ZGlvMS5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG4gIH1cbn07XG5cbnRpbWVsaW5lLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAvLyBpZiAobW91c2VEb3duID09PSB0cnVlKSB7XG4gIGxldCBzY3J1YlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3J1Yi5lbCksXG4gICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgIHBvc2l0aW9uID0gcGFyc2VJbnQoc2NydWJTdHlsZS5sZWZ0LCAxMCksXG4gICAgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIChlLmNsaWVudFggLSBzY3J1Yi5sYXN0LngpLFxuICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICB0aW1lV2lkdGggPSBwYXJzZUludCh0aW1lU3R5bGUud2lkdGgsIDEwKTtcbiAgaWYgKFxuICAgIGUuY2xpZW50WCA8XG4gICAgdGltZWxpbmUub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyBzY3J1Yk9mZnNldCAqIDJcbiAgKSB7XG4gICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgfSBlbHNlIGlmIChcbiAgICBlLmNsaWVudFggPj1cbiAgICB0aW1lV2lkdGggK1xuICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgfVxuICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gbmV3UG9zaXRpb24gKyBcInB4XCI7XG4gIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgYXVkaW8xLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIGF1ZGlvMS5kdXJhdGlvbjtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59O1xuXG5kb2N1bWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IGZhbHNlO1xufTtcblxucGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgaWYgKGF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGxheSgpO1xuICAgIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xuICB9IGVsc2UgaWYgKCFhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBhdXNlKCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBsYXlfYXJyb3dcIjtcbiAgfVxufSk7XG4iLCJleHBvcnQgY29uc3QgZGVtb3MgPSBbXG4gIHtcbiAgICB0aXRsZTogXCI3IFJpbmdzXCIsXG4gICAgYXJ0aXN0OiBcIkFyaWFuYSBHcmFuZGVcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy83cmluZ3MubXAzXCIsXG4gIH0sXG5cbiAge1xuICAgIHRpdGxlOiBcIkdpb3JubydzIFRoZW1lXCIsXG4gICAgYXJ0aXN0OiBcIkpvam8ncyBCaXphcnJlIEFkdmVudHVyZVwiLFxuICAgIHNvbmc6IFwiLi9kaXN0L211c2ljL2pvam8ubXAzXCIsXG4gIH0sXG5cbiAge1xuICAgIHRpdGxlOiBcIlNoaW56byB3byBTYXNhZ2V5byFcIixcbiAgICBhcnRpc3Q6IFwiTGlua2VkIEhvcml6b25cIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy9zYXNlZ2F5by5tcDNcIixcbiAgfSxcblxuICB7XG4gICAgdGl0bGU6IFwiU2V2ZW4gTmF0aW9uIEFybXlcIixcbiAgICBhcnRpc3Q6IFwiVGhlIFdoaXRlIFN0cmlwZXNcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy9zbmEubXAzXCIsXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogXCJVbnJhdmVsXCIsXG4gICAgYXJ0aXN0OiBcIlRvcnUgS2l0YWppbWFcIixcbiAgICBzb25nOiBcIi4vZGlzdC9tdXNpYy91bnJhdmVsLm1wM1wiLFxuICB9LFxuXTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5jc3NcIjtcbmltcG9ydCBcIi4vc2NydWJCYXJcIjtcblxuaW1wb3J0IHsgcGxheVZpc3VhbGl6ZXIgfSBmcm9tIFwiLi9tYWluVmlzdWFsaXplclwiO1xuaW1wb3J0IHsgZGVtb3MgfSBmcm9tIFwiLi9zb25nc1wiO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKTtcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGV1cGxvYWRcIik7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhczFcIik7XG5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5jb25zdCBjYW52YXMyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMyXCIpO1xuY2FudmFzMi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY2FudmFzMi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHgyID0gY2FudmFzMi5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmxldCBhdWRpb1NvdXJjZTtcbmxldCBhbmFseXNlcjtcblxubGV0IGJhcldpZHRoID0gMTU7XG5cbmxldCB4ID0gY2FudmFzLndpZHRoIC8gMjtcbmxldCB5ID0gY2FudmFzLmhlaWdodCAvIDI7XG5cbmNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuY29uc3Qgc29uZ1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLXRpdGxlXCIpO1xuY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5zb25nVGl0bGUuaW5uZXJIVE1MID0gZGVtb3NbMF0udGl0bGU7XG5zb25nQXJ0aXN0LmlubmVySFRNTCA9IGRlbW9zWzBdLmFydGlzdDtcblxuY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYnV0dG9uXCIpO1xuYnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGlkeCkgPT4ge1xuICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gY2hhbmdlQXVkaW9Tb3VyY2UoZGVtb3NbaWR4ICsgMV0sIGlkeCArIDEpO1xufSk7XG5cbmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBhdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuICB0cnkge1xuICAgIGF1ZGlvU291cmNlID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvMSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFuYWx5c2VyID0gYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgYXVkaW9Tb3VyY2UuY29ubmVjdChhbmFseXNlcik7XG4gIGFuYWx5c2VyLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICBhbmFseXNlci5mZnRTaXplID0gMjU2O1xuICBjb25zdCBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcbiAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcblxuICAvLyBydW5zIGlmIHlvdSBjbGljayBhbnl3aGVyZSBpbiB0aGUgY29udGFpbmVyXG4gIGxldCBoZWlnaHQgPSBjYW52YXMyLmhlaWdodDtcbiAgbGV0IHdpZHRoID0gY2FudmFzMi53aWR0aDtcbiAgLy8gYW5pbWF0ZSBsb29wXG4gIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGN0eDIuY2xlYXJSZWN0KDAsIDAsIGNhbnZhczIud2lkdGgsIGNhbnZhczIuaGVpZ2h0KTtcbiAgICBhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShkYXRhQXJyYXkpO1xuXG4gICAgbGV0IGN1cnJlbnRUaW1lID0gYXVkaW8xLmN1cnJlbnRUaW1lO1xuICAgIGxldCBkdXJhdGlvbiA9IGF1ZGlvMS5kdXJhdGlvbjtcblxuICAgIHBsYXlWaXN1YWxpemVyKFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBjdHgsXG4gICAgICBidWZmZXJMZW5ndGgsXG4gICAgICBiYXJXaWR0aCxcbiAgICAgIGRhdGFBcnJheSxcbiAgICAgIGN1cnJlbnRUaW1lLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGN0eDJcbiAgICApO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgfTtcbiAgYW5pbWF0ZSgpO1xufSk7XG5cbi8vIGZpbGUgdXBsb2FkXG5maWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZXM7XG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG5cbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IGZpbGVzWzBdLm5hbWUuc2xpY2UoMCwgLTQpO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IFwiVXNlciBVcGxvYWRcIjtcblxuICBhdWRpbzEuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1swXSk7XG4gIGF1ZGlvMS5sb2FkKCk7XG4gIGF1ZGlvMS5wbGF5KCk7XG4gIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xufSk7XG5cbmZ1bmN0aW9uIGNoYW5nZUF1ZGlvU291cmNlKHsgdGl0bGUsIGFydGlzdCwgc29uZyB9LCBpZHgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGNvbnN0IHNvbmdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy10aXRsZVwiKTtcbiAgY29uc3Qgc29uZ0FydGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29uZy1hcnRpc3RcIik7XG4gIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcblxuICBhdWRpbzEuc3JjID0gc29uZztcbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xuICBzb25nQXJ0aXN0LmlubmVySFRNTCA9IGFydGlzdDtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG5cbiAgW2RlbW9zWzBdLCBkZW1vc1tpZHhdXSA9IFtkZW1vc1tpZHhdLCBkZW1vc1swXV07XG4gIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpZHgpID0+IHtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gZGVtb3NbaWR4ICsgMV0udGl0bGU7XG4gICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VBdWRpb1NvdXJjZShkZW1vc1tpZHggKyAxXSwgaWR4ICsgMSk7XG4gIH0pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==