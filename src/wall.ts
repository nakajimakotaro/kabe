import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle} from "./shape";

export class Wall extends GameObject{
    constructor(public game:Game, public shape:Rectangle){
        super();
        this.game.level.collision.add(this, this.shape);
        console.log(this.shape);
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0x3E2723);
        view.drawRect(
            this.shape.left(),
            this.shape.top(),
            this.shape.width,
            this.shape.height,
        );
    }
}
