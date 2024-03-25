//VER DE USAR GLMATRIX PARA EL RAYCAST? (si es posible)

const M_2_PI = 2 * Math.PI;

const M_PI_2 = Math.PI / 2;

const M_3_PI_2 = (3 * Math.PI) / 2;

const MAX_DEPTH = 10;

const myMap = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
];
//[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]
//
const xsize = 7;
const ysize = 7;

const MAX_DIST = 8;

//sigue habiendo algun error que hace que en las esquinas se haga mas luminoso con algun rebote. Sospecho que en el gradiente

const grid_size = 150;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var playerx = 3.51;
var playery = 3.5;

var direction = 50; //grados

const MAX_REBOTES = 6;

var canvas = document.getElementById("canvas");
var myCtx = canvas.getContext("2d"); // devuelve un CanvasRenderingContext2D

window.onload = renderWorld();
window.addEventListener("keydown", onKeyboardPress);
window.addEventListener("mousemove", mouse_monitor);

var amplitud_luz = Math.PI/4;

var prev_mousex = 0;
var prev_mousey = 0;
function mouse_monitor(e) {
  var mouse_x = e.pageX;
  var mouse_y = e.pageY;

  direction = Math.atan2(
    mouse_y - (playery - 1) * grid_size,
    mouse_x - (playerx - 1) * grid_size
  );

  if (direction >= M_2_PI) {
    direction -= M_2_PI;
  } else if (direction < 0) {
    direction += M_2_PI;
  }

  renderWorld();
}

function onKeyboardPress(event) {
  var code = event.code;
  // Alert the key name and key code on keydown
  //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
  switch (code) {
    case "KeyS":
      playery += 0.08;
      renderWorld();
      break;
    case "KeyW":
      playery -= 0.08;
      renderWorld();
      break;
    case "KeyA":
      playerx -= 0.08;
      renderWorld();
      break;
    case "KeyD":
      playerx += 0.08;
      renderWorld();
      break;
  }
}

function reflect(dir_x, dir_y, normal_x, normal_y) {
  var dot = dir_x * normal_x + dir_y * normal_y;
  var ref_x = dir_x - 2 * dot * normal_x;
  var ref_y = dir_y - 2 * dot * normal_y;

  return [ref_x, ref_y];
}

function renderWorld() {
  myCtx.fillStyle = colorFondo;
  myCtx.fillRect(0, 0, canvas.width, canvas.height);

  myCtx.lineWidth = 2;

  drawMap(myCtx, myMap);

  // drawRay(myCtx, playerx, playery, direction)
  const rays_count = 250;
  const tope =  (direction+amplitud_luz)
  const incremento = amplitud_luz / rays_count;
  for (var ray_direction = direction-(amplitud_luz/2); ray_direction < tope; ray_direction+=incremento) {
    drawRay(
      myCtx,
      playerx,
      playery,
      ray_direction
    );
  }
}

function drawMap(ctx, map) {
  ctx.fillStyle = colorPared;
  for (var i = 0; i < xsize; i++) {
    for (var j = 0; j < ysize; j++) {
      if (map[j][i] == 1) {
        ctx.fillRect(
          i * grid_size - grid_size,
          j * grid_size - grid_size,
          grid_size,
          grid_size
        );
      }
    }
  }
}

function drawRay(ctx, raystart_x, raystart_y, ref_dir) {
  var dist_restante = MAX_DIST;

  var i = 0;
  while (dist_restante > 0 && i < 20) {
    var [
      raycolision_x,
      raycolision_y,
      wallNormal_x,
      wallNormal_y,
      dist_colision,
    ] = castRay(raystart_x, raystart_y, ref_dir);

    // dibujar flecha con normal del objeto colisionado
    drawLine(
      ctx,
      raystart_x,
      raystart_y,
      raycolision_x,
      raycolision_y,
      dist_colision,
      dist_restante
    );
    dist_restante -= dist_colision;

    dist_restante /= 3; //reflectividad de pared. 1 sería simular un espejo
    var raystart_x = raycolision_x;
    var raystart_y = raycolision_y;

    var [vecreflect_x, vecreflect_y] = reflect(
      Math.cos(ref_dir),
      Math.sin(ref_dir),
      wallNormal_x,
      wallNormal_y
    );
    ref_dir = Math.atan2(vecreflect_y, vecreflect_x);

    if (ref_dir >= M_2_PI) {
      ref_dir -= M_2_PI;
    } else if (ref_dir < 0) {
      ref_dir += M_2_PI;
    }

    i++;
  }
}

function drawLine(
  ctx,
  start_x,
  start_y,
  end_x,
  end_y,
  dist_colision,
  dist_restante
) {
  // linear gradient from start to end of line
  var grad = ctx.createLinearGradient(
    start_x * grid_size - grid_size,
    start_y * grid_size - grid_size,
    end_x * grid_size - grid_size,
    end_y * grid_size - grid_size
  );

  // grad.addColorStop(0, "blue");
  // grad.addColorStop(1, "red");

  if (dist_restante > dist_colision) {
    grad.addColorStop(0, `${colorRayo}${decimalToHex(dist_restante * 255 / MAX_DIST / 4)}`);
    grad.addColorStop(1,`${colorRayo}${decimalToHex((dist_restante - dist_colision) * 255 / MAX_DIST / 4)}`);
  } else {
    grad.addColorStop(0, `${colorRayo}${decimalToHex(dist_restante * 255 / MAX_DIST / 4)}`);
    grad.addColorStop(dist_restante / dist_colision, `#00000000`);
    grad.addColorStop(1, `#00000000`);
  }

  ctx.strokeStyle = grad;

  ctx.beginPath();
  ctx.moveTo(start_x * grid_size - grid_size, start_y * grid_size - grid_size);
  ctx.lineTo(end_x * grid_size - grid_size, end_y * grid_size - grid_size);
  ctx.stroke();
}

function getTileSteps(dir) {
  if (0 <= dir && dir <= M_PI_2) {
    tileStepX = 1;
    tileStepY = 1;
  } else if (M_PI_2 < dir && dir <= Math.PI) {
    tileStepX = -1;
    tileStepY = 1;
  } else if (Math.PI < dir && dir <= M_3_PI_2) {
    tileStepX = -1;
    tileStepY = -1;
  } else {
    tileStepX = 1;
    tileStepY = -1;
  }
  return [tileStepX, tileStepY];
}

function getXYSteps(dir) {
  if (dir == 0) {
    xStep = 60;
    yStep = 0;
  } else if (dir == Math.PI) {
    xStep = -60;
    yStep = 0;
  } else if (dir == M_PI_2) {
    xStep = 0;
    yStep = -60;
  } else if (dir == M_3_PI_2) {
    xStep = 0;
    yStep = 60;
  } else {
    auxTanDirection = Math.tan(dir);
    xStep = tileStepY / auxTanDirection;
    yStep = tileStepX * auxTanDirection;
  }

  return [xStep, yStep];
}

function distance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}
function getTile(x, y) {
  if (x < 0 || x >= xsize || y < 0 || y >= ysize) return null;
  return myMap[y][x];
}

function castRay(raystart_x, raystart_y, dir) {
  tileX = Math.floor(raystart_x);
  dx = raystart_x - tileX;
  tileY = Math.floor(raystart_y);
  dy = raystart_y - tileY;

  x = tileX;
  y = tileY;

  var [tileStepX, tileStepY] = getTileSteps(dir);

  var [xStep, yStep] = getXYSteps(dir);

  var xIntercept, yIntercept;

  if (dir <= Math.PI) {
    xIntercept = x + dx + (1 - dy) * xStep;
  } else {
    xIntercept = x + dx + dy * xStep;
  }

  if (dir >= M_PI_2 && dir <= M_3_PI_2) {
    yIntercept = y + dy + dx * yStep;
  } else {
    yIntercept = y + dy + (1 - dx) * yStep;
  }

  // Loopea hasta encontrar pared tanto horizontal como vertical (o pasar max_depth)
  wallFoundX = null;
  wallFoundY = null;

  //var canvas = document.getElementById('canvas');

  //var ctx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D

  //
  for (i = 0; i <= MAX_DEPTH && !(wallFoundX && wallFoundY); i++) {
    if (!wallFoundX) {
      wallFound = getTile(Math.floor(xIntercept), y + tileStepY);
      if (wallFound) {
        wallFoundX = wallFound;
      } else {
        y += tileStepY;
        xIntercept += xStep;
      }
    }
    if (!wallFoundY) {
      wallFound = getTile(x + tileStepX, Math.floor(yIntercept));
      if (wallFound) {
        wallFoundY = wallFound;
      } else {
        x += tileStepX;
        yIntercept += yStep;
      }
    }
  }

  var [colhx, colhy] = [xIntercept, y + (tileStepY == 1)];
  var [colvx, colvy] = [x + (tileStepX == 1), yIntercept];

  var d1 = distance(raystart_x, raystart_y, colhx, colhy);
  var d2 = distance(raystart_x, raystart_y, colvx, colvy);

  var wallNormalX, wallNormalY, d;
  if (d1 < d2) {
    var [colisionx, colisiony, d] = [colhx, colhy, d1];
    if (tileStepY == 1) {
      [wallNormalX, wallNormalY] = [0, -1];
    } else {
      [wallNormalX, wallNormalY] = [0, 1];
    }
  } else {
    var [colisionx, colisiony, d] = [colvx, colvy, d2];
    if (tileStepX == 1) {
      [wallNormalX, wallNormalY] = [-1, 0];
    } else {
      [wallNormalX, wallNormalY] = [1, 0];
    }
  }

  return [colisionx, colisiony, wallNormalX, wallNormalY, d];
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


document.getElementById("AmplitudSlider").addEventListener("input", onAmplitudSliderChange)

function onAmplitudSliderChange(e){ // deberia ir de 1 a 360 grados pero los supera. Ver por qué
  console.log(e.target.value);
  amplitud_luz=parseInt(e.target.value) * Math.PI / 180;
  renderWorld();
}


document.getElementById("colorPared").addEventListener("input", onColorParedChange)
var colorPared = '#000000';
function onColorParedChange(e){
  colorPared = e.target.value;
  renderWorld();
}

document.getElementById("colorRayo").addEventListener("input", onColorRayoChange)
var colorRayo = '#ffffff';
function onColorRayoChange(e){
  colorRayo = e.target.value;
  renderWorld();
}

document.getElementById("colorFondo").addEventListener("input", onColorFondoChange)
var colorFondo = '#000000';
function onColorFondoChange(e){
  colorFondo = e.target.value;
  renderWorld();
}