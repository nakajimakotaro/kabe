import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Wall} from "./wall";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";
import {Ink} from "./ink";

export class Ball extends ViewObject{

    speed = 0;
    
    constructor(public game:Game, public shape:Circle){
        super();
        this.game.level.collision.add(this, this.shape);
    }
    update(){
        super.update();
        for(let collision of this.shape.collisionList){
            if(collision.owner instanceof Wall){
                this.game.level.addObject(new Ink(this.game, new Point(this.shape.x, collision.owner.shape.bottom() - 1), collision.owner));
                this.remove();
                break;
            }
        }
        this.move.x += Math.cos(this.shape.angle) * this.speed;
        this.move.y += Math.sin(this.shape.angle) * this.speed;
        let view = this.game.level.view;
        view.beginFill(0x00ff00);
        view.drawCircle(
            this.shape.x,
            this.shape.y,
            this.shape.r,
        );
    }

    shot(angle:number, speed:number){
        this.shape.angle = angle;
        this.speed = speed;
    }
}
