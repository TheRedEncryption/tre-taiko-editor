// GLOBAL VARIABLE DECLARATIONS
const valueNames = ["empty", "small_do", "small_ka", "big_do", "big_ka"];
const valueLocs = ["./assets/drums/empty.png", "./assets/drums/small_do.png", "./assets/drums/small_ka.png", "./assets/drums/big_do.png", "./assets/drums/big_ka.png", "./assets/drums/big_ka.png"];

var buttons = [];
var nodes = [];
var arrows = [];

var Taiko = new FontFace('Taiko', 'url(./assets/font/TnT.ttf)');

var beatlist = ["0000000000000000"];
var currentMeasure = 0;
var measureData = beatlist[currentMeasure]
var currentButton = "empty";
var currentNode;

var numButtons = valueNames.length; /* change this if you want to add more buttons!!! */

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}

var bpmTextbox;
var bpm = 100;

var songInput;
var audio;
var songTitle = "Upload Song:";
var currentlyPlaying = false;
var audioRequest;

var playbackStartingPos;
var playbackEndingPos; /* used for visually stopping the playhead */
var playbackTrueEnding; /* used for calculating how fast the playhead should go */
var playbackRequest; /* requestAnimationFrame id to use for cancelAnimationFrame */
var playheadX = 0;

Taiko.load().then(function(font){ /* not technically a variable, but c'mon, man! */
  document.fonts.add(font);
  //console.log('Font loaded');
  refresh();
});

var nodeScale = 0.01 * (window.innerWidth * 0.9) / 28;

var mediaButton;

//GLOBAL IMAGES

var playButton = new Image(); /* play audio */
playButton.src = './assets/buttons/play_nb.png';

var stopButton = new Image(); /* sotp audio */
stopButton.src = './assets/buttons/stop_nb.png';

var playhead = new Image();
playhead.src = './assets/background/playhead_nb.png'

var play_area = new Image();
play_area.src = './assets/background/playarea.png';

var gamebutton = new Image(); /* game button */
gamebutton.src = './assets/buttons/button_nb.png';

var pressedbutton = new Image(); /* game button, pressed */
pressedbutton.src = './assets/buttons/button_pressed_nb.png';

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

var backButton = new Image(); /* back button */
backButton.src = './assets/buttons/arrow_back_nb.png';

var backButtonGray = new Image(); /* (unpressable) back button */
backButtonGray.src = './assets/buttons/arrow_back_blocked_nb.png';

var forwardButton = new Image(); /* forward button */
forwardButton.src = './assets/buttons/arrow_forward_nb.png';

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
  constructor(x, y, value, image, scale, buttonImage, depressed) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.image = image;
    this.scale = scale;
    this.width = 288 * scale;
    this.height = 216 * scale;
    myGameArea.context.drawImage(buttonImage, 0, 0, 288, 216, x, y, 288 * scale, 216 * scale);
    var logo = imgDict[image];
    this.depression = depressed * (logo.width * scale / 5);
    myGameArea.context.drawImage(logo, 0, 0, logo.width, logo.height, x + (144 * scale) - (logo.width * scale / 2), y + (90 * scale) - (logo.height * scale / 2) + this.depression, logo.width * scale, logo.height * scale); 
  }
}

class Node {
  constructor(x, y, source) {
    this.x = x;
    this.y = y;
    var nodeImage = imgDict[source];
    this.image = nodeImage;
    var thiswidth = nodeImage.width * nodeScale;
    var thisheight = nodeImage.height * nodeScale;
    myGameArea.context.drawImage(nodeImage, 0, 0, nodeImage.width, nodeImage.height, x - thiswidth / 2, y - thisheight / 2, thiswidth, thisheight);
  }
}

class Arrow {
  constructor(x, y, image, increment){
    this.x = x;
    this.y = y;
    this.image = image;
    this.increment = increment;
    this.thiswidth = image.width * nodeScale * 2;
    this.thisheight = image.height * nodeScale * 2;
    myGameArea.context.drawImage(image, 0, 0, image.width, image.height, x - this.thiswidth / 2, y - this.thisheight / 2, this.thiswidth, this.thisheight);
  }
}

class MediaButton {
  constructor(x, y, scale, isPlaying){
    this.x = x;
    this.y = y;
    if(isPlaying){
      this.image = stopButton;
    }
    else{
      this.image = playButton;
    }
    this.trueX = this.x - this.image.width / 2 * scale;
    this.trueY = this.y - this.image.height / 2 * scale;
    this.w = this.image.width * scale;
    this.h = this.image.height * scale;
    myGameArea.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.trueX, this.trueY, this.image.width * scale, this.image.height * scale);
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
  var ebScale = window.innerWidth * 0.9 / 288 / numButtons
  var ebSize = 288 * ebScale
  var ebSpacing = window.innerWidth * 0.1 / (numButtons + 1)
  for (let i = 0; i < valueNames.length; i++){
    // console.log(valueNames[i], currentButton, valueNames[i] == currentButton);
    if(valueNames[i] == currentButton){
      buttons[i] = new EditorButton((i + 1) * ebSpacing + i * ebSize, window.innerHeight * 0.5, valueNames[i], valueNames[i], ebScale, pressedbutton, 1);
    }
    else{
      buttons[i] = new EditorButton((i + 1) * ebSpacing + i * ebSize, window.innerHeight * 0.5, valueNames[i], valueNames[i], ebScale, gamebutton, 0);
    }
  }
  if(currentMeasure !== 0){
    arrows[0] = new Arrow(window.innerWidth * 0.03, (window.innerHeight * 0.39), backButton, -1);
  }
  else{
    arrows[0] = new Arrow(window.innerWidth * 0.03, (window.innerHeight * 0.39), backButtonGray, -1);
  }
  arrows[1] = new Arrow(window.innerWidth * 0.97, (window.innerHeight * 0.39), forwardButton, 1);
  mediaButton = new MediaButton(window.innerWidth * 0.95, window.innerHeight * 0.1, (window.innerWidth * 0.0005), currentlyPlaying);
}

function isInside(mx, my, x1, y1, x2, y2){
    return (x1 < mx) && (mx < x2) && (y1 < my) && (my < y2);
}

async function make_base()
{  
  myGameArea.context.drawImage(play_area,0,0,1,143,0,(window.innerHeight / 3.5),window.innerWidth,window.innerHeight * (143/695));
  drawNodes();
}

function drawNodes(){
  var loc = "";
  for (let i = 0; i < 16; i++){
    loc = valueNames[measureData[i]]
    //console.log(loc);
    nodes[i] = new Node((i * ((window.innerWidth * 0.9) / 16)) + (window.innerWidth * 0.078), (window.innerHeight * 0.39), loc); //"./assets/background/playarea_node.png")
  }
  playbackStartingPos = nodes[0].x;
  playbackEndingPos = nodes[15].x;
  playbackTrueEnding = nodes[15].x + (window.innerWidth * 0.055)
}

function label(text, x, y, size, align = "left"){
  myGameArea.context.textAlign = align;
  myGameArea.context.miterLimit = 2;
  myGameArea.context.font = (size * (window.innerHeight * window.innerWidth) / 1000000) + "px Taiko";
  myGameArea.context.fillStyle = "black";
  myGameArea.context.lineWidth = 7;
  myGameArea.context.strokeText(text, x, y);
  myGameArea.context.fillStyle = "white";
  myGameArea.context.fillText(text, x, y);
}

function draw_words(){
  label("Taiko Editor (太鼓のエディター)", window.innerHeight * 0.05, window.innerHeight * 0.12, "60");
  label("By TheRedEncryption", window.innerHeight * 0.05, window.innerHeight * 0.185, "30");
  label("Measure: " + (currentMeasure + 1) + " of " + (beatlist.length), window.innerHeight * 0.35, window.innerHeight * 0.25, "30")
  label("BPM: ", window.innerHeight * 0.05, window.innerHeight * 0.25, "30");
  label(songTitle, window.innerWidth * 0.91, window.innerHeight * 0.245, "20", "right")
}

startGame();

document.addEventListener("mousedown", (e)=>{
  //console.log(e.x, e.y);
  handleArrowClick(e.x, e.y);
  currentButton = handleButtonClick(e.x, e.y);
  currentNode = handleNodeClick(e.x, e.y);
  handleMediaClick(e.x, e.y);
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

function handleArrowClick(x, y){
  for (let i = 0; i < arrows.length; i++) {
    //console.log(arrows[i]);
    if(isInside(x, y, arrows[i].x - arrows[i].thiswidth / 2, arrows[i].y - arrows[i].thisheight / 2, arrows[i].x + arrows[i].thiswidth / 2, arrows[i].y + arrows[i].thisheight / 2)){
      //console.log(arrows[i].increment);
      scrollMeasureBy(arrows[i].increment);
    }
  }
  //return 0;
  //console.log("baller");
}

function handleMediaClick(x, y){
  if(!audio){
    return;
  }
  if(isInside(x,y, mediaButton.trueX, mediaButton.trueY, mediaButton.trueX + mediaButton.w, mediaButton.trueY + mediaButton.h)){
    currentlyPlaying = !currentlyPlaying;
    if(!currentlyPlaying){
      stopAudio();
    }
    else{
      play();
    }
  }
  refresh();
}

function play() {
  audio.currentTime = calculateStart();
  audio.play();
  audioRequest = setTimeout(stopAudio, 1000 * (240 / bpm));
  playheadX = 0;
  playbackRequest = requestAnimationFrame(animatePlayback);
}

function stopAudio(){
  audio.pause();
  clearTimeout(audioRequest);
  cancelAnimationFrame(playbackRequest);
  currentlyPlaying = false;
  refresh();
}

function animatePlayback() {
  refresh();
  scale = window.innerWidth * 0.001;
  myGameArea.context.drawImage(playhead, 0, 0, playhead.width, playhead.height, playbackStartingPos + playheadX - playhead.width / 2 * scale, (window.innerHeight * 0.39) - playhead.height / 2 * scale, playhead.width * scale, playhead.height * scale);
  playheadX += (playbackTrueEnding - playbackStartingPos)/((240/bpm)*60);
  playbackRequest = requestAnimationFrame(animatePlayback);
}

function scrollMeasureBy(move){
  if(move != -1 || currentMeasure != 0){ /* i have literally no clue how this logic even works so please forgive me DeMorgan */
    //console.log("this is so suspicious heehee");
    currentMeasure += move;
  }
  if(currentMeasure == beatlist.length){
    addBlankMeasure();
  }
  if (move == -1) {
    if(!(beatlist.length == 1)){
      //console.log(move);
      removeBlankMeasure();
    }
  }
  //console.log(currentMeasure);
  //console.log(beatlist);
}

function addBlankMeasure(){
  beatlist[beatlist.length] = "0000000000000000";
}

function removeBlankMeasure(){
  if(beatlist[beatlist.length - 1] == "0000000000000000") {
    //console.log("pop");
    beatlist.pop();
  }
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
  var input = [];
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

addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("export").addEventListener("click",compileData);
  bpmTextbox = document.getElementById("bpm");
  bpmTextbox.addEventListener("change",sanitizeBpm);
  songInput = document.getElementById("song_file");
  songInput.addEventListener("change",getSong);
});

function sanitizeBpm(){
  if(!bpmTextbox.valueAsNumber){
    bpmTextbox.value = "100";
  }
  if(bpmTextbox.valueAsNumber < 1){
    bpmTextbox.value = "1"
  }
  if(bpmTextbox.valueAsNumber > 999){
    bpmTextbox.value = "999"
  }
  bpm = bpmTextbox.valueAsNumber;
}

function getSong(){
  songTitle = songInput.files[0]["name"];
  if(songTitle.length > 20){
    songTitle = songTitle.substring(0,20) + "...";
  }
  var file = URL.createObjectURL(songInput.files[0]);
  audio = new Audio(file);
  //audio.play(); /* <------- there's a funny thing called audio.currentTime that accepts doubles!!!*/
  refresh();
}

function calculateStart(){
  if(audio){
    amount = currentMeasure * (240/bpm);
    audio.currentTime = amount;
    return amount;
  }
}

function compileData(){
  var output = ["BPM:" + bpm + "\n","#START\n"];
  var offset = output.length;
  for(let i = 0; i < beatlist.length; i++){
    output[i + offset] = beatlist[i] + ",\n";
  }
  output[output.length] = "#END";
  //return output;
  blob = new Blob(output, {type: ".tja"});
  link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "output.tja");
  document.body.appendChild(link);
  link.click();
  link.remove();
}