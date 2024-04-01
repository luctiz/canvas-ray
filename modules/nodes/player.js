import { amplitud_luz, cantidadRayos, colorRayo, direction, intensidadRayo } from "../../main.js";
import { adjustDirection } from "../common.js";
import Node from "../node.js";
import Ray from "./ray.js";

export default class Player extends Node{
    constructor(ctx, map, x, y){
        super(ctx);
        this.map = map;
        this.x = x;
        this.y = y;
    }

    update(){
        super.update();
        const tope =  (direction+amplitud_luz/2) // bug: a veces la cantidad de rayos es 1 mas que la que debería ser.
        const incremento = amplitud_luz / cantidadRayos;
        for (var ray_direction = direction - (amplitud_luz/2); ray_direction < tope; ray_direction+=incremento) {
            let ray = new Ray(this.ctx, this.map, this.x, this.y, adjustDirection(ray_direction), colorRayo, intensidadRayo);
            this.childNodes.push(ray);
        }
    }

    render(){
        super.render();
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fillRect(this.x-1, this.y-1, 2, 2);
        this.ctx.lineWidth = 2;
    }
}