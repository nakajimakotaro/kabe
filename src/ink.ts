import PIXI = require('pixi.js');
import Matter = require("matter-js");
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Wall} from "./wall";
import {Ball} from "./ball";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";

function random(min:number, max:number){
    return Math.random() * (max - min) + min;
}

export class Ink extends ViewObject{
    view:PIXI.Graphics;
    shape:Rectangle;
    private body:Matter.Body;
    public get position(){
        return {x: this.body.position.x, y: this.body.position.y};
    }
    public get angle(){
        return this.body.angle;
    }
    splashList: {shape:Circle, angle:number, speed:number, firstSpeed:{x:number, y:number}}[] = [];
    constructor(public game:Game, public splashPoint:Point, public ball:Ball, wall:Wall, public color:number){
        super();

        this.view = new PIXI.Graphics();
        const mask = new PIXI.Graphics();
        this.view.mask = mask;
        mask.beginFill(0);
        mask.drawRect(wall.sprite.x, wall.sprite.y, wall.sprite.width, wall.sprite.height);
        this.game.level.view.addChild(this.view);


        this.setShape(wall);
        this.splashCreate();
        this.splashDraw();
    }

    setShape(wall:Wall){
        //let x = this.splashPoint.x;
        //let y = this.splashPoint.y;
        //let width = 40;
        //let height = 40;
        ////壁についたインクの当たり判定
        //if(wall.shape.width < width / 2){
        //    x = wall.shape.x;
        //    width = wall.shape.width;
        //}else if(this.splashPoint.x - width / 2 < wall.shape.left()){
        //    width = (this.splashPoint.x + width) - wall.shape.left();
        //    x = wall.shape.left() + width / 2;
        //}else if(this.splashPoint.x + width / 2 > wall.shape.right()){
        //    width = wall.shape.right() - (this.splashPoint.x - width);
        //    x = wall.shape.right() - width / 2;
        //}

        //if(wall.shape.height < height / 2){
        //    y = wall.shape.top();
        //    height = wall.shape.height;
        //}else if(this.splashPoint.y - height / 2 < wall.shape.top()){
        //    height = (this.splashPoint.y + height) - wall.shape.top();
        //    y = wall.shape.top() + height / 2;
        //}else if(this.splashPoint.y + height / 2 > wall.shape.bottom()){
        //    height = wall.shape.bottom() - (this.splashPoint.y - height / 2);
        //    y = wall.shape.bottom() - height / 2;
        //}

        //this.shape = new Rectangle(x, y, width, height);
        //this.game.level.collision.add(this, this.shape);
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
            const firstSpeed = {x: this.ball.moveAverage().x, y: this.ball.moveAverage().y};

            this.splashList.push(
                {
                    shape: shape,
                    angle: angle,
                    speed: speed,
                    firstSpeed: firstSpeed,
                });
        }
    }
    splashDraw(){
        this.view.beginFill(this.color);
        for(let splash of this.splashList){
            this.view.drawCircle(
                splash.shape.x,
                splash.shape.y,
                splash.shape.r
            );
        }
    }
    nextCount = 0;
    splashNext(){
        for(let splash of this.splashList){
            splash.shape.x += Math.cos(splash.angle) * splash.speed + splash.firstSpeed.x;
            splash.shape.y += Math.sin(splash.angle) * splash.speed + splash.firstSpeed.y;
            splash.shape.r *= random(0.75, 0.95);
        }
        this.splashDraw();
    }
    update(){
        if(this.game.level.countFrame % 3 == 0 && this.nextCount < 4){
            this.splashNext();
            this.nextCount++;
        }
        let debug = true;
        if(debug){
            this.game.level.view.endFill();
            this.game.level.view.lineStyle(1, 0x00ff00);
            this.game.level.view.moveTo(this.shape.left(), this.shape.top());
            this.game.level.view.lineTo(this.shape.right(), this.shape.top());
            this.game.level.view.lineTo(this.shape.right(), this.shape.bottom());
            this.game.level.view.lineTo(this.shape.left(), this.shape.bottom());
            this.game.level.view.lineTo(this.shape.left(), this.shape.top());
            this.game.level.view.lineStyle(0, 0x00ff00);
        }
    }

    ability(ball:Ball, wall:Wall){
        let xReverse = 1;
        let yReverse = 1;
        let angle = Math.atan2(ball.moveAverage().y * -1 * yReverse, ball.moveAverage().x * xReverse);
        ball.shot(angle, ball.speed);
    }
}
