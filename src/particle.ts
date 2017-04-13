import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Circle,Point} from "./shape";
import {ViewObject} from "./viewObject";

export interface Firework{
    type:"firework",
    color:number,
    pos:Point,
    posRandom?:{xmin:number, xmax:number, ymin:number, ymax:number},
    sparkNum:number,
    initialVelocity?:{x:number, y:number},
    randomVelocity?:{xmin:number, xmax:number, ymin:number, ymax:number},
    endTime:number,
}

export class Particle extends ViewObject{
    shape:Point = {kind: "Point", x:0, y:0};
    particles:{shape:Circle, vector:{x:number, y:number}}[] = [];

    constructor(game:Game, public config:Firework){
        super(game);
        this.shape.x = config.pos.x;
        this.shape.y = config.pos.y;

        config.posRandom       = config.posRandom       == undefined ? {xmin: 0, xmax: 0, ymin: 0, ymax: 0} : config.posRandom;
        config.initialVelocity = config.initialVelocity == undefined ? {x: 0, y: 0} : config.initialVelocity;
        config.randomVelocity  = config.randomVelocity  == undefined ? {xmin: 0, xmax: 0, ymin: 0, ymax: 0} : config.randomVelocity;

        function random(min, max):number{
            return Math.random() * (max - min) + min;
        }

        for(let i = 0; i < config.sparkNum;i++){
            let shape:Circle = {
                kind: "Circle",
                x: config.pos.x + random(config.posRandom.xmin, config.posRandom.xmax),
                y: config.pos.y + random(config.posRandom.ymin, config.posRandom.ymax),
                r: 1,
                angle: 0,
            };

            this.particles[i] = {
                "shape": shape,
                vector: {
                    x: config.initialVelocity.x + random(config.randomVelocity.xmin, config.randomVelocity.xmax),
                    y: config.initialVelocity.y + random(config.randomVelocity.ymin, config.randomVelocity.ymax),
                },
            };
        };
    }
    update(){
        if(this.config.endTime < this.game.level.countFrame){
            this.remove();
        }
        for(let particle of this.particles){
            particle.shape.x += particle.vector.x;
            particle.shape.y += particle.vector.y;
            particle.vector.x *= 0.9;
            particle.vector.y *= 0.9;
            particle.vector.y += 0.1;
        }
    }
    draw(renderer: PIXI.Graphics){
        renderer.beginFill(this.config.color);
        for(let particle of this.particles){
            renderer.drawCircle(particle.shape.x, particle.shape.y, particle.shape.r);
        }
        renderer.endFill();
    }
}
