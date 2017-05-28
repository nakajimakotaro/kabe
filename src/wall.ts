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
        this.body = Matter.Bodies.rectangle(x, y, width, height);
        this.body.isStatic = true;
        Matter.World.add(this.game.level.matterEngine.world, this.body);
        this.sprite = this.game.resourceLoader.rectangle(width, height, 0xfafa0a);
        this.game.level.view.addChild(this.sprite);
        this.sprite.x = x;
        this.sprite.y = y;

        //this.game.level.collision.add(this, this.body);;
    }
    update(){
        let view = this.game.level.view;
    }
}
