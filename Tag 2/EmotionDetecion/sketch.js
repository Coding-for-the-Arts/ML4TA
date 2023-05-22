let mobilenet;
let video;
let classifier;

let classes = ['Happy', 'Surprised', "Neutral"];
let buttons = ['buttonHappy', 'buttonSurprised', "buttonNeutral"]
let rButtons = ['removeHappy', 'removeSurprised', "removeNeutral"]
let faceapi;

let happyImages = []
let surprisedImages = []
let neutralImages = []


let detectionOptions = {
    withLandmarks: true,
    withDescriptors: true,
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
    console.log(detections)

    } 

}

function modelReady() {
    select("#modelStatus").html("MobileNet Loaded!");
   
}

function faceReady() {
	select("#modelStatus").html("FaceAPI Loaded!");
  faceapi.detect(faceDetected);
}

function addToArray(name) {
  let img =  cvs.elt.toDataURL("image/jpeg", 1.0);
  var element = document.getElementById(name.toString() + "Images");
  value = parseInt(element.innerHTML);
  value++;
  element.innerHTML = value;

  return img;
}

function showButtons() {
    
  for (let i = 0; i < classes.length; i++) {
    
    buttons[i] = select('#' + classes[i].toString());
    buttons[i].mousePressed(function() {
        //classifier.addImage(classes[i].toString());
        if (classes[i].toString() == "Happy") {
          let img =  addToArray("Happy")
          happyImages.push(img)
          console.log(happyImages[i])
        }else if (classes[i].toString() == "Surprised"){
          let img = addToArray("Surprised")
          surprisedImages.push(img)
          console.log(surprisedImages[i])
        }else{
          let img = addToArray("Neutral")
          neutralImages.push(img)
          console.log(neutralImages[i])
        }

   
        });
    }

  // Train Button
  train = select("#train");
  train.mousePressed(async function() {
    await (addTrainingData());
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


//remove button
for (let i = 0; i < classes.length; i++) {
  rButtons[i] = select('#remove' + classes[i].toString());
    rButtons[i].mousePressed(function() {
        var element = document.getElementById(classes[i].toString() + "Images");
        if (classes[i].toString() == "Happy") {
          for (let i = 0; i < happyImages.length; i++) {
           happyImages.length = 0
           console.log(happyImages)
          }
        }else if (classes[i].toString() == "Surprised"){
          for (let i = 0; i < surprisedImages.length; i++) {
            surprisedImages.length = 0
            console.log(surprisedImages)
          }
        }else{
          for (let i = 0; i < neutralImages.length; i++) {
            neutralImages.length = 0
            console.log(neutralImages)
          }
        }

        value = parseInt(element.innerHTML);
        value = 0;
        element.innerHTML = value;
        });
      }
}

function addTrainingData(){
  
    for (let i = 0; i < happyImages.length; i++) {
      
      classifier.addImage(happyImages[i], "Happy");
    }
    for (let i = 0; i < surprisedImages.length; i++) {
    
      classifier.addImage(surprisedImages[i], "Surprised");
    }
    for (let i = 0; i < neutralImages.length; i++) {
     
      classifier.addImage(neutralImages[i], "Neutral");
    }

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
    let descriptors = detections[i].landmarks._positions;
		noFill();
		stroke(161, 95, 251);
		strokeWeight(2);
		rect(x, y, boxWidth, boxHeight);
    for (let j = 0; j < descriptors.length; j++){
      circle(descriptors[j]._x, descriptors[j]._y, 10)
    }
    
    console.log(descriptors)
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


