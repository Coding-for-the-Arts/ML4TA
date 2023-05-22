
const flip = true; 
let webcam;
let model;

async function load(modelURL) {
  const checkpointURL = modelURL + "model.json";
  const metadataURL = modelURL + "metadata.json";
  model = await tmPose.load(checkpointURL, metadataURL);
  totalClasses = model.getTotalClasses();
  console.log("model reloaded")
}

async function loadWebcam() {
  webcam = new tmPose.Webcam(960 , 540, flip); 
  await webcam.setup(); 
  await webcam.play();
  window.requestAnimationFrame(loopWebcam);
 } 

async function loopWebcam(timestamp) {
  webcam.update(); // update the webcam frame
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

  const sortedPrediction = prediction.sort((a, b) => - a.probability +         b.probability);


await myPose(sortedPrediction);
  //console.log(sortedPrediction[0].probability.toFixed(2))
  if (pose) {
    drawPose(pose);
  }
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence,ctx, 5, "white");
      tmPose .drawKeypoints(pose.keypoints, minPartConfidence, ctx, 5, "white");
      for (let j = 0; j < pose.keypoints.length; j += 1) {
        const keypoint = pose.keypoints[j];
        text(keypoint.part, keypoint.position.x, keypoint.position.y)
        //text("x: " + keypoint.position.x.toFixed(2), keypoint.position.x , keypoint.position.y + 15)
        //text("y: " +keypoint.position.y.toFixed(2), keypoint.position.x, keypoint.position.y + 30)
      }

    }
  }
}