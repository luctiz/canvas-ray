const M_PI_180 = Math.PI/180
const MAX_DEPTH=10;

const myMap =  [[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]]
const xsize = 5;
const ysize = 5;


const grid_size=128;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var playerx = 2;
var playery = 2;

var direction = 50; //grados

const MAX_REBOTES = 2;


window.onload = drawRay()

window.addEventListener('keydown', onKeyboardPress);

function onKeyboardPress(event) {
    var code = event.code;
    // Alert the key name and key code on keydown
    //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
    switch(code){
        case 'KeyW':
            direction-=1;
            drawRay()
            break;
        case 'KeyS':
            direction+=1;
            drawRay()
            break;

        case 'ArrowDown':
            playery+=0.01;
            drawRay()
            break;
        case 'ArrowUp':
            playery-=0.01;
            drawRay()
            break;

        case 'ArrowLeft':
          playerx-=0.01;
          drawRay()
          break;

        case 'ArrowRight':
          playerx+=0.01;
          drawRay()
          break;
    }
    if (direction >= 360) {
      direction -= 360;
   } else if (direction < 0) {
      direction +=360;
   }

}


function reflect(dir_x,dir_y,normal_x,normal_y){
  var dot = dir_x * normal_x  - dir_y * normal_y;
  var ref_x = 2*dot*normal_x + dir_x;
  var ref_y = 2*dot*normal_y - dir_y;

  return [ref_x,ref_y]
}

function onKeyboardUp(event) {
    var code = event.code;
    // Alert the key name and key code on keydown
    //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
   dict_keys[code] = false;
}

 function drawRay(){

    var canvas = document.getElementById('canvas');
    
    var ctx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D
    

    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    
    ctx.lineWidth = 2;
  
    // dibujo paredes//
    ctx.fillStyle = `rgba(255,0,0,0.5)`
    for (var i = 0; i < xsize; i++){
      for (var j = 0; j < ysize; j++){
        if (myMap[i][j]==1){
          ctx.fillRect(i*grid_size,j*grid_size,grid_size,grid_size);
        }
      }
    }
    //


    var raystart_x = playerx;
    var raystart_y = playery;
    var ref_dir = direction
    for(var i = 0; (i < MAX_REBOTES); i++){

        //dibujar rayo en direccion
        // ctx.strokeStyle = `rgba(128,128,128,0.5)`;
        // ctx.beginPath();
        // ctx.moveTo(playerx*grid_size,playery*grid_size);
        // ctx.lineTo(grid_size*(playerx+10*Math.cos(direction*Math.PI/180)),grid_size*(playerx+10*Math.sin(direction*Math.PI/180)));
        // ctx.stroke();
        //

        ctx.strokeStyle = `rgb(128,128,255)`;//`rgba(0,255,0, ${(MAX_REBOTES-i)/MAX_REBOTES})`;
        ctx.beginPath();
        ctx.moveTo(raystart_x*grid_size,raystart_y*grid_size);
        var [raycolision_x,raycolision_y,wallNormal_x, wallNormal_y] = castRay(raystart_x,raystart_y,ref_dir);
        
        console.log(wallNormal_x,wallNormal_y)
        ctx.lineTo(raycolision_x*grid_size,raycolision_y*grid_size);
        ctx.stroke();



        var raystart_x = raycolision_x;
        var raystart_y= raycolision_y;

        var [vecreflect_x, vecreflect_y]  = reflect(Math.cos(ref_dir*M_PI_180),Math.sin(ref_dir*M_PI_180),wallNormal_x,wallNormal_y)
        ref_dir = Math.atan(vecreflect_y,vecreflect_x)*180/Math.PI;
        //await sleep(1000);    
    }
}

function getTileSteps(dir) {
    if ((0 < dir) && (dir <= 90)) {
      tileStepX = 1;
      tileStepY = 1;
    } else if ((90 < dir) && (dir <= 180)) {
      tileStepX = -1;
      tileStepY = 1;
    } else if ((180 < dir) && (dir <= 270)) {
      tileStepX = -1;
      tileStepY = -1;
    } else {
      tileStepX = 1;
      tileStepY = -1;
    }
    return [tileStepX, tileStepY];
  }


function getXYSteps(direction) {
    if (direction == 360) {
      xStep = 60;
      yStep = 0;
    } else if (direction == 180) {
      xStep = -60;
      yStep = 0;
    } else if (direction == 90) {
      xStep = 0;
      yStep = -60;
    } else if (direction == 270) {
      xStep = 0;
      yStep = 60;
    } else {
      auxTanDirection = Math.tan(direction * M_PI_180);
      xStep = tileStepY/auxTanDirection;
      yStep = tileStepX*auxTanDirection;
    }

    return [xStep,yStep]
  }


  function distance(x1,x2,y1,y2){
	return (((x2-x1)**2) + ((y2-y1)**2))**(0.5);
  }
    function getTile(x, y) {
    if (x < 0 || x >= xsize || y < 0 || y >= ysize) return null;
    return myMap[y][x];
  }

  function castRay(playerx, playery, direction) {

    tileX = Math.floor(playerx);
    dx = playerx - tileX;
    tileY = Math.floor(playery);
    dy = playery - tileY;
  
    x = tileX;
    y = tileY;
 
     var [tileStepX, tileStepY] = getTileSteps(direction);
 
     var [xStep, yStep] = getXYSteps(direction);
 
     var xIntercept, yIntercept;
 
     if (direction <= 180) {
       xIntercept = x + dx + (1-dy)*xStep;
     } else {
       xIntercept = x + dx + dy*xStep;
     }
 
     if (direction >= 90 && direction <= 270) {
       yIntercept = y + dy + (dx)*yStep;
     } else {
       yIntercept = y + dy + (1-dx)*yStep;
     }




    
 
     // Loopea hasta encontrar pared tanto horizontal como vertical (o pasar max_depth)
     wallFoundX = null;
     wallFoundY = null;
     

      //
      //var canvas = document.getElementById('canvas');
    
      //var ctx = canvas.getContext('2d'); // devuelve un CanvasRenderingContext2D

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

     var d1 = distance(playerx,playery,colhx,colhy);
     var d2 = distance(playerx,playery,colvx,colvy);


    //  ctx.beginPath();
    //  ctx.strokeStyle = `rgba(0,255,0,0.5)`;
    // ctx.arc(grid_size*colhx, grid_size*colhy, grid_size/10, 0, 2 * Math.PI);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.strokeStyle = `rgba(0,0,255,0.5)`;
    // ctx.arc(grid_size*colvx, grid_size*colvy, grid_size/10, 0, 2 * Math.PI);
    //ctx.stroke();
    var wallNormalX , wallNormalY;
     if (d1 < d2) {
         var [colisionx, colisiony] = [colhx, colhy];
         if (tileStepX == 1){
          [wallNormalX , wallNormalY] = [0,-1];
         } else {
          [wallNormalX , wallNormalY] = [0,1];
         }
     } else {
        var [colisionx, colisiony] = [colvx, colvy];
        if (tileStepY == 1){
          [wallNormalX , wallNormalY] = [-1,0];
         } else {
          [wallNormalX , wallNormalY] = [1,0];
         }
     }

     return [colisionx,colisiony,wallNormalX,wallNormalY];
 }