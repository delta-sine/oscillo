function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) { x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  } return curve;
};

//var voiceSelect = document.getElementById("voice");

function reverbSample(){
  ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open('GET', 'http://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg', true);
  ajaxRequest.responseType = 'arraybuffer';
  ajaxRequest.onload = function() {
    var audioData = ajaxRequest.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        concertHallBuffer = buffer;
        soundSource = audioCtx.createBufferSource();
        soundSource.buffer = concertHallBuffer;
      }, function(e){"Error with decoding audio data" + e.err});
  }
  ajaxRequest.send();
}

function voiceChange() {
  distortion.oversample = '4x';
  biquadFilter.gain.value = 0;
  convolver.buffer = undefined;
  var voiceSetting = voiceSelect.value;
  console.log(voiceSetting);
  if(voiceSetting == "distortion") {distortion.curve = makeDistortionCurve(400);}
  else if(voiceSetting == "convolver") {convolver.buffer = concertHallBuffer;}
  else if(voiceSetting == "biquad") {
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 25;
  } else if(voiceSetting == "off") {console.log("Voice settings turned off");}
}
// event listeners to change visualize and voice settings
visualSelect.onchange = function(){window.cancelAnimationFrame(drawVisual); visualize();}
voiceSelect.onchange = function() {voiceChange();}
