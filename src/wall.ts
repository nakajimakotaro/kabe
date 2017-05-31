import PIXI = require('pixi.js');
import Matter = require("matter-js");
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {ViewObject} from "./viewObject";
import {Shape,Rectangle} from "./shape";;

export class Wall extends ViewObject{
    public body:Matter.Body;
    public sprite:PIXI.Sprite;
    public get position(){
        return {x: this.body.position.x, y: this.body.position.y};
    }
    public get angle(){
        return this.body.angle;
    }
    constructor(public game:Game, x:number, y:number, width:number, height:number){
        super();
        //body
        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            restitution: 0,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 1,
        });
        //this.body.isStatic = true;
        this.body["userObject"] = this;
        this.body["userCollisionList"] = [];
        //this.body.torque = 10;
        Matter.World.add(this.game.level.matterEngine.world, this.body);
        const pin = Matter.Constraint.create({bodyA: this.body, pointB: {x: this.body.position.x, y: this.body.position.y}, stiffness: 1})
        Matter.World.add(this.game.level.matterEngine.world, pin);
        this.sprite = this.game.resourceLoader.rectangle(width, height, 0x9C27B0);
        this.game.level.view.addChild(this.sprite);
        this.sprite.x = x;
        this.sprite.y = y;
        //this.game.level.collision.add(this, this.body);;
    }
    update(){
        this.body["userCollisionList"] = [];
        let angle = this.sprite.rotation;
        angle += 0.01;
        if(angle > Math.PI * 2){
            angle -= Math.PI * 2;
        }
        this.sprite.position.x = this.body.position.x;
        this.sprite.position.y = this.body.position.y;
        this.sprite.rotation = this.body.angle;
        //Matter.Body.rotate(this.body, 0.01);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}
