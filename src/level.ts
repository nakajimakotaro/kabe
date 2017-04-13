import PIXI = require('pixi.js');
import _ = require('lodash');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle} from "./shape";
import {Collision} from "./collision";
import {Wall} from "./wall"

export class Level extends GameObject{
    shape:Rectangle = new Rectangle(0, 0, 960, 540);
    collision:Collision;
    view:PIXI.Graphics;

    levelData:any;
    isLoad = false;


    gameObjectList:GameObject[] = [];
    removeQueueList:GameObject[] = [];

    isGameSet = false;

    countFrame = 0;

    constructor(public game: Game){
        super();
        this.view = new PIXI.Graphics();
        this.game.app.stage.addChild(this.view);
        this.collision = new Collision();
    }
    save(){
    }
    update(){
        this.view.clear();
        if(this.isGameSet == false){
            for(let object of this.gameObjectList){
                object.update();
            }
            this.collision.tick();
            this.removeExec();
        }
        this.countFrame++;
    }
    addObject(object:GameObject){
        this.gameObjectList.push(object);
    }

    removeQueue(object:GameObject){
        this.removeQueueList.push(object);
    }
    private removeExec(){
        for(let a of this.removeQueueList){
            _.remove(this.gameObjectList, (b)=>{
                return a===b;
            });
        }
        this.removeQueueList = [];
    }

    gameSet(){
        this.isGameSet = true;
    }
}

