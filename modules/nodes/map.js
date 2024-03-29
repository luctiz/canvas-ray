const xsize = 7;
const ysize = 7;

import { grid_size } from "./world.js";
import { colorFondo, colorPared } from "../../main.js";
import Node from "../node.js";
export class Map extends Node {
  constructor(ctx, matrixMap, width, height) {
    super(ctx);
    this.matrixMap = matrixMap;
    this.width = width;
    this.height = height;
  }

  render() {
    super.render();
    // background
    this.ctx.fillStyle = colorFondo;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 2;

    // paredes
    this.ctx.fillStyle = colorPared;
    for (var i = 0; i < xsize; i++) {
      for (var j = 0; j < ysize; j++) {
        if (this.matrixMap[j][i] == 1) {
          this.ctx.fillRect(
            i * grid_size - grid_size,
            j * grid_size - grid_size,
            grid_size,
            grid_size
          );
        }
      }
    }
  }

  getTile(x, y) {
    if (x < 0 || x >= xsize || y < 0 || y >= ysize) return null;
    return this.matrixMap[y][x];
  }
}
