//VER DE USAR GLMATRIX PARA EL RAYCAST? (si es posible)

const M_2_PI = 2*Math.PI

const M_PI_2 = Math.PI/2

const M_3_PI_2 = 3*Math.PI/2

const MAX_DEPTH=10;

const myMap =  [[1,1,1,1,1,1,1],[1,1,0,0,0,0,1],[1,1,0,0,0,0,1],[1,0,1,0,0,0,1],[1,0,0,1,0,0,1],[1,0,0,0,0,1,1],[1,1,1,1,1,1,1]]
const xsize = 7;
const ysize = 7;




const grid_size=150;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var playerx = 2.6;
var playery = 2;

var direction = 50; //grados

const MAX_REBOTES = 5;


window.onload = main()

window.addEventListener('keydown', onKeyboardPress);

window.addEventListener('mousemove', mouse_monitor)


var prev_mousex = 0;
var prev_mousey = 0;
function mouse_monitor(e) {
    var mouse_x = e.pageX;
    var mouse_y = e.pageY;

    direction = Math.atan2(mouse_y - (playery-1)*(grid_size), mouse_x-(playerx-1)*(grid_size))//*180/Math.PI
    
    if (direction >= M_2_PI) {
      direction -= M_2_PI;
    } else if (direction < 0) {
        direction +=M_2_PI;
    }

    main()
  }

function onKeyboardPress(event) {
    var code = event.code;
    // Alert the key name and key code on keydown
    //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
    switch(code){
        case 'KeyS':
            playery+=0.08;
            drawRay()
            break;
        case 'KeyW':
            playery-=0.08;
            drawRay()
            break;
        case 'KeyA':
          playerx-=0.08;
          drawRay()
          break;
        case 'KeyD':
          playerx+=0.08;
          drawRay()
          break;
    }
}


function reflect(dir_x,dir_y,normal_x,normal_y){
  var dot = dir_x * normal_x  + dir_y * normal_y;
  var ref_x = dir_x - 2*dot*normal_x;
  var ref_y = dir_y - 2*dot*normal_y;

  return [ref_x,ref_y]
}


function main(){
  var canvas = document.getElementById('canvas');
  var myCtx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D
  myCtx.fillStyle = "black"
  myCtx.fillRect(0,0,canvas.width,canvas.height)

  myCtx.lineWidth = 2;

  drawMap(myCtx,myMap);

  var raystart_x = playerx;
  var raystart_y = playery;
  var ref_dir = direction
  for(var i = 0; (i < MAX_REBOTES); i++){

      //dibujar rayo en direccion
      //  ctx.strokeStyle = `rgba(128,128,128,0.5)`;
      //  ctx.beginPath();
      //  ctx.moveTo(raystart_x*grid_size,raystart_y*grid_size);
      //  ctx.lineTo(grid_size*(raystart_x+10*Math.cos(ref_dir*Math.PI/180)),grid_size*(raystart_y+10*Math.sin(ref_dir*Math.PI/180)));
      //  ctx.stroke();
      //
      
      var [raycolision_x,raycolision_y,wallNormal_x, wallNormal_y] = castRay(raystart_x,raystart_y,ref_dir);
      
      // dibujar flecha con normal del objeto colisionado
      // canvas_arrow(ctx, raycolision_x * grid_size,raycolision_y* grid_size,(raycolision_x+wallNormal_x)* grid_size, (raycolision_y+wallNormal_y)* grid_size)
      // ctx.stroke()
      drawRay(myCtx,raystart_x, raystart_y, raycolision_x,raycolision_y, `rgba(0,255,0, ${(MAX_REBOTES-i)/MAX_REBOTES})`)

      var raystart_x = raycolision_x;
      var raystart_y = raycolision_y;

      var [vecreflect_x, vecreflect_y]  = reflect(Math.cos(ref_dir),Math.sin(ref_dir),wallNormal_x,wallNormal_y)
      ref_dir = Math.atan2(vecreflect_y,vecreflect_x)//*180/Math.PI;

      if (ref_dir >= M_2_PI) {
        ref_dir -= M_2_PI;
     } else if (ref_dir < 0) {
      ref_dir +=M_2_PI;
     }
  }

}

function drawMap(ctx,map){
  ctx.fillStyle = `rgba(255,0,0,0.5)`
  for (var i = 0; i < xsize; i++){
    for (var j = 0; j < ysize; j++){
      if (map[j][i]==1){
        ctx.fillRect(i*grid_size - grid_size,j*grid_size- grid_size,grid_size,grid_size);
      }
    }
  }
}

 function drawRay(ctx,start_x,start_y,end_x,end_y,color){
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.moveTo(start_x*grid_size - grid_size ,start_y*grid_size - grid_size);
    ctx.lineTo(end_x*grid_size - grid_size ,end_y*grid_size - grid_size);
    ctx.stroke();
}

function getTileSteps(dir) {
    if ((0 <= dir) && (dir <= M_PI_2)) {
      tileStepX = 1;
      tileStepY = 1;
    } else if ((M_PI_2 < dir) && (dir <= Math.PI)) {
      tileStepX = -1;
      tileStepY = 1;
    } else if ((Math.PI < dir) && (dir <= M_3_PI_2)) {
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
      xStep = tileStepY/auxTanDirection;
      yStep = tileStepX*auxTanDirection;
    }

    return [xStep,yStep]
  }


  function distance(x1,y1,x2,y2){
	return (((x2-x1)**2) + ((y2-y1)**2))**(0.5);
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
       xIntercept = x + dx + (1-dy)*xStep;
     } else {
       xIntercept = x + dx + dy*xStep;
     }
 
     if (dir >= M_PI_2 && dir <= M_3_PI_2) {
       yIntercept = y + dy + (dx)*yStep;
     } else {
       yIntercept = y + dy + (1-dx)*yStep;
     }

     // Loopea hasta encontrar pared tanto horizontal como vertical (o pasar max_depth)
     wallFoundX = null;
     wallFoundY = null;
     
      var canvas = document.getElementById('canvas');
  
     var ctx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D

      //
     for (i = 0; i <= MAX_DEPTH && !(wallFoundX && wallFoundY) ; i++) {
       if (!wallFoundX) {
         wallFound = getTile(Math.floor(xIntercept),y+tileStepY);
         if (wallFound) {
             wallFoundX = wallFound;

             //ctx.fillStyle = `rgba(0,255,0,0.5)`
              //ctx.fillRect(Math.floor(xIntercept)*grid_size,(y+tileStepY)*grid_size,grid_size,grid_size);
         } else {
           y += tileStepY;
           xIntercept += xStep;
         }
       }
       if (!wallFoundY) {
         wallFound = getTile(x+tileStepX,Math.floor(yIntercept));
         if (wallFound) {
             wallFoundY = wallFound;

             //ctx.fillStyle = `rgba(0,0,255,0.5)`
              //ctx.fillRect((x+tileStepX)*grid_size,Math.floor(yIntercept)*grid_size,grid_size,grid_size);
             } else {
           x += tileStepX;
           yIntercept += yStep;
             }
         }
       }
       
    var [colhx,colhy] = [xIntercept, y+(tileStepY == 1)];
    var [colvx,colvy] = [x+(tileStepX == 1), yIntercept];

     var d1 = distance(raystart_x,raystart_y,colhx,colhy);
     var d2 = distance(raystart_x,raystart_y,colvx,colvy);


     // dibujar circulos en 2 las posibles paredes de colision
    //   ctx.beginPath();
    //   ctx.strokeStyle = `rgba(0,255,0,0.5)`;
    //  ctx.arc(grid_size*colhx, grid_size*colhy, grid_size/10, 0, 2 * Math.PI);
    //  ctx.stroke();

    //  ctx.beginPath();
    //  ctx.strokeStyle = `rgba(0,0,255,0.5)`;
    //  ctx.arc(grid_size*colvx, grid_size*colvy, grid_size/10, 0, 2 * Math.PI);
    // ctx.stroke();
    //

    var wallNormalX , wallNormalY;
     if (d1 < d2) {
         var [colisionx, colisiony] = [colhx, colhy];
         if (tileStepY == 1){
          [wallNormalX , wallNormalY] = [0,-1];
         } else {
          [wallNormalX , wallNormalY] = [0,1];
         }
     } else {
        var [colisionx, colisiony] = [colvx, colvy];
        if (tileStepX == 1){
          [wallNormalX , wallNormalY] = [-1,0];
         } else {
          [wallNormalX , wallNormalY] = [1,0];
         }
     }

     return [colisionx,colisiony,wallNormalX,wallNormalY];
 }






 //dibujar flecha

 function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}