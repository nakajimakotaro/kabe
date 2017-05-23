import PIXI = require('pixi.js');
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
    constructor(public game: Game, public shape: Circle, public color: number) {
        super();
        console.time("ball");
        console.time("sprite");
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        console.timeEnd("sprite");
        console.time("viewadd");
        this.game.level.view.addChild(this.sprite);
        console.timeEnd("viewadd");
        console.time("color");
        this.setColor(color);
        console.timeEnd("color");
        console.time("collisionadd");
        this.game.level.collision.add(this, this.shape);
        console.timeEnd("collisionadd");
        console.timeEnd("ball");
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

        this.move.x += Math.cos(this.shape.angle) * this.speed;
        this.move.y += Math.sin(this.shape.angle) * this.speed * -1;
        for (let objectList of this.collisionHistory) {
            for (let history of objectList) {
                _.remove(this.shape.collisionList, (e) => {
                    return e === history;
                });
            }
        }
        this.collisionHistory.shift();
        this.collisionHistory.push(this.shape.collisionList.slice());
        this.collisionAction();
    }
    collisionAction() {
        const wallColisionList: Wall[] = [];
        const inkColisionList: Ink[] = [];
        for (let collision of this.shape.collisionList) {
            if (collision.owner instanceof Wall) {
                wallColisionList.push(collision.owner);
            } else if (collision.owner instanceof Ink) {
                inkColisionList.push(collision.owner);
            }
        }
        // console.log(this.shape.collisionList);
        if (wallColisionList.length != 0 && inkColisionList.length != 0) {
            console.log("インクにぶつかった");
            inkColisionList[0].ability(this, wallColisionList[0]);
        }
        if (wallColisionList.length != 0 && inkColisionList.length == 0) {
            console.log("壁にぶつかった");
            this.game.level.addObject(new Ink(this.game, new Point(this.shape.x, this.shape.y), this, wallColisionList[0], this.color));
            this.game.level.addObject(new Particle(this.game, {
                type: "firework",
                shape: new Circle(
                    this.shape.x,
                    this.shape.y,
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
        this.sprite.x = this.shape.x - this.shape.r;
        this.sprite.y = this.shape.y - this.shape.r;
    }
    remove() {
        super.remove();
        this.game.level.view.removeChild(this.sprite);
    }

    shot(angle: number, speed: number) {
        this.shape.angle = angle;
        this.speed = speed;
    }
}
