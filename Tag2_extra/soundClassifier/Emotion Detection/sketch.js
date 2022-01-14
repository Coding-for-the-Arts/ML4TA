let mobilenet;
let video;
let classifier;

let classes = ['Happy', 'Surprised', "Neutral"];
let buttons = ['buttonHappy', 'buttonSurprised', "buttonNeutral"]

let faceapi;

let detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
	};

let detections = [];

function setup() {
  cvs = createCanvas(640, 480)
  cvs.parent("videoContainer")
  video = createCapture(VIDEO);
  
  video.size(640, 480);
  video.hide()


  faceapi = ml5.faceApi(video, detectionOptions, faceReady)

  mobilenet = ml5.featureExtractor('MobileNet', modelReady);

  const options = { numLabels: 3 };
  classifier = mobilenet.classification(video, options);

  showButtons() 
  
}

function draw() {
  image(video, 0, 0);

  if (detections && detections.length > 0) {
    drawBox(detections);
    } 

}

function modelReady() {
    select("#modelStatus").html("MobileNet Loaded!");
   
}

function faceReady() {
	select("#modelStatus").html("FaceAPI Loaded!");
  faceapi.detect(faceDetected);
}

function showButtons() {
    
  for (let i = 0; i < classes.length; i++) {
    
    buttons[i] = select('#' + classes[i].toString());
    buttons[i].mousePressed(function() {
        classifier.addImage(classes[i].toString());
        var element = document.getElementById(classes[i].toString() + "Images");
        value = parseInt(element.innerHTML);
        value++;
        element.innerHTML = value;
        });
    }

  // Train Button
  train = select("#train");
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select("#loss").html(`Loss: ${loss}`);
      } else {
        select("#loss").html(`Done Training! Final Loss: ${loss}`);
      }
    });
  });

  // Predict Button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(classify);

  // Save model
  saveBtn = select("#save");
  saveBtn.mousePressed(function() {
    classifier.save();
  });

  // Load model
  loadBtn = select("#load");
  loadBtn.changed(function() {
    classifier.load(loadBtn.elt.files, function() {
      select("#modelStatus").html("Custom Model Loaded!");
    });
  });



}
function faceDetected(err, result) {
	if (err) {
		print(err);
		return;
	}

	detections = result;
	faceapi.detect(faceDetected);
}

// draw a bounding box around each detected face
function drawBox(detections){
	for(let i = 0; i < detections.length; i++){
		let alignedRect = detections[i].alignedRect;
		let x = alignedRect._box._x;
		let y = alignedRect._box._y;
		let boxWidth = alignedRect._box._width;
		let boxHeight  = alignedRect._box._height;

		noFill();
		stroke(161, 95, 251);
		strokeWeight(2);
		rect(x, y, boxWidth, boxHeight);
	}
}

function classify() {
    classifier.classify(gotResults);
 
}


function gotResults(error, result) {
  if (error) {
    console.log(error);
  } else {
    if (result) {
        select("#result").html(result[0].label);
        select("#confidence").html(`${result[0].confidence.toFixed(2) * 100  }%`);
        classify();
      }
  }

}