let handResults;
let webcam;
const videoElement = document.getElementById(`webcam`);
const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({
        image: videoElement,
      });
    },
    width: 1280,
    height: 720,
  });


const hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
});

let avgX = 0;
let avgY = 0;
function setup() {
  createCanvas(1280, 720);

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  
  hands.onResults(onResults);
  camera.start();
  webcam = select(`#webcam`);

  pg = createGraphics(1280, 720);
}

function onResults(results) {
  handResults = results;
}

function draw() {
 
  background(0);
 // image(webcam, 0, 0, webcam.width, webcam.height);
  fill(255, 0, 0);
  stroke(255, 0, 0);  

  displayHands(handResults);

  pg.background(0,20)
  image(pg, 0, 0, webcam.width, webcam.height);
}

function displayHands(results) {
  if(!results) return;
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      for (let i = 0; i < landmarks.length; i++) {
        fill(255);
        text(`x: ${(landmarks[i].x).toFixed(2)}`, landmarks[i].x * width + 10, landmarks[i].y * height)
        text(`y: ${(landmarks[i].y).toFixed(2)}`, landmarks[i].x * width + 10, landmarks[i].y * height + 10)
        avgX+=landmarks[i].x * width
        avgY+=landmarks[i].y * height

        pg.noStroke()
        pg.ellipse(landmarks[i].x * width, landmarks[i].y * height, 30)

      }
      avgX = avgX/21;
      avgY = avgY/21;
      //ellipse(avgX, avgY, 30)
      push()
      scale(0.5)
       drawConnectors(drawingContext, landmarks, HAND_CONNECTIONS,
        {color: '#00FF00', lineWidth: 5});
        drawLandmarks(drawingContext, landmarks, {color: '#FF0000', lineWidth: 2});
      pop()
    }
  }

 
}


