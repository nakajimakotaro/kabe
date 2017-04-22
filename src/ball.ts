import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";
import {Wall} from "./wall";
import {Ink} from "./ink";
import {Particle} from "./particle";

export class Ball extends ViewObject{

    speed = 0;
    sprite:PIXI.Sprite;
    constructor(public game:Game, public shape:Circle, public color:number){
        super();
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.game.level.view.addChild(this.sprite);
        this.setColor(color);
        this.game.level.collision.add(this, this.shape);
    }
    setColor(color:number){
        this.setSprite('0x' + color.toString(16));
    }
    setSprite(path:string){
        this.game.resourceLoader.load(path).then(
            (texture:PIXI.Texture)=>{
                this.sprite.texture = texture;
            });
    }
    collisionActionFrame = 0;
    update(){
        super.update();

        this.move.x += Math.cos(this.shape.angle) * this.speed;
        this.move.y += Math.sin(this.shape.angle) * this.speed * -1;
        if(this.shape.collisionList.length != 0 && this.collisionActionFrame + 10 < this.game.level.countFrame){
            this.collisionAction();
            this.collisionActionFrame = this.game.level.countFrame;
        }
    }
    collisionAction(){
        const wallColisionList:Wall[] = [];
        const inkColisionList:Ink[] = [];
        for(let collision of this.shape.collisionList){
            if(collision.owner instanceof Wall){
                wallColisionList.push(collision.owner);
            }else if(collision.owner instanceof Ink){
                inkColisionList.push(collision.owner);
            }
        }
        // console.log(this.shape.collisionList);
        if(wallColisionList.length != 0 && inkColisionList.length != 0){
            console.log("インクにぶつかった");
            inkColisionList[0].ability(this, wallColisionList[0]);
        }
        if(wallColisionList.length != 0 && inkColisionList.length == 0){
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
                    xmax:  10,
                    ymin: -10,
                    ymax:  10,
                },
                color: this.color,
                sparkNum: 20,
                initialVelocity: {
                    x:this.moveAverage().x,
                    y:this.moveAverage().y,
                },
                randomVelocity: {
                    xmin: -10,
                    xmax:  10,
                    ymin: -5,
                    ymax:  10,
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
    moveOn(){
        super.moveOn();
        this.sprite.x = this.shape.x - this.shape.r;
        this.sprite.y = this.shape.y - this.shape.r;
    }
    remove(){
        super.remove();
        this.game.level.view.removeChild(this.sprite);
    }

    shot(angle:number, speed:number){
        this.shape.angle = angle;
        this.speed = speed;
    }
}
