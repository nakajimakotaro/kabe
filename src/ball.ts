import PIXI = require('pixi.js');
import Matter = require("matter-js");
import { Game } from "./script";
import { GameObject } from "./gameObject";
import { Shape, Rectangle, Circle, Point } from "./shape";
import { ViewObject } from "./viewObject";
import { Wall } from "./wall";
import { Ink } from "./ink";
import { Particle } from "./particle";
import * as _ from "lodash";

export class Ball extends ViewObject {

    speed = 0;
    sprite: PIXI.Sprite;
    private body: Matter.Body;
    public get position() {
        return { x: this.body.position.x, y: this.body.position.y };
    }
    public get angle() {
        return this.body.angle;
    }
    constructor(public game: Game, x: number, y: number, radius: number, public color: number) {
        super();
        this.body = Matter.Bodies.circle(x, y, radius, {
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            restitution: 1,
        });
        this.body["userObject"] = this;
        this.body["userCollisionList"] = [];
        this.sprite = this.game.resourceLoader.circle(radius, color);
        this.sprite.x = x;
        this.sprite.y = y;
        this.game.level.view.addChild(this.sprite);
    }
    collisionHistory: Object[][] = new Array(10).fill(0).map(() => []);
    collisionActionFrame = 0;
    update() {
        super.update();

        this.collisionAction();
        this.body["userCollisionList"].length = 0;
    }
    collisionAction() {
        const wallColisionList: Wall[] = [];
        const inkColisionList: Ink[] = [];
        for (let collision of this.body["userCollisionList"]) {
            if (collision instanceof Wall) {
                wallColisionList.push(collision);
            } else if (collision instanceof Ink) {
                inkColisionList.push(collision);
            }
        }
        //if (wallColisionList.length != 0 && inkColisionList.length != 0) {
        //console.log("インクにぶつかった");
        //    inkColisionList[0].ability(this, wallColisionList[0]);
        //}
        //}
        if (wallColisionList.length != 0 && inkColisionList.length == 0) {
            console.log("壁にぶつかった");
            this.remove();
            this.game.level.addObject(new Ink(this.game, new Point(this.body.position.x, this.body.position.y), this, wallColisionList[0], this.color));
            //    this.game.level.addObject(new Particle(this.game, {
            //        type: "firework",
            //        shape: new Circle(
            //            this.body.position.x,
            //            this.body.position.y,
            //            3,
            //        ),
            //        posRandom: {
            //            xmin: -10,
            //            xmax: 10,
            //            ymin: -10,
            //            ymax: 10,
            //        },
            //        color: this.color,
            //        sparkNum: 20,
            //        initialVelocity: {
            //            x: this.moveAverage().x,
            //            y: this.moveAverage().y,
            //        },
            //        randomVelocity: {
            //            xmin: -10,
            //            xmax: 10,
            //            ymin: -5,
            //            ymax: 10,
            //        },
            //        friction: {
            //            x: 0.98,
            //            y: 0.98,
            //        },
            //        endTime: 120 + this.game.level.countFrame,
            //        gravity: {
            //            x: 0,
            //            y: 0.3,
            //        },
            //    }
            //    ));
        }
    }
    moveOn() {
        super.moveOn();
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }
    remove() {
        super.remove();
        this.game.level.view.removeChild(this.sprite);
        Matter.World.remove(this.game.level.matterEngine.world, this.body);
    }

    shot(angle: number, speed: number) {
        this.body.angle = angle;
        this.speed = speed;
        Matter.World.add(this.game.level.matterEngine.world, this.body);
        Matter.Body.setVelocity(
            this.body,
            {
                x: Math.cos(this.body.angle) * this.speed,
                y: Math.sin(this.body.angle) * this.speed * -1,
            }
        );
    }
}
