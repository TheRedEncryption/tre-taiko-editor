// GLOBAL VARIABLE DECLARATIONS
const valueNames = ["empty", "small_do", "small_ka", "big_do", "big_ka"];
const valueLocs = ["./assets/drums/empty.png", "./assets/drums/small_do.png", "./assets/drums/small_ka.png", "./assets/drums/big_do.png", "./assets/drums/big_ka.png", "./assets/drums/big_ka.png"];

var buttons = [];
var nodes = [];

var Taiko = new FontFace('Taiko', 'url(./assets/font/TnT.ttf)');

var beatlist = ["0000000000000000"];
var currentMeasure = 0;
var measureData = beatlist[currentMeasure]
var currentButton = "empty";
var currentNode;

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}

Taiko.load().then(function(font){ /* not technically a variable, but c'mon, man! */
  document.fonts.add(font);
  //console.log('Font loaded');
  refresh();
});

var nodeScale = 0.01 * (window.innerWidth * 0.9) / 28;

//GLOBAL IMAGES

var play_area = new Image();
play_area.src = './assets/background/playarea.png';

var gamebutton = new Image(); /* game button */
gamebutton.src = './assets/buttons/button_nb.png';

var empty = new Image(); /* gray drum image */
empty.src = './assets/drums/empty.png';

var small_do = new Image(); /* smol red */
small_do.src = './assets/drums/small_do.png';

var small_ka = new Image(); /* smol blu */
small_ka.src = './assets/drums/small_ka.png';

var big_do = new Image(); /* beeg red */
big_do.src = './assets/drums/big_do.png';

var big_ka = new Image(); /* beeg blu */
big_ka.src = './assets/drums/big_ka.png';

var imgDict = {
  // KEY : VALUE
  // "empty" : empty (the key, "empty", is the id, whereas the value empty is the Image variable)
  "empty" : empty,
  "small_do" : small_do,
  "small_ka" : small_ka,
  "big_do" : big_do,
  "big_ka" : big_ka
};

//CLASS DECLARATIONS

class EditorButton {
  constructor(x, y, value, image, scale, buttonImage) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.image = image;
    this.scale = scale;
    this.width = 288 * scale;
    this.height = 216 * scale;
    myGameArea.context.drawImage(buttonImage, 0, 0, 288, 216, x, y, 288 * scale, 216 * scale);
    var logo = imgDict[image]; //new Image();
    //logo.src = image;
    //logo.onload = function () { 
      myGameArea.context.drawImage(logo, 0, 0, logo.width, logo.height, x + (144 * scale) - (logo.width * scale / 2), y + (90 * scale) - (logo.height * scale / 2), logo.width * scale, logo.height * scale); 
    //};
  }
}

class Node {
  constructor(x, y, source) {
    this.x = x;
    this.y = y;
    //this.source = imgDict[source];
    var nodeImage = imgDict[source];//new Image();
    //nodeImage.src = source;
    this.image = nodeImage;
    //nodeImage.onload = function(){
      var thiswidth = nodeImage.width * nodeScale;
      var thisheight = nodeImage.height * nodeScale;
      myGameArea.context.drawImage(nodeImage, 0, 0, nodeImage.width, nodeImage.height, x - thiswidth / 2, y - thisheight / 2, thiswidth, thisheight);
    //}
  }
}

//EVERYTHING ELSE I GUESS

function startGame() {
  myGameArea.start();
  refresh();
}

function refresh(){
  clear();
  myGameArea.canvas.width = window.innerWidth;
  myGameArea.canvas.height = window.innerHeight;
  measureData = beatlist[currentMeasure]
  nodeScale = 0.01 * (window.innerWidth * 0.9) / 28;
  make_base();
  draw_words();
  createButtons();
}

function clear() {
  myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
}

function createButtons(){
  var numButtons = 8;
  var ebScale = window.innerWidth * 0.9 / 288 / numButtons
  var ebSize = 288 * ebScale
  var ebSpacing = window.innerWidth * 0.1 / (numButtons + 1)
  //var gamebutton = new Image();
  //gamebutton.src = './assets/buttons/button_nb.png';
  //gamebutton.onload = function(){
    for (let i = 0; i < valueNames.length; i++){
      buttons[i] = new EditorButton((i + 1) * ebSpacing + i * ebSize, window.innerHeight * 0.5, valueNames[i], valueNames[i], ebScale, gamebutton)
    }
  //}
}

function isInside(mx, my, x1, y1, x2, y2){
    return (x1 < mx) && (mx < x2) && (y1 < my) && (my < y2);
}

async function make_base()
{  
  // var play_area = new Image();
  // play_area.src = './assets/background/playarea.png';
  //play_area.onload = function(){
    myGameArea.context.drawImage(play_area,0,0,1,300,0,(window.innerHeight / 2) - 150,window.innerWidth,300);
    drawNodes();
  //}
}

function drawNodes(){
  var loc = "";
  for (let i = 0; i < 16; i++){
    loc = valueNames[measureData[i]]
    //console.log(loc);
    nodes[i] = new Node((i * ((window.innerWidth * 0.9) / 16)) + (window.innerWidth * 0.07), (window.innerHeight * 0.39), loc); //"./assets/background/playarea_node.png")
  }
}

function label(text, x, y, size){
  myGameArea.context.font = size + "px Taiko";
  myGameArea.context.fillStyle = "black";
  myGameArea.context.lineWidth = 5;
  myGameArea.context.strokeText(text, x, y);
  myGameArea.context.fillStyle = "white";
  myGameArea.context.fillText(text, x, y);
}

function draw_words(){
  label("Taiko Editor", window.innerHeight * 0.05, window.innerHeight * 0.12, "60");
  label("BY THEREDENCRYPTION", window.innerHeight * 0.05, window.innerHeight * 0.168, "30");
  label("BPM: ", window.innerHeight * 0.05, window.innerHeight * 0.25, "30");
}

startGame();

// interval = setInterval(() => {
//   draw_words();
//   //console.log("words");
//   clearInterval(interval);
// }, 500);

document.addEventListener("mousedown", (e)=>{
  //console.log(e.x, e.y);
  currentButton = handleButtonClick(e.x, e.y);
  currentNode = handleNodeClick(e.x, e.y);
  updateBeatmap();
  refresh();
})

window.addEventListener("resize", (e)=>{
  refresh();
})

function handleButtonClick(x, y){
  for(let i = 0; i < buttons.length; i++){
    if(isInside(x, y, buttons[i].x, buttons[i].y, buttons[i].width + buttons[i].x, buttons[i].height + buttons[i].y)){
      return buttons[i].value;
    }
  }
  return currentButton;
}

function handleNodeClick(x, y){
  for(let i = 0; i < nodes.length; i++){
    var offsetX = nodes[i].image.width * nodeScale / 2;
    var offsetY = nodes[i].image.height * nodeScale / 2;
    if(isInside(x, y, nodes[i].x - offsetX, nodes[i].y - offsetY, nodes[i].image.width * nodeScale + nodes[i].x - offsetX, nodes[i].image.height * nodeScale + nodes[i].y - offsetY)){
      //console.log(i);
      return i;
    }
  }
  return null;
}

function updateBeatmap(){
  if(currentNode !== null){
    var note;
    for(let i = 0; i < valueNames.length; i++){
      //console.log(currentButton);
      if (valueNames[i] ==  currentButton){
        note = i;
        //console.log(currentButton, valueNames[i], note);
      }
    }
    beatlist[currentMeasure] = replaceAt(beatlist[currentMeasure], currentNode, note);
    //console.log(beatlist);
  }
}

function replaceAt(inputString, loc, replacement){
  var input = []
  for (let i = 0; i < inputString.length; i++){
    input[i] = inputString[i];
  }
  input[loc] = replacement;
  var output = "";
  for (let i = 0; i < input.length; i++){
    //console.log(output, input[i]);
    output = output.concat(input[i])
  }
  return output;
}