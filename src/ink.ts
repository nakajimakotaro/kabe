import PIXI = require('pixi.js');
import Matter = require("matter-js");
import { Game } from "./script";
import { GameObject } from "./gameObject";
import { Wall } from "./wall";
import { Ball } from "./ball";
import { Shape, Rectangle, Circle, Point } from "./shape";
import { ViewObject } from "./viewObject";

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export class Ink extends ViewObject {
    view: PIXI.Graphics;
    shape: Rectangle;
    private sensor: Matter.Body;
    public get position() {
        return { x: this.sensor.position.x, y: this.sensor.position.y };
    }
    public get angle() {
        return this.sensor.angle;
    }
    splashList: { shape: Circle, angle: number, speed: number, firstSpeed: { x: number, y: number } }[] = [];
    constructor(public game: Game, private splashPoint: Point, private ball: Ball, private wall: Wall, public color: number) {
        super();


        const range = Math.hypot(ball.sprite.x - wall.sprite.x, ball.sprite.y - wall.sprite.y);
        const angle = Math.atan2(ball.sprite.y - wall.sprite.y, ball.sprite.x - wall.sprite.x);
        //view
        this.view = new PIXI.Graphics();
        this.game.level.view.addChild(this.view);
        //sensor
        this.sensor = Matter.Bodies.rectangle(wall.sprite.x + Math.cos(angle) * range, wall.sprite.y + Math.sin(angle) * range, 40, 40, { isSensor: true });
        Matter.World.add(this.game.level.matterEngine.world, this.sensor);
        const pin = Matter.Constraint.create({
            bodyA: this.wall.body,
            pointA: {x: this.sensor.position.x - this.wall.position.x, y: this.sensor.position.y - this.wall.position.y},
            bodyB: this.sensor,
            stiffness: 1,
            length: 0
        });
        Matter.World.add(this.game.level.matterEngine.world, pin);
        //mask
        const mask = new PIXI.Graphics();
        //this.view.mask = mask;
        mask.beginFill(0x00ffff);
        mask.drawRect(wall.sprite.width / -2, wall.sprite.height / -2, wall.sprite.width, wall.sprite.height);
        mask.position.x = wall.sprite.x;
        mask.position.y = wall.sprite.y;
        mask.rotation = wall.angle;

        this.setShape(wall);
        this.splashCreate();
        this.splashDraw();
    }

    setShape(wall: Wall) {
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
    splashCreate() {
        const maxSize = 12;
        let inkVolume = 75;
        while (inkVolume > 0) {
            let splashVolume = random(1, maxSize);
            if (splashVolume < inkVolume) {
                inkVolume -= splashVolume;
            } else {
                splashVolume = inkVolume;
                inkVolume = 0;
            }
            const shape = new Circle(
                0,
                0,
                splashVolume);
            const angle = random(0, Math.PI * 2);
            const speed = (maxSize - shape.r) + 5;
            const firstSpeed = { x: this.ball.moveAverage().x, y: this.ball.moveAverage().y };

            this.splashList.push(
                {
                    shape: shape,
                    angle: angle,
                    speed: speed,
                    firstSpeed: firstSpeed,
                });
        }
    }
    splashDraw() {
        this.view.beginFill(this.color);
        for (let splash of this.splashList) {
            this.view.drawCircle(
                splash.shape.x,
                splash.shape.y,
                splash.shape.r
            );
        }
    }
    nextCount = 0;
    splashNext() {
        for (let splash of this.splashList) {
            splash.shape.x += Math.cos(splash.angle) * splash.speed + splash.firstSpeed.x;
            splash.shape.y += Math.sin(splash.angle) * splash.speed + splash.firstSpeed.y;
            splash.shape.r *= random(0.75, 0.95);
        }
        this.splashDraw();
    }
    update() {
        this.sensor.angle = this.wall.angle;
        this.view.rotation = this.sensor.angle;
        this.view.position.x = this.sensor.position.x;
        this.view.position.y = this.sensor.position.y;
        if (this.game.level.countFrame % 3 == 0 && this.nextCount < 4) {
            this.splashNext();
            this.nextCount++;
        }
        let debug = false;
        if (debug) {
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

    ability(ball: Ball, wall: Wall) {
        let xReverse = 1;
        let yReverse = 1;
        let angle = Math.atan2(ball.moveAverage().y * -1 * yReverse, ball.moveAverage().x * xReverse);
        ball.shot(angle, ball.speed);
    }
}
