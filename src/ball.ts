import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Wall} from "./wall";
import {Shape,Rectangle,Circle} from "./shape";
import {ViewObject} from "./viewObject";

export class Ball extends ViewObject{
    constructor(public game:Game, public shape:Circle){
        super();
        this.game.level.collision.add(this, this.shape);
    }
    update(){
        super.update();
        for(let collision of this.shape.collisionList){
            if(collision.owner instanceof Wall){
                this.remove();
            }
        }
        this.move.y--;
        let view = this.game.level.view;
        view.beginFill(0x00ff00);
        view.drawCircle(
            this.shape.x,
            this.shape.y,
            this.shape.r,
        );
    }
}
