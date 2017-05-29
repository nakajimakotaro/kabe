import PIXI = require('pixi.js');
import Matter = require("matter-js");
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {ViewObject} from "./viewObject";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {Ball} from "./ball"; 
export class BallTee extends ViewObject{
    ball:Ball;
    prevCreateFrame = 0;
    public body:Matter.Body;
    public get position(){
        return {x: this.x, y: this.y};
    }
    public get angle(){
        return this.body.angle;
    }

    constructor(public game:Game, public x:number, public y:number){
        super();
        this.setBall();
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0xff0000);
        view.drawCircle(
            this.position.x,
            this.position.y,
            1
        );
        const canvas = this.game.app.view;
        //マウスとタッチイベントの追加
        const onDown = (e)=>{
            if(this.prevCreateFrame + 10 > this.game.level.countFrame){
                return;
            }else{
                this.prevCreateFrame = this.game.level.countFrame;
            }

            const x = e.pageX - canvas.offsetLeft;
            const y = e.pageY - canvas.offsetTop;
            const height = (y - this.position.y) * -1;
            let width  = (x - this.position.x);
            let angle = Math.atan2(height, width);
            let speed = 10;
            this.ball.shot(angle, speed);
            this.setBall();
        }
        canvas.addEventListener('mousedown', onDown);
    }

    colorList = [
        0xf44336,
        0xE91E63,
        0x9C27B0,
        0x673AB7,
        0x3F51B5,
        0x2196F3,
        0x03A9F4,
        0x00BCD4,
        0x009688,
        0x4CAF50,
        0x8BC34A,
        0xCDDC39,
        0xFFEB3B,
        0xFFC107,
        0xFF9800,
        0xFF5722
    ];
    currColorIndex = 0;
    nextColor(): number {
        this.currColorIndex++;
        if (this.colorList.length == this.currColorIndex) {
            this.currColorIndex = 0;
        }
        return this.colorList[this.currColorIndex];
    };
    setBall() {
        this.ball = new Ball(
            this.game,
            this.position.x,
            this.position.y,
            10,
            this.nextColor()
        );
        this.game.level.addObject(this.ball);
    }
}
