
let classifier;
let video;

let modelURL = "./model/model.json";
let label;
let confidence;

let timer = 15;
let tabOpened = false;

let points = []

function preload(){
    classifier = ml5.imageClassifier(modelURL)
    label = "Das Model laedt..."
}

function setup() 
{
	createCanvas(960,600);
    video = createCapture(VIDEO)
    video.hide();

    textSize(32)
    textAlign(CENTER, CENTER)
    fill(255)

    classifyVideo();
}

function draw()
{
 background(0)
 image(video, 0, 0, 960, 540);
 text(label, width/2, height-64)
 text(confidence, width/2, height - 32)


 if (label == "Tasse"){
     kurzePause();

 }else if (label == "Spaceshuttle"){
     streamTab();

 }else if (label == "Marker"){
      zeichne();
 }else {
    tabOpened = false;
    clearPoints();
    timer = 15;
 }

}

function classifyVideo(){
    classifier.classify(video, gotResult)
}

function gotResult(error, result){

    if(error){
        console.error(error);
        return;
    }

    classifyVideo();
    label = result[0].label;
    confidence = nf(result[0].confidence * 100, 0, 2) + "%";

}

function kurzePause() {
    tabOpened = false;
    clearPoints();
    text(timer, width/2, height/2);
    tint(255, 50);
    if (frameCount % 30 == 0 && timer > 0){
        timer--
    }

    if (timer==0){
        timer = ""
        text("PAUSE IST VORBEI", width/2, height/2)
        tint(255, 255);
    }

}

function streamTab(){
    clearPoints();
    timer = 15;
    if(!tabOpened){
        window.open("https://www.youtube.com/watch?v=21X5lGlDOfg")
    }

    tabOpened = true;
}

function zeichne(){
    tabOpened = false;
    timer = 15;
    background(0, 0);
    stroke(10)
    strokeWeight(10)

    beginShape(LINES);

    for (let i in points){
        var singlePoint = points[i];
        curveVertex(singlePoint.x, singlePoint.y);
    }

    endShape();

}

function clearPoints(){

    while(points.length > 0){
        points.pop();
    }

    noStroke();
}

function mouseDragged(){
    var singlePoint = {};
    singlePoint.x = mouseX;
    singlePoint.y = mouseY;

    points.push(singlePoint);
}