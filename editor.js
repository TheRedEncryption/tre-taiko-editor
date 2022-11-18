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

  var gamebutton = new Image();
  gamebutton.src = './assets/buttons/button_nb.png';
  gamebutton.onload = function(){
    myGameArea.context.drawImage(gamebutton,5,window.innerHeight / 2);
  }
}

var myFont = new FontFace('myFont', 'url(./assets/font/TnT.ttf)');

myFont.load().then(function(font){

  // with canvas, if this is ommited won't work
  document.fonts.add(font);
  console.log('Font loaded');

});

function label(text, x, y, size){
  myGameArea.context.font = size + "px myFont";
  myGameArea.context.fillStyle = "black";
  myGameArea.context.lineWidth = 10;
  myGameArea.context.strokeText(text, x, y);
  myGameArea.context.fillStyle = "white";
  myGameArea.context.fillText(text, x, y);
}

function draw_words(){
  label("Taiko Editor", 60, 100, "60");
  
}

make_base();
startGame();

interval = setInterval(() => {
  draw_words();
  console.log("words");
  clearInterval(interval);
}, 500);