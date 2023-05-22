// 💥 You can change this (You probably should too)!!! 💥
const URL = "https://teachablemachine.withgoogle.com/models/t4m8pSTmN/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true;
  webcam = new tmImage.Webcam(400, 400, flip);
  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam-container").appendChild(webcam.canvas);

  // Loops through the predictor once every second
  setInterval(loop, 1000);
}

async function loop() {
  webcam.update(); // Update the webcam frame
  await predict(); // Make prediction
}

// Run the webcam image through the image model
async function predict() {
  // Predict takes in webcam footage
  const prediction = await model.predict(webcam.canvas);

  // Sort predictions by probability (descending)
  prediction.sort(function (a, b) {
    return b.probability - a.probability;
  });

  // If the most probable prediction is "Thumbs Up"
  if (prediction[0].className === "Thumbs Up") {
    // Get all post elements
    const postElementNodeList = document.querySelectorAll("article");
    const postElementArray = Array.from(postElementNodeList);

    // Get the most visible post element
    const mostVisiblePostElement = getElementMostVisible(postElementArray);

    // Get the "content" container element from the post element
    const imageElement = mostVisiblePostElement.querySelector("img"); // Get nested image element
    const videoElement = mostVisiblePostElement.querySelector("video"); // Get nested video element

    const likeButtonImage = mostVisiblePostElement.querySelector(
      `svg[aria-label="Gefällt mir"]`
    ); // Get image icon
    
    const btn = document.querySelector('button svg[aria-label="Gefällt mir"]').closest('button');
    console.log(btn)

    // If the post is alread liked (the like button image is gone)
    if (likeButtonImage == null) {
      return;
    }

    if (videoElement !== null) {
      // Handle Videos
      const likeButtonImageContainer = likeButtonImage.parentNode; // The `svg` click events are cancelled for some reason, so we click on it's parent
      likeButtonImageContainer.click();
    } else {
      // Handle Images
      doubleClick(btn);
    }
  }
}

function doubleClick(element) {
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  
  element.dispatchEvent(clickEvent);
  console.log("LIKED!") ;
}

function getElementMostVisible(elements) {
  // Filter out elements that don't have a top or bottom that's visible
  const elementsThatAreVisible = elements.filter(function (element) {
    const bounds = element.getBoundingClientRect();
    return bounds.top > 0 || bounds.bottom > 0;
  });

  // Sort elements by their top (y) position
  elementsThatAreVisible.sort(function (a, b) {
    const boundsA = a.getBoundingClientRect();
    const boundsB = b.getBoundingClientRect();

    return boundsA.top - boundsB.top;
  });

  // Extract out the two elements that are visible
  const [elementA, elementB] = elementsThatAreVisible;

  const windowHeight = window.innerHeight;

  // Determine the percentage of the screen that is occupied
  // by each of the two elements
  const elementAPercentage =
    elementA.getBoundingClientRect().bottom / windowHeight;
  const elementBPercentage =
    (windowHeight - elementB.getBoundingClientRect().top) / windowHeight;

  // Return the most visible element
  if (elementAPercentage > elementBPercentage) {
    //console.log(elementA, "is the most visible element 👓");
    return elementA;
  }

  //console.log(elementB, "is the most visible element 👓");
  return elementB;
}

// Adds webcam element to the document (we need it, even though we're going to hide it)
const webcamContainer = document.createElement("div");
webcamContainer.id = "webcam-container";
webcamContainer.style.display = "none"; // Don't display the webcam on the site
document.body.appendChild(webcamContainer);

// Start predicting
init();
