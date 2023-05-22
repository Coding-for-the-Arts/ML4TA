//Sketch adapted from Andreas Refsgaard https://editor.p5js.org/AndreasRef/sketches/0txn4mV9A
//Parameterized Chair adapted from http://formandcode.com/code-examples/parameterize-chair

let ctx;
let chairSeatHeight;
let chairWidth;
let chairDepth;
let chairBackHeight;
let chairFrameThickness;

let chairSeatHeightLerped = 0;
let chairWidthLerped = 0;
let chairDepthLerped = 0;
let chairBackHeightLerped = 0;
let chairFrameThicknessLerped = 0;
let lerpFactor = 0.15;

//sketch for drawing the pose
const s1 = function (sketch) {
  sketch.setup = async function () {
    let canvas1 = sketch.createCanvas(640, 520);
    canvas1.position(0, 0);
    ctx = canvas1.elt.getContext("2d");
    await load();
    await loadWebcam();
  };

  window.myPose = async function (sortedPrediction) {
    
    if (sortedPrediction[0].className == "Pose A") {
      chairVal = 10;
      chairThick = 20;
      lerpFactor = 0.2;

    } else if (sortedPrediction[0].className == "Pose B") {
      chairVal = 80;
      chairThick = 10;
      lerpFactor = 0.1;

    } else if (sortedPrediction[0].className == "Pose C") {
      chairVal = 145;
      chairThick = 50;
      lerpFactor = 0.05;

    }

    chairSeatHeightLerped = sketch.lerp(chairSeatHeightLerped, chairVal, lerpFactor);
    chairSeatHeight.value(chairSeatHeightLerped);

    chairWidthLerped =  sketch.lerp(chairWidthLerped, chairVal, lerpFactor);
    chairWidth.value(chairWidthLerped);

    chairDepthLerped =  sketch.lerp(chairDepthLerped, chairVal, lerpFactor);
    chairDepth.value(chairDepthLerped);

    chairBackHeightLerped =  sketch.lerp(chairBackHeightLerped, chairVal, lerpFactor);
    chairBackHeight.value(chairBackHeightLerped);

    chairFrameThicknessLerped =  sketch.lerp(
      chairFrameThicknessLerped,
      chairThick,
      lerpFactor
    );
    chairFrameThickness.value(chairFrameThicknessLerped);
  };
};


//sketch for drawing the chair
const s2 = function (sketch) {
  sketch.setup = function () {
    let canvas2 = sketch.createCanvas(640, 520, sketch.WEBGL);
    canvas2.position(640, 0);

    chairSeatHeight = sketch.createSlider(0, 145, 100).position(650, 10);
    chairWidth = sketch.createSlider(0, 145, 100).position(650, 30);
    chairDepth = sketch.createSlider(0, 145, 100).position(650, 50);
    chairBackHeight = sketch.createSlider(0, 145, 100).position(650, 70);
    chairFrameThickness = sketch.createSlider(0, 50, 5).position(650, 90);

    let txt = sketch.createDiv("Benenne deine Posen wie folgt:<br> 'Pose A', 'Pose B','Pose C'");
    txt.style('color', 'blue')
    txt.position(650, 110)
    
  };

  sketch.draw = function () {
    sketch.background(0);
    sketch.ortho();
    sketch.push();
    sketch.noStroke()
    sketch.fill(250);
    sketch.translate(-100, -50, 0);
    sketch.rotateX(-sketch.PI / 9);
    sketch.rotateY(sketch.PI / 8);
    sketch.plane(400,400)

    sketch.translate(230,1, 182);
    sketch.rotateY(30);
    sketch.plane(370,400)
    sketch.pop();

    sketch.push();
    sketch.noStroke()
    sketch.fill(250);
    sketch.translate(-100, -50, 0);
    sketch.rotateX(-sketch.PI / 9);
    sketch.rotateY(sketch.PI / 8);
    sketch.translate(3, 177, 240);
    sketch.rotateX(sketch.PI/1.87);
    sketch.plane(400,500)
    sketch.pop();


    //Draw the chair
    sketch.push();
    sketch.fill(0);
    sketch.strokeWeight(3);
    sketch.stroke(255);
    sketch.translate(-55, -180, 100);
    sketch.rotateX(-sketch.PI / 9);
    sketch.rotateY(sketch.PI / 8);
    sketch.drawChair();
    sketch.pop();
  };

  sketch.drawChair = function () {
    // Draw back of chair
    
    sketch.push();
    sketch.translate(chairWidth.value() / 2, chairBackHeight.value() / 2);
    sketch.box(
      chairWidth.value(),
      chairBackHeight.value(),
      chairFrameThickness.value()
    );
    sketch.pop();

    // Draw seat of chair
    sketch.push();
    sketch.translate(
      chairWidth.value() / 2,
      chairBackHeight.value() + chairFrameThickness.value() / 2,
      chairDepth.value() / 2 - chairFrameThickness.value() / 2
    );
    sketch.box(
      chairWidth.value(),
      chairFrameThickness.value(),
      chairDepth.value()
    );
    sketch.pop();

    // Draw legs of chair
    sketch.push();
    sketch.translate(
      chairFrameThickness.value() / 2,
      chairBackHeight.value() +
        chairSeatHeight.value() / 2 +
        chairFrameThickness.value(),
      0
    );
    sketch.box(
      chairFrameThickness.value(),
      chairSeatHeight.value(),
      chairFrameThickness.value()
    );
    sketch.pop();

    sketch.push();
    sketch.translate(
      chairWidth.value() - chairFrameThickness.value() / 2,
      chairBackHeight.value() +
        chairSeatHeight.value() / 2 +
        chairFrameThickness.value(),
      0
    );
    sketch.box(
      chairFrameThickness.value(),
      chairSeatHeight.value(),
      chairFrameThickness.value()
    );
    sketch.pop();

    sketch.push();
    sketch.translate(
      chairWidth.value() - chairFrameThickness.value() / 2,
      chairBackHeight.value() +
        chairSeatHeight.value() / 2 +
        chairFrameThickness.value(),
      chairDepth.value() - chairFrameThickness.value()
    );
    sketch.box(
      chairFrameThickness.value(),
      chairSeatHeight.value(),
      chairFrameThickness.value()
    );
    sketch.pop();

    sketch.push();
    sketch.translate(
      chairFrameThickness.value() / 2,
      chairBackHeight.value() +
        chairSeatHeight.value() / 2 +
        chairFrameThickness.value(),
      chairDepth.value() - chairFrameThickness.value()
    );
    sketch.box(
      chairFrameThickness.value(),
      chairSeatHeight.value(),
      chairFrameThickness.value()
    );
    sketch.pop();
  };
};

new p5(s1);
new p5(s2);

