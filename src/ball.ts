import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";
import {Wall} from "./wall";
import {Ink} from "./ink";

export class Ball extends ViewObject{

    speed = 0;
    constructor(public game:Game, public shape:Circle, public color:number){
        super();
        this.game.level.collision.add(this, this.shape);
    }
    update(){
        super.update();
        const wallColisionList:Wall[] = [];
        const inkColisionList:Ink[] = [];
        for(let collision of this.shape.collisionList){
            if(collision.owner instanceof Wall){
                wallColisionList.push(collision.owner);
            }else if(collision.owner instanceof Ink){
                inkColisionList.push(collision.owner);
            }
            console.log(collision.owner);
        }
        if(wallColisionList.length != 0 && inkColisionList.length != 0){
            inkColisionList[0].ability(this, wallColisionList[0]);
        }
        if(wallColisionList.length != 0 && inkColisionList.length == 0){
            this.game.level.addObject(new Ink(this.game, new Point(this.shape.x, this.shape.y), this, wallColisionList[0], this.color));
            this.remove();
            return;
        }
        this.move.x += Math.cos(this.shape.angle) * this.speed;
        this.move.y += Math.sin(this.shape.angle) * this.speed * -1;
        let view = this.game.level.view;
        view.beginFill(this.color);
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
