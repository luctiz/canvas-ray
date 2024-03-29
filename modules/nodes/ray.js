import { reflectividadPared } from "../../main.js";
import { distance, reflect , decimalToHex, M_2_PI, M_PI_2, M_3_PI_2} from "../common.js";
import Node from "../node.js";
import { grid_size } from "./world.js";


const MAX_DEPTH = 10;

export default class Ray extends Node{
    constructor(ctx, map, start_x, start_y, direction, color, dist_restante, rebotes_restantes){
      super(ctx);
      //console.log(color);
      this.max_dist = 8; // maxima distancia del rayo (refactorizar para sacarla luego???)
      this.start_x = start_x;
      this.start_y = start_y;
      var [
        raycolision_x, raycolision_y,
        wallNormal_x, wallNormal_y,
        dist_colision,
      ] = Ray.getCollissionRay(map, start_x, start_y, direction);
      
      [this.end_x, this.end_y] = [raycolision_x, raycolision_y]

      this.color_start = `${color.substr(0,7)}${decimalToHex(Math.min(255, dist_restante * 255 / this.max_dist ))}`;

      dist_restante -= dist_colision;

      rebotes_restantes--;
      var [vecreflect_x, vecreflect_y] = reflect(
        Math.cos(direction),
        Math.sin(direction),
        wallNormal_x,
        wallNormal_y
      );
      let reflection_dir = Math.atan2(vecreflect_y, vecreflect_x);
  
      if (reflection_dir >= M_2_PI) {
        reflection_dir -= M_2_PI;
      } else if (reflection_dir < 0) {
        reflection_dir += M_2_PI;
      }

      this.colorStops = []
      this.colorStops.push({})

      if (dist_restante > 0 && rebotes_restantes > 0){
        this.stopAt = 1;
        this.color_end = `${color.substr(0,7)}${decimalToHex(Math.max(0, Math.min(255, dist_restante * 255 / this.max_dist )))}`;
        dist_restante *= reflectividadPared / 100;
        
        this.color_newRay = `${color.substr(0,7)}${decimalToHex(Math.max(0, Math.min(255, dist_restante * 255 / this.max_dist )))}`;
        let ray = new Ray(ctx, map, raycolision_x, raycolision_y, reflection_dir, this.color_newRay, dist_restante, rebotes_restantes);
        this.childNodes.push(ray);
      } else {
        this.stopAt = (dist_restante + dist_colision) / dist_colision; // a veces se actualiza raro esto. Capaz hay un bug por acá.
        this.color_end = `#00000000`;
      }
    }

    update(){
        super.update();
        super.kill();
    }

    draw(){

    }

    static getCollissionRay(map, raystart_x, raystart_y, dir){
      let tileX, tileY, dx, dy, x ,y, tileStepX, tileStepY, xStep, yStep, wallFoundX, wallFoundY;
        tileX = Math.floor(raystart_x);
        dx = raystart_x - tileX;
        tileY = Math.floor(raystart_y);
        dy = raystart_y - tileY;
        
        x = tileX;
        y = tileY;
        
        [tileStepX, tileStepY] = Ray.getTileSteps(dir);
        
        [xStep, yStep] = Ray.getXYSteps(tileStepX, tileStepY, dir);
        
        let xIntercept, yIntercept;
        
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
        
        //
        for (let i = 0; i <= MAX_DEPTH && !(wallFoundX && wallFoundY); i++) {
            if (!wallFoundX) {
            let wallFound = map.getTile(Math.floor(xIntercept), y + tileStepY);
            if (wallFound) {
                wallFoundX = wallFound;
            } else {
                y += tileStepY;
                xIntercept += xStep;
            }
            }
            if (!wallFoundY) {
            let wallFound = map.getTile(x + tileStepX, Math.floor(yIntercept));
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

    render() {
      super.render();
        // linear gradient from start to end of line
      var grad = this.ctx.createLinearGradient(
        this.start_x * grid_size - grid_size, this.start_y * grid_size - grid_size,
        this.end_x * grid_size - grid_size, this.end_y * grid_size - grid_size
      );
    
      grad.addColorStop(0, this.color_start);
      grad.addColorStop(this.stopAt, this.color_end);
      // if (dist_restante > dist_colision) {
      //   grad.addColorStop(0, );
      //   grad.addColorStop(1,`${colorRayo}${decimalToHex((dist_restante - dist_colision) * 255 / this.max_dist / 4)}`);
      // } else {
      //   grad.addColorStop(0, `${colorRayo}${decimalToHex(dist_restante * 255 / this.max_dist / 4)}`);
      //   grad.addColorStop(dist_restante / dist_colision, `#00000000`);
      //   grad.addColorStop(1, `#00000000`);
      // }
    
      this.ctx.strokeStyle = grad;
    
      this.ctx.beginPath();
      this.ctx.moveTo(this.start_x * grid_size - grid_size, this.start_y * grid_size - grid_size);
      this.ctx.lineTo(this.end_x * grid_size - grid_size, this.end_y * grid_size - grid_size);
      this.ctx.stroke();
    }


      static getTileSteps(dir) {
        let tileStepX, tileStepY;
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
      
      static getXYSteps(tileStepX, tileStepY, dir) {
        let xStep,yStep;
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
          let auxTanDirection = Math.tan(dir);
          xStep = tileStepY / auxTanDirection;
          yStep = tileStepX * auxTanDirection;
        }
      
        return [xStep, yStep];
      }
}