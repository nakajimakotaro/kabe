import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {Ball} from "./ball";

export class BallTee extends GameObject{
    setBall:Ball;
    constructor(public game:Game, public shape:Point){
        super();
        this.setBall = new Ball(this.game, new Circle(
            this.shape.x,
            this.shape.y,
            10)
        );
        this.game.level.addObject(this.setBall);
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0xff0000);
        view.drawCircle(
            this.shape.x,
            this.shape.y,
            1
        );
    }
}
