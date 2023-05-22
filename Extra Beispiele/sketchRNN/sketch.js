// The SketchRNN model
let model;
// Start by drawing
let previous_pen = 'down';
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;
var drawing = models[Math.floor(Math.random() * models.length)];

var buttons = ["b1", "b2", "b3", "b4", "b5"]
var drawingArray = []
var totalScore = 0;
let clicked = false;
let img;

function preload() {
    img = loadImage('roll.gif');
}


function setup() {
    cvs = createCanvas(800, 800);
    cvs.parent("cvs")
    background(255);
    noStroke();
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Gill Sans');
    textSize(32);
    text("Errate die Skizze!", width / 2, height / 2)
    text("Drücke S zum Starten", width / 2, height / 2 + 100)

    for (let i = 0; i < buttons.length; i++) {
        buttons[i] = select('#' + buttons[i].toString()).position(50 + 150 * i,100 );
    }
}


function keyPressed() {
    if (key == "s" || key == "S") {
        if (!clicked) {
            totalScore = 0;
            select('#status').html('Model wird geladen...');
            drawing = models[Math.floor(Math.random() * models.length)];
            model = ml5.SketchRNN(drawing, modelReady);
            clicked = true;
        }
    }
}



// Reset the drawing
function startDrawing() {
    resetButtons()
    background(255);
    fill(0)
    strokeWeight(0);

    text("Total Score", width - 200, 20)
    text(totalScore, width - 50, 20)

    x = width / 2;
    y = height / 2;

    model.generate(gotStroke);

}

function resetButtons() {
    drawingArray = []

    for (let i = 0; i < buttons.length; i++) {
        drawingArray.push(models[Math.floor(Math.random() * models.length)])
    }

    drawingArray.splice(Math.floor(Math.random() * drawingArray.length), 1, drawing)

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].html(drawingArray[i].toString())
        buttons[i].mousePressed(function () {
            if (buttons[i].html() == drawing) {
                drawing = models[Math.floor(Math.random() * models.length)];
                model = ml5.SketchRNN(drawing, modelReady);
                totalScore += 10;
            } else {
                clicked = false;
                strokeWeight(0);
                text("Game Over", width / 2, height / 2 - 100)
                text("Drücke S zum Starten", width / 2, height / 2)
                fill(52, 122, 72)
                text(`Die Antwort war: ${drawing}`, width / 2, height / 2 + 200)
            }
        });
    }
}

function draw() {
    // If something new to draw
    if (strokePath) {

        // If the pen is down, draw a line
        if (previous_pen == 'down') {
            stroke(0);
            strokeWeight(3.0);
            line(x, y, x + strokePath.dx, y + strokePath.dy);
        }
        // Move the pen
        x += strokePath.dx;
        y += strokePath.dy;
        // The pen state actually refers to the next stroke
        previous_pen = strokePath.pen;

        // If the drawing is complete
        if (strokePath.pen !== 'end') {
            strokePath = null;
            model.generate(gotStroke);
        }

    }

    if (totalScore == 100) {
        clear();
        image(img, width / 2, height / 2);
        strokeWeight(0)
        text("YOU WON!", width / 2, height / 2)
        text("Drücke S zum Neustart", width / 2, height / 2 + 100)
        clicked = false;
    }

}

// A new stroke path
function gotStroke(err, s) {
    strokePath = s;
}

// The model is ready
function modelReady() {
    select('#status').html('Model geladen!');
    startDrawing();
}