
//circle setting
let circleSize = 60;
let trails = [];
const MAX_POS = 10;

// poseNet
let video;
let poseNet;
let poses = [];

// neuralNetwork
let brain;


// interface
let dataButton;
let trainButton;
let predictButton;
let saveButton;
let loadButton;
let positionSlider;
let h5;
let samples = 0;
let positionLerped = 0;

function setup() {
  createCanvas(640, 480);

  //Video
  video = createCapture(VIDEO);

  //poseNet options
  var poseNetOptions = {
    detectionType: "single",
  };

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, poseNetOptions, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  // Interface buttons
  dataButton = createButton("add example").position(10, 500);
  dataButton.mousePressed(addExample);
  trainButton = createButton("train model").position(10, 530);
  trainButton.mousePressed(trainModel);

  predictButton = createButton("predict").position(10, 560);
  predictButton.mousePressed(predict);

  positionSlider = createSlider(0, 200, 100).position(10, 10);
  h5 = createElement("h5", `Amount of images ${samples}`).position(120, 480);

  // Create the model with options
  let options = {
    inputs: 34,
    outputs: 1,
    debug: true,
  };

  brain = ml5.neuralNetwork(options);

  // Save model
  saveButton = select("#save").position(10, 590);
  saveButton.mousePressed(function () {
    brain.save();
  });

  // Load model
  loadButton = select("#load").position(80, 590);
  loadButton.changed(function () {
    brain.load(loadButton.elt.files, function () {
      console.log("Custom Model Loaded!");
    });
  });
}

//get positions of the keypoints
function getInputs() {
  let keypoints = poses[0].pose.keypoints;
  let inputs = [];
  for (let i = 0; i < keypoints.length; i++) {
    inputs.push(keypoints[i].position.x);
    inputs.push(keypoints[i].position.y);
  }
  return inputs;
}

// Callback function when poseNet is ready
function modelReady() {
  console.log("model loaded");
}

// Add training examples
function addExample() {
  samples++;
  if (poses.length > 0) {
    let inputs = getInputs();
    brain.addData(inputs, [positionSlider.value()]);
  }
}

// Normalize model
function normalizeModel() {
  brain.normalizeData();
}

// Train model
function trainModel() {
  normalizeModel();
  let options = {
    epochs: 15,
  };
  brain.train(options, finishedTraining);
}

// Callback function when training is over
function finishedTraining() {
  console.log("training finished");
}

// Make a prediction
function predict() {
  if (poses.length > 0) {
    let inputs = getInputs();
    brain.predict(inputs, gotResults);
  }
}

// Callback function when new results(poses) are found
function gotResults(error, outputs) {
  let lerpFactor = 0.05;
  positionLerped = lerp(positionLerped, outputs[0].value, lerpFactor);
  positionSlider.value(positionLerped);

  // Predict again
  predict();
}



function draw() {
  background(255, 0);

 //show slider 
  let posX = map(
    positionSlider.value(),
    0,
    200,
    circleSize / 2,
    width - circleSize / 2
    );
    
  let maxCircle = circleSize / MAX_POS;
  h5.html(`Amount of images ${samples}`);

  //draw video and mirror it
  push();
  scale(-1, 1);
  translate(-width, 0);
  image(video, 0, 0, width, height);

  // For one pose only
  // draw PoseNet keypoints
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let i = 0; i < pose.keypoints.length; i++) {
      fill(255);
      noStroke();
      ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 8);
    }
  }
  pop();

  //draw trail 
  fill(0);
  trails.push({ x: posX, y: height / 2 });
    
  //removes poses that are older than 10
  if (trails.length > MAX_POS) {
    trails.shift();
  }
  for (let i = 0; i < trails.length; i += 1) {
    circle(trails[i].x, trails[i].y, i * maxCircle);
  }
}
