import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {Ball} from "./ball";

export class BallTee extends GameObject{
    ball:Ball;
    prevCreateTime = 0;
    constructor(public game:Game, public shape:Point){
        super();
        this.setBall();
    }
    update(){
        let view = this.game.level.view;
        view.beginFill(0xff0000);
        view.drawCircle(
            this.shape.x,
            this.shape.y,
            1
        );
        let canvas = this.game.app.view;
        //マウスとタッチイベントの追加
        let onDown = (e)=>{
            if(this.prevCreateTime + 500 > this.game.level.countFrame){
                return;
            }
            const x = e.pageX - canvas.offsetLeft;
            const y = e.pageY - canvas.offsetTop;
            const height = (y - this.shape.y) * -1;
            const width  = (x - this.shape.x);
            let angle = Math.atan(height / width);
            let speed = 5;
            this.ball.shot(angle, speed);
            console.log('new');
            this.setBall();
        }
        canvas.addEventListener('mousedown', onDown);
    }

    setBall(){
        this.ball = new Ball(this.game, new Circle(
            this.shape.x,
            this.shape.y,
            10)
        );
        this.game.level.addObject(this.ball);
    }
}
