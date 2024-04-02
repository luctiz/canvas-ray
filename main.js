import Player from './modules/nodes/player.js';
import { Map, grid_size } from './modules/nodes/map.js';
import {World} from './modules/nodes/world.js';
import { adjustDirection } from './modules/common.js';

const matrixMap = [
  [1, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1],
];


export var direction = 50; //grados

document.getElementById("colorPared").addEventListener("input", onColorParedChange)
export var colorPared = '#ff0000';
function onColorParedChange(e){
  colorPared = e.target.value;
}

document.getElementById("colorRayo").addEventListener("input", onColorRayoChange)
export var colorRayo = '#ffffffff';
function onColorRayoChange(e){
  colorRayo = e.target.value;
}

document.getElementById("colorFondo").addEventListener("input", onColorFondoChange)
export var colorFondo = '#000000';
function onColorFondoChange(e){
  colorFondo = e.target.value;
}


document.getElementById("AmplitudSlider").addEventListener("input", onAmplitudSliderChange)
export var amplitud_luz = Math.PI/4;
function onAmplitudSliderChange(e){
  amplitud_luz=parseInt(e.target.value) * Math.PI / 180;
}

export var cantidadRayos = 100;
document.getElementById("CantidadRayosSlider").addEventListener("input", onCantidadRayosSliderChange)
function onCantidadRayosSliderChange(e){
  cantidadRayos = e.target.value;
}

export var intensidadRayo = 8;
document.getElementById("IntensidadSlider").addEventListener("input", onIntensidadSliderChange)
function onIntensidadSliderChange(e){
  intensidadRayo = e.target.value;
}

export var reflectividadPared = 100;
document.getElementById("ReflectividadParedSlider").addEventListener("input", onReflectividadParedSliderChange)
function onReflectividadParedSliderChange(e){
  reflectividadPared = e.target.value;
}


let canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

var world = new World();
let map = new Map(ctx, matrixMap, canvas.width, canvas.height);
let player = new Player(ctx, map, 1.5, 1.5);

world.childNodes.push(map);
world.childNodes.push(player);

window.onload = gameLoop();
window.addEventListener("keydown", onKeyboardPress);
window.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", onMouseDown);

function onMouseMove(e) {
  var mouse_x = e.pageX;
  var mouse_y = e.pageY;

  direction = adjustDirection(Math.atan2(
    mouse_y - (player.y) * grid_size,
    mouse_x - (player.x) * grid_size
  ));
}

function onMouseDown(e) {
  let canvasPosition = canvas.getBoundingClientRect();
  map.toggleTile(e.screenX - canvasPosition.x, e.screenY - 90 - canvasPosition.y);
}

setInterval(gameLoop, 30); // could be improved. Search for requestAnimationFrame ? . Also increase FPS?

function gameLoop(){
    world.update();
    world.render();
}

function onKeyboardPress(event) {
  var code = event.code;
  // Alert the key name and key code on keydown
  //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
  switch (code) {
    case "KeyS":
      player.y += 0.08;
      break;
    case "KeyW":
      player.y -= 0.08;
      break;
    case "KeyA":
      player.x -= 0.08;
      break;
    case "KeyD":
      player.x += 0.08;
      break;
  }
}



//dibujar flecha
function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}