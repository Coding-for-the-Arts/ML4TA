const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
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
  if (frameCount % 30) {
    emitters.push(
      new Emitter(
        results.poseLandmarks[11].x * width,
        results.poseLandmarks[11].y * height
      )
    );
    emitters.push(
      new Emitter(
        results.poseLandmarks[12].x * width,
        results.poseLandmarks[12].y * height
      )
    );
  }
}

let emitters = [];

function setup() {
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

  camera.start();
  webcam = select("#input_video");
  frameRate(30);
}

function draw() {
  background(0);
  image(webcam, 0, 0, webcam.width, webcam.height);

  if (emitters.length > 3) {
    emitters.shift();
  }
  for (let emitter of emitters) {
    emitter.emit(1);
    emitter.show();
    emitter.update();
  }
}
