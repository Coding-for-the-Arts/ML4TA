const URL = "https://teachablemachine.withgoogle.com/models/iyoNKQgsY/";
let model, webcam, labelContainer, maxPredictions;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const requestTimeoutNoRaf = (fn, delay, registerCancel) => {
  const timeoutId = setTimeout(fn, delay);
  registerCancel(() => clearTimeout(timeoutId));
}

async function init(){
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    
    setInterval(loop, 1000);
}

async function loop() {
    webcam.update();
    await predict();
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    prediction.sort(function (a, b) {
      return b.probability - a.probability;
    });

    if (prediction[0].className=="Play" && prediction[0].probability.toFixed(2) == "1.00") {
          console.log("Play or Stop video");
          var e = new KeyboardEvent('keydown',{'keyCode':32,'which':32});
          document.dispatchEvent(e);    
          await sleep(1500);
    } 

}

// Adds webcam element to the document (we need it, even though we're going to hide it)
const webcamContainer = document.createElement("div");
webcamContainer.id = "webcam-container";
webcamContainer.style.display = "none"; // Don't display the webcam on the site
document.body.appendChild(webcamContainer);

init();