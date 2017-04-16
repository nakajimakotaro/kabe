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
        const canvas = this.game.app.view;
        //マウスとタッチイベントの追加
        const onDown = (e)=>{
            let nowTime = performance.now();
            if(this.prevCreateTime + 500 > nowTime){
                return;
            }else{
                this.prevCreateTime = nowTime;
            }

            const x = e.pageX - canvas.offsetLeft;
            const y = e.pageY - canvas.offsetTop;
            const height = (y - this.shape.y) * -1;
            let width  = (x - this.shape.x);
            console.log(`height: ${height}`);
            console.log(`width: ${width}`);
            let angle = Math.atan2(height, width);
            let speed = 5;
            this.ball.shot(angle, speed);
            console.log(angle);
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
