let videoElement = document.getElementById("input_video")

const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }});

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({image: videoElement});
    },
    width: 1280,
    height: 720
  });

function setup()  {
	createCanvas(1280,720);
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.1,
        minTrackingConfidence: 0.1
      });
      faceMesh.onResults(onResults);

      camera.start();

      faceMesh.onResults(onResults);

    webcam = select("#input_video")
    frameRate(30)
}

function draw()
{
    background(0);
    image(webcam, 0,0, webcam.width, webcam.height)

}


function onResults(results) {
  if(!results) return;
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        for (let i = 0; i < landmarks.length; i++) {
            fill(255,0,0);
            noStroke();
            //ellipse(landmarks[i].x * width, landmarks[i].x * height, 10);
            var smiling = dist(landmarks[61].x, landmarks[61].y, landmarks[91].x, landmarks[91].y)
            if (smiling > 0.025) {
              heart(landmarks[119].x * width, landmarks[119].y * height, 10)
              heart(landmarks[347].x * width, landmarks[347].y * height, 10)
            }
           }
          push()
          scale(0.5)
         //  drawConnection()
          pop()

      }
    }
    
  }

  function heart(x, y, size) {

    push()
    beginShape();
      translate(x,y)
      scale(map(sin(0.5 *frameCount), -1, 1, 0, 2))
      vertex(0,0);
      bezierVertex(-size/2, -size/2, -size, size/3, 0, size);
      bezierVertex(size, size/3,size/2, -size/2, 0, 0);
    endShape(CLOSE);
    pop()
    
  }
  

  function drawConnections() {
    drawConnectors(drawingContext, landmarks, FACEMESH_TESSELATION,{color: '#C0C0C070', lineWidth: 4});
    drawConnectors(drawingContext, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
    drawConnectors(drawingContext, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
    drawConnectors(drawingContext, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
    drawConnectors(drawingContext, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
    drawConnectors(drawingContext, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
    drawConnectors(drawingContext, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
    drawConnectors(drawingContext, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
    drawConnectors(drawingContext, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
  }