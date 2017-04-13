
import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Wall} from "./wall";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";

function random(min:number, max:number){
    return Math.random() * (max - min) + min;
}

export class Ink extends ViewObject{
    view:PIXI.Graphics;
    splashList: {shape:Circle, angle:number}[] = [];
    constructor(public game:Game, public shape:Point){
        super();
        this.game.level.collision.add(this, this.shape);
        this.view = new PIXI.Graphics();
        this.game.level.view.addChild(this.view);
        this.inkDraw();
    }
    inkDraw(){
        for(let i = 0;i < 30;i++){
            this.splashList.push(
                    {
                        shape: new Circle(
                            this.shape.x,
                            this.shape.y - 8,
                            Math.random() * 8
                        ),
                        angle: random(0, Math.PI * 2)
                    });
        }
        let hasOutWall = (splash)=>{
            this.game.level.collision.collision(splash.shape);
            for(let collision of splash.shape.collisionList){
                if(collision.owner instanceof Wall){
                    return false;
                }
            }
            return true;
        }
        this.view.beginFill(0x00ff00);
        this.view.drawRect(
                this.shape.x - 10,
                this.shape.y - 7,
                20,
                7
                );
        this.view.drawCircle(
                this.shape.x,
                this.shape.y - 10,
                10
                );
        for(let splash of this.splashList){
            while(splash.shape.r > 2 && !hasOutWall(splash)){
                this.view.drawCircle(
                        splash.shape.x,
                        splash.shape.y,
                        splash.shape.r
                        );
                splash.shape.x += Math.cos(splash.angle) * 8;
                splash.shape.y += Math.sin(splash.angle) * 8;
                splash.shape.r *= random(0.55, 0.95);
            }
        }
    }
}
