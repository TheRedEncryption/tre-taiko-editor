function startGame() {
    myGameArea.start();
    /* console.log("start"); */
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

function EditorButton(x, y, value, image, scale){ //button constructor!! yippee!!
  myGameArea.context.drawImage(gamebutton, 0, 0, 288, 216, x, y, 288 * scale, 216 * scale);
  var logo = new Image();
  logo.src = image;
  console.log(logo);
  logo.onload = function(){myGameArea.context.drawImage(logo, 0, 0, logo.width, logo.height, x + (144 * scale) - (logo.width * scale / 2), y + (90 * scale) - (logo.height * scale / 2), logo.width * scale, logo.height * scale)}
}

function createButtons(){
  var numButtons = 5;
  var ebScale = window.innerWidth * 0.9 / 288 / numButtons
  var ebSize = 288 * ebScale
  var ebSpacing = window.innerWidth * 0.1 / (numButtons + 1)
  const valueNames = ["empty", "small_do", "small_ka", "big_do", "big_ka"];
  const valueLocs = ["./assets/drums/empty.png", "./assets/drums/small_do.png", "./assets/drums/small_ka.png", "./assets/drums/big_do.png", "./assets/drums/big_ka.png", "./assets/drums/big_ka.png"];
  for (let i = 0; i < valueNames.length; i++){
    EditorButton((i + 1) * ebSpacing + i * ebSize, window.innerHeight * 0.5, valueNames[i], valueLocs[i], ebScale)
  }
}

async function make_base()
{
  // var bg_image = new Image();
  // bg_image.src = './assets/background/tiledbg.jpg';
  // bg_image.onload = function(){
  //   myGameArea.context.drawImage(bg_image,0,0,2000,2000,0,0,window.innerWidth,window.innerWidth);
  // }
  
  var play_area = new Image();
  play_area.src = './assets/background/playarea.png';
  play_area.onload = function(){
    myGameArea.context.drawImage(play_area,0,0,1,300,0,(window.innerHeight / 2) - 150,window.innerWidth,300);
  }

  //var gamebutton = new Image();
  //gamebutton.src = './assets/buttons/button_nb.png';
  
}

var Taiko = new FontFace('Taiko', 'url(./assets/font/TnT.ttf)');

Taiko.load().then(function(font){

  // with canvas, if this is ommited won't work
  document.fonts.add(font);
  console.log('Font loaded');

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
  label("BPM: ", window.innerHeight * 0.05, window.innerHeight * 0.25, "30")
}

make_base();
startGame();

interval = setInterval(() => {
  draw_words();
  //console.log("words");
  clearInterval(interval);
}, 500);