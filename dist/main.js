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
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvbWFpblZpc3VhbGl6ZXIuanMiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL3NjcnViQmFyLmpzIiwid2VicGFjazovL2pzUHJvamVjdC8uL3NyYy9zdHlsZXMvaW5kZXguY3NzIiwid2VicGFjazovL2pzUHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYW5nbGUiLCJyb3RhdGlvblNwZWVkIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwibGluZVdpZHRoIiwiaW5zZXQiLCJzaWRlcyIsImNyZWF0ZUNpcmNsZSIsInNldEludGVydmFsIiwiY2lyY2xlcyIsImxvd1BpdGNoIiwicGxheVZpc3VhbGl6ZXIiLCJ4IiwieSIsImN0eCIsImJ1ZmZlckxlbmd0aCIsImJhcldpZHRoIiwiZGF0YUFycmF5IiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY3R4MiIsImNvbmRpdGlvbmFsQ2lyY2xlIiwiZHJhd0NpcmNsZXMiLCJyYWRpdXMiLCJyZWR1Y2VyIiwibGVuZ3RoIiwicHVzaCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsImh1ZSIsImkiLCJiYXJIZWlnaHQiLCJncmFkaWVudCIsImNyZWF0ZVJhZGlhbEdyYWRpZW50IiwiYWRkQ29sb3JTdG9wIiwiYmVnaW5QYXRoIiwic2F2ZSIsInRyYW5zbGF0ZSIsIm1vdmVUbyIsImRyYXdDaXJjbGUiLCJmaWxsU3R5bGUiLCJmaWxsIiwicmVzdG9yZSIsInN0cm9rZSIsInNoaWZ0IiwiYmFySGVpZ2h0UmVkdWNlciIsImFyYyIsIlBJIiwiZHJhd1N0YXIiLCJyb3RhdGUiLCJsaW5lVG8iLCJyb3RhdGlvbiIsInNoYXBlIiwic3Ryb2tlU3R5bGUiLCJzY3J1YiIsImVsIiwiY3VycmVudCIsImxhc3QiLCJ0aW1lbGluZSIsIm1vdXNlRG93biIsImF1ZGlvMSIsInNjcnViQ29udGFpbmVyIiwicGxheSIsInBsYXlCdXR0b24iLCJvbnRpbWV1cGRhdGUiLCJwZXJjZW50Iiwic3R5bGUiLCJsZWZ0Iiwib25tb3VzZWRvd24iLCJvcmlnaW4iLCJvZmZzZXRMZWZ0Iiwib25tb3VzZW1vdmUiLCJlIiwic2NydWJTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJzY3J1Yk9mZnNldCIsInBhcnNlSW50IiwicG9zaXRpb24iLCJuZXdQb3NpdGlvbiIsImNsaWVudFgiLCJ0aW1lU3R5bGUiLCJ0aW1lV2lkdGgiLCJvZmZzZXRYIiwiaW5uZXJIVE1MIiwib25jbGljayIsIm9ubW91c2V1cCIsImFkZEV2ZW50TGlzdGVuZXIiLCJwYXVzZWQiLCJwYXVzZSIsImNvbnRhaW5lciIsImZpbGUiLCJjYW52YXMiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJnZXRDb250ZXh0IiwiY2FudmFzMiIsImF1ZGlvU291cmNlIiwiYW5hbHlzZXIiLCJhdWRpb0N0eCIsIkF1ZGlvQ29udGV4dCIsImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSIsImVycm9yIiwiY3JlYXRlQW5hbHlzZXIiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJmZnRTaXplIiwiZnJlcXVlbmN5QmluQ291bnQiLCJVaW50OEFycmF5IiwiYW5pbWF0ZSIsImNsZWFyUmVjdCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwicmVxdWVz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MUUsS0FBM0IsRUFBa0MwRSxNQUFNLENBQUN6RSxNQUF6QztBQUNBQyxRQUFJLENBQUMyRixTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQmQsT0FBTyxDQUFDL0UsS0FBN0IsRUFBb0MrRSxPQUFPLENBQUM5RSxNQUE1QztBQUNBZ0YsWUFBUSxDQUFDYSxvQkFBVCxDQUE4QmpHLFNBQTlCO0FBRUEsUUFBSUMsV0FBVyxHQUFHNkMsTUFBTSxDQUFDN0MsV0FBekI7QUFDQSxRQUFJQyxRQUFRLEdBQUc0QyxNQUFNLENBQUM1QyxRQUF0QjtBQUVBUixtRUFBYyxDQUNaQyxDQURZLEVBRVpDLENBRlksRUFHWkMsR0FIWSxFQUlaQyxZQUpZLEVBS1pDLFFBTFksRUFNWkMsU0FOWSxFQU9aQyxXQVBZLEVBUVpDLFFBUlksRUFTWkMsS0FUWSxFQVVaQyxNQVZZLEVBV1pDLElBWFksQ0FBZDtBQWFBNkYseUJBQXFCLENBQUNILE9BQUQsQ0FBckI7QUFDRCxHQXRCRDs7QUF1QkFBLFNBQU87QUFDUixDQTFDRCxFLENBNENBOztBQUNBbkIsSUFBSSxDQUFDSixnQkFBTCxDQUFzQixRQUF0QixFQUFnQyxZQUFZO0FBQzFDLE1BQU0yQixLQUFLLEdBQUcsS0FBS0EsS0FBbkI7QUFDQSxNQUFNckQsTUFBTSxHQUFHOUQsUUFBUSxDQUFDQyxjQUFULENBQXdCLFFBQXhCLENBQWY7QUFDQTZELFFBQU0sQ0FBQ3NELEdBQVAsR0FBYUMsR0FBRyxDQUFDQyxlQUFKLENBQW9CSCxLQUFLLENBQUMsQ0FBRCxDQUF6QixDQUFiO0FBQ0FyRCxRQUFNLENBQUN5RCxJQUFQO0FBQ0F6RCxRQUFNLENBQUNFLElBQVA7QUFDRCxDQU5ELEUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBhbmdsZSA9IDEwO1xubGV0IHJvdGF0aW9uU3BlZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhcIikudmFsdWUgKiAwLjAwMDA1O1xubGV0IGxpbmVXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieVwiKS52YWx1ZSAqIDE7XG5sZXQgaW5zZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2V0XCIpLnZhbHVlICogMC4wMTtcbmxldCBzaWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiblwiKS52YWx1ZSAqIDE7XG5sZXQgY3JlYXRlQ2lyY2xlID0gdHJ1ZTtcbnNldEludGVydmFsKCgpID0+IChjcmVhdGVDaXJjbGUgPSB0cnVlKSwgMTAwMCk7XG5sZXQgY2lyY2xlcyA9IFtdO1xubGV0IGxvd1BpdGNoID0gZmFsc2U7XG5cbmV4cG9ydCBjb25zdCBwbGF5VmlzdWFsaXplciA9IChcbiAgeCxcbiAgeSxcbiAgY3R4LFxuICBidWZmZXJMZW5ndGgsXG4gIGJhcldpZHRoLFxuICBkYXRhQXJyYXksXG4gIGN1cnJlbnRUaW1lLFxuICBkdXJhdGlvbixcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgY3R4MlxuKSA9PiB7XG4gIHJvdGF0aW9uU3BlZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInhcIikudmFsdWUgKiAwLjAwMDA1O1xuICBsaW5lV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInlcIikudmFsdWUgKiAxO1xuICBpbnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXRcIikudmFsdWUgKiAwLjAxO1xuICBzaWRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiblwiKS52YWx1ZSAqIDE7XG4gIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAvIDMsXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGUgLyA0XG4gICk7XG5cbiAgY29uZGl0aW9uYWxDaXJjbGUoXG4gICAgeCAqICg1IC8gMyksXG4gICAgeSAvIDIsXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgLWFuZ2xlIC8gNFxuICApO1xuICBjb25kaXRpb25hbENpcmNsZShcbiAgICB4LFxuICAgIHksXG4gICAgYnVmZmVyTGVuZ3RoLFxuICAgIGJhcldpZHRoLFxuICAgIGRhdGFBcnJheSxcbiAgICBjdHgsXG4gICAgY3VycmVudFRpbWUsXG4gICAgZHVyYXRpb24sXG4gICAgYW5nbGVcbiAgKTtcblxuICBkcmF3Q2lyY2xlcyhjdHgyLCBkYXRhQXJyYXksIDEgLyAyLCB3aWR0aCwgaGVpZ2h0KTtcbn07XG5cbmZ1bmN0aW9uIGRyYXdDaXJjbGVzKGN0eCwgcmFkaXVzLCByZWR1Y2VyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIGlmIChjaXJjbGVzLmxlbmd0aCA8IDI1ICYmIGNyZWF0ZUNpcmNsZSkge1xuICAgIGNpcmNsZXMucHVzaChbXG4gICAgICBNYXRoLnJhbmRvbSgpICogd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBNYXRoLnJhbmRvbSgpICogMyAtIDEuNSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhZGl1cy5sZW5ndGgpLFxuICAgIF0pO1xuICAgIGNyZWF0ZUNpcmNsZSA9IGZhbHNlO1xuICB9XG4gIGxldCBodWUgPSByYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNpcmNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYmFySGVpZ2h0ID0gcmFkaXVzW2NpcmNsZXNbaV1bM11dIC8gMiArIDUwO1xuICAgIGxldCBncmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAxMCwgMCwgMCwgODUpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JWApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcIiMxMzIzNTZcIik7XG5cbiAgICAvLyBjdHguc3Ryb2tlU3R5bGUgPSBgaHNsKCR7aHVlICogaX0sIDIwMCUsICR7MzB9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoY2lyY2xlc1tpXVswXSwgY2lyY2xlc1tpXVsxXSk7XG4gICAgLy8gY3R4LnRyYW5zbGF0ZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIGJhckhlaWdodCk7XG4gICAgZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgcmVkdWNlcik7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBpZiAoY2lyY2xlc1tpXVsxXSA8PSAwKSB7XG4gICAgICBjaXJjbGVzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGNpcmNsZXNbaV1bMF0gKz0gY2lyY2xlc1tpXVsyXTtcbiAgICBjaXJjbGVzW2ldWzFdIC09IE1hdGgucmFuZG9tKCk7XG4gIH1cbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0NpcmNsZShjdHgsIGJhckhlaWdodCwgYmFySGVpZ2h0UmVkdWNlcikge1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmMoMCwgMCwgYmFySGVpZ2h0ICogYmFySGVpZ2h0UmVkdWNlciwgMCwgTWF0aC5QSSAqIDIpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdTdGFyKGN0eCwgcmFkaXVzLCByZWR1Y2VyLCB4LCB5LCBpbnNldCwgc2lkZXMpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gIGN0eC5zYXZlKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2lkZXM7IGkrKykge1xuICAgIGN0eC5tb3ZlVG8oMCwgMCAtIHJhZGl1cyk7XG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJIC8gc2lkZXMpO1xuICAgIGN0eC5saW5lVG8oMCwgLXJhZGl1cyAqIGluc2V0KTtcbiAgICBjdHgucm90YXRlKE1hdGguUEkgLyBzaWRlcyk7XG4gICAgY3R4LmxpbmVUbygwLCAtcmFkaXVzKTtcbiAgICBjdHgubGluZVRvKDAsIHJhZGl1cyk7XG4gIH1cbiAgY3R4LnJlc3RvcmUoKTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBjb25kaXRpb25hbENpcmNsZShcbiAgeCxcbiAgeSxcbiAgYnVmZmVyTGVuZ3RoLFxuICBiYXJXaWR0aCxcbiAgZGF0YUFycmF5LFxuICBjdHgsXG4gIGN1cnJlbnRUaW1lLFxuICBkdXJhdGlvbixcbiAgcm90YXRpb25cbikge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGJhckhlaWdodCA9IGRhdGFBcnJheVtpXTtcbiAgICBsZXQgaHVlID0gY3VycmVudFRpbWUgKiBpO1xuICAgIGxldCBzaGFwZSA9IGRyYXdDaXJjbGU7XG5cbiAgICBpZiAocm90YXRpb24gPT09IGFuZ2xlICYmIGkgJSAxMCA9PT0gMCkge1xuICAgICAgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldICogMztcbiAgICAgIHNoYXBlID0gZHJhd1N0YXI7XG4gICAgfVxuICAgIGlmIChyb3RhdGlvbiA9PT0gYW5nbGUgJiYgaSAlIDEwICE9PSAwKSB7XG4gICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAyO1xuICAgICAgc2hhcGUgPSAoKSA9PiB7fTtcbiAgICB9XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LnRyYW5zbGF0ZSh4LCB5KTtcblxuICAgIGN0eC5yb3RhdGUoaSAqIHJvdGF0aW9uKTtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGBoc2woJHtodWV9LCAyMDAlLCAke2l9JSlgO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgIGN0eC5saW5lVG8oMCwgYmFySGVpZ2h0KTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjUpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAxIC8gMiwgeCwgeSwgaW5zZXQsIHNpZGVzKTtcbiAgICB9XG4gICAgaWYgKGkgPiBidWZmZXJMZW5ndGggKiAwLjgpIHtcbiAgICAgIHNoYXBlKGN0eCwgYmFySGVpZ2h0LCAzLCB4LCB5LCBpbnNldCwgc2lkZXMpO1xuICAgICAgaWYgKGRhdGFBcnJheVtpXSA+IDApIGxvd1BpdGNoID0gdHJ1ZTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuICBhbmdsZSArPSByb3RhdGlvblNwZWVkO1xufVxuIiwibGV0IHNjcnViID0ge1xuICAgIGVsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViXCIpLFxuICAgIGN1cnJlbnQ6IHtcbiAgICAgIHg6IDAsXG4gICAgfSxcbiAgICBsYXN0OiB7XG4gICAgICB4OiAwLFxuICAgIH0sXG4gIH0sXG4gIHRpbWVsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aW1lbGluZVwiKSxcbiAgbW91c2VEb3duID0gZmFsc2UsXG4gIGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpLFxuICBzY3J1YkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NydWItY29udGFpbmVyXCIpLFxuICBwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpLFxuICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlLWljb25cIik7XG5cbmF1ZGlvMS5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBwZXJjZW50ID0gKGF1ZGlvMS5jdXJyZW50VGltZSAvIGF1ZGlvMS5kdXJhdGlvbikgKiAxMDA7XG4gIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBgY2FsYygke3BlcmNlbnR9JSArIDEwcHgpYDtcbn07XG5cbnRpbWVsaW5lLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICBtb3VzZURvd24gPSB0cnVlO1xuICBzY3J1Yi5vcmlnaW4gPSB0aW1lbGluZS5vZmZzZXRMZWZ0O1xuICBzY3J1Yi5sYXN0LnggPVxuICAgIHNjcnViLmVsLm9mZnNldExlZnQgKyBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0ICsgdGltZWxpbmUub2Zmc2V0TGVmdCArIDUwO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lbGluZS5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmIChtb3VzZURvd24gPT09IHRydWUpIHtcbiAgICBsZXQgc2NydWJTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc2NydWIuZWwpLFxuICAgICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgICAgcG9zaXRpb24gPSBwYXJzZUludChzY3J1YlN0eWxlLmxlZnQsIDEwKSxcbiAgICAgIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyAoZS5jbGllbnRYIC0gc2NydWIubGFzdC54KSxcbiAgICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICAgIHRpbWVXaWR0aCA9IHBhcnNlSW50KHRpbWVTdHlsZS53aWR0aCwgMTApO1xuICAgIGlmIChcbiAgICAgIGUuY2xpZW50WCA8XG4gICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCArIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgZS5jbGllbnRYID49XG4gICAgICB0aW1lV2lkdGggK1xuICAgICAgICB0aW1lbGluZS5vZmZzZXRMZWZ0ICtcbiAgICAgICAgc2NydWJDb250YWluZXIub2Zmc2V0TGVmdCAtXG4gICAgICAgIHNjcnViT2Zmc2V0ICogMlxuICAgICkge1xuICAgICAgbmV3UG9zaXRpb24gPSB0aW1lV2lkdGggLSB0aW1lbGluZS5vZmZzZXRMZWZ0ICsgMjAgKyBzY3J1Yk9mZnNldCAqIDI7XG4gICAgfVxuICAgIHNjcnViLmVsLnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArIFwicHhcIjtcbiAgICBzY3J1Yi5sYXN0LnggPSBlLmNsaWVudFg7XG5cbiAgICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgICBhdWRpbzEuY3VycmVudFRpbWUgPSBwZXJjZW50ICogYXVkaW8xLmR1cmF0aW9uO1xuICAgIGF1ZGlvMS5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG4gIH1cbn07XG5cbnRpbWVsaW5lLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAvLyBpZiAobW91c2VEb3duID09PSB0cnVlKSB7XG4gIGxldCBzY3J1YlN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3J1Yi5lbCksXG4gICAgc2NydWJPZmZzZXQgPSBwYXJzZUludChzY3J1YlN0eWxlLndpZHRoLCAxMCkgLyAyLFxuICAgIHBvc2l0aW9uID0gcGFyc2VJbnQoc2NydWJTdHlsZS5sZWZ0LCAxMCksXG4gICAgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIChlLmNsaWVudFggLSBzY3J1Yi5sYXN0LngpLFxuICAgIHRpbWVTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGltZWxpbmUsIDEwKSxcbiAgICB0aW1lV2lkdGggPSBwYXJzZUludCh0aW1lU3R5bGUud2lkdGgsIDEwKTtcbiAgaWYgKFxuICAgIGUuY2xpZW50WCA8XG4gICAgdGltZWxpbmUub2Zmc2V0TGVmdCArIHNjcnViQ29udGFpbmVyLm9mZnNldExlZnQgKyBzY3J1Yk9mZnNldCAqIDJcbiAgKSB7XG4gICAgbmV3UG9zaXRpb24gPSAxMDtcbiAgfSBlbHNlIGlmIChcbiAgICBlLmNsaWVudFggPj1cbiAgICB0aW1lV2lkdGggK1xuICAgICAgdGltZWxpbmUub2Zmc2V0TGVmdCArXG4gICAgICBzY3J1YkNvbnRhaW5lci5vZmZzZXRMZWZ0IC1cbiAgICAgIHNjcnViT2Zmc2V0ICogMlxuICApIHtcbiAgICBuZXdQb3NpdGlvbiA9IHRpbWVXaWR0aCAtIHRpbWVsaW5lLm9mZnNldExlZnQgKyAyMCArIHNjcnViT2Zmc2V0ICogMjtcbiAgfVxuICBzY3J1Yi5lbC5zdHlsZS5sZWZ0ID0gbmV3UG9zaXRpb24gKyBcInB4XCI7XG4gIHNjcnViLmxhc3QueCA9IGUuY2xpZW50WDtcblxuICBsZXQgcGVyY2VudCA9IGUub2Zmc2V0WCAvIHRpbWVXaWR0aDtcbiAgYXVkaW8xLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIGF1ZGlvMS5kdXJhdGlvbjtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBhdXNlXCI7XG59O1xuXG5kb2N1bWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gIG1vdXNlRG93biA9IGZhbHNlO1xufTtcblxucGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgaWYgKCFhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBhdXNlKCk7XG4gICAgcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcInBsYXlfYXJyb3dcIjtcbiAgfSBlbHNlIGlmIChhdWRpbzEucGF1c2VkKSB7XG4gICAgYXVkaW8xLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLmlubmVySFRNTCA9IFwicGF1c2VcIjtcbiAgfVxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguY3NzXCI7XG5pbXBvcnQgXCIuL3NjcnViQmFyXCI7XG5cbmltcG9ydCB7IHBsYXlWaXN1YWxpemVyIH0gZnJvbSBcIi4vbWFpblZpc3VhbGl6ZXJcIjtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIik7XG5jb25zdCBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxldXBsb2FkXCIpO1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMxXCIpO1xuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuY29uc3QgY2FudmFzMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzMlwiKTtcbmNhbnZhczIud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhczIuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuY29uc3QgY3R4MiA9IGNhbnZhczIuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5sZXQgYXVkaW9Tb3VyY2U7XG5sZXQgYW5hbHlzZXI7XG5cbmxldCBiYXJXaWR0aCA9IDE1O1xuXG5sZXQgeCA9IGNhbnZhcy53aWR0aCAvIDI7XG5sZXQgeSA9IGNhbnZhcy5oZWlnaHQgLyAyO1xuXG5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYXVkaW8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhdWRpbzFcIik7XG4gIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICB0cnkge1xuICAgIGF1ZGlvU291cmNlID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvMSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFuYWx5c2VyID0gYXVkaW9DdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgYXVkaW9Tb3VyY2UuY29ubmVjdChhbmFseXNlcik7XG4gIGFuYWx5c2VyLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICBhbmFseXNlci5mZnRTaXplID0gMjU2O1xuICBjb25zdCBidWZmZXJMZW5ndGggPSBhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudDtcbiAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyTGVuZ3RoKTtcbiAgLy8gcnVucyBpZiB5b3UgY2xpY2sgYW55d2hlcmUgaW4gdGhlIGNvbnRhaW5lclxuICBsZXQgaGVpZ2h0ID0gY2FudmFzMi5oZWlnaHQ7XG4gIGxldCB3aWR0aCA9IGNhbnZhczIud2lkdGg7XG4gIC8vIGFuaW1hdGUgbG9vcFxuICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjdHgyLmNsZWFyUmVjdCgwLCAwLCBjYW52YXMyLndpZHRoLCBjYW52YXMyLmhlaWdodCk7XG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZGF0YUFycmF5KTtcblxuICAgIGxldCBjdXJyZW50VGltZSA9IGF1ZGlvMS5jdXJyZW50VGltZTtcbiAgICBsZXQgZHVyYXRpb24gPSBhdWRpbzEuZHVyYXRpb247XG5cbiAgICBwbGF5VmlzdWFsaXplcihcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgY3R4LFxuICAgICAgYnVmZmVyTGVuZ3RoLFxuICAgICAgYmFyV2lkdGgsXG4gICAgICBkYXRhQXJyYXksXG4gICAgICBjdXJyZW50VGltZSxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdHgyXG4gICAgKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gIH07XG4gIGFuaW1hdGUoKTtcbn0pO1xuXG4vLyBmaWxlIHVwbG9hZFxuZmlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZmlsZXMgPSB0aGlzLmZpbGVzO1xuICBjb25zdCBhdWRpbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImF1ZGlvMVwiKTtcbiAgYXVkaW8xLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZXNbMF0pO1xuICBhdWRpbzEubG9hZCgpO1xuICBhdWRpbzEucGxheSgpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9