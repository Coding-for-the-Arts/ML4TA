let myCanvas;
let ctx;
var i = 0;
let myInput;
let newTab = "zhdk.ch";
let goTo = " ";
let previousInput = null;
let classA = "A";
let classB = "B";
let classSubmit = "Submit";
let classHold = "Hold";
let webA = "zhdk.ch";
let webB = "epfl.ch";

async function setup() {
  myCanvas = createCanvas(960, 540);
  ctx = myCanvas.elt.getContext("2d");
  myCanvas.parent("sketch-container");

  pg = createGraphics(960, 540);
  textFont("Roboto");
  textSize(16);
  noStroke();
  myInput = document.getElementById("inp");

  const modelURL = "https://teachablemachine.withgoogle.com/models/1mjk2xoz6/";
  await load(modelURL);
  await loadWebcam();
}

async function draw() {
  fill(255);
}

async function myPose(sortedPrediction) {
  console.log(sortedPrediction[0].className);
  switch (sortedPrediction[0].className) {
    case classA:
      goTo = classA;
      myInput.value = webA;
      break;
    case classB:
      goTo = classB;
      myInput.value = webB;
      break;
    case classSubmit:
      goTo = classSubmit;
      break;
    case classHold:
      goTo = classHold;
      break;
  }

  if (goTo !== previousInput) {
    previousInput = goTo;
    if (goTo == classSubmit) {
      setTimeout(function () {
        window.open("https://" + myInput.value, "_blank");
        myInput.value = "";
      }, 2000);
    }
  }
}

async function userInput() {
  myModel = document.getElementById("model").value;
  await load(myModel);

  webA = document.getElementById("websiteA").value;
  webB = document.getElementById("websiteB").value;
}
