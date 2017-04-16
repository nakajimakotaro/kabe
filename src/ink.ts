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
    shape:Rectangle;
    splashList: {shape:Circle, angle:number, speed:number}[] = [];
    constructor(public game:Game, public splashPoint:Point, wall:Wall, public color:number){
        super();
        console.log(splashPoint);
        this.game.level.collision.add(this, this.splashPoint);
        this.view = new PIXI.Graphics();
        this.game.level.view.addChild(this.view);
        let x = this.splashPoint.x;
        let y = this.splashPoint.y;
        let width = 40;
        let height = 40;
        //壁についたインクの当たり判定
        if(wall.shape.width < width / 2){
            x = wall.shape.x;
            width = wall.shape.width;
        }else if(splashPoint.x - width / 2 < wall.shape.left()){
            width = (splashPoint.x + width) - wall.shape.left();
            x = wall.shape.left() + width / 2;
        }else if(splashPoint.x + width / 2 < wall.shape.right()){
            width = wall.shape.right() - (splashPoint.x - width);
            x = wall.shape.right() - width / 2;
        }

        if(wall.shape.height < height / 2){
            y = wall.shape.top();
            height = wall.shape.height;
        }else if(splashPoint.y - height / 2 < wall.shape.top()){
            height = (splashPoint.y + height) - wall.shape.left();
            y = wall.shape.left() + height / 2;
        }else if(splashPoint.y + height / 2 < wall.shape.bottom()){
            height = wall.shape.right() - (splashPoint.y - height);
            y = wall.shape.right() - height / 2;
        }
        this.shape = new Rectangle(x, y, width, height);
        console.log(this.shape);
        const mask = new PIXI.Graphics();
        mask.beginFill(0);
        mask.drawRect(wall.shape.left(), wall.shape.top(), wall.shape.width, wall.shape.height);
        this.view.mask = mask;
        this.splashCreate();
        this.splashDraw();
    }
    splashCreate(){
        const maxSize = 12;
        let inkVolume = 75;
        while(inkVolume > 0){
            let splashVolume = random(1, maxSize);
            if(splashVolume < inkVolume){
                inkVolume -= splashVolume;
            }else{
                splashVolume = inkVolume;
                inkVolume = 0;
            }
            const shape = new Circle(
                this.splashPoint.x,
                this.splashPoint.y,
                splashVolume
            );
            const angle = random(0, Math.PI * 2);
            const speed = (maxSize - shape.r) + 5;

            this.splashList.push(
                {
                    shape: shape,
                    angle: angle,
                    speed: speed,
                });
        }
    }
    splashDraw(){
        this.view.beginFill(this.color);
        for(let splash of this.splashList){
            for(let i = 0;i < 4;i++){
                this.view.drawCircle(
                    splash.shape.x,
                    splash.shape.y,
                    splash.shape.r
                );
                splash.shape.x += Math.cos(splash.angle) * splash.speed;
                splash.shape.y += Math.sin(splash.angle) * splash.speed;
                splash.shape.r *= random(0.75, 0.95);
            }
        }
    }
}
