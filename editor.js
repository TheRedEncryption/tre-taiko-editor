const valueNames = ["empty", "small_do", "small_ka", "big_do", "big_ka"];
const valueLocs = ["./assets/drums/empty.png", "./assets/drums/small_do.png", "./assets/drums/small_ka.png", "./assets/drums/big_do.png", "./assets/drums/big_ka.png", "./assets/drums/big_ka.png"];

var buttons = []
var nodes = [];

var Taiko = new FontFace('Taiko', 'url(./assets/font/TnT.ttf)');

function startGame() {
  myGameArea.start();
  make_base();
  //interval = setInterval("refresh()", 0);
}

function refresh(){
  clear();
  myGameArea.canvas.width = window.innerWidth;
  myGameArea.canvas.height = window.innerHeight;
  make_base();
  draw_words();
  createButtons();
}

function clear() {
  myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}



var gamebutton = new Image();
gamebutton.src = './assets/buttons/button_nb.png';
gamebutton.onload = function(){createButtons()}

class EditorButton {
  constructor(x, y, value, image, scale) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.image = image;
    this.scale = scale;
    this.width = 288 * scale;
    this.height = 216 * scale;
    myGameArea.context.drawImage(gamebutton, 0, 0, 288, 216, x, y, 288 * scale, 216 * scale);
    var logo = new Image();
    logo.src = image;
    console.log(logo);
    logo.onload = function () { myGameArea.context.drawImage(logo, 0, 0, logo.width, logo.height, x + (144 * scale) - (logo.width * scale / 2), y + (90 * scale) - (logo.height * scale / 2), logo.width * scale, logo.height * scale); };
  }
}

class Node {
  constructor(x, y, source) {
    this.x = x;
    this.y = y;
    this.source = source;
    var nodeImage = new Image();
    nodeImage.src = source;
    console.log(source);
    

    nodeImage.onload = function(){
      var thiswidth = (nodeImage.width/100) * (window.innerWidth * 0.9) / 28;
      var thisheight = (nodeImage.height/100) * (window.innerWidth * 0.9) / 28;
      myGameArea.context.drawImage(nodeImage, 0, 0, nodeImage.width, nodeImage.height, x - thiswidth / 2, y - thisheight / 2, thiswidth, thisheight);
    }
  }
}

function createButtons(){
  var numButtons = 8;
  var ebScale = window.innerWidth * 0.9 / 288 / numButtons
  var ebSize = 288 * ebScale
  var ebSpacing = window.innerWidth * 0.1 / (numButtons + 1)
  for (let i = 0; i < valueNames.length; i++){
    buttons[i] = new EditorButton((i + 1) * ebSpacing + i * ebSize, window.innerHeight * 0.5, valueNames[i], valueLocs[i], ebScale)
  }
}

function isInside(mx, my, x1, y1, x2, y2){
    // console.log((x1 < mx) , (mx < x2) , (y1 < my) , (my < y2));
    return (x1 < mx) && (mx < x2) && (y1 < my) && (my < y2);
}



async function make_base()
{  
  var play_area = new Image();
  play_area.src = './assets/background/playarea.png';
  play_area.onload = function(){
    myGameArea.context.drawImage(play_area,0,0,1,300,0,(window.innerHeight / 2) - 150,window.innerWidth,300);
    for (let i = 0; i < 16; i++){
      nodes[i] = new Node((i * ((window.innerWidth * 0.9) / 16)) + (window.innerWidth * 0.07), (window.innerHeight * 0.39), "./assets/drums/big_ka.png"); //"./assets/background/playarea_node.png")
      console.log(i);
    }
  }
}

 


Taiko.load().then(function(font){

  // with canvas, if this is ommited won't work
  document.fonts.add(font);
  console.log('Font loaded');
  draw_words();
});

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

var currentButton = "empty";

document.addEventListener("mousedown", (e)=>{
  //console.log(e.x, e.y);
  currentButton = handleButtonClick(e.x, e.y);
  console.log(currentButton);
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