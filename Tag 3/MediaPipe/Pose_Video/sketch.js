
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const videoElement = document.getElementById("input_video");

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

let video;
let time = 0;
let loaded = false;
let ff= 0;
var videoV = VideoFrame({
  id : 'input_video',
  frameRate: 29.97,
  callback :function(frame) {
    console.log("frame", frame)
    //await pose.send({image: frame});
  }
});

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  // Only overwrite missing pixels.
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.globalCompositeOperation = "source-over";
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00FF00",
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });
  canvasCtx.restore();

}


function setup() {
  frameRate(60)
  cvs = createCanvas(1280, 720);
  cvs.parent("ctr");
  cvs.style("position", "absolute", "left", 0, "top", 0, "z-index", 0);

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  pose.onResults(onResults);
 
 video = VideoFrame();
 setInterval(drawVideoFrame,50);
}

function videoLoaded(){
  loaded = true;

  //onSeek()
  setTimeout(drawNextFrame,1000);
}

function drawNextFrame() {
  video.elt.addEventListener('seeked', onSeek);
  video.time(time); 
  time += 1/60;
}

async function onSeek(){
  video.elt.removeEventListener('seeked', onSeek);
  setTimeout(drawNextFrame,1);
  await pose.send({image: video.elt});
}


function draw() {
 //console.log(ff)

 if (!loaded) return;
 image(video, 0, 0, width, height);

}


function drawVideoFrame(){
  video.seekForward(ff);
  ff++;

}