import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle} from "./shape";

export class Wall extends GameObject{
    constructor(public game:Game, public shape:Rectangle){
        super();
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0xff0000);
        view.drawRect(
            this.shape.x,
            this.shape.y,
            this.shape.width,
            this.shape.height
        );
    }
}
