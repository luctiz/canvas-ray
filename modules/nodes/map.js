export var grid_size = 150;

import { colorFondo, colorPared } from "../../main.js";
import { clamp } from "../common.js";
import Node from "../node.js";
export class Map extends Node {
  constructor(ctx, matrixMap, width, height) {
    super(ctx);
    this.matrixMap = matrixMap;
    this.xsize = matrixMap.length;
    this.ysize = matrixMap[0].length;
    this.width = width;
    this.height = height;
    grid_size = (this.width / this.xsize);
  }

  render() {
    super.render();
    // background
    this.ctx.fillStyle = colorFondo;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 2;

    // paredes
    this.ctx.fillStyle = colorPared;
    for (var i = 0; i < this.xsize; i++) {
      for (var j = 0; j < this.ysize; j++) {
        if (this.matrixMap[j][i] == 1) {
          this.ctx.fillRect(
            i * grid_size,
            j * grid_size,
            grid_size,
            grid_size
          );
        }
      }
    }
  }

  getTile(x, y) {
    if (x < 0 || x >= this.xsize || y < 0 || y >= this.ysize) return null;
    return this.matrixMap[y][x];
  }

  toggleTile(screenX, screenY){
    let tileX = clamp(0, Math.floor(screenX / grid_size), this.xsize);
    let tileY = clamp(0, Math.floor(screenY / grid_size), this.ysize);
    this.matrixMap[tileY][tileX] = !this.matrixMap[tileY][tileX];
  }
}
