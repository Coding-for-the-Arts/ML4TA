let mobilenet;
let video;
let classifier;

let coffeeImages = [];
let waterBottleImages = [];

let indexCup,
  indexWater = 0;

function setup() {
  cvs = createCanvas(640, 480);
  cvs.parent("videoContainer");
  video = createCapture(VIDEO);

  video.size(640, 480);
  video.hide();

  featureExtractor = ml5.featureExtractor("MobileNet", modelReady);

  const options = {
    numLabels: 2,
    debug: true,
  };

  classifier = featureExtractor.classification(video, options, videoReady);

  showButtons();
}

function draw() {
  push();
  scale(-1,1)
  translate(-width, 0);
  image(video, 0, 0);
  pop()
}

function modelReady() {
  console.log("Model loaded!");
}

function videoReady() {
  console.log("Video is ready!");
}

function addToArray(arrayName, spanName) {
  let img = cvs.elt.toDataURL("image/jpg", 1);
  arrayName.push(img);
  amountName = select(spanName);

  if (spanName == "#AmountCupImages") {
    amountNumber = parseInt(amountName.elt.innerHTML);
    amountNumber++;
    amountName.elt.innerHTML = amountNumber;
  } else if (spanName == "#AmountWaterBottleImages") {
    amountNumber = parseInt(amountName.elt.innerHTML);
    amountNumber++;
    amountName.elt.innerHTML = amountNumber;
  }
}

function showButtons() {
  //Add Cup Images
  cupButton = select("#Cup");
  cupButton.mousePressed(function () {
    addToArray(coffeeImages, "#AmountCupImages");
  });

  waterBottleButton = select("#WaterBottle");
  waterBottleButton.mousePressed(function () {
    addToArray(waterBottleImages, "#AmountWaterBottleImages");
  });

  // Train Button
  train = select("#Train");
  train.mousePressed(async function () {
    await addTrainingData();
    classifier.train(function (lossValue) {
      console.log("Loss is", lossValue);
    });
  });

  // Predict Button
  predict = select("#Predict");
  predict.mousePressed(classify);

  // Save Model
  saveModel = select("#Save");
  saveModel.mousePressed(function () {
    classifier.save();
  });
  // Load Model
  loadModel = select("#Load");
  loadModel.changed(function () {
    files = loadModel.elt.files;
    classifier.load(files);
  });
}

function addTrainingData() {
  for (let i = 0; i < coffeeImages.length; i++) {
    classifier.addImage(coffeeImages[i], "Cup");
  }

  for (let j = 0; j < waterBottleImages.length; j++) {
    classifier.addImage(waterBottleImages[j], "Bottle");
  }
}

function classify() {
  classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error();
  } else {
    console.log(results);
    classify();
  }
}
