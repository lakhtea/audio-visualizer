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
var lowPitch = false;
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
  if (circles.length < 25 && createCircle) {
    circles.push([Math.random() * width, height, Math.random() * 3 - 1.5, Math.floor(Math.random() * radius.length)]);
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

    if (circles[i][1] <= 0) {
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
  if (!audio1.paused) {
    audio1.pause();
    playButton.innerHTML = "play_arrow";
  } else if (audio1.paused) {
    audio1.play();
    playButton.innerHTML = "pause";
  }
});

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
var myStorage = window.localStorage;
localStorage.setItem("7rings", URL.createObjectURL(audio1.src));
container.addEventListener("click", function () {
  var audio1 = document.getElementById("audio1");
  audio1.src = localStorage.getItem("7rings");
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
  var dataArray = new Uint8Array(bufferLength);
  var fileName = audio1.src.slice(32, -4);
  var songTitle = document.getElementById("song-title");
  songTitle.innerHTML = fileName; // runs if you click anywhere in the container

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
  songTitle.innerHTML = files[0].name.slice(0, -4);
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  playButton.innerHTML = "pause";
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zdHlsZXMvaW5kZXguY3NzIiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYW5nbGUiLCJyb3RhdGlvblNwZWVkIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwibGluZVdpZHRoIiwiaW5zZXQiLCJzaWRlcyIsImNyZWF0ZUNpcmNsZSIsInNldEludGVydmFsIiwiY2lyY2xlcyIsImxvd1BpdGNoIiwicGxheVZpc3VhbGl6ZXIiLCJ4IiwieSIsImN0eCIsImJ1ZmZlckxlbmd0aCIsImJhcldpZHRoIiwiZGF0YUFycmF5IiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY3R4MiIsImNvbmRpdGlvbmFsQ2lyY2xlIiwiZHJhd0NpcmNsZXMiLCJyYWRpdXMiLCJyZWR1Y2VyIiwibGVuZ3RoIiwicHVzaCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsImh1ZSIsImkiLCJiYXJIZWlnaHQiLCJncmFkaWVudCIsImNyZWF0ZVJhZGlhbEdyYWRpZW50IiwiYWRkQ29sb3JTdG9wIiwiYmVnaW5QYXRoIiwic2F2ZSIsInRyYW5zbGF0ZSIsIm1vdmVUbyIsImRyYXdDaXJjbGUiLCJmaWxsU3R5bGUiLCJmaWxsIiwicmVzdG9yZSIsInN0cm9rZSIsInNoaWZ0IiwiYmFySGVpZ2h0UmVkdWNlciIsImFyYyIsIlBJIiwiZHJhd1N0YXIiLCJyb3RhdGUiLCJsaW5lVG8iLCJyb3RhdGlvbiIsInNoYXBlIiwic3Ryb2tlU3R5bGUiLCJzY3J1YiIsImVsIiwiY3VycmVudCIsImxhc3QiLCJ0aW1lbGluZSIsIm1vdXNlRG93biIsImF1ZGlvMSIsInNjcnViQ29udGFpbmVyIiwicGxheSIsInBsYXlCdXR0b24iLCJvbnRpbWV1cGRhdGUiLCJwZXJjZW50Iiwic3R5bGUiLCJsZWZ0Iiwib25tb3VzZWRvd24iLCJvcmlnaW4iLCJvZmZzZXRMZWZ0Iiwib25tb3VzZW1vdmUiLCJlIiwic2NydWJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJzY3J1Yk9mZnNldCIsInBhcnNlSW50IiwicG9zaXRpb24iLCJuZXdQb3NpdGlvbiIsImNsaWVudFgiLCJ0aW1lU3R5bGUiLCJ0aW1lV2lkdGgiLCJvZmZzZXRYIiwiaW5uZXJIVE1MIiwib25jbGljayIsIm9ubW91c2V1cCIsImFkZEV2ZW50TGlzdGVuZXIiLCJwYXVzZWQiLCJwYXVzZSIsImNvbnRhaW5lciIsImZpbGUiLCJjYW52YXMiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJnZXRDb250ZXh0IiwiY2FudmFzMiIsImF1ZGlvU291cmNlIiwiYW5hbHlzZXIiLCJteVN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwic3JjIiwiZ2V0SXRlbSIsImF1ZGlvQ3R4IiwiQXVkaW9Db250ZXh0IiwiY3JlYXRlTWVkaWFFbGVtZW50U291cmNlIiwiZXJyb3IiLCJjcmVhdGVBbmFseXNlciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImZmdFNpemUiLCJmcmVxdWVuY3lCaW5Db3VudCIsIlVpbnQ4QXJyYXkiLCJmaWxlTmFtZSIsInNsaWNlIiwic29uZ1RpdGxlIiwiYW5pbWF0ZSIsImNsZWFyUmVjdCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsZXMiLCJuYW1lIiwibG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxLQUFLLEdBQUcsRUFBWjtBQUNBLElBQUlDLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxPQUF6RDtBQUNBLElBQUlDLFNBQVMsR0FBR0gsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxDQUFyRDtBQUNBLElBQUlFLEtBQUssR0FBR0osUUFBUSxDQUFDQyxjQUFULENBQXdCLE9BQXhCLEVBQWlDQyxLQUFqQyxHQUF5QyxJQUFyRDtBQUNBLElBQUlHLEtBQUssR0FBR0wsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCQyxLQUE3QixHQUFxQyxDQUFqRDtBQUNBLElBQUlJLFlBQVksR0FBRyxJQUFuQjtBQUNBQyxXQUFXLENBQUM7QUFBQSxTQUFPRCxZQUFZLEdBQUcsSUFBdEI7QUFBQSxDQUFELEVBQThCLElBQTlCLENBQVg7QUFDQSxJQUFJRSxPQUFPLEdBQUcsRUFBZDtBQUNBLElBQUlDLFFBQVEsR0FBRyxLQUFmO0FBRU8sSUFBTUMsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUM1QkMsQ0FENEIsRUFFNUJDLENBRjRCLEVBRzVCQyxHQUg0QixFQUk1QkMsWUFKNEIsRUFLNUJDLFFBTDRCLEVBTTVCQyxTQU40QixFQU81QkMsV0FQNEIsRUFRNUJDLFFBUjRCLEVBUzVCQyxLQVQ0QixFQVU1QkMsTUFWNEIsRUFXNUJDLElBWDRCLEVBWXpCO0FBQ0h0QixlQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsT0FB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QSxTQUFPO0FBQ1IsQ0EvQ0QsRSxDQWlEQTs7QUFDQTdCLElBQUksQ0FBQ0osZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsWUFBWTtBQUMxQyxNQUFNcUMsS0FBSyxHQUFHLEtBQUtBLEtBQW5CO0FBQ0EsTUFBTS9ELE1BQU0sR0FBRzlELFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixRQUF4QixDQUFmO0FBQ0EsTUFBTWdFLFVBQVUsR0FBR2pFLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBbkI7QUFDQSxNQUFNdUgsU0FBUyxHQUFHeEgsUUFBUSxDQUFDQyxjQUFULENBQXdCLFlBQXhCLENBQWxCO0FBRUF1SCxXQUFTLENBQUNuQyxTQUFWLEdBQXNCd0MsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTQyxJQUFULENBQWNQLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBQyxDQUF4QixDQUF0QjtBQUVBekQsUUFBTSxDQUFDNEMsR0FBUCxHQUFhRixHQUFHLENBQUNDLGVBQUosQ0FBb0JvQixLQUFLLENBQUMsQ0FBRCxDQUF6QixDQUFiO0FBQ0EvRCxRQUFNLENBQUNpRSxJQUFQO0FBQ0FqRSxRQUFNLENBQUNFLElBQVA7QUFDQUMsWUFBVSxDQUFDb0IsU0FBWCxHQUF1QixPQUF2QjtBQUNELENBWkQsRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFuZ2xlID0gMTA7XG5sZXQgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG5sZXQgbGluZVdpZHRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5XCIpLnZhbHVlICogMTtcbmxldCBpbnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXRcIikudmFsdWUgKiAwLjAxO1xubGV0IHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbmxldCBjcmVhdGVDaXJjbGUgPSB0cnVlO1xuc2V0SW50ZXJ2YWwoKCkgPT4gKGNyZWF0ZUNpcmNsZSA9IHRydWUpLCAxMDAwKTtcbmxldCBjaXJjbGVzID0gW107XG5sZXQgbG93UGl0Y2ggPSBmYWxzZTtcblxuZXhwb3J0IGNvbnN0IHBsYXlWaXN1YWxpemVyID0gKFxuICB4LFxuICB5LFxuICBjdHgsXG4gIGJ1ZmZlckxlbmd0aCxcbiAgYmFyV2lkdGgsXG4gIGRhdGFBcnJheSxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBjdHgyXG4pID0+IHtcbiAgcm90YXRpb25TcGVlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieFwiKS52YWx1ZSAqIDAuMDAwMDU7XG4gIGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG4gIGluc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNldFwiKS52YWx1ZSAqIDAuMDE7XG4gIHNpZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuXCIpLnZhbHVlICogMTtcbiAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4IC8gMyxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZSAvIDRcbiAgKTtcblxuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4ICogKDUgLyAzKSxcbiAgICB5IC8gMixcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICAtYW5nbGUgLyA0XG4gICk7XG4gIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICAgIHgsXG4gICAgeSxcbiAgICBidWZmZXJMZW5ndGgsXG4gICAgYmFyV2lkdGgsXG4gICAgZGF0YUFycmF5LFxuICAgIGN0eCxcbiAgICBjdXJyZW50VGltZSxcbiAgICBkdXJhdGlvbixcbiAgICBhbmdsZVxuICApO1xuXG4gIGRyYXdDaXJjbGVzKGN0eDIsIGRhdGFBcnJheSwgMSAvIDIsIHdpZHRoLCBoZWlnaHQpO1xufTtcblxuZnVuY3Rpb24gZHJhd0NpcmNsZXMoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgaWYgKGNpcmNsZXMubGVuZ3RoIDwgMjUgJiYgY3JlYXRlQ2lyY2xlKSB7XG4gICAgY2lyY2xlcy5wdXNoKFtcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIE1hdGgucmFuZG9tKCkgKiAzIC0gMS41LFxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCksXG4gICAgXSk7XG4gICAgY3JlYXRlQ2lyY2xlID0gZmFsc2U7XG4gIH1cbiAgbGV0IGh1ZSA9IHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2lyY2xlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBiYXJIZWlnaHQgPSByYWRpdXNbY2lyY2xlc1tpXVszXV0gLyAyICsgNTA7XG4gICAgbGV0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDEwLCAwLCAwLCA4NSk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lYCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIFwiIzEzMjM1NlwiKTtcblxuICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9IGBoc2woJHtodWUgKiBpfSwgMjAwJSwgJHszMH0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZShjaXJjbGVzW2ldWzBdLCBjaXJjbGVzW2ldWzFdKTtcbiAgICAvLyBjdHgudHJhbnNsYXRlKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gYmFySGVpZ2h0KTtcbiAgICBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCByZWR1Y2VyKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zdHJva2UoKTtcblxuICAgIGlmIChjaXJjbGVzW2ldWzFdIDw9IDApIHtcbiAgICAgIGNpcmNsZXMuc2hpZnQoKTtcbiAgICB9XG4gICAgY2lyY2xlc1tpXVswXSArPSBjaXJjbGVzW2ldWzJdO1xuICAgIGNpcmNsZXNbaV1bMV0gLT0gTWF0aC5yYW5kb20oKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGN0eCwgYmFySGVpZ2h0LCBiYXJIZWlnaHRSZWR1Y2VyKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYygwLCAwLCBiYXJIZWlnaHQgKiBiYXJIZWlnaHRSZWR1Y2VyLCAwLCBNYXRoLlBJICogMik7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gZHJhd1N0YXIoY3R4LCByYWRpdXMsIHJlZHVjZXIsIHgsIHksIGluc2V0LCBzaWRlcykge1xuICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgY3R4LnNhdmUoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XG4gICAgY3R4Lm1vdmVUbygwLCAwIC0gcmFkaXVzKTtcbiAgICBjdHgucm90YXRlKE1hdGguUEkgLyBzaWRlcyk7XG4gICAgY3R4LmxpbmVUbygwLCAtcmFkaXVzICogaW5zZXQpO1xuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSAvIHNpZGVzKTtcbiAgICBjdHgubGluZVRvKDAsIC1yYWRpdXMpO1xuICAgIGN0eC5saW5lVG8oMCwgcmFkaXVzKTtcbiAgfVxuICBjdHgucmVzdG9yZSgpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGNvbmRpdGlvbmFsQ2lyY2xlKFxuICB4LFxuICB5LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN0eCxcbiAgY3VycmVudFRpbWUsXG4gIGR1cmF0aW9uLFxuICByb3RhdGlvblxuKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldO1xuICAgIGxldCBodWUgPSBjdXJyZW50VGltZSAqIGk7XG4gICAgbGV0IHNoYXBlID0gZHJhd0NpcmNsZTtcblxuICAgIGlmIChyb3RhdGlvbiA9PT0gYW5nbGUgJiYgaSAlIDEwID09PSAwKSB7XG4gICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAzO1xuICAgICAgc2hhcGUgPSBkcmF3U3RhcjtcbiAgICB9XG4gICAgaWYgKHJvdGF0aW9uID09PSBhbmdsZSAmJiBpICUgMTAgIT09IDApIHtcbiAgICAgIGJhckhlaWdodCA9IGRhdGFBcnJheVtpXSAqIDI7XG4gICAgICBzaGFwZSA9ICgpID0+IHt9O1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHgudHJhbnNsYXRlKHgsIHkpO1xuXG4gICAgY3R4LnJvdGF0ZShpICogcm90YXRpb24pO1xuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDIwMCUsICR7aX0lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgY3R4LmxpbmVUbygwLCBiYXJIZWlnaHQpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuNSkge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDEgLyAyLCB4LCB5LCBpbnNldCwgc2lkZXMpO1xuICAgIH1cbiAgICBpZiAoaSA+IGJ1ZmZlckxlbmd0aCAqIDAuOCkge1xuICAgICAgc2hhcGUoY3R4LCBiYXJIZWlnaHQsIDMsIHgsIHksIGluc2V0LCBzaWRlcyk7XG4gICAgICBpZiAoZGF0YUFycmF5W2ldID4gMCkgbG93UGl0Y2ggPSB0cnVlO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG4gIGFuZ2xlICs9IHJvdGF0aW9uU3BlZWQ7XG59XG4iLCJsZXQgc2NydWIgPSB7XG4gICAgZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NydWJcIiksXG4gICAgY3VycmVudDoge1xuICAgICAgeDogMCxcbiAgICB9LFxuICAgIGxhc3Q6IHtcbiAgICAgIHg6IDAsXG4gICAgfSxcbiAgfSxcbiAgdGltZWxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVsaW5lXCIpLFxuICBtb3VzZURvd24gPSBmYWxzZSxcbiAgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIiksXG4gIHNjcnViQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3J1Yi1jb250YWluZXJcIiksXG4gIHBsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlcIiksXG4gIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktcGF1c2UtaWNvblwiKTtcblxuYXVkaW8xLm9udGltZXVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgbGV0IHBlcmNlbnQgPSAoYXVkaW8xLmN1cnJlbnRUaW1lIC8gYXVkaW8xLmR1cmF0aW9uKSAqIDEwMDtcbiAgc2NydWIuZWwuc3R5bGUubGVmdCA9IGBjYWxjKCR7cGVyY2VudH0lICsgMTBweClgO1xufTtcblxudGltZWxpbmUub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IHRydWU7XG4gIHNjcnViLm9yaWdpbiA9IHRpbWVsaW5lLm9mZnNldExlZnQ7XG4gIHNjcnViLmxhc3QueCA9XG4gICAgc2NydWIuZWwub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgNTA7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgaWYgKG1vdXNlRG93biA9PT0gdHJ1ZSkge1xuICAgIGxldCBzY3J1YlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3J1Yi5lbCksXG4gICAgICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gICAgICBwb3NpdGlvbiA9IHBhcnNlSW50KHNjcnViU3R5bGUubGVmdCwgMTApLFxuICAgICAgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIChlLmNsaWVudFggLSBzY3J1Yi5sYXN0LngpLFxuICAgICAgdGltZVN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSwgMTApLFxuICAgICAgdGltZVdpZHRoID0gcGFyc2VJbnQodGltZVN0eWxlLndpZHRoLCAxMCk7XG4gICAgaWYgKFxuICAgICAgZS5jbGllbnRYIDxcbiAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgc2NydWJPZmZzZXQgKiAyXG4gICAgKSB7XG4gICAgICBuZXdQb3NpdGlvbiA9IDEwO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBlLmNsaWVudFggPj1cbiAgICAgIHRpbWVXaWR0aCArXG4gICAgICAgIHRpbWVsaW5lLm9mZnNldExlZnQgK1xuICAgICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgICAgc2NydWJPZmZzZXQgKiAyXG4gICAgKSB7XG4gICAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgICB9XG4gICAgc2NydWIuZWwuc3R5bGUubGVmdCA9IG5ld1Bvc2l0aW9uICsgXCJweFwiO1xuICAgIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICAgIGxldCBwZXJjZW50ID0gZS5vZmZzZXRYIC8gdGltZVdpZHRoO1xuICAgIGF1ZGlvMS5jdXJyZW50VGltZSA9IHBlcmNlbnQgKiBhdWRpbzEuZHVyYXRpb247XG4gICAgYXVkaW8xLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbiAgfVxufTtcblxudGltZWxpbmUub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gIC8vIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgbGV0IHNjcnViU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNjcnViLmVsKSxcbiAgICBzY3J1Yk9mZnNldCA9IHBhcnNlSW50KHNjcnViU3R5bGUud2lkdGgsIDEwKSAvIDIsXG4gICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uICsgKGUuY2xpZW50WCAtIHNjcnViLmxhc3QueCksXG4gICAgdGltZVN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lbGluZSwgMTApLFxuICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICBpZiAoXG4gICAgZS5jbGllbnRYIDxcbiAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IDEwO1xuICB9IGVsc2UgaWYgKFxuICAgIGUuY2xpZW50WCA+PVxuICAgIHRpbWVXaWR0aCArXG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgLVxuICAgICAgc2NydWJPZmZzZXQgKiAyXG4gICkge1xuICAgIG5ld1Bvc2l0aW9uID0gdGltZVdpZHRoIC0gdGltZWxpbmUub2Zmc2V0TGVmdCArIDIwICsgc2NydWJPZmZzZXQgKiAyO1xuICB9XG4gIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgc2NydWIubGFzdC54ID0gZS5jbGllbnRYO1xuXG4gIGxldCBwZXJjZW50ID0gZS5vZmZzZXRYIC8gdGltZVdpZHRoO1xuICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICBhdWRpbzEucGxheSgpO1xuICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbn07XG5cbmRvY3VtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgbW91c2VEb3duID0gZmFsc2U7XG59O1xuXG5wbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBpZiAoIWF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGF1c2UoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGxheV9hcnJvd1wiO1xuICB9IGVsc2UgaWYgKGF1ZGlvMS5wYXVzZWQpIHtcbiAgICBhdWRpbzEucGxheSgpO1xuICAgIHBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCJwYXVzZVwiO1xuICB9XG59KTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5jc3NcIjtcbmltcG9ydCBcIi4vc2NydWJCYXJcIjtcblxuaW1wb3J0IHsgcGxheVZpc3VhbGl6ZXIgfSBmcm9tIFwiLi9tYWluVmlzdWFsaXplclwiO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKTtcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGV1cGxvYWRcIik7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhczFcIik7XG5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5jb25zdCBjYW52YXMyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMyXCIpO1xuY2FudmFzMi53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY2FudmFzMi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5jb25zdCBjdHgyID0gY2FudmFzMi5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmxldCBhdWRpb1NvdXJjZTtcbmxldCBhbmFseXNlcjtcblxubGV0IGJhcldpZHRoID0gMTU7XG5cbmxldCB4ID0gY2FudmFzLndpZHRoIC8gMjtcbmxldCB5ID0gY2FudmFzLmhlaWdodCAvIDI7XG5cbmNvbnN0IG15U3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiN3JpbmdzXCIsIFVSTC5jcmVhdGVPYmplY3RVUkwoYXVkaW8xLnNyYykpO1xuXG5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGF1ZGlvMS5zcmMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIjdyaW5nc1wiKTtcbiAgY29uc3QgYXVkaW9DdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gIHRyeSB7XG4gICAgYXVkaW9Tb3VyY2UgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW8xKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpO1xuICBhdWRpb1NvdXJjZS5jb25uZWN0KGFuYWx5c2VyKTtcbiAgYW5hbHlzZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gIGFuYWx5c2VyLmZmdFNpemUgPSAyNTY7XG4gIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuICBjb25zdCBmaWxlTmFtZSA9IGF1ZGlvMS5zcmMuc2xpY2UoMzIsIC00KTtcbiAgY29uc3Qgc29uZ1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLXRpdGxlXCIpO1xuXG4gIHNvbmdUaXRsZS5pbm5lckhUTUwgPSBmaWxlTmFtZTtcbiAgLy8gcnVucyBpZiB5b3UgY2xpY2sgYW55d2hlcmUgaW4gdGhlIGNvbnRhaW5lclxuICBsZXQgaGVpZ2h0ID0gY2FudmFzMi5oZWlnaHQ7XG4gIGxldCB3aWR0aCA9IGNhbnZhczIud2lkdGg7XG4gIC8vIGFuaW1hdGUgbG9vcFxuICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjdHgyLmNsZWFyUmVjdCgwLCAwLCBjYW52YXMyLndpZHRoLCBjYW52YXMyLmhlaWdodCk7XG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZGF0YUFycmF5KTtcblxuICAgIGxldCBjdXJyZW50VGltZSA9IGF1ZGlvMS5jdXJyZW50VGltZTtcbiAgICBsZXQgZHVyYXRpb24gPSBhdWRpbzEuZHVyYXRpb247XG5cbiAgICBwbGF5VmlzdWFsaXplcihcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgY3R4LFxuICAgICAgYnVmZmVyTGVuZ3RoLFxuICAgICAgYmFyV2lkdGgsXG4gICAgICBkYXRhQXJyYXksXG4gICAgICBjdXJyZW50VGltZSxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdHgyXG4gICAgKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gIH07XG4gIGFuaW1hdGUoKTtcbn0pO1xuXG4vLyBmaWxlIHVwbG9hZFxuZmlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzO1xuICBjb25zdCBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKTtcbiAgY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZS1pY29uXCIpO1xuICBjb25zdCBzb25nVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctdGl0bGVcIik7XG5cbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IGZpbGVzWzBdLm5hbWUuc2xpY2UoMCwgLTQpO1xuXG4gIGF1ZGlvMS5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKTtcbiAgYXVkaW8xLmxvYWQoKTtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=