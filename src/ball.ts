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
    constructor(public game: Game, public body: Matter.Body, public color: number) {
        super();
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.game.level.view.addChild(this.sprite);
        this.setColor(color);
        //this.game.level.collision.add(this, this.body);
    }
    setColor(color: number) {
        this.setSprite('0x' + color.toString(16));
    }
    setSprite(path: string) {
        this.game.resourceLoader.load(path).then(
            (texture: PIXI.Texture) => {
                this.sprite.texture = texture;
            });
    }
    collisionHistory: Object[][] = new Array(10).fill(0).map(() => []);
    collisionActionFrame = 0;
    update() {
        super.update();

        this.move.x += Math.cos(this.body.angle) * this.speed;
        this.move.y += Math.sin(this.body.angle) * this.speed * -1;
        this.collisionAction();
    }
    collisionAction() {
        const wallColisionList: Wall[] = [];
        const inkColisionList: Ink[] = [];
        //for (let collision of this.shape.collisionList) {
        //    if (collision.owner instanceof Wall) {
        //        wallColisionList.push(collision.owner);
        //    } else if (collision.owner instanceof Ink) {
        //        inkColisionList.push(collision.owner);
        //    }
        //}
        // console.log(this.shape.collisionList);
        if (wallColisionList.length != 0 && inkColisionList.length != 0) {
            console.log("インクにぶつかった");
            inkColisionList[0].ability(this, wallColisionList[0]);
        }
        if (wallColisionList.length != 0 && inkColisionList.length == 0) {
            console.log("壁にぶつかった");
            this.game.level.addObject(new Ink(this.game, new Point(this.body.position.x, this.body.position.y), this, wallColisionList[0], this.color));
            this.game.level.addObject(new Particle(this.game, {
                type: "firework",
                shape: new Circle(
                    this.body.position.x,
                    this.body.position.y,
                    3,
                ),
                posRandom: {
                    xmin: -10,
                    xmax: 10,
                    ymin: -10,
                    ymax: 10,
                },
                color: this.color,
                sparkNum: 20,
                initialVelocity: {
                    x: this.moveAverage().x,
                    y: this.moveAverage().y,
                },
                randomVelocity: {
                    xmin: -10,
                    xmax: 10,
                    ymin: -5,
                    ymax: 10,
                },
                friction: {
                    x: 0.98,
                    y: 0.98,
                },
                endTime: 120 + this.game.level.countFrame,
                gravity: {
                    x: 0,
                    y: 0.3,
                },
            }
            ));
            this.remove();
        }
    }
    moveOn() {
        super.moveOn();
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;
    }
    remove() {
        super.remove();
        this.game.level.view.removeChild(this.sprite);
    }

    shot(angle: number, speed: number) {
        this.body.angle = angle;
        this.speed = speed;
    }
}
