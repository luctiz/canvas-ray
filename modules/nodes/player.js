import { colorRayo, direction } from "../../main.js";
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
        this.childNodes.forEach((x) => console.log(x.isAlive));

        super.update();

        console.log("after update");
        let ray = new Ray(this.ctx, this.map, this.x, this.y, direction, colorRayo, 10, 20);
        this.childNodes.push(ray);
        this.childNodes.forEach((x) => console.log(x.isAlive));
    }

    render(){
        console.log("will render rays:", this.childNodes.length);
        super.render();
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fillRect(this.x-1, this.y-1, 2, 2);
        this.ctx.lineWidth = 2;
    }
}