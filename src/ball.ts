import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle} from "./shape";

export class Ball extends GameObject{
    constructor(public game:Game, public shape:Circle){
        super();
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0x00ff00);
        view.drawCircle(
            this.shape.x,
            this.shape.y,
            this.shape.r,
        );
    }
}
