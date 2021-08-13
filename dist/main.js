/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/index.css":
/*!******************************!*\
  !*** ./src/styles/index.css ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.css */ "./src/styles/index.css");

var container = document.getElementById("container");
var canvas = document.getElementById("canvas1");
var file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
ctx.globalCompositeOperation = "difference";
var audioSource;
var analyser;
container.addEventListener("click", function () {
  // runs if you click anywhere in the container
  var audio1 = document.getElementById("audio1");
  var audioCtx = new AudioContext();
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 128;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  var barWidth = 15;
  var barHeight;
  var x; // animate loop

  var animate = function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
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
}); // draw rotation visualizer
// function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
//   for (let i = 0; i < bufferLength; i++) {
//     // dataArray values range from 0 - 250
//     barHeight = dataArray[i] * 5;
//     // creates a savepoint for the canvas
//     ctx.save();
//     // translates 0,0 postion from top right to center
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     // rotates canvas a certain amount of radians
//     ctx.rotate(i + (Math.PI * 2) / bufferLength);
//     //colors
//     const red = (i * barHeight) / 20;
//     const green = i / 4;
//     const blue = barHeight / 2;
//     ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
//     ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//     x += barWidth;
//     ctx.restore();
//   }
// }
// firework
// function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
//   for (let i = 0; i < bufferLength; i++) {
//     // dataArray values range from 0 - 250
//     barHeight = dataArray[i] * 1.5;
//     // creates a savepoint for the canvas
//     ctx.save();
//     // translates 0,0 postion from top right to center
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     // rotates canvas a certain amount of radians
//     ctx.rotate(i * 3);
//     //colors
//     const hue = i * 0.3;
//     ctx.fillStyle = `hsl(${hue}, 100%, ${barHeight / 3}%)`;
//     ctx.fillRect(0, 0, barWidth, barHeight);
//     x += barWidth;
//     ctx.restore();
//   }
// }

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (var i = 0; i < bufferLength; i++) {
    // dataArray values range from 0 - 250
    barHeight = dataArray[i] * 1.5; // creates a savepoint for the canvas

    ctx.save(); // translates 0,0 postion from top right to center

    ctx.translate(canvas.width / 2, canvas.height / 2); // rotates canvas a certain amount of radians

    ctx.rotate(i * 3.2); //colors

    var hue = i * 0.1;
    ctx.strokeStyle = "hsl(".concat(hue, ", 100%, ").concat(barHeight / 3, "%)");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, barHeight);
    ctx.stroke();
    x += barWidth;

    if (i > bufferLength * 0.6) {
      ctx.beginPath();
      ctx.arc(0, 0, barHeight, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc1Byb2plY3QvLi9zcmMvc3R5bGVzL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9qc1Byb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vanNQcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjYW52YXMiLCJmaWxlIiwid2lkdGgiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwibGluZVdpZHRoIiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiYXVkaW9Tb3VyY2UiLCJhbmFseXNlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdWRpbzEiLCJhdWRpb0N0eCIsIkF1ZGlvQ29udGV4dCIsInBsYXkiLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJjcmVhdGVBbmFseXNlciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImZmdFNpemUiLCJidWZmZXJMZW5ndGgiLCJmcmVxdWVuY3lCaW5Db3VudCIsImRhdGFBcnJheSIsIlVpbnQ4QXJyYXkiLCJiYXJXaWR0aCIsImJhckhlaWdodCIsIngiLCJhbmltYXRlIiwiY2xlYXJSZWN0IiwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLCJkcmF3VmlzdWFsaXplciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGVzIiwic3JjIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibG9hZCIsImkiLCJzYXZlIiwidHJhbnNsYXRlIiwicm90YXRlIiwiaHVlIiwic3Ryb2tlU3R5bGUiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJhcmMiLCJNYXRoIiwiUEkiLCJyZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7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QUFZLEdBQUcsR0FBdkIsRUFBNEI7QUFDMUJoQixTQUFHLENBQUN1QyxTQUFKO0FBQ0F2QyxTQUFHLENBQUMyQyxHQUFKLENBQVEsQ0FBUixFQUFXLENBQVgsRUFBY3RCLFNBQWQsRUFBeUIsQ0FBekIsRUFBNEJ1QixJQUFJLENBQUNDLEVBQUwsR0FBVSxDQUF0QztBQUNBN0MsU0FBRyxDQUFDMEMsTUFBSjtBQUNEOztBQUNEMUMsT0FBRyxDQUFDOEMsT0FBSjtBQUNEO0FBQ0YsQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguY3NzXCI7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXMxXCIpO1xuY29uc3QgZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXVwbG9hZFwiKTtcbmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmN0eC5saW5lV2lkdGggPSAyO1xuY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGlmZmVyZW5jZVwiO1xuXG5sZXQgYXVkaW9Tb3VyY2U7XG5sZXQgYW5hbHlzZXI7XG5cbmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAvLyBydW5zIGlmIHlvdSBjbGljayBhbnl3aGVyZSBpbiB0aGUgY29udGFpbmVyXG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBjb25zdCBhdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgYXVkaW8xLnBsYXkoKTtcbiAgYXVkaW9Tb3VyY2UgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW8xKTtcbiAgYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpO1xuICBhdWRpb1NvdXJjZS5jb25uZWN0KGFuYWx5c2VyKTtcbiAgYW5hbHlzZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gIGFuYWx5c2VyLmZmdFNpemUgPSAxMjg7XG4gIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50O1xuICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xuXG4gIGxldCBiYXJXaWR0aCA9IDE1O1xuICBsZXQgYmFySGVpZ2h0O1xuICBsZXQgeDtcbiAgLy8gYW5pbWF0ZSBsb29wXG4gIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgeCA9IDA7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGRhdGFBcnJheSk7XG4gICAgZHJhd1Zpc3VhbGl6ZXIoYnVmZmVyTGVuZ3RoLCB4LCBiYXJXaWR0aCwgYmFySGVpZ2h0LCBkYXRhQXJyYXkpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgfTtcbiAgYW5pbWF0ZSgpO1xufSk7XG5cbi8vIGZpbGUgdXBsb2FkXG5maWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZXM7XG4gIGNvbnN0IGF1ZGlvMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXVkaW8xXCIpO1xuICBhdWRpbzEuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1swXSk7XG4gIGF1ZGlvMS5sb2FkKCk7XG4gIGF1ZGlvMS5wbGF5KCk7XG59KTtcblxuLy8gZHJhdyByb3RhdGlvbiB2aXN1YWxpemVyXG4vLyBmdW5jdGlvbiBkcmF3VmlzdWFsaXplcihidWZmZXJMZW5ndGgsIHgsIGJhcldpZHRoLCBiYXJIZWlnaHQsIGRhdGFBcnJheSkge1xuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG4vLyAgICAgLy8gZGF0YUFycmF5IHZhbHVlcyByYW5nZSBmcm9tIDAgLSAyNTBcbi8vICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiA1O1xuLy8gICAgIC8vIGNyZWF0ZXMgYSBzYXZlcG9pbnQgZm9yIHRoZSBjYW52YXNcbi8vICAgICBjdHguc2F2ZSgpO1xuLy8gICAgIC8vIHRyYW5zbGF0ZXMgMCwwIHBvc3Rpb24gZnJvbSB0b3AgcmlnaHQgdG8gY2VudGVyXG4vLyAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMik7XG4vLyAgICAgLy8gcm90YXRlcyBjYW52YXMgYSBjZXJ0YWluIGFtb3VudCBvZiByYWRpYW5zXG4vLyAgICAgY3R4LnJvdGF0ZShpICsgKE1hdGguUEkgKiAyKSAvIGJ1ZmZlckxlbmd0aCk7XG4vLyAgICAgLy9jb2xvcnNcbi8vICAgICBjb25zdCByZWQgPSAoaSAqIGJhckhlaWdodCkgLyAyMDtcbi8vICAgICBjb25zdCBncmVlbiA9IGkgLyA0O1xuLy8gICAgIGNvbnN0IGJsdWUgPSBiYXJIZWlnaHQgLyAyO1xuLy8gICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiKCR7cmVkfSwgJHtncmVlbn0sICR7Ymx1ZX0pYDtcbi8vICAgICBjdHguZmlsbFJlY3QoeCwgY2FudmFzLmhlaWdodCAtIGJhckhlaWdodCwgYmFyV2lkdGgsIGJhckhlaWdodCk7XG4vLyAgICAgeCArPSBiYXJXaWR0aDtcbi8vICAgICBjdHgucmVzdG9yZSgpO1xuLy8gICB9XG4vLyB9XG5cbi8vIGZpcmV3b3JrXG4vLyBmdW5jdGlvbiBkcmF3VmlzdWFsaXplcihidWZmZXJMZW5ndGgsIHgsIGJhcldpZHRoLCBiYXJIZWlnaHQsIGRhdGFBcnJheSkge1xuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlckxlbmd0aDsgaSsrKSB7XG4vLyAgICAgLy8gZGF0YUFycmF5IHZhbHVlcyByYW5nZSBmcm9tIDAgLSAyNTBcbi8vICAgICBiYXJIZWlnaHQgPSBkYXRhQXJyYXlbaV0gKiAxLjU7XG4vLyAgICAgLy8gY3JlYXRlcyBhIHNhdmVwb2ludCBmb3IgdGhlIGNhbnZhc1xuLy8gICAgIGN0eC5zYXZlKCk7XG4vLyAgICAgLy8gdHJhbnNsYXRlcyAwLDAgcG9zdGlvbiBmcm9tIHRvcCByaWdodCB0byBjZW50ZXJcbi8vICAgICBjdHgudHJhbnNsYXRlKGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcbi8vICAgICAvLyByb3RhdGVzIGNhbnZhcyBhIGNlcnRhaW4gYW1vdW50IG9mIHJhZGlhbnNcbi8vICAgICBjdHgucm90YXRlKGkgKiAzKTtcbi8vICAgICAvL2NvbG9yc1xuLy8gICAgIGNvbnN0IGh1ZSA9IGkgKiAwLjM7XG4vLyAgICAgY3R4LmZpbGxTdHlsZSA9IGBoc2woJHtodWV9LCAxMDAlLCAke2JhckhlaWdodCAvIDN9JSlgO1xuLy8gICAgIGN0eC5maWxsUmVjdCgwLCAwLCBiYXJXaWR0aCwgYmFySGVpZ2h0KTtcbi8vICAgICB4ICs9IGJhcldpZHRoO1xuLy8gICAgIGN0eC5yZXN0b3JlKCk7XG4vLyAgIH1cbi8vIH1cblxuZnVuY3Rpb24gZHJhd1Zpc3VhbGl6ZXIoYnVmZmVyTGVuZ3RoLCB4LCBiYXJXaWR0aCwgYmFySGVpZ2h0LCBkYXRhQXJyYXkpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuICAgIC8vIGRhdGFBcnJheSB2YWx1ZXMgcmFuZ2UgZnJvbSAwIC0gMjUwXG4gICAgYmFySGVpZ2h0ID0gZGF0YUFycmF5W2ldICogMS41O1xuICAgIC8vIGNyZWF0ZXMgYSBzYXZlcG9pbnQgZm9yIHRoZSBjYW52YXNcbiAgICBjdHguc2F2ZSgpO1xuICAgIC8vIHRyYW5zbGF0ZXMgMCwwIHBvc3Rpb24gZnJvbSB0b3AgcmlnaHQgdG8gY2VudGVyXG4gICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMik7XG4gICAgLy8gcm90YXRlcyBjYW52YXMgYSBjZXJ0YWluIGFtb3VudCBvZiByYWRpYW5zXG4gICAgY3R4LnJvdGF0ZShpICogMy4yKTtcbiAgICAvL2NvbG9yc1xuICAgIGNvbnN0IGh1ZSA9IGkgKiAwLjE7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsICR7YmFySGVpZ2h0IC8gM30lKWA7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgY3R4LmxpbmVUbygwLCBiYXJIZWlnaHQpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICB4ICs9IGJhcldpZHRoO1xuICAgIGlmIChpID4gYnVmZmVyTGVuZ3RoICogMC42KSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKDAsIDAsIGJhckhlaWdodCwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9