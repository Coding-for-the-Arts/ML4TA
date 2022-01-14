let classifier;
let label;
let confidence;

const options = {
  probabilityThreshold: 0.95
};


let particleSize = 50;
//Total particles
let particleAmount = 10;
//Distance the line gets drawn
let lineMaxDist = 500;
let particles = [];


function preload() {
  classifier = ml5.soundClassifier('SpeechCommands18w', options, modelReady);

}

function modelReady() {
    // classify sound
    classifier.classify(gotResult);
    label.html('Model Loaded');
  }

function setup() {
  createCanvas(800,800);
  textSize(32)
  for (let i = 0; i < particleAmount; i++) {
    particles.push(new Particle());
  }

  label = createDiv('');
  confidence = createDiv('');
 
}

function draw() {
  background(0);
  randomSeed(11323)
  for (let i = 0; i < particles.length; i++) {
        particles[i].move();
        particles[i].connect();
        particles[i].display();
      
  }
}

function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  // Show the first label and confidence
  label.html('Label: ' + results[0].label);

  if (results[0].label == 'left') {
    for (let i = 0; i < particles.length; i++) {
     particles[i].direction = createVector(-1,0)
    }
  } else if (results[0].label == 'right') {
    for (let i = 0; i < particles.length; i++) {
        particles[i].direction = createVector(1,0)
    }
  } else if (results[0].label == 'up') {
    for (let i = 0; i < particles.length; i++) {
        particles[i].direction = createVector(0,-1)
    }
  } else if (results[0].label == 'down') {
    for (let i = 0; i < particles.length; i++) {
        particles[i].direction = createVector(0,1)
    }
  }  else if (results[0].label == 'stop') {
    for (let i = 0; i < particles.length; i++) {
      particles[i].direction = createVector(0,0);
    }
  } else if (results[0].label == 'go') {
    for (let i = 0; i < particles.length; i++) {
      particles[i].direction = createVector(Math.random() * 0.7, Math.random() * 0.7);
    }

 }  else if (results[0].label == 'one') {
    spliceParticles(1)
  } else if (results[0].label == 'two') {
    spliceParticles(2)
  }else if (results[0].label == 'three') {
    spliceParticles(3)
  }else if (results[0].label == 'four') {
    spliceParticles(4)
  }else if (results[0].label == 'five') {
    spliceParticles(5)
  }else if (results[0].label == 'six') {
    spliceParticles(6)
  }else if (results[0].label == 'seven') {
    spliceParticles(7)
  }else if (results[0].label == 'eight') {
    spliceParticles(8)
  } else if (results[0].label == 'nine') {
    spliceParticles(9)
  }
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}

function spliceParticles(n){
    for (let i = 0; i < particles.length; i++) {
        if (particles.length > n){
            particles.splice(0, particles.length - n);
         }
         else {
            particles.unshift(new Particle());
         }
    }
}
