import PIXI = require('pixi.js');
import Matter = require("matter-js");
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {ViewObject} from "./viewObject";
import {Shape,Rectangle} from "./shape";;

export class Wall extends ViewObject{
    private body:Matter.Body;
    public sprite:PIXI.Sprite;
    public get position(){
        return {x: this.body.position.x, y: this.body.position.y};
    }
    public get angle(){
        return this.body.angle;
    }
    constructor(public game:Game, x:number, y:number, width:number, height:number){
        super();
        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            restitution: 0,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 1,
        });
        this.body.isStatic = true;
        Matter.World.add(this.game.level.matterEngine.world, this.body);
        this.sprite = this.game.resourceLoader.rectangle(width, height, 0x9C27B0);
        this.game.level.view.addChild(this.sprite);
        this.sprite.x = x;
        this.sprite.y = y;
        //this.game.level.collision.add(this, this.body);;
    }
    update(){
        let angle = this.sprite.rotation;
        angle += 0.01;
        if(angle > Math.PI * 2){
            angle -= Math.PI * 2;
        }
        this.sprite.rotation = angle;
        Matter.Body.rotate(this.body, 0.01)
    }
}
