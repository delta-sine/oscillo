(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();
var soundSource, concertHallBuffer, source, stream;
var mute = document.querySelector('.mute');
//Analyzer context
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
//Canvas context for visualizer
var drawVisual;
var canvas = document.querySelector('#scope');
var canvasCtx = canvas.getContext("2d");
var intendedWidth = document.querySelector('.wrapper').clientWidth;
canvas.setAttribute('width',intendedWidth);
//general purpose draw() function
function draw(target_canvas) {
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    target_canvas.fillStyle = 'rgb(200, 200, 200)'; //Foreground
    target_canvas.fillRect(0, 0, WIDTH, HEIGHT);
    target_canvas.lineWidth = 2;
    target_canvas.strokeStyle = 'rgb(0, 0, 0)'; //Line color
    target_canvas.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;
      if(i === 0) {target_canvas.moveTo(x, y);}
      else {target_canvas.lineTo(x, y);}
      x += sliceWidth;
    }
    target_canvas.lineTo(canvas.width, canvas.height/2);
    target_canvas.stroke();
};
//main block for RECORDING INPUT SIGNAL
if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia ({audio: true},
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(distortion);
         gainNode.connect(audioCtx.destination);
      	 visualize();
      },
      function(err) {console.log('The following gUM error occured: ' + err);}
   );
} else {console.log('getUserMedia not supported on your browser!');}
function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;
  var dataArray = new Uint8Array(bufferLength);
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  draw(canvasCtx);
}

},{}]},{},[1]);
