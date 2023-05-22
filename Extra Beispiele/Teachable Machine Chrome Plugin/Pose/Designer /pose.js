
const modelURL = 'https://teachablemachine.withgoogle.com/models/2U9-zrZe-/';
const checkpointURL = modelURL + "model.json";
const metadataURL = modelURL + "metadata.json";
const flip = true; 
let webcam;
let model;

async function load() {
  model = await tmPose.load(checkpointURL, metadataURL);
  totalClasses = model.getTotalClasses();
}

async function loadWebcam() {
  webcam = new tmPose.Webcam(640, 520,flip); 
  await webcam.setup(); 
  await webcam.play();
  window.requestAnimationFrame(loopWebcam);
 } 

async function loopWebcam(timestamp) {
  webcam.update(); 
  await predict();
  window.requestAnimationFrame(loopWebcam);
 
}

async function predict() {

  const flipHorizontal = false;
  const { pose, posenetOutput } = await model.estimatePose(
    webcam.canvas,
    flipHorizontal
  );
 
  const prediction = await model.predict(
    posenetOutput,
    flipHorizontal,
    totalClasses
  );

  const sortedPrediction = prediction.sort((a, b) => b.probability - a.probability);
  await window.myPose(sortedPrediction);
  if (pose) {
    drawPose(pose);
  }
  
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    
    if (pose) {
      const minPartConfidence = 0.5;

      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}

 