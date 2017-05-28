import PIXI = require('pixi.js');
import Matter = require("matter-js");
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {ViewObject} from "./viewObject";
import {Shape,Circle,Point} from "./shape";

function random(min:number, max:number):number{
    return Math.random() * (max - min) + min;
}


export interface Firework{
    type:"firework",
    color:number,
    shape:Circle,   //円の形
    posRandom?:{xmin:number, xmax:number, ymin:number, ymax:number},    //ドットの場所のランダム性
    sparkNum:number,    //パーティクルのドットの作る数
    initialVelocity?:{x:number, y:number},      //初速
    randomVelocity?:{xmin:number, xmax:number, ymin:number, ymax:number}, //速度のランダム性
    generateFrequency?:number,      //0以外にするとそのミリ秒ずつこのパーティクルを発生させる
    randomgenerateFrequency?:number,    //頻度のランダム性
    friction:{x:number, y:number},      //摩擦
    endTime:number,     //endTimeミリ秒たつとに消える
    gravity: {x:number, y:number},  //重力
}

export class Particle extends ViewObject{
    x:number;
    y:number;
    particles:{shape:Circle, sprite:PIXI.Sprite, vector:{x:number, y:number}}[] = [];

    public get position(){
        return {x: this.x, y: this.y};
    }
    public get angle(){
        return 0;
    }
    constructor(public game:Game, public config:Firework){
        super();
        this.x = config.shape.x;
        this.y = config.shape.y;

        config.posRandom                = config.posRandom ? config.posRandom: {xmin: 0, xmax: 0, ymin: 0, ymax: 0};
        config.initialVelocity          = config.initialVelocity ? config.initialVelocity : {x: 0, y: 0};
        config.randomVelocity           = config.randomVelocity ? config.randomVelocity : {xmin: 0, xmax: 0, ymin: 0, ymax: 0} ;
        config.generateFrequency        = config.generateFrequency ? config.generateFrequency : 0;
        config.randomgenerateFrequency  = config.randomgenerateFrequency ? config.randomgenerateFrequency : 0;
        config.gravity                  = config.gravity ? config.gravity : {x:0, y:0};
        config.friction                 = config.friction ? config.friction : {x:0, y:0};

        for(let i = 0; i < config.sparkNum;i++){
            let shape:Circle = new Circle(
                config.shape.x + random(config.posRandom.xmin, config.posRandom.xmax),
                config.shape.y + random(config.posRandom.ymin, config.posRandom.ymax),
                config.shape.r,
                );

            let particle = {
                "shape": shape,
                sprite: new PIXI.Sprite(PIXI.Texture.EMPTY),
                vector: {
                    x: config.initialVelocity.x + random(config.randomVelocity.xmin, config.randomVelocity.xmax),
                    y: config.initialVelocity.y + random(config.randomVelocity.ymin, config.randomVelocity.ymax),
                },
            };
            this.presetTexture(particle);
            particle.sprite = this.game.resourceLoader.circle(particle.shape.r, this.config.color);
            this.game.level.view.addChild(particle.sprite);
            this.particles.push(particle);
        }
    }
    update(){
        super.update();
        if(this.config.endTime < this.game.level.countFrame){
            this.remove();
        }
        for(let particle of this.particles){
            particle.shape.x += particle.vector.x;
            particle.shape.y += particle.vector.y;
            particle.vector.x += this.config.gravity.x;
            particle.vector.y += this.config.gravity.y;
            particle.vector.x *= this.config.friction.x;
            particle.vector.y *= this.config.friction.y;
        }
    }
    remove(){
        super.remove();
        for(let particle of this.particles){
            this.game.level.view.removeChild(particle.sprite);
        }
    }
    moveOn(){
        super.moveOn();
        for(let particle of this.particles){
            particle.sprite.x = particle.shape.x - particle.shape.r;
            particle.sprite.y = particle.shape.y - particle.shape.r;
        }
    }
    presetTexture(particle:{shape:Circle, sprite:PIXI.Sprite, vector:{x:number, y:number}}){
        if(this.game.resourceLoader.isCache(`${this.config.color}-${particle.shape.r}`)){
            return;
        }
        let texture = 
            new PIXI.Graphics()
                .beginFill(this.config.color)
                .drawCircle(0, 0, particle.shape.r)
                .generateCanvasTexture(1);
                this.game.resourceLoader.setResource(`${this.config.color}-${particle.shape.r}`, texture);
    }
}
