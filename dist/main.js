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
container.addEventListener("click", function () {
  var audio1 = document.getElementById("audio1");
  var audioCtx = new AudioContext();
  audio1.src = "https://lakhtea.github.io/jsProject/src/music/7rings.mp3";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zdHlsZXMvaW5kZXguY3NzIiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYW5nbGUiLCJyb3RhdGlvblNwZWVkIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwibGluZVdpZHRoIiwiaW5zZXQiLCJzaWRlcyIsImNyZWF0ZUNpcmNsZSIsInNldEludGVydmFsIiwiY2lyY2xlcyIsImxvd1BpdGNoIiwicGxheVZpc3VhbGl6ZXIiLCJ4IiwieSIsImN0eCIsImJ1ZmZlckxlbmd0aCIsImJhcldpZHRoIiwiZGF0YUFycmF5IiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY3R4MiIsImNvbmRpdGlvbmFsQ2lyY2xlIiwiZHJhd0NpcmNsZXMiLCJyYWRpdXMiLCJyZWR1Y2VyIiwibGVuZ3RoIiwicHVzaCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsImh1ZSIsImkiLCJiYXJIZWlnaHQiLCJncmFkaWVudCIsImNyZWF0ZVJhZGlhbEdyYWRpZW50IiwiYWRkQ29sb3JTdG9wIiwiYmVnaW5QYXRoIiwic2F2ZSIsInRyYW5zbGF0ZSIsIm1vdmVUbyIsImRyYXdDaXJjbGUiLCJmaWxsU3R5bGUiLCJmaWxsIiwicmVzdG9yZSIsInN0cm9rZSIsInNoaWZ0IiwiYmFySGVpZ2h0UmVkdWNlciIsImFyYyIsIlBJIiwiZHJhd1N0YXIiLCJyb3RhdGUiLCJsaW5lVG8iLCJyb3RhdGlvbiIsInNoYXBlIiwic3Ryb2tlU3R5bGUiLCJzY3J1YiIsImVsIiwiY3VycmVudCIsImxhc3QiLCJ0aW1lbGluZSIsIm1vdXNlRG93biIsImF1ZGlvMSIsInNjcnViQ29udGFpbmVyIiwicGxheSIsInBsYXlCdXR0b24iLCJvbnRpbWV1cGRhdGUiLCJwZXJjZW50Iiwic3R5bGUiLCJsZWZ0Iiwib25tb3VzZWRvd24iLCJvcmlnaW4iLCJvZmZzZXRMZWZ0Iiwib25tb3VzZW1vdmUiLCJlIiwic2NydWJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJzY3J1Yk9mZnNldCIsInBhcnNlSW50IiwicG9zaXRpb24iLCJuZXdQb3NpdGlvbiIsImNsaWVudFgiLCJ0aW1lU3R5bGUiLCJ0aW1lV2lkdGgiLCJvZmZzZXRYIiwiaW5uZXJIVE1MIiwib25jbGljayIsIm9ubW91c2V1cCIsImFkZEV2ZW50TGlzdGVuZXIiLCJwYXVzZWQiLCJwYXVzZSIsImNvbnRhaW5lciIsImZpbGUiLCJjYW52YXMiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJnZXRDb250ZXh0IiwiY2FudmFzMiIsImF1ZGlvU291cmNlIiwiYW5hbHlzZXIiLCJhdWRpb0N0eCIsIkF1ZGlvQ29udGV4dCIsInNyYyIsImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSIsImVycm9yIiwiY3JlYXRlQW5hbHlzZXIiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJmZnRTaXplIiwiZnJlcXVlbmN5QmluQ291bnQiLCJVaW50OEFycmF5IiwiZmlsZU5hbWUiLCJzbGljZSIsInNvbmdUaXRsZSIsImFuaW1hdGUiLCJjbGVhclJlY3QiLCJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGVzIiwibmFtZSIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSyxHQUFHLEVBQVo7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsT0FBekQ7QUFDQSxJQUFJQyxTQUFTLEdBQUdILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBckQ7QUFDQSxJQUFJRSxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixPQUF4QixFQUFpQ0MsS0FBakMsR0FBeUMsSUFBckQ7QUFDQSxJQUFJRyxLQUFLLEdBQUdMLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsR0FBcUMsQ0FBakQ7QUFDQSxJQUFJSSxZQUFZLEdBQUcsSUFBbkI7QUFDQUMsV0FBVyxDQUFDO0FBQUEsU0FBT0QsWUFBWSxHQUFHLElBQXRCO0FBQUEsQ0FBRCxFQUE4QixJQUE5QixDQUFYO0FBQ0EsSUFBSUUsT0FBTyxHQUFHLEVBQWQ7QUFDQSxJQUFJQyxRQUFRLEdBQUcsS0FBZjtBQUVPLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FDNUJDLENBRDRCLEVBRTVCQyxDQUY0QixFQUc1QkMsR0FINEIsRUFJNUJDLFlBSjRCLEVBSzVCQyxRQUw0QixFQU01QkMsU0FONEIsRUFPNUJDLFdBUDRCLEVBUTVCQyxRQVI0QixFQVM1QkMsS0FUNEIsRUFVNUJDLE1BVjRCLEVBVzVCQyxJQVg0QixFQVl6QjtBQUNIdEIsZUFBYSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkJDLEtBQTdCLEdBQXFDLE9BQXJEO0FBQ0FDLFdBQVMsR0FBR0gsUUFBUSxDQUFDQyxjQUFULENBQXdCLEdBQXhC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QVQsQ0FBd0IsaUJBQXhCLENBQW5CO0FBQ0EsTUFBTWlILFNBQVMsR0FBR2xILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixZQUF4QixDQUFsQjtBQUVBaUgsV0FBUyxDQUFDN0IsU0FBVixHQUFzQmtDLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU0MsSUFBVCxDQUFjUCxLQUFkLENBQW9CLENBQXBCLEVBQXVCLENBQUMsQ0FBeEIsQ0FBdEI7QUFFQW5ELFFBQU0sQ0FBQ3lDLEdBQVAsR0FBYWtCLEdBQUcsQ0FBQ0MsZUFBSixDQUFvQkgsS0FBSyxDQUFDLENBQUQsQ0FBekIsQ0FBYjtBQUNBekQsUUFBTSxDQUFDNkQsSUFBUDtBQUNBN0QsUUFBTSxDQUFDRSxJQUFQO0FBQ0FDLFlBQVUsQ0FBQ29CLFNBQVgsR0FBdUIsT0FBdkI7QUFDRCxDQVpELEUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBhbmdsZSA9IDEwO1xubGV0IHJvdGF0aW9uU3BlZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhcIikudmFsdWUgKiAwLjAwMDA1O1xubGV0IGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG5sZXQgaW5zZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2V0XCIpLnZhbHVlICogMC4wMTtcbmxldCBzaWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiblwiKS52YWx1ZSAqIDE7XG5sZXQgY3JlYXRlQ2lyY2xlID0gdHJ1ZTtcbnNldEludGVydmFsKCgpID0+IChjcmVhdGVDaXJjbGUgPSB0cnVlKSwgMTAwMCk7XG5sZXQgY2lyY2xlcyA9IFtdO1xubGV0IGxvd1BpdGNoID0gZmFsc2U7XG5cbmV4cG9ydCBjb25zdCBwbGF5VmlzdWFsaXplciA9IChcbiAgeCxcbiAgeSxcbiAgY3R4LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN1cnJlbnRUaW1lLFxuICBkdXJhdGlvbixcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgY3R4MlxuKSA9PiB7XG4gIHJvdGF0aW9uU3BlZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhcIikudmFsdWUgKiAwLjAwMDA1O1xuICBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xuICBpbnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXRcIikudmFsdWUgKiAwLjAxO1xuICBzaWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiblwiKS52YWx1ZSAqIDE7XG4gIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAvIDMsXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGUgLyA0XG4gICk7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAqICg1IC8gMyksXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgLWFuZ2xlIC8gNFxuICApO1xuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4LFxuICAgIHksXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGVcbiAgKTtcblxuICBkcmF3Q2lyY2xlcyhjdHgyLCBkYXRhQXJyYXksIDEgLyAyLCB3aWR0aCwgaGVpZ2h0KTtcbn07XG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGVzKGN0eCwgcmFkaXVzLCByZWR1Y2VyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIGlmIChjaXJjbGVzLmxlbmd0aCA8IDI1ICYmIGNyZWF0ZUNpcmNsZSkge1xuICAgIGNpcmNsZXMucHVzaChbXG4gICAgICBNYXRoLnJhbmRvbSgpICogd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBNYXRoLnJhbmRvbSgpICogMyAtIDEuNSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhZGl1cy5sZW5ndGgpLFxuICAgIF0pO1xuICAgIGNyZWF0ZUNpcmNsZSA9IGZhbHNlO1xuICB9XG4gIGxldCBodWUgPSByYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNpcmNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gcmFkaXVzW2NpcmNsZXNbaV1bM11dIC8gMiArIDUwO1xuICAgIGxldCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAxMCwgMCwgMCwgODUpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JWApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcIiMxMzIzNTZcIik7XG5cbiAgICAvLyBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoY2lyY2xlc1tpXVswXSwgY2lyY2xlc1tpXVsxXSk7XG4gICAgLy8gY3R4LnRyYW5zbGF0ZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIGJhckhlaWdodCk7XG4gICAgZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgcmVkdWNlcik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBpZiAoY2lyY2xlc1tpXVsxXSA8PSAwKSB7XG4gICAgICBjaXJjbGVzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGNpcmNsZXNbaV1bMF0gKz0gY2lyY2xlc1tpXVsyXTtcbiAgICBjaXJjbGVzW2ldWzFdIC09IE1hdGgucmFuZG9tKCk7XG4gIH1cbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgYmFySGVpZ2h0UmVkdWNlcikge1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmMoMCwgMCwgYmFySGVpZ2h0ICogYmFySGVpZ2h0UmVkdWNlciwgMCwgTWF0aC5QSSAqIDIpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdTdGFyKGN0eCwgcmFkaXVzLCByZWR1Y2VyLCB4LCB5LCBpbnNldCwgc2lkZXMpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gIGN0eC5zYXZlKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2lkZXM7IGkrKykge1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIHJhZGl1cyk7XG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJIC8gc2lkZXMpO1xuICAgIGN0eC5saW5lVG8oMCwgLXJhZGl1cyAqIGluc2V0KTtcbiAgICBjdHgucm90YXRlKE1hdGguUEkgLyBzaWRlcyk7XG4gICAgY3R4LmxpbmVUbygwLCAtcmFkaXVzKTtcbiAgICBjdHgubGluZVRvKDAsIHJhZGl1cyk7XG4gIH1cbiAgY3R4LnJlc3RvcmUoKTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBjb25kaXRpb25hbENpcmNsZShcbiAgeCxcbiAgeSxcbiAgYnVmZmVyTGVuZ3RoLFxuICBiYXJXaWR0aCxcbiAgZGF0YUFycmF5LFxuICBjdHgsXG4gIGN1cnJlbnRUaW1lLFxuICBkdXJhdGlvbixcbiAgcm90YXRpb25cbikge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGJhckhlaWdodCA9IGRhdGFBcnJheVtpXTtcbiAgICBsZXQgaHVlID0gY3VycmVudFRpbWUgKiBpO1xuICAgIGxldCBzaGFwZSA9IGRyYXdDaXJjbGU7XG5cbiAgICBpZiAocm90YXRpb24gPT09IGFuZ2xlICYmIGkgJSAxMCA9PT0gMCkge1xuICAgICAgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldICogMztcbiAgICAgIHNoYXBlID0gZHJhd1N0YXI7XG4gICAgfVxuICAgIGlmIChyb3RhdGlvbiA9PT0gYW5nbGUgJiYgaSAlIDEwICE9PSAwKSB7XG4gICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAyO1xuICAgICAgc2hhcGUgPSAoKSA9PiB7fTtcbiAgICB9XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LnRyYW5zbGF0ZSh4LCB5KTtcblxuICAgIGN0eC5yb3RhdGUoaSAqIHJvdGF0aW9uKTtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGBoc2woJHtodWV9LCAyMDAlLCAke2l9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgIGN0eC5saW5lVG8oMCwgYmFySGVpZ2h0KTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjUpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxIC8gMiwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9XG4gICAgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjgpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAzLCB4LCB5LCBpbnNldCwgc2lkZXMpO1xuICAgICAgaWYgKGRhdGFBcnJheVtpXSA+IDApIGxvd1BpdGNoID0gdHJ1ZTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICBhbmdsZSArPSByb3RhdGlvblNwZWVkO1xufVxuIiwibGV0IHNjcnViID0ge1xuICAgIGVsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViXCIpLFxuICAgIGN1cnJlbnQ6IHtcbiAgICAgIHg6IDAsXG4gICAgfSxcbiAgICBsYXN0OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gIH0sXG4gIHRpbWVsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aW1lbGluZVwiKSxcbiAgbW91c2VEb3duID0gZmFsc2UsXG4gIGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpLFxuICBzY3J1YkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NydWItY29udGFpbmVyXCIpLFxuICBwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpLFxuICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG5cbmF1ZGlvMS5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBwZXJjZW50ID0gKGF1ZGlvMS5jdXJyZW50VGltZSAvIGF1ZGlvMS5kdXJhdGlvbikgKiAxMDA7XG4gIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBgY2FsYygke3BlcmNlbnR9JSArIDEwcHgpYDtcbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICBtb3VzZURvd24gPSB0cnVlO1xuICBzY3J1Yi5vcmlnaW4gPSB0aW1lbGluZS5vZmZzZXRMZWZ0O1xuICBzY3J1Yi5sYXN0LnggPVxuICAgIHNjcnViLmVsLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgdGltZWxpbmUub2Zmc2V0TGVmdCArIDUwO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lbGluZS5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgICBsZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICAgICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICAgIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyAoZS5jbGllbnRYIC0gc2NydWIubGFzdC54KSxcbiAgICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICAgIGlmIChcbiAgICAgIGUuY2xpZW50WCA8XG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZS5jbGllbnRYID49XG4gICAgICB0aW1lV2lkdGggK1xuICAgICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICAgIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSB0aW1lV2lkdGggLSB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgMjAgKyBzY3J1Yk9mZnNldCAqIDI7XG4gICAgfVxuICAgIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgICBzY3J1Yi5sYXN0LnggPSBlLmNsaWVudFg7XG5cbiAgICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICAgIGF1ZGlvMS5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG4gIH1cbn07XG5cbnRpbWVsaW5lLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAvLyBpZiAobW91c2VEb3duID09PSB0cnVlKSB7XG4gIGxldCBzY3J1YlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3J1Yi5lbCksXG4gICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgIHBvc2l0aW9uID0gcGFyc2VJbnQoc2NydWJTdHlsZS5sZWZ0LCAxMCksXG4gICAgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIChlLmNsaWVudFggLSBzY3J1Yi5sYXN0LngpLFxuICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICB0aW1lV2lkdGggPSBwYXJzZUludCh0aW1lU3R5bGUud2lkdGgsIDEwKTtcbiAgaWYgKFxuICAgIGUuY2xpZW50WCA8XG4gICAgdGltZWxpbmUub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyBzY3J1Yk9mZnNldCAqIDJcbiAgKSB7XG4gICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgfSBlbHNlIGlmIChcbiAgICBlLmNsaWVudFggPj1cbiAgICB0aW1lV2lkdGggK1xuICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgfVxuICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gbmV3UG9zaXRpb24gKyBcInB4XCI7XG4gIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgYXVkaW8xLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIGF1ZGlvMS5kdXJhdGlvbjtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59O1xuXG5kb2N1bWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IGZhbHNlO1xufTtcblxucGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgaWYgKCFhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBhdXNlKCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBsYXlfYXJyb3dcIjtcbiAgfSBlbHNlIGlmIChhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbiAgfVxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguY3NzXCI7XG5pbXBvcnQgXCIuL3NjcnViQmFyXCI7XG5cbmltcG9ydCB7IHBsYXlWaXN1YWxpemVyIH0gZnJvbSBcIi4vbWFpblZpc3VhbGl6ZXJcIjtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIik7XG5jb25zdCBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxldXBsb2FkXCIpO1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMxXCIpO1xuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuY29uc3QgY2FudmFzMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzMlwiKTtcbmNhbnZhczIud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhczIuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4MiA9IGNhbnZhczIuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5sZXQgYXVkaW9Tb3VyY2U7XG5sZXQgYW5hbHlzZXI7XG5cbmxldCBiYXJXaWR0aCA9IDE1O1xuXG5sZXQgeCA9IGNhbnZhcy53aWR0aCAvIDI7XG5sZXQgeSA9IGNhbnZhcy5oZWlnaHQgLyAyO1xuXG5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICBhdWRpbzEuc3JjID0gXCJodHRwczovL2xha2h0ZWEuZ2l0aHViLmlvL2pzUHJvamVjdC9zcmMvbXVzaWMvN3JpbmdzLm1wM1wiO1xuXG4gIHRyeSB7XG4gICAgYXVkaW9Tb3VyY2UgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW8xKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpO1xuICBhdWRpb1NvdXJjZS5jb25uZWN0KGFuYWx5c2VyKTtcbiAgYW5hbHlzZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gIGFuYWx5c2VyLmZmdFNpemUgPSAyNTY7XG4gIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuICBjb25zdCBmaWxlTmFtZSA9IGF1ZGlvMS5zcmMuc2xpY2UoMzIsIC00KTtcbiAgY29uc3Qgc29uZ1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb25nLXRpdGxlXCIpO1xuXG4gIHNvbmdUaXRsZS5pbm5lckhUTUwgPSBmaWxlTmFtZTtcbiAgLy8gcnVucyBpZiB5b3UgY2xpY2sgYW55d2hlcmUgaW4gdGhlIGNvbnRhaW5lclxuICBsZXQgaGVpZ2h0ID0gY2FudmFzMi5oZWlnaHQ7XG4gIGxldCB3aWR0aCA9IGNhbnZhczIud2lkdGg7XG4gIC8vIGFuaW1hdGUgbG9vcFxuICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjdHgyLmNsZWFyUmVjdCgwLCAwLCBjYW52YXMyLndpZHRoLCBjYW52YXMyLmhlaWdodCk7XG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZGF0YUFycmF5KTtcblxuICAgIGxldCBjdXJyZW50VGltZSA9IGF1ZGlvMS5jdXJyZW50VGltZTtcbiAgICBsZXQgZHVyYXRpb24gPSBhdWRpbzEuZHVyYXRpb247XG5cbiAgICBwbGF5VmlzdWFsaXplcihcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgY3R4LFxuICAgICAgYnVmZmVyTGVuZ3RoLFxuICAgICAgYmFyV2lkdGgsXG4gICAgICBkYXRhQXJyYXksXG4gICAgICBjdXJyZW50VGltZSxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdHgyXG4gICAgKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gIH07XG4gIGFuaW1hdGUoKTtcbn0pO1xuXG4vLyBmaWxlIHVwbG9hZFxuZmlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzO1xuICBjb25zdCBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKTtcbiAgY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZS1pY29uXCIpO1xuICBjb25zdCBzb25nVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbmctdGl0bGVcIik7XG5cbiAgc29uZ1RpdGxlLmlubmVySFRNTCA9IGZpbGVzWzBdLm5hbWUuc2xpY2UoMCwgLTQpO1xuXG4gIGF1ZGlvMS5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKTtcbiAgYXVkaW8xLmxvYWQoKTtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=