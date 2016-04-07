(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
  WaveForm Oscilloscope
*/

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

//Setup the buffer
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

//Clear canvas
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

//Define draw()
function draw() {
  //requestAnimationFrame() keeps looping the draw() func once it's been started
  drawVisual = requestAnimationFrame(draw);
  //get time domain data, copy to dataArray
  analyser.getByteTimeDomainData(dataArray);
  //fill canvas with a solid color to start
  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  //Set a line width and stroke colour for the wave we will draw, then begin drawing a path
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  canvasCtx.beginPath();
  /*
  Determine the width of each segment of the line,
   by dividing the canvas width by the array length
  (equal to the FrequencyBinCount, as defined earlier on),
  then define an x variable for the position to move each segment of the line.
  */

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  /*
    Now we run through a loop,
      defining the position of a small segment of the wave for each point in the buffer
        at a certain height based on the data point value form the array,
        then moving the line across to the place where the next wave segment should be drawn:
  */
  for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;
        if(i === 0) {canvasCtx.moveTo(x, y);
        } else {canvasCtx.lineTo(x, y);}
        x += sliceWidth;
      }
  /*
  Finally, we finish the line in the middle of the right hand side of the canvas,
  then draw the stroke we've defined
  */
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
}; //End draw();

draw();

},{}]},{},[1]);
