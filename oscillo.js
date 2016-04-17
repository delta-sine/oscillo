navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
//Audio Context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();
var soundSource, concertHallBuffer, source, stream;
//Analyzer context
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
//Canvas context
var canvas = document.querySelector('#scope');
var canvasCtx = canvas.getContext("2d");
var intendedWidth = document.querySelector('.wrapper').clientWidth;
var drawVisual;
canvas.setAttribute('width',intendedWidth);

//main block for RECORDING INPUT SIGNAL
if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia ({audio: true},
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(distortion);
         gainNode.connect(audioCtx.destination);
      	 draw();
      },
      function(err) {console.log('The following gUM error occured: ' + err);}
   );
} else {console.log('getUserMedia not supported on your browser!');}

//general purpose draw() function
function draw() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    analyser.fftSize = 2048;
    var dataArray = new Uint8Array(analyser.fftSize);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(0, 0, 0)'; //Foreground
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2.5;
    canvasCtx.strokeStyle = 'rgb(124,252,0)'; //Line color
    canvasCtx.beginPath();
    var sliceWidth = WIDTH * 1.0 / analyser.fftSize;
    var x = 0;
    for(var i = 0; i < analyser.fftSize; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;
      if(i === 0) {canvasCtx.moveTo(x, y);}
      else {canvasCtx.lineTo(x, y);}
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
};
